import { afterEach, describe, expect, it, vi } from "vitest";
import { runAuthorizationFlow } from "../../src/oauth/flow";
import type { Discovered } from "../../src/discovery";
import { ISSUER, TOKEN_RESPONSE } from "../fixtures/server-responses";

const TOKEN_ENDPOINT = `${ISSUER}/oauth/token`;

const DISCOVERED: Discovered = {
  base: ISSUER,
  resource: `${ISSUER}/mcp`,
  mcpUrl: `${ISSUER}/mcp`,
  issuer: ISSUER,
  scopesSupported: ["health-reports:read", "health-reports:write"],
  authorizationEndpoint: `${ISSUER}/oauth/authorize`,
  tokenEndpoint: TOKEN_ENDPOINT,
  registrationEndpoint: `${ISSUER}/oauth/register`,
  revocationEndpoint: `${ISSUER}/oauth/revoke`,
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  codeChallengeMethods: ["S256"],
  issParameterSupported: true,
  cimdSupported: true,
};

describe("runAuthorizationFlow", () => {
  let restore: (() => void) | undefined;
  afterEach(() => restore?.());

  it("builds a correct authorize URL, validates the redirect, and exchanges the code", async () => {
    const realFetch = globalThis.fetch;
    let tokenBody: URLSearchParams | undefined;

    // Mock only the token endpoint; loopback callbacks must hit the real server.
    globalThis.fetch = (async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === TOKEN_ENDPOINT) {
        tokenBody = new URLSearchParams(String(init?.body ?? ""));
        return new Response(JSON.stringify(TOKEN_RESPONSE), { status: 200 });
      }
      return realFetch(input as string, init);
    }) as typeof fetch;
    restore = () => {
      globalThis.fetch = realFetch;
    };

    let authorizeUrl: URL | undefined;
    const flow = runAuthorizationFlow(DISCOVERED, {
      clientId: "cid-1",
      scopes: ["health-reports:read", "health-reports:write"],
      openBrowser: false,
      onAuthorizeUrl: (u) => {
        authorizeUrl = new URL(u);
      },
    });

    // Wait for the listener + authorize URL, then simulate the AS redirect.
    await vi.waitFor(() => expect(authorizeUrl).toBeDefined());
    const a = authorizeUrl!;
    expect(a.searchParams.get("response_type")).toBe("code");
    expect(a.searchParams.get("code_challenge_method")).toBe("S256");
    expect(a.searchParams.get("resource")).toBe(`${ISSUER}/mcp`);
    expect(a.searchParams.get("client_id")).toBe("cid-1");
    const redirectUri = a.searchParams.get("redirect_uri")!;
    const state = a.searchParams.get("state")!;
    expect(redirectUri).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/);

    const callback = new URL(redirectUri);
    callback.searchParams.set("code", "auth-code-xyz");
    callback.searchParams.set("state", state);
    callback.searchParams.set("iss", ISSUER);
    await realFetch(callback.toString());

    const tokens = await flow;
    expect(tokens.accessToken).toBe(TOKEN_RESPONSE.access_token);
    expect(tokens.refreshToken).toBe(TOKEN_RESPONSE.refresh_token);
    expect(tokens.scope).toBe(TOKEN_RESPONSE.scope);

    // Token exchange sent the code, S256 verifier, client_id, and identical redirect_uri.
    expect(tokenBody?.get("grant_type")).toBe("authorization_code");
    expect(tokenBody?.get("code")).toBe("auth-code-xyz");
    expect(tokenBody?.get("client_id")).toBe("cid-1");
    expect(tokenBody?.get("redirect_uri")).toBe(redirectUri);
    expect(tokenBody?.get("code_verifier")).toMatch(
      /^[A-Za-z0-9._~-]{43,128}$/,
    );
  });

  it("rejects a redirect whose iss does not match (mix-up defense)", async () => {
    let authorizeUrl: URL | undefined;
    const flow = runAuthorizationFlow(DISCOVERED, {
      clientId: "cid-1",
      scopes: ["health-reports:read"],
      openBrowser: false,
      onAuthorizeUrl: (u) => {
        authorizeUrl = new URL(u);
      },
    });
    // Attach the rejection handler synchronously so a fast rejection is never
    // flagged as unhandled.
    const rejection = flow.then(
      () => new Error("expected rejection"),
      (e: unknown) => e as Error,
    );

    await vi.waitFor(() => expect(authorizeUrl).toBeDefined());
    const redirectUri = authorizeUrl!.searchParams.get("redirect_uri")!;
    const state = authorizeUrl!.searchParams.get("state")!;
    const callback = new URL(redirectUri);
    callback.searchParams.set("code", "auth-code-xyz");
    callback.searchParams.set("state", state);
    callback.searchParams.set("iss", "https://evil.test");
    await fetch(callback.toString());

    expect((await rejection).message).toMatch(/iss_mismatch/);
  });
});
