import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

/** Read a JSON config file, returning `{}` if it is missing or unparseable. */
export function readJsonConfig(path: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

/**
 * Write a JSON config atomically (temp file + rename), creating parent dirs. On
 * the first modification of an existing file, a one-time `.dreambase.bak` backup
 * is made so the user can restore their prior config.
 */
export function writeJsonConfig(
  path: string,
  data: Record<string, unknown>,
): void {
  mkdirSync(dirname(path), { recursive: true });
  const backup = `${path}.dreambase.bak`;
  if (existsSync(path) && !existsSync(backup)) {
    copyFileSync(path, backup);
  }
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  renameSync(tmp, path);
}

/**
 * Merge an MCP server entry into a config's `mcpServers` map without disturbing
 * other entries. Returns whether anything changed (a no-op when the entry is
 * already present and identical).
 */
export function upsertMcpServer(
  config: Record<string, unknown>,
  name: string,
  entry: object,
): boolean {
  const servers =
    (config.mcpServers as Record<string, unknown> | undefined) ?? {};
  const existing = servers[name];
  if (existing && JSON.stringify(existing) === JSON.stringify(entry)) {
    return false;
  }
  servers[name] = entry;
  config.mcpServers = servers;
  return true;
}

/** Remove `mcpServers[name]` if present. Returns whether anything changed. */
export function removeMcpServer(
  config: Record<string, unknown>,
  name: string,
): boolean {
  const servers = config.mcpServers as Record<string, unknown> | undefined;
  if (!servers || !(name in servers)) return false;
  delete servers[name];
  config.mcpServers = servers;
  return true;
}

/** Whether `mcpServers[name]` exists and points at the expected URL. */
export function hasMcpServerUrl(
  config: Record<string, unknown>,
  name: string,
  url: string,
): boolean {
  const servers = config.mcpServers as
    Record<string, { url?: string }> | undefined;
  return servers?.[name]?.url === url;
}
