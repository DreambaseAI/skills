import type { Discovered } from "../discovery";
import {
  getCreds,
  setCreds,
  type CredKey,
  type StoredCreds,
} from "../store/credentials";
import { performRefresh, ReauthRequired } from "./refresh";
import { withRefreshLock } from "./refresh-lock";

/** Refresh this many ms before the access token's stated expiry. */
const EXPIRY_SKEW_MS = 30_000;

/**
 * Owns the short-lived access token for a stored session. Access tokens live
 * only in memory (security §9); the refresh token is read from the store and,
 * on every rotation, the new refresh token is persisted *before* the access
 * token is handed out — so a crash mid-request can never strand the family.
 */
export class TokenSession {
  private access?: { token: string; expiresAt: number };
  private inFlight?: Promise<string>;

  private constructor(
    private readonly d: Discovered,
    private readonly key: CredKey,
    private creds: StoredCreds,
  ) {}

  /** Load the stored session for a discovered server, or reject with ReauthRequired. */
  static async load(d: Discovered): Promise<TokenSession> {
    const key: CredKey = { issuer: d.issuer, resource: d.resource };
    const creds = await getCreds(key);
    if (!creds) {
      throw new ReauthRequired(
        "No stored credentials — run `dreambase-mcp install` first.",
      );
    }
    return new TokenSession(d, key, creds);
  }

  /** A valid access token, refreshing proactively if it is missing or near expiry. */
  async getAccessToken(): Promise<string> {
    if (this.access && Date.now() < this.access.expiresAt - EXPIRY_SKEW_MS) {
      return this.access.token;
    }
    return this.refresh();
  }

  /** Force a refresh (used after a 401 from the resource server). */
  async forceRefresh(): Promise<string> {
    this.access = undefined;
    return this.refresh();
  }

  /** Coalesce concurrent refreshes into a single in-flight request. */
  private refresh(): Promise<string> {
    if (this.inFlight) return this.inFlight;
    this.inFlight = this.doRefresh().finally(() => {
      this.inFlight = undefined;
    });
    return this.inFlight;
  }

  private doRefresh(): Promise<string> {
    // Serialize refresh across processes. Rotating refresh tokens revoke the
    // whole family on reuse, so two shim processes (Claude Desktop can run one
    // per connection) must never rotate the same token at once.
    return withRefreshLock(this.key, async () => {
      // Re-read under the lock: another process may have rotated while we
      // waited. Always refresh with the freshest *stored* token so we can't
      // present an already-rotated one and trip family revocation.
      const stored = await getCreds(this.key);
      if (!stored) {
        throw new ReauthRequired(
          "No stored credentials — run `dreambase-mcp install` first.",
        );
      }
      this.creds = stored;

      const tokens = await performRefresh(
        this.d,
        this.creds.refreshToken,
        this.creds.clientId,
      );
      // Persist the rotated refresh token BEFORE using the access token.
      if (
        tokens.refreshToken &&
        tokens.refreshToken !== this.creds.refreshToken
      ) {
        this.creds = { ...this.creds, refreshToken: tokens.refreshToken };
        await setCreds(this.key, this.creds);
      }
      this.access = {
        token: tokens.accessToken,
        expiresAt: tokens.obtainedAt + tokens.expiresIn * 1000,
      };
      return this.access.token;
    });
  }
}
