import { Command } from "commander";
import { runDoctor } from "./doctor";
import { runInstall } from "./install";
import { runLogout } from "./logout";
import { runShim } from "./shim";

// Replaced at build time by tsup with the package.json version (see tsup.config.ts).
declare const __DREAMBASE_MCP_VERSION__: string;
const VERSION =
  typeof __DREAMBASE_MCP_VERSION__ === "string"
    ? __DREAMBASE_MCP_VERSION__
    : "0.0.0-dev";

const program = new Command();

program
  .name("dreambase-mcp")
  .description(
    "Set up a Dreambase MCP connection: OAuth, token storage, client config, and skills.",
  )
  .version(VERSION);

interface InstallFlags {
  url?: string;
  scopes?: string;
  yes?: boolean;
  client?: string[];
}

function installAction(flags: InstallFlags) {
  return runInstall({
    url: flags.url,
    scopes: flags.scopes
      ?.split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean),
    yes: flags.yes,
    clients: flags.client,
  });
}

// `install` (also the default when no subcommand is given).
program
  .command("install", { isDefault: true })
  .description("Detect clients, run OAuth, write config, and install skills")
  .option("--url <base>", "Dreambase app base URL (overrides DREAMBASE_URL)")
  .option(
    "--client <name...>",
    "Only configure the named client(s): claude-desktop, openai",
  )
  .option("--scopes <list>", "Space/comma-separated scopes to request")
  .option("-y, --yes", "Skip interactive prompts (accept defaults)")
  .action(async (flags: InstallFlags) => {
    process.exit(await installAction(flags));
  });

// `doctor` — re-run discovery and (later) validate the stored token + client config.
program
  .command("doctor")
  .description("Diagnose the Dreambase MCP setup and connection")
  .option("--url <base>", "Dreambase app base URL (overrides DREAMBASE_URL)")
  .action(async (opts: { url?: string }) => {
    process.exit(await runDoctor({ url: opts.url }));
  });

// `shim` (internal) — the stdio↔http proxy launched by header-only clients.
program
  .command("shim")
  .description(
    "Internal: stdio↔http MCP proxy that injects the stored bearer token",
  )
  .option("--url <base>", "Dreambase app base URL (overrides DREAMBASE_URL)")
  .action(async (opts: { url?: string }) => {
    await runShim({ url: opts.url });
  });

// `logout` — revoke the refresh token, clear stored creds, optionally clean config.
program
  .command("logout")
  .description(
    "Revoke the token, clear stored credentials, optionally remove client config",
  )
  .option("--url <base>", "Dreambase app base URL (overrides DREAMBASE_URL)")
  .option(
    "--remove-config",
    "Also remove the Dreambase entry from client configs",
  )
  .action(async (opts: { url?: string; removeConfig?: boolean }) => {
    process.exit(
      await runLogout({ url: opts.url, removeConfig: opts.removeConfig }),
    );
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
