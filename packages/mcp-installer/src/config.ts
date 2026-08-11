import { homedir } from "node:os";
import { join } from "node:path";

/**
 * The only hardcoded URL in the tool. Everything else (PRM, AS metadata,
 * authorize/token/register/revoke endpoints, the `resource` value) is
 * *discovered* from this base per RFC 9728/8414 — see `discovery.ts`.
 *
 * Overridable for local testing via the `DREAMBASE_URL` env var or the `--url`
 * CLI flag (flag > env > this default).
 */
export const DEFAULT_APP_URL = "https://app.dreambase.com";

/** Env var that overrides {@link DEFAULT_APP_URL} (a `--url` flag beats it). */
export const APP_URL_ENV = "DREAMBASE_URL";

/**
 * Resolve the app base URL: explicit flag wins, then `DREAMBASE_URL`, then the
 * built-in default. The returned value has any trailing slash trimmed so
 * `${base}/mcp` never doubles up.
 */
export function resolveBaseUrl(flagUrl?: string): string {
  const raw = flagUrl ?? process.env[APP_URL_ENV] ?? DEFAULT_APP_URL;
  return trimTrailingSlash(raw);
}

export function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Directory for the `0600` file-fallback credential store and any local state. */
export function dreambaseDir(): string {
  return join(homedir(), ".dreambase");
}

/** Path to the file-fallback credentials store (used when no OS keychain). */
export function credentialsFilePath(): string {
  return join(dreambaseDir(), "credentials.json");
}

/** Service name used for OS-keychain entries. */
export const KEYCHAIN_SERVICE = "dreambase-mcp";

/** User-Agent sent on every HTTP request the tool makes. */
export const USER_AGENT = "dreambase-mcp";

/**
 * Default scopes requested when the caller does not override `--scopes`.
 * Installation is read-only by default; users explicitly opt into write scopes
 * with `--scopes` when they need mutation tools.
 *
 * The install flow intersects this with the server's advertised
 * `scopes_supported`, so an older server that only knows some of these still
 * works — an unknown scope is dropped rather than failing the authorization.
 */
export const DEFAULT_SCOPES = [
  "workspaces:read",
  "dashboards:read",
  "datasets:read",
  "connections:read",
  "health-reports:read",
  "skills:read",
];
