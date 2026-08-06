import { createHash, randomBytes } from "node:crypto";

export interface Pkce {
  verifier: string;
  challenge: string;
  method: "S256";
}

function base64url(buf: Buffer): string {
  return buf.toString("base64url");
}

/**
 * Create an RFC 7636 PKCE pair using S256 (the only method the Dreambase AS
 * accepts; `plain` is rejected). The verifier is 32 random bytes base64url
 * encoded → 43 chars, comfortably inside the 43–128 unreserved-char range the
 * server enforces (`^[A-Za-z0-9._~-]{43,128}$`).
 */
export function createPkce(): Pkce {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge, method: "S256" };
}

/** A URL-safe opaque value for the OAuth `state` CSRF parameter. */
export function createState(): string {
  return base64url(randomBytes(32));
}
