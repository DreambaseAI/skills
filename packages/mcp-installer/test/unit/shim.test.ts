import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Discovered } from "../../src/discovery";
import { TokenSession } from "../../src/oauth/session";
import { forwardMessage } from "../../src/shim";
import { setCreds } from "../../src/store/credentials";
import { resetBackendCache } from "../../src/store/keychain";
import { ISSUER } from "../fixtures/server-responses";

const MCP_URL = `${ISSUER}/mcp`;
const TOKEN_ENDPOINT = `${ISSUER}/oauth/token`;
const D: Discovered = {
  base: ISSUER,
  resource: MCP_URL,
  mcpUrl: MCP_URL,
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
const KEY = { issuer: ISSUER, resource: MCP_URL };

describe("forwardMessage (shim passthrough)", () => {
  let prevHome: string | undefined;
  let restore: (() => void) | undefined;

  beforeEach(async () => {
    prevHome = process.env.HOME;
    process.env.HOME = mkdtempSync(join(tmpdir(), "dreambase-shim-"));
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

  it("injects the bearer and returns the JSON-RPC response body", async () => {
    const real = globalThis.fetch;
    restore = () => {
      globalThis.fetch = real;
    };
    globalThis.fetch = (async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === TOKEN_ENDPOINT) {
        return new Response(
          JSON.stringify({ access_token: "at-1", expires_in: 900, scope: "s" }),
          { status: 200 },
        );
      }
      if (url === MCP_URL) {
        const auth = new Headers(init?.headers).get("authorization");
        expect(auth).toBe("Bearer at-1");
        expect(new Headers(init?.headers).get("accept")).toContain(
          "text/event-stream",
        );
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: 7, result: { ok: true } }),
          { status: 200 },
        );
      }
      return real(input as string, init);
    }) as typeof fetch;

    const session = await TokenSession.load(D);
    const out = await forwardMessage(
      MCP_URL,
      session,
      JSON.stringify({ jsonrpc: "2.0", id: 7, method: "tools/list" }),
    );
    expect(JSON.parse(out!)).toEqual({
      jsonrpc: "2.0",
      id: 7,
      result: { ok: true },
    });
  });

  it("refreshes and retries once on a 401 from the MCP endpoint", async () => {
    const real = globalThis.fetch;
    restore = () => {
      globalThis.fetch = real;
    };
    let tokenCalls = 0;
    globalThis.fetch = (async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === TOKEN_ENDPOINT) {
        tokenCalls++;
        return new Response(
          JSON.stringify({
            access_token: `tok-${tokenCalls}`,
            expires_in: 900,
            refresh_token: `rt-${tokenCalls + 1}`,
            scope: "s",
          }),
          { status: 200 },
        );
      }
      if (url === MCP_URL) {
        const auth = new Headers(init?.headers).get("authorization");
        // Only the second minted token is accepted.
        if (auth !== "Bearer tok-2") {
          return new Response(
            JSON.stringify({ jsonrpc: "2.0", error: { code: -32001 } }),
            { status: 401 },
          );
        }
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: 1, result: "pong" }),
          { status: 200 },
        );
      }
      return real(input as string, init);
    }) as typeof fetch;

    const session = await TokenSession.load(D);
    const out = await forwardMessage(
      MCP_URL,
      session,
      JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
    );
    expect(JSON.parse(out!).result).toBe("pong");
    expect(tokenCalls).toBe(2); // initial mint + refresh-on-401
  });

  it("returns null for a 202 (notification, no response body)", async () => {
    const real = globalThis.fetch;
    restore = () => {
      globalThis.fetch = real;
    };
    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === TOKEN_ENDPOINT) {
        return new Response(
          JSON.stringify({ access_token: "at", expires_in: 900, scope: "s" }),
          { status: 200 },
        );
      }
      if (url === MCP_URL) return new Response(null, { status: 202 });
      return real(input as string);
    }) as typeof fetch;

    const session = await TokenSession.load(D);
    const out = await forwardMessage(
      MCP_URL,
      session,
      JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
    );
    expect(out).toBeNull();
  });
});
