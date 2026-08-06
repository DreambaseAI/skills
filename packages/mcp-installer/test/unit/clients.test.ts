import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { claudeDesktop } from "../../src/clients/claude-desktop";
import { openai } from "../../src/clients/openai";
import { ALL_WRITERS, writerById } from "../../src/clients/detect";
import {
  hasMcpServerUrl,
  upsertMcpServer,
} from "../../src/clients/json-config";

const CTX = {
  base: "https://app.dreambase.test",
  mcpUrl: "https://app.dreambase.test/mcp",
  serverName: "dreambase",
};

describe("json-config helpers", () => {
  it("upsert is a no-op when the entry is already identical", () => {
    const config = { mcpServers: { dreambase: { url: CTX.mcpUrl } } };
    expect(upsertMcpServer(config, "dreambase", { url: CTX.mcpUrl })).toBe(
      false,
    );
  });
  it("upsert preserves sibling servers", () => {
    const config = { mcpServers: { other: { url: "https://x" } } };
    expect(upsertMcpServer(config, "dreambase", { url: CTX.mcpUrl })).toBe(
      true,
    );
    expect((config.mcpServers as Record<string, unknown>).other).toEqual({
      url: "https://x",
    });
    expect(hasMcpServerUrl(config, "dreambase", CTX.mcpUrl)).toBe(true);
  });
});

describe("client registry", () => {
  // Claude Code and Cursor are served by the `dreambase` plugin, whose
  // `.mcp.json` declares the http server and lets the host own OAuth. A writer
  // here would fight that config, so the registry deliberately excludes them.
  it("covers only the header-only clients", () => {
    expect(ALL_WRITERS.map((w) => w.id)).toEqual(["claude-desktop", "openai"]);
    expect(ALL_WRITERS.every((w) => w.nativeOauth === false)).toBe(true);
  });

  it("does not resolve the plugin-owned hosts", () => {
    expect(writerById("claude-code")).toBeUndefined();
    expect(writerById("cursor")).toBeUndefined();
    expect(writerById("claude-desktop")).toBeDefined();
  });
});

describe("openai / header-only writer", () => {
  let home: string;
  let prevHome: string | undefined;
  beforeEach(() => {
    home = mkdtempSync(join(tmpdir(), "dreambase-openai-"));
    prevHome = process.env.HOME;
    process.env.HOME = home;
  });
  afterEach(() => {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
  });

  // The reference-config + printed-block pattern is the template every
  // header-only harness reuses, so keep it covered.
  it("writes a shim reference config and prints the block to paste", async () => {
    const res = await openai.write(CTX);
    expect(res.action).toBe("printed");
    expect(res.configPath).toBe(join(home, ".dreambase", "openai-mcp.json"));

    const entry = JSON.parse(readFileSync(res.configPath!, "utf8")).mcpServers
      .dreambase;
    expect(entry.args).toContain("shim");
    expect(entry.args).toContain(CTX.base);
    expect(entry.url).toBeUndefined();
    expect(res.note).toContain("dreambase");

    expect((await openai.status(CTX)).configured).toBe(true);
    expect((await openai.remove(CTX)).action).toBe("updated");
    expect((await openai.status(CTX)).configured).toBe(false);
  });
});

describe("claude-desktop writer", () => {
  let home: string;
  let prevHome: string | undefined;
  beforeEach(() => {
    home = mkdtempSync(join(tmpdir(), "dreambase-desktop-"));
    prevHome = process.env.HOME;
    process.env.HOME = home;
  });
  afterEach(() => {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
  });

  it("writes a shim stdio command entry (Desktop rejects url entries)", async () => {
    const res = await claudeDesktop.write(CTX);
    expect(res.action).toBe("updated");
    const entry = JSON.parse(readFileSync(res.configPath!, "utf8")).mcpServers
      .dreambase;
    // Command form (never a `url` entry); launches our shim for this base.
    expect(typeof entry.command).toBe("string");
    expect(entry.args).toContain("shim");
    expect(entry.args).toContain("--url");
    expect(entry.args).toContain(CTX.base);
    expect(entry.url).toBeUndefined();
    expect((await claudeDesktop.status(CTX)).configured).toBe(true);
  });
});
