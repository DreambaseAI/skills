import { mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { credentialsFilePath } from "../../src/config";
import {
  clearCreds,
  getCachedClientId,
  getCreds,
  setCachedClientId,
  setCreds,
} from "../../src/store/credentials";
import { backendName } from "../../src/store/credentials";
import { resetBackendCache } from "../../src/store/keychain";

const KEY = { issuer: "https://as.test", resource: "https://as.test/mcp" };

describe("credentials (file backend)", () => {
  let home: string;
  let prevHome: string | undefined;
  let prevStore: string | undefined;

  beforeEach(() => {
    home = mkdtempSync(join(tmpdir(), "dreambase-mcp-test-"));
    prevHome = process.env.HOME;
    prevStore = process.env.DREAMBASE_MCP_STORE;
    process.env.HOME = home;
    process.env.DREAMBASE_MCP_STORE = "file";
    resetBackendCache();
  });

  afterEach(() => {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
    if (prevStore === undefined) delete process.env.DREAMBASE_MCP_STORE;
    else process.env.DREAMBASE_MCP_STORE = prevStore;
    resetBackendCache();
  });

  it("uses the file backend when forced", async () => {
    expect(await backendName()).toBe("file");
  });

  it("round-trips credentials and clears them", async () => {
    expect(await getCreds(KEY)).toBeNull();
    await setCreds(KEY, {
      clientId: "cid",
      refreshToken: "rt-1",
      scope: "health-reports:read",
    });
    expect(await getCreds(KEY)).toEqual({
      clientId: "cid",
      refreshToken: "rt-1",
      scope: "health-reports:read",
    });
    await clearCreds(KEY);
    expect(await getCreds(KEY)).toBeNull();
  });

  it("caches a client_id per issuer", async () => {
    expect(await getCachedClientId(KEY.issuer)).toBeNull();
    await setCachedClientId(KEY.issuer, "client-123");
    expect(await getCachedClientId(KEY.issuer)).toBe("client-123");
  });

  it("writes the credentials file with 0600 permissions", async () => {
    await setCreds(KEY, { clientId: "c", refreshToken: "r", scope: "s" });
    const mode = statSync(credentialsFilePath()).mode & 0o777;
    expect(mode).toBe(0o600);
  });
});
