import { getJson, redact, request } from "./http";

/**
 * Everything the tool needs to run OAuth + talk to the MCP surface, all
 * *discovered* from the app base URL (never hardcoded) per the MCP OAuth spec:
 *
 *   POST <base>/mcp                → 401 + `WWW-Authenticate: Bearer resource_metadata="…"`
 *   GET  <resource_metadata_url>   → PRM (RFC 9728): resource + authorization_servers[]
 *   GET  <issuer>/.well-known/oauth-authorization-server → AS metadata (RFC 8414)
 */
export interface Discovered {
  /** The (trimmed) app base URL we started from. */
  base: string;
  /** RFC 9728 `resource` — the audience tokens must be bound to (`<base>/mcp`). */
  resource: string;
  /** The MCP endpoint to POST JSON-RPC to (equal to `resource`). */
  mcpUrl: string;
  /** `authorization_servers[0]` from the PRM — the AS issuer. */
  issuer: string;
  /** Scopes the AS advertises; the caller intersects its request with these. */
  scopesSupported: string[];
  authorizationEndpoint: string;
  tokenEndpoint: string;
  registrationEndpoint: string;
  revocationEndpoint: string;
  jwksUri: string;
  /** Must contain `"S256"` — we reject a server that only offers `plain`. */
  codeChallengeMethods: string[];
  /** RFC 9207: whether the AS emits `iss` on the authorize redirect. */
  issParameterSupported: boolean;
  /** Whether the AS accepts URL-form `client_id`s (CIMD). */
  cimdSupported: boolean;
}

interface ProtectedResourceMetadata {
  resource: string;
  authorization_servers: string[];
  scopes_supported?: string[];
  bearer_methods_supported?: string[];
}

interface AuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint?: string;
  revocation_endpoint?: string;
  jwks_uri?: string;
  scopes_supported?: string[];
  code_challenge_methods_supported?: string[];
  client_id_metadata_document_supported?: boolean;
  authorization_response_iss_parameter_supported?: boolean;
}

export class DiscoveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiscoveryError";
  }
}

/**
 * Parse the `resource_metadata` URL out of an RFC 9728 `WWW-Authenticate`
 * challenge, e.g. `Bearer resource_metadata="https://app/.well-known/…", error="…"`.
 * Tolerant on ordering and surrounding parameters.
 */
export function parseResourceMetadataUrl(
  wwwAuthenticate: string | null,
): string | null {
  if (!wwwAuthenticate) return null;
  const match = wwwAuthenticate.match(/resource_metadata="([^"]+)"/i);
  return match ? match[1]! : null;
}

/**
 * Full discovery chain. `base` should already be trimmed of a trailing slash.
 */
export async function discover(base: string): Promise<Discovered> {
  const mcpUrl = `${base}/mcp`;
  const resourceMetadataUrl = await discoverResourceMetadataUrl(base, mcpUrl);
  const prm = await getJson<ProtectedResourceMetadata>(resourceMetadataUrl);

  if (
    !Array.isArray(prm.authorization_servers) ||
    !prm.authorization_servers[0]
  ) {
    throw new DiscoveryError(
      `Protected-resource metadata at ${redact(resourceMetadataUrl)} listed no authorization_servers`,
    );
  }
  const issuer = trimSlash(prm.authorization_servers[0]);
  const asMetadataUrl = `${issuer}/.well-known/oauth-authorization-server`;
  const as = await getJson<AuthorizationServerMetadata>(asMetadataUrl);

  const codeChallengeMethods = as.code_challenge_methods_supported ?? [];
  if (!codeChallengeMethods.includes("S256")) {
    throw new DiscoveryError(
      `Authorization server ${redact(issuer)} does not advertise PKCE S256 (found: ${codeChallengeMethods.join(", ") || "none"})`,
    );
  }
  for (const [field, value] of [
    ["authorization_endpoint", as.authorization_endpoint],
    ["token_endpoint", as.token_endpoint],
    ["registration_endpoint", as.registration_endpoint],
  ] as const) {
    if (!value) {
      throw new DiscoveryError(
        `Authorization server metadata is missing required field "${field}"`,
      );
    }
  }

  return {
    base,
    resource: trimSlash(prm.resource),
    mcpUrl,
    issuer,
    scopesSupported: prm.scopes_supported ?? as.scopes_supported ?? [],
    authorizationEndpoint: as.authorization_endpoint,
    tokenEndpoint: as.token_endpoint,
    registrationEndpoint: as.registration_endpoint!,
    revocationEndpoint: as.revocation_endpoint ?? `${issuer}/oauth/revoke`,
    jwksUri: as.jwks_uri ?? `${issuer}/.well-known/jwks.json`,
    codeChallengeMethods,
    issParameterSupported:
      as.authorization_response_iss_parameter_supported ?? false,
    cimdSupported: as.client_id_metadata_document_supported ?? false,
  };
}

/**
 * Get the PRM URL: hit the MCP endpoint unauthenticated and read the 401
 * challenge. Falls back to the RFC-canonical well-known path if the challenge
 * header is absent (defensive — the server always sends it today).
 */
async function discoverResourceMetadataUrl(
  base: string,
  mcpUrl: string,
): Promise<string> {
  // A minimal JSON-RPC body; auth is checked before the body is parsed, so any
  // POST triggers the 401 challenge. GET/DELETE would return 405.
  const res = await request(mcpUrl, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 0, method: "ping" }),
  });

  const fromChallenge = parseResourceMetadataUrl(
    res.headers.get("www-authenticate"),
  );
  if (fromChallenge) return fromChallenge;

  if (res.status === 401) {
    // 401 without a parseable challenge — fall back to the canonical path.
    return `${base}/.well-known/oauth-protected-resource/mcp`;
  }
  if (res.status === 404) {
    throw new DiscoveryError(
      `The MCP endpoint ${redact(mcpUrl)} returned 404 — the Dreambase MCP surface may be disabled or the URL is wrong.`,
    );
  }
  throw new DiscoveryError(
    `Expected a 401 challenge from ${redact(mcpUrl)} but got ${res.status}.`,
  );
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, "");
}
