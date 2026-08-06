import { claudeDesktop } from "./claude-desktop";
import { openai } from "./openai";
import type { ClientWriter } from "./types";

/**
 * All known client writers, in the order the installer offers them.
 *
 * Scope: clients that cannot run the MCP OAuth dance from a config entry, so the
 * installer has to own the flow and hand them the shim. Hosts with native
 * remote-MCP support (Claude Code, Cursor) install the `dreambase` plugin
 * instead — its `.mcp.json` declares the http server and the host drives OAuth
 * itself, so an installer-written config would be a competing source of truth.
 */
export const ALL_WRITERS: ClientWriter[] = [claudeDesktop, openai];

export function writerById(id: string): ClientWriter | undefined {
  return ALL_WRITERS.find((w) => w.id === id);
}

export interface DetectedClient {
  writer: ClientWriter;
  installed: boolean;
}

/** Detect which clients are installed. Detection failures count as not-installed. */
export async function detectClients(): Promise<DetectedClient[]> {
  return Promise.all(
    ALL_WRITERS.map(async (writer) => ({
      writer,
      installed: await writer.detect().catch(() => false),
    })),
  );
}
