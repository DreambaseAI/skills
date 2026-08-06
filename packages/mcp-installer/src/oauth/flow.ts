import open from "open";
import type { Discovered } from "../discovery";
import { HttpError, parseJson, postForm, redact } from "../http";
import { parseErrorRedirect, validateAuthorizeResponse } from "./iss";
import { startLoopback } from "./loopback";
import { createPkce, createState } from "./pkce";

/** Tokens returned from a grant. `obtainedAt`/`expiresIn` drive proactive refresh. */
export interface Tokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  obtainedAt: number;
}

interface TokenSuccess {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface TokenErrorBody {
  error: string;
  error_description?: string;
}

export interface AuthorizeFlowOptions {
  clientId: string;
  scopes: string[];
  /** Open the browser automatically (default true); false just prints the URL. */
  openBrowser?: boolean;
  /** Called with the authorize URL so the CLI can print it. */
  onAuthorizeUrl?: (url: string) => void;
}

/**
 * Run the installer-owned OAuth 2.1 + PKCE authorization-code flow against the
 * discovered AS, returning the issued tokens. Enforces (security §9):
 *  - S256 PKCE (never `plain`),
 *  - `state` + RFC 9207 `iss` validated *before* the code is used,
 *  - `resource` always sent (audience binding),
 *  - single-use, timeout-bounded 127.0.0.1 loopback listener.
 */
export async function runAuthorizationFlow(
  d: Discovered,
  opts: AuthorizeFlowOptions,
): Promise<Tokens> {
  const pkce = createPkce();
  const state = createState();
  const listener = await startLoopback();

  try {
    const authorizeUrl = new URL(d.authorizationEndpoint);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("client_id", opts.clientId);
    authorizeUrl.searchParams.set("redirect_uri", listener.redirectUri);
    authorizeUrl.searchParams.set("code_challenge", pkce.challenge);
    authorizeUrl.searchParams.set("code_challenge_method", pkce.method);
    authorizeUrl.searchParams.set("state", state);
    // RFC 8707 audience binding — REQUIRED by the AS's /oauth/authorize.
    authorizeUrl.searchParams.set("resource", d.resource);
    authorizeUrl.searchParams.set("scope", opts.scopes.join(" "));

    const urlStr = authorizeUrl.toString();
    opts.onAuthorizeUrl?.(urlStr);
    if (opts.openBrowser !== false) {
      try {
        await open(urlStr);
      } catch {
        // Headless or no browser — the printed URL is the fallback.
      }
    }

    const callbackUrl = await listener.waitForCallback();

    // Reject a mismatched state / bad iss BEFORE touching the code.
    const validated = validateAuthorizeResponse(callbackUrl, {
      expectedIssuer: d.issuer,
      expectedState: state,
      strict: true,
    });
    if (!validated.ok) {
      const asError = parseErrorRedirect(callbackUrl);
      if (asError) {
        throw new HttpError(
          `Authorization was denied: ${asError.error}${asError.errorDescription ? ` — ${asError.errorDescription}` : ""}`,
        );
      }
      throw new HttpError(
        `Authorization redirect failed validation: ${validated.error}`,
      );
    }

    return exchangeCode(d, {
      code: validated.code,
      codeVerifier: pkce.verifier,
      clientId: opts.clientId,
      redirectUri: listener.redirectUri,
    });
  } finally {
    listener.close();
  }
}

/** Exchange an authorization code for tokens. `redirect_uri` MUST match authorize. */
async function exchangeCode(
  d: Discovered,
  p: {
    code: string;
    codeVerifier: string;
    clientId: string;
    redirectUri: string;
  },
): Promise<Tokens> {
  const res = await postForm(d.tokenEndpoint, {
    grant_type: "authorization_code",
    code: p.code,
    code_verifier: p.codeVerifier,
    client_id: p.clientId,
    redirect_uri: p.redirectUri,
  });

  if (res.status < 200 || res.status >= 300) {
    const body = safeError(res.text);
    throw new HttpError(
      `Token exchange at ${redact(d.tokenEndpoint)} failed (${res.status})${body ? `: ${body.error}${body.error_description ? ` — ${body.error_description}` : ""}` : ""}`,
    );
  }

  const body = parseJson<TokenSuccess>(res.text, d.tokenEndpoint);
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    expiresIn: body.expires_in,
    scope: body.scope,
    obtainedAt: Date.now(),
  };
}

function safeError(text: string): TokenErrorBody | null {
  try {
    return JSON.parse(text) as TokenErrorBody;
  } catch {
    return null;
  }
}
