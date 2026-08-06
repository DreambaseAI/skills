// Wire shapes captured verbatim from the Dreambase MCP server routes on branch
// `mcp-api-server-poc-impl`. Pinning them here means our unit tests fail loudly
// if the server contract drifts from what the installer assumes.

export const BASE = "https://app.dreambase.test";
export const ISSUER = "https://app.dreambase.test";

/** `WWW-Authenticate` value on the unauthenticated 401 from POST /mcp. */
export const WWW_AUTHENTICATE = `Bearer resource_metadata="${BASE}/.well-known/oauth-protected-resource/mcp"`;

/** RFC 9728 protected-resource metadata (from app/oauth/protected-resource-mcp/route.ts). */
export const PRM = {
  resource: `${BASE}/mcp`,
  authorization_servers: [ISSUER],
  scopes_supported: [
    "dashboards:read",
    "health-reports:read",
    "health-reports:write",
  ],
  bearer_methods_supported: ["header"],
};

/** RFC 8414 AS metadata (from app/oauth/authorization-server-metadata/route.ts). */
export const AS_METADATA = {
  issuer: ISSUER,
  authorization_endpoint: `${ISSUER}/oauth/authorize`,
  token_endpoint: `${ISSUER}/oauth/token`,
  revocation_endpoint: `${ISSUER}/oauth/revoke`,
  registration_endpoint: `${ISSUER}/oauth/register`,
  jwks_uri: `${ISSUER}/.well-known/jwks.json`,
  response_types_supported: ["code"],
  grant_types_supported: ["authorization_code", "refresh_token"],
  scopes_supported: [
    "dashboards:read",
    "health-reports:read",
    "health-reports:write",
  ],
  code_challenge_methods_supported: ["S256"],
  token_endpoint_auth_methods_supported: ["none"],
  revocation_endpoint_auth_methods_supported: ["none"],
  client_id_metadata_document_supported: true,
  authorization_response_iss_parameter_supported: true,
};

/** DCR 201 response body (from app/oauth/register/route.ts). */
export const DCR_RESPONSE = {
  client_id: "11111111-2222-3333-4444-555555555555",
  client_id_issued_at: 1_700_000_000,
  redirect_uris: ["http://127.0.0.1/callback"],
  grant_types: ["authorization_code", "refresh_token"],
  response_types: ["code"],
  token_endpoint_auth_method: "none",
  application_type: "native",
  client_name: "dreambase-mcp",
};

/** Successful token response (authorization_code / refresh_token grant). */
export const TOKEN_RESPONSE = {
  access_token: "header.payload.signature",
  token_type: "Bearer",
  expires_in: 900,
  refresh_token: "refresh-token-value",
  scope: "health-reports:read health-reports:write",
};

/** `whoami` MCP tool result content (JSON encoded in content[0].text). */
export const WHOAMI_RESULT = {
  userId: "user-abc",
  clientId: "11111111-2222-3333-4444-555555555555",
  scopes: ["health-reports:read", "health-reports:write"],
};

/**
 * Install a fetch stub that serves the fixtures above for a standard discovery
 * chain. Returns a restore function. Extra route handlers can be layered on.
 */
export function installDiscoveryFetch(
  overrides: Record<string, () => Response> = {},
): () => void {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input.toString();
    for (const [prefix, handler] of Object.entries(overrides)) {
      if (url.startsWith(prefix)) return handler();
    }
    if (url === `${BASE}/mcp`) {
      return new Response(
        JSON.stringify({ jsonrpc: "2.0", error: { code: -32001 } }),
        { status: 401, headers: { "www-authenticate": WWW_AUTHENTICATE } },
      );
    }
    if (url === `${BASE}/.well-known/oauth-protected-resource/mcp`) {
      return new Response(JSON.stringify(PRM), { status: 200 });
    }
    if (url === `${ISSUER}/.well-known/oauth-authorization-server`) {
      return new Response(JSON.stringify(AS_METADATA), { status: 200 });
    }
    return new Response("not found", { status: 404 });
  }) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}
