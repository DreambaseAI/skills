import { describe, expect, it } from "vitest";
import { discover } from "../../src/discovery";
import { trimTrailingSlash } from "../../src/config";

// End-to-end smoke against a REAL, locally-running Dreambase server. Gated on
// DREAMBASE_MCP_E2E_URL so the default test run stays hermetic. It exercises the
// live discovery contract (401 → PRM → AS metadata); the browser-driven
// authorization leg is verified manually (see README).
const E2E_URL = process.env.DREAMBASE_MCP_E2E_URL;
const maybe = E2E_URL ? describe : describe.skip;

maybe("integration: live discovery", () => {
  it("walks the real 401 → PRM → AS-metadata chain", async () => {
    const base = trimTrailingSlash(E2E_URL!);
    const d = await discover(base);

    expect(d.mcpUrl).toBe(`${base}/mcp`);
    expect(d.resource).toBe(`${base}/mcp`);
    expect(d.issuer).toBeTruthy();
    expect(d.codeChallengeMethods).toContain("S256");
    expect(d.issParameterSupported).toBe(true);
    expect(d.registrationEndpoint).toBeTruthy();
    expect(d.tokenEndpoint).toBeTruthy();
    // The health-report scopes the installer requests by default.
    expect(d.scopesSupported).toContain("health-reports:read");
    expect(d.scopesSupported).toContain("health-reports:write");
  });
});
