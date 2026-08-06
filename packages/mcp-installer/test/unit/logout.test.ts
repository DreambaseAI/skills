import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runLogout } from "../../src/logout";
import { getCreds, setCreds } from "../../src/store/credentials";
import { resetBackendCache } from "../../src/store/keychain";
import {
  BASE,
  ISSUER,
  installDiscoveryFetch,
} from "../fixtures/server-responses";

const KEY = { issuer: ISSUER, resource: `${BASE}/mcp` };

describe("runLogout", () => {
  let prevHome: string | undefined;
  let restore: (() => void) | undefined;

  beforeEach(async () => {
    prevHome = process.env.HOME;
    process.env.HOME = mkdtempSync(join(tmpdir(), "dreambase-logout-"));
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

  it("revokes the refresh token and clears stored credentials", async () => {
    let revokeBody: URLSearchParams | undefined;
    restore = installDiscoveryFetch({
      [`${ISSUER}/oauth/revoke`]: () => new Response(null, { status: 200 }),
    });
    // Wrap fetch to capture the revoke body.
    const wrapped = globalThis.fetch;
    globalThis.fetch = (async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === `${ISSUER}/oauth/revoke`) {
        revokeBody = new URLSearchParams(String(init?.body ?? ""));
      }
      return wrapped(input as string, init);
    }) as typeof fetch;

    const code = await runLogout({ url: BASE });
    expect(code).toBe(0);
    expect(revokeBody?.get("token")).toBe("rt-1");
    expect(revokeBody?.get("token_type_hint")).toBe("refresh_token");
    expect(await getCreds(KEY)).toBeNull();
  });
});
