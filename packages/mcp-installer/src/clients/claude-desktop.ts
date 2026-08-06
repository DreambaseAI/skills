import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import {
  readJsonConfig,
  removeMcpServer,
  upsertMcpServer,
  writeJsonConfig,
} from "./json-config";
import { isShimEntry, shimCommand } from "./shim-command";
import type {
  ClientStatus,
  ClientWriter,
  WriteContext,
  WriteResult,
} from "./types";

/**
 * Claude Desktop's `claude_desktop_config.json` only accepts **stdio command**
 * MCP servers — a `{ type: "http", url }` entry is rejected as "not a valid MCP
 * server configuration" (its URL-based remote connectors are added through the
 * app UI, not this file). And a browser-OAuth bridge (mcp-remote) is fragile
 * here: Desktop spawns/kills the server process on its own schedule, so the
 * short-lived callback listener isn't reliably up when the redirect lands
 * (ERR_CONNECTION_REFUSED). So Desktop uses OUR shim instead: the installer
 * owns the OAuth flow up front (one browser round-trip through our own
 * loopback) and stores the token; the shim just injects it at runtime — no
 * sign-in during Desktop's lifecycle.
 */
function desktopConfigPath(): string {
  const home = homedir();
  if (process.platform === "darwin") {
    return join(
      home,
      "Library",
      "Application Support",
      "Claude",
      "claude_desktop_config.json",
    );
  }
  if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? join(home, "AppData", "Roaming");
    return join(appData, "Claude", "claude_desktop_config.json");
  }
  return join(home, ".config", "Claude", "claude_desktop_config.json");
}

export const claudeDesktop: ClientWriter = {
  id: "claude-desktop",
  displayName: "Claude Desktop",
  // Not native: Desktop can't run the http-OAuth dance itself from a config
  // entry, so the installer owns the flow and Desktop runs our shim.
  nativeOauth: false,

  async detect() {
    // The config file may not exist yet, but its parent dir does once Desktop
    // has run at least once.
    return existsSync(dirname(desktopConfigPath()));
  },

  configPath() {
    return desktopConfigPath();
  },

  async write(ctx: WriteContext): Promise<WriteResult> {
    const path = desktopConfigPath();
    const config = readJsonConfig(path);
    const changed = upsertMcpServer(
      config,
      ctx.serverName,
      shimCommand(ctx.base),
    );
    if (changed) writeJsonConfig(path, config);
    return {
      action: changed ? "updated" : "skipped",
      configPath: path,
      note: "Restart Claude Desktop; it runs the Dreambase shim with your stored token (no further sign-in). The report-formatting skills appear under the `/` menu as Dreambase prompts.",
    };
  },

  async remove(ctx: WriteContext): Promise<WriteResult> {
    const path = desktopConfigPath();
    const config = readJsonConfig(path);
    const changed = removeMcpServer(config, ctx.serverName);
    if (changed) writeJsonConfig(path, config);
    return { action: changed ? "updated" : "skipped", configPath: path };
  },

  async status(ctx: WriteContext): Promise<ClientStatus> {
    const path = desktopConfigPath();
    const installed = existsSync(dirname(path));
    const config = readJsonConfig(path);
    const servers = config.mcpServers as
      Record<string, { args?: string[] }> | undefined;
    const configured = isShimEntry(servers?.[ctx.serverName], ctx.base);
    return { installed, configPath: path, configured };
  },
};
