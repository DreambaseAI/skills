import type { Discovered } from "../discovery";
import { HttpError, parseJson, postForm, redact } from "../http";
import type { Tokens } from "./flow";

/** Thrown when the refresh token is dead (revoked/expired/reused) — re-auth needed. */
export class ReauthRequired extends Error {
  constructor(
    message = "Session expired — run `dreambase-mcp install` to sign in again.",
  ) {
    super(message);
    this.name = "ReauthRequired";
  }
}

interface TokenSuccess {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface TokenErrorBody {
  error?: string;
  error_description?: string;
}

/**
 * Rotating refresh (RFC 6749 §6). The AS requires `client_id` on the refresh
 * grant for public clients and returns a NEW refresh token each time (reuse of
 * the old one revokes the family). The caller MUST persist the returned
 * `refreshToken` before using the access token so a crash can't strand the
 * family.
 *
 * An `invalid_grant` (dead/rotated token) surfaces as {@link ReauthRequired}.
 */
export async function performRefresh(
  d: Discovered,
  refreshToken: string,
  clientId: string,
): Promise<Tokens> {
  const res = await postForm(d.tokenEndpoint, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  if (res.status === 400 || res.status === 401) {
    const body = safeParse(res.text);
    if (body?.error === "invalid_grant") {
      throw new ReauthRequired();
    }
    throw new HttpError(
      `Token refresh at ${redact(d.tokenEndpoint)} failed (${res.status})${body?.error ? `: ${body.error}` : ""}`,
    );
  }
  if (res.status < 200 || res.status >= 300) {
    throw new HttpError(
      `Token refresh at ${redact(d.tokenEndpoint)} failed with ${res.status}.`,
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

function safeParse(text: string): TokenErrorBody | null {
  try {
    return JSON.parse(text) as TokenErrorBody;
  } catch {
    return null;
  }
}
