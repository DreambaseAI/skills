import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { dreambaseDir } from "../config";
import { readJsonConfig, writeJsonConfig } from "./json-config";
import { shimCommand } from "./shim-command";
import type {
  ClientStatus,
  ClientWriter,
  WriteContext,
  WriteResult,
} from "./types";

/**
 * Header-only / non-native-OAuth clients (e.g. the OpenAI stack). These can't
 * do the MCP OAuth dance, so the installer owns the flow (already run + stored
 * before this writer is invoked) and exposes the connection through the local
 * `shim`, which injects the bearer on every call.
 *
 * The exact config path for a given header-only client varies (spec §11 open
 * question), so we write a reference config to `~/.dreambase/openai-mcp.json`
 * and print the stdio block for the user to paste into their client.
 */
function referencePath(): string {
  return join(dreambaseDir(), "openai-mcp.json");
}

function shimEntry(base: string, serverName: string) {
  return {
    mcpServers: {
      [serverName]: shimCommand(base),
    },
  };
}

export const openai: ClientWriter = {
  id: "openai",
  displayName: "OpenAI / header-only (shim)",
  nativeOauth: false,

  async detect() {
    // No reliable cross-client signal — only configured on explicit request.
    return false;
  },

  configPath() {
    return referencePath();
  },

  async write(ctx: WriteContext): Promise<WriteResult> {
    const path = referencePath();
    const entry = shimEntry(ctx.base, ctx.serverName);
    writeJsonConfig(path, entry);
    const block = JSON.stringify(entry, null, 2);
    return {
      action: "printed",
      configPath: path,
      note:
        `Add this stdio MCP server to your client's config:\n\n${block}\n\n` +
        `(also written to ${path}). The shim reads the token you just stored and injects it on each call.`,
    };
  },

  async remove(): Promise<WriteResult> {
    const path = referencePath();
    const existed = existsSync(path);
    if (existed) rmSync(path, { force: true });
    return {
      action: existed ? "updated" : "skipped",
      configPath: path,
      note: existed
        ? "Removed the reference file; also remove the shim entry from your client's config."
        : undefined,
    };
  },

  async status(): Promise<ClientStatus> {
    const path = referencePath();
    return {
      installed: existsSync(path),
      configPath: path,
      configured: Boolean(readJsonConfig(path).mcpServers),
    };
  },
};
