import { afterEach, describe, expect, it } from "vitest";
import {
  discover,
  DiscoveryError,
  parseResourceMetadataUrl,
} from "../../src/discovery";
import {
  AS_METADATA,
  BASE,
  ISSUER,
  installDiscoveryFetch,
  PRM,
  WWW_AUTHENTICATE,
} from "../fixtures/server-responses";

describe("parseResourceMetadataUrl", () => {
  it("extracts the URL from a standard challenge", () => {
    expect(parseResourceMetadataUrl(WWW_AUTHENTICATE)).toBe(
      `${BASE}/.well-known/oauth-protected-resource/mcp`,
    );
  });

  it("is tolerant of extra parameters and ordering", () => {
    const header = `Bearer error="invalid_token", resource_metadata="https://x/y", error_description="nope"`;
    expect(parseResourceMetadataUrl(header)).toBe("https://x/y");
  });

  it("returns null when absent", () => {
    expect(parseResourceMetadataUrl('Bearer error="invalid_token"')).toBeNull();
    expect(parseResourceMetadataUrl(null)).toBeNull();
  });
});

describe("discover", () => {
  let restore: () => void;
  afterEach(() => restore?.());

  it("walks 401 → PRM → AS metadata and returns the full contract", async () => {
    restore = installDiscoveryFetch();
    const d = await discover(BASE);

    expect(d.resource).toBe(PRM.resource);
    expect(d.mcpUrl).toBe(`${BASE}/mcp`);
    expect(d.issuer).toBe(ISSUER);
    expect(d.authorizationEndpoint).toBe(AS_METADATA.authorization_endpoint);
    expect(d.tokenEndpoint).toBe(AS_METADATA.token_endpoint);
    expect(d.registrationEndpoint).toBe(AS_METADATA.registration_endpoint);
    expect(d.revocationEndpoint).toBe(AS_METADATA.revocation_endpoint);
    expect(d.codeChallengeMethods).toContain("S256");
    expect(d.issParameterSupported).toBe(true);
    expect(d.cimdSupported).toBe(true);
    expect(d.scopesSupported).toContain("health-reports:write");
  });

  it("falls back to the well-known PRM path when the challenge header is missing", async () => {
    restore = installDiscoveryFetch({
      [`${BASE}/mcp`]: () =>
        new Response(JSON.stringify({ jsonrpc: "2.0" }), { status: 401 }),
    });
    const d = await discover(BASE);
    expect(d.issuer).toBe(ISSUER);
  });

  it("errors clearly on a 404 from the MCP endpoint", async () => {
    restore = installDiscoveryFetch({
      [`${BASE}/mcp`]: () => new Response("nope", { status: 404 }),
    });
    await expect(discover(BASE)).rejects.toThrow(DiscoveryError);
  });

  it("rejects a server that does not advertise S256", async () => {
    restore = installDiscoveryFetch({
      [`${ISSUER}/.well-known/oauth-authorization-server`]: () =>
        new Response(
          JSON.stringify({
            ...AS_METADATA,
            code_challenge_methods_supported: ["plain"],
          }),
          { status: 200 },
        ),
    });
    await expect(discover(BASE)).rejects.toThrow(/S256/);
  });
});
