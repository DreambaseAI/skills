import { DEFAULT_SCOPES, resolveBaseUrl } from "./config";
import { detectClients, writerById } from "./clients/detect";
import type { ClientWriter, WriteContext } from "./clients/types";
import { discover, type Discovered } from "./discovery";
import { installSkills } from "./skills";
import { ensureClientId } from "./oauth/client-id";
import { runAuthorizationFlow } from "./oauth/flow";
import { backendName, setCreds } from "./store/credentials";
import { callTool, type WhoAmI } from "./mcp";
import { isInteractive, multiselect } from "./prompt";

const SERVER_NAME = "dreambase";

export interface InstallOptions {
  url?: string;
  scopes?: string[];
  yes?: boolean;
  clients?: string[];
}

/**
 * The default command: discover the contract, pick target clients, run the
 * OAuth dance where the installer owns it (header-only clients), write each
 * client's config, and install the formatting skills.
 */
export async function runInstall(opts: InstallOptions): Promise<number> {
  const base = resolveBaseUrl(opts.url);
  console.log(`Setting up the Dreambase MCP connection`);
  console.log(`  app URL: ${base}\n`);

  const d = await discover(base);
  console.log(`Discovered authorization server: ${d.issuer}\n`);

  const selected = await selectClients(opts);
  if (selected.length === 0) {
    console.log(
      `No clients selected. Re-run with \`--client claude-desktop|openai\`.\n` +
        `(Claude Code and Cursor install the \`dreambase\` plugin instead — see the README.)`,
    );
    return 1;
  }
  console.log(
    `Configuring: ${selected.map((w) => w.displayName).join(", ")}\n`,
  );

  const ctx: WriteContext = { base, mcpUrl: d.mcpUrl, serverName: SERVER_NAME };

  // Header-only clients need the installer to own the OAuth flow + store a token.
  const needsOwnedFlow = selected.some((w) => !w.nativeOauth);
  if (needsOwnedFlow) {
    await runOwnedFlow(d, opts);
  }

  // Write each client's config. Keep trying independent clients, but report a
  // failed install to callers if any requested target could not be configured.
  const failedWriters: string[] = [];
  for (const writer of selected) {
    try {
      const result = await writer.write(ctx);
      const where = result.configPath ? ` (${result.configPath})` : "";
      console.log(`  ✓ ${writer.displayName}: ${result.action}${where}`);
      if (result.note) {
        console.log(indent(result.note));
      }
    } catch (err) {
      failedWriters.push(writer.displayName);
      console.error(
        `  ✗ ${writer.displayName}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Install the report-formatting skills.
  console.log("");
  const skillResults = await installSkills();
  for (const r of skillResults) {
    console.log(`  ✓ skills → ${r.dir} (${r.installed.join(", ")})`);
  }

  if (failedWriters.length > 0) {
    console.error(
      `\nSetup incomplete: failed to configure ${failedWriters.join(", ")}. ` +
        `Fix the errors above and run the installer again.`,
    );
    return 1;
  }

  console.log(`\nDone. Run \`dreambase-mcp doctor\` to verify anytime.`);
  return 0;
}

/** Run the installer-owned OAuth flow and store the refresh token. */
async function runOwnedFlow(
  d: Discovered,
  opts: InstallOptions,
): Promise<void> {
  const requested = opts.scopes?.length ? opts.scopes : DEFAULT_SCOPES;
  const scopes =
    d.scopesSupported.length > 0
      ? requested.filter((s) => d.scopesSupported.includes(s))
      : requested;
  if (scopes.length === 0) {
    throw new Error(
      `None of the requested scopes (${requested.join(", ")}) are supported by the server.`,
    );
  }
  console.log(`Requesting scopes: ${scopes.join(", ")}`);

  const clientId = await ensureClientId(d);
  console.log(`Opening your browser to authorize…`);
  const tokens = await runAuthorizationFlow(d, {
    clientId,
    scopes,
    onAuthorizeUrl: (url) =>
      console.log(`  If it doesn't open, visit:\n  ${url}\n`),
  });
  if (!tokens.refreshToken) {
    throw new Error(
      `The server did not return a refresh token; cannot persist the session.`,
    );
  }
  await setCreds(
    { issuer: d.issuer, resource: d.resource },
    { clientId, refreshToken: tokens.refreshToken, scope: tokens.scope },
  );
  const me = await callTool<WhoAmI>(d.mcpUrl, tokens.accessToken, "whoami");
  console.log(
    `Stored credentials (${await backendName()} backend). Connected as ${me.userId}.\n`,
  );
}

/**
 * Resolve which client writers to configure. Deterministic for automation
 * (explicit `--client`, or `--yes` / non-TTY → detected clients), and an
 * arrow-key/spacebar checkbox picker for interactive terminals.
 */
async function selectClients(opts: InstallOptions): Promise<ClientWriter[]> {
  // 1. Explicit flag wins — fully deterministic, no detection or prompt.
  if (opts.clients?.length) {
    const writers: ClientWriter[] = [];
    for (const id of opts.clients) {
      const w = writerById(id);
      if (!w) throw new Error(`Unknown client "${id}".`);
      writers.push(w);
    }
    return writers;
  }

  const detected = await detectClients();
  const installed = detected.filter((d) => d.installed).map((d) => d.writer);

  // 2. Non-interactive (agents / piped / `--yes`): auto-select detected clients.
  if (opts.yes || !isInteractive()) {
    if (installed.length === 0) {
      console.log(
        `No supported clients detected. Use \`--client <name>\` to configure one explicitly.`,
      );
    } else if (!opts.yes) {
      console.log(
        `Non-interactive: selecting detected client(s): ${installed
          .map((w) => w.displayName)
          .join(", ")}. Pass --client to choose explicitly.`,
      );
    }
    return installed;
  }

  // 3. Interactive: checkbox picker over all clients, detected ones pre-checked.
  const chosen = await multiselect(
    "Which clients should Dreambase be installed into?",
    detected.map((d) => ({
      value: d.writer.id,
      label: d.writer.displayName,
      hint: d.installed ? "detected" : "not detected",
      checked: d.installed,
    })),
  );
  return chosen
    .map((id) => writerById(id))
    .filter((w): w is ClientWriter => Boolean(w));
}

function indent(text: string): string {
  return text
    .split("\n")
    .map((l) => `    ${l}`)
    .join("\n");
}
