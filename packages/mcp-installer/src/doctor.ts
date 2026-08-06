import { resolveBaseUrl } from "./config";
import { ALL_WRITERS } from "./clients/detect";
import type { WriteContext } from "./clients/types";
import { discover, type Discovered } from "./discovery";
import { callTool, type WhoAmI } from "./mcp";
import { ReauthRequired } from "./oauth/refresh";
import { TokenSession } from "./oauth/session";
import { backendName, getCreds } from "./store/credentials";
import { skillStatus } from "./skills";

const SERVER_NAME = "dreambase";
const OK = "✓";
const FAIL = "✗";
const INFO = "•";

export interface DoctorOptions {
  url?: string;
}

interface Check {
  label: string;
  ok: boolean;
  detail: string;
}

/**
 * Re-run discovery, validate the stored token via the `whoami` MCP tool, check
 * each client's config, and report skill install state. Exits non-zero on any
 * hard failure (discovery broken, or a stored token that won't validate).
 */
export async function runDoctor(opts: DoctorOptions): Promise<number> {
  const base = resolveBaseUrl(opts.url);
  const checks: Check[] = [];

  console.log(`Dreambase MCP doctor`);
  console.log(`  app URL: ${base}\n`);

  const discovered = await tryDiscover(base, checks);
  if (discovered) {
    reportContract(discovered);
    await validateToken(discovered, checks);
    await reportClients(discovered, base);
    reportSkills();
  }

  console.log(`Checks:`);
  let failures = 0;
  for (const c of checks) {
    if (!c.ok) failures++;
    console.log(`  ${c.ok ? OK : FAIL} ${c.label} — ${c.detail}`);
  }
  console.log("");
  if (failures > 0) {
    console.log(`${failures} check(s) failed.`);
    return 1;
  }
  console.log(`All checks passed.`);
  return 0;
}

async function tryDiscover(
  base: string,
  checks: Check[],
): Promise<Discovered | undefined> {
  try {
    const d = await discover(base);
    checks.push({
      label: "Discovery (PRM + AS metadata)",
      ok: true,
      detail: `issuer ${d.issuer}`,
    });
    checks.push({
      label: "PKCE S256 + RFC 9207 iss supported",
      ok: d.codeChallengeMethods.includes("S256") && d.issParameterSupported,
      detail: `S256=${d.codeChallengeMethods.includes("S256")}, iss=${d.issParameterSupported}`,
    });
    return d;
  } catch (err) {
    checks.push({
      label: "Discovery (PRM + AS metadata)",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
    return undefined;
  }
}

function reportContract(d: Discovered): void {
  console.log(`Discovered contract:`);
  console.log(`  resource:              ${d.resource}`);
  console.log(`  issuer:                ${d.issuer}`);
  console.log(`  token_endpoint         ${d.tokenEndpoint}`);
  console.log(`  registration_endpoint  ${d.registrationEndpoint}`);
  console.log(
    `  scopes_supported       ${d.scopesSupported.join(", ") || "(none advertised)"}`,
  );
  console.log("");
}

/** Validate the installer-owned session (if any) by calling `whoami`. */
async function validateToken(d: Discovered, checks: Check[]): Promise<void> {
  const creds = await getCreds({ issuer: d.issuer, resource: d.resource });
  if (!creds) {
    console.log(
      `Session: no installer-owned token stored (native clients manage their own).\n`,
    );
    return;
  }
  try {
    const session = await TokenSession.load(d);
    const token = await session.getAccessToken();
    const me = await callTool<WhoAmI>(d.mcpUrl, token, "whoami");
    checks.push({
      label: "Stored token validates (whoami)",
      ok: true,
      detail: `user ${me.userId}, scopes ${me.scopes.join(" ") || "(none)"} [${await backendName()}]`,
    });
  } catch (err) {
    checks.push({
      label: "Stored token validates (whoami)",
      ok: false,
      detail:
        err instanceof ReauthRequired
          ? "session expired — run `dreambase-mcp install`"
          : err instanceof Error
            ? err.message
            : String(err),
    });
  }
}

async function reportClients(d: Discovered, base: string): Promise<void> {
  const ctx: WriteContext = { base, mcpUrl: d.mcpUrl, serverName: SERVER_NAME };
  console.log(`Clients:`);
  for (const writer of ALL_WRITERS) {
    try {
      const s = await writer.status(ctx);
      const mark = !s.installed ? INFO : s.configured ? OK : INFO;
      const state = !s.installed
        ? "not installed"
        : s.configured
          ? "configured"
          : `not configured${s.detail ? ` (${s.detail})` : ""}`;
      console.log(`  ${mark} ${writer.displayName}: ${state}`);
    } catch {
      console.log(`  ${INFO} ${writer.displayName}: status unavailable`);
    }
  }
  console.log("");
}

function reportSkills(): void {
  console.log(`Skills:`);
  for (const s of skillStatus()) {
    const state =
      s.present.length === 0 && s.missing.length === 0
        ? "no bundled skills"
        : `${s.present.length} present${s.missing.length ? `, ${s.missing.length} missing` : ""}`;
    console.log(`  ${INFO} ${s.dir}: ${state}`);
  }
  console.log("");
}
