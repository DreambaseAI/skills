import { getBackend } from "./keychain";

/** Identifies a credential set: an AS issuer + the resource its tokens bind to. */
export interface CredKey {
  issuer: string;
  resource: string;
}

/**
 * What we persist long-term. Per security §9 only the refresh token is stored
 * durably — access tokens are short-lived (15 min) and kept in memory by the
 * shim, re-minted from the refresh token on demand. `clientId` is stored so the
 * refresh grant (which requires `client_id`) can be replayed, and `scope`
 * records what was granted.
 */
export interface StoredCreds {
  clientId: string;
  refreshToken: string;
  scope: string;
}

/** Composite account key for a credential set. */
function credAccount(k: CredKey): string {
  return `creds:${k.issuer}|${k.resource}`;
}

/** Account key for the cached DCR `client_id` for an issuer. */
function clientIdAccount(issuer: string): string {
  return `client_id:${issuer}`;
}

export async function getCreds(k: CredKey): Promise<StoredCreds | null> {
  const raw = await (await getBackend()).get(credAccount(k));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredCreds;
  } catch {
    return null;
  }
}

export async function setCreds(k: CredKey, creds: StoredCreds): Promise<void> {
  await (await getBackend()).set(credAccount(k), JSON.stringify(creds));
}

export async function clearCreds(k: CredKey): Promise<void> {
  await (await getBackend()).del(credAccount(k));
}

export async function getCachedClientId(
  issuer: string,
): Promise<string | null> {
  return (await getBackend()).get(clientIdAccount(issuer));
}

export async function setCachedClientId(
  issuer: string,
  clientId: string,
): Promise<void> {
  await (await getBackend()).set(clientIdAccount(issuer), clientId);
}

export async function clearCachedClientId(issuer: string): Promise<void> {
  await (await getBackend()).del(clientIdAccount(issuer));
}

/** Which storage backend is in use — surfaced by `doctor`. */
export async function backendName(): Promise<"keyring" | "file"> {
  return (await getBackend()).name;
}
