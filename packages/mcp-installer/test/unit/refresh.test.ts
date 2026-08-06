import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Discovered } from "../../src/discovery";
import { performRefresh, ReauthRequired } from "../../src/oauth/refresh";
import { TokenSession } from "../../src/oauth/session";
import { getCreds, setCreds } from "../../src/store/credentials";
import { resetBackendCache } from "../../src/store/keychain";
import { ISSUER } from "../fixtures/server-responses";

const TOKEN_ENDPOINT = `${ISSUER}/oauth/token`;
const D: Discovered = {
  base: ISSUER,
  resource: `${ISSUER}/mcp`,
  mcpUrl: `${ISSUER}/mcp`,
  issuer: ISSUER,
  scopesSupported: [],
  authorizationEndpoint: `${ISSUER}/oauth/authorize`,
  tokenEndpoint: TOKEN_ENDPOINT,
  registrationEndpoint: `${ISSUER}/oauth/register`,
  revocationEndpoint: `${ISSUER}/oauth/revoke`,
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  codeChallengeMethods: ["S256"],
  issParameterSupported: true,
  cimdSupported: true,
};
const KEY = { issuer: ISSUER, resource: `${ISSUER}/mcp` };

function mockToken(handler: (form: URLSearchParams) => Response): () => void {
  const real = globalThis.fetch;
  globalThis.fetch = (async (
    input: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url === TOKEN_ENDPOINT) {
      return handler(new URLSearchParams(String(init?.body ?? "")));
    }
    return real(input as string, init);
  }) as typeof fetch;
  return () => {
    globalThis.fetch = real;
  };
}

describe("performRefresh", () => {
  let restore: () => void;
  afterEach(() => restore?.());

  it("sends client_id and returns rotated tokens", async () => {
    let seen: URLSearchParams | undefined;
    restore = mockToken((form) => {
      seen = form;
      return new Response(
        JSON.stringify({
          access_token: "at-2",
          expires_in: 900,
          refresh_token: "rt-2",
          scope: "health-reports:read",
        }),
        { status: 200 },
      );
    });
    const t = await performRefresh(D, "rt-1", "cid-1");
    expect(seen?.get("grant_type")).toBe("refresh_token");
    expect(seen?.get("refresh_token")).toBe("rt-1");
    expect(seen?.get("client_id")).toBe("cid-1");
    expect(t.accessToken).toBe("at-2");
    expect(t.refreshToken).toBe("rt-2");
  });

  it("maps invalid_grant to ReauthRequired", async () => {
    restore = mockToken(
      () =>
        new Response(JSON.stringify({ error: "invalid_grant" }), {
          status: 400,
        }),
    );
    await expect(performRefresh(D, "rt-dead", "cid-1")).rejects.toThrow(
      ReauthRequired,
    );
  });
});

describe("TokenSession", () => {
  let home: string;
  let prevHome: string | undefined;
  let restore: (() => void) | undefined;

  beforeEach(async () => {
    home = mkdtempSync(join(tmpdir(), "dreambase-session-"));
    prevHome = process.env.HOME;
    process.env.HOME = home;
    process.env.DREAMBASE_MCP_STORE = "file";
    resetBackendCache();
    await setCreds(KEY, {
      clientId: "cid-1",
      refreshToken: "rt-1",
      scope: "health-reports:read",
    });
  });
  afterEach(() => {
    restore?.();
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
    delete process.env.DREAMBASE_MCP_STORE;
    resetBackendCache();
  });

  it("refreshes on first use, persists the rotated refresh token, then caches", async () => {
    let calls = 0;
    restore = mockToken(() => {
      calls++;
      return new Response(
        JSON.stringify({
          access_token: `at-${calls}`,
          expires_in: 900,
          refresh_token: `rt-${calls + 1}`,
          scope: "health-reports:read",
        }),
        { status: 200 },
      );
    });

    const session = await TokenSession.load(D);
    expect(await session.getAccessToken()).toBe("at-1");
    // Rotated refresh token persisted to the store before use.
    expect((await getCreds(KEY))?.refreshToken).toBe("rt-2");
    // Second call is cached (no new refresh).
    expect(await session.getAccessToken()).toBe("at-1");
    expect(calls).toBe(1);
    // forceRefresh rotates again.
    expect(await session.forceRefresh()).toBe("at-2");
    expect(calls).toBe(2);
    expect((await getCreds(KEY))?.refreshToken).toBe("rt-3");
  });

  it("load rejects with ReauthRequired when no credentials are stored for the key", async () => {
    // Creds exist for KEY (seeded in beforeEach) but not for the `/other` resource.
    await expect(
      TokenSession.load({ ...D, resource: `${ISSUER}/other` }),
    ).rejects.toBeInstanceOf(ReauthRequired);
  });

  it("refreshes with the freshest STORED token, not a stale in-memory one", async () => {
    // Simulates a sibling shim process having rotated the token in the shared
    // store after this session loaded: the refresh must present the stored
    // token (rt-sibling), never the one captured at load (rt-1) — otherwise
    // reuse-detection would revoke the family.
    let sent: string | undefined;
    restore = mockToken((form) => {
      sent = form.get("refresh_token") ?? undefined;
      return new Response(
        JSON.stringify({
          access_token: "at-x",
          expires_in: 900,
          refresh_token: "rt-next",
          scope: "health-reports:read",
        }),
        { status: 200 },
      );
    });

    const session = await TokenSession.load(D); // captures rt-1 in memory
    await setCreds(KEY, {
      clientId: "cid-1",
      refreshToken: "rt-sibling",
      scope: "health-reports:read",
    });

    await session.getAccessToken();
    expect(sent).toBe("rt-sibling");
    expect((await getCreds(KEY))?.refreshToken).toBe("rt-next");
  });
});
