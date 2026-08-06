import { resolveBaseUrl } from "./config";
import { ALL_WRITERS } from "./clients/detect";
import type { WriteContext } from "./clients/types";
import { discover } from "./discovery";
import { postForm } from "./http";
import { clearCachedClientId, clearCreds, getCreds } from "./store/credentials";

const SERVER_NAME = "dreambase";

export interface LogoutOptions {
  url?: string;
  removeConfig?: boolean;
}

/**
 * Revoke the stored refresh token at the AS (RFC 7009 — revoking a refresh
 * token kills the whole family), clear stored credentials, and optionally
 * remove the installer's entries from each client config.
 */
export async function runLogout(opts: LogoutOptions): Promise<number> {
  const base = resolveBaseUrl(opts.url);
  const d = await discover(base);
  const key = { issuer: d.issuer, resource: d.resource };
  const creds = await getCreds(key);

  if (creds) {
    // RFC 7009: always 200, no token-existence oracle; best-effort revoke.
    try {
      await postForm(d.revocationEndpoint, {
        token: creds.refreshToken,
        token_type_hint: "refresh_token",
      });
      console.log(`Revoked the refresh token at ${d.issuer}.`);
    } catch (err) {
      console.error(
        `Warning: revoke request failed (${err instanceof Error ? err.message : String(err)}); clearing local credentials anyway.`,
      );
    }
    await clearCreds(key);
    await clearCachedClientId(d.issuer);
    console.log(`Cleared stored credentials.`);
  } else {
    console.log(`No stored credentials for ${d.issuer}.`);
  }

  if (opts.removeConfig) {
    const ctx: WriteContext = {
      base,
      mcpUrl: d.mcpUrl,
      serverName: SERVER_NAME,
    };
    for (const writer of ALL_WRITERS) {
      try {
        const res = await writer.remove(ctx);
        if (res.action !== "skipped") {
          console.log(`  removed ${writer.displayName} entry`);
        }
      } catch {
        // Best-effort — a missing client is not an error.
      }
    }
  }

  console.log(`Logged out.`);
  return 0;
}
