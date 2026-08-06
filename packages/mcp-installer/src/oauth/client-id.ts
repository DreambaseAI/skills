import type { Discovered } from "../discovery";
import { HttpError, parseJson, postJson, redact } from "../http";
import { getCachedClientId, setCachedClientId } from "../store/credentials";

/**
 * The loopback redirect the AS must accept. Registered port-agnostically
 * (`http://127.0.0.1/callback`, no port, path exactly `/callback`, no query):
 * the AS matches http loopback ignoring the port, so any runtime ephemeral port
 * is fine — and `application_type: "native"` is REQUIRED for the AS to allow the
 * `127.0.0.1` IP literal at all (a `web` client only gets `localhost`).
 */
const LOOPBACK_REDIRECT = "http://127.0.0.1/callback";

interface DcrResponse {
  client_id: string;
  redirect_uris?: string[];
  token_endpoint_auth_method?: string;
}

/**
 * Resolve a `client_id` for the AS: reuse a cached DCR registration if present,
 * otherwise register a new public native client (RFC 7591) and cache the id.
 *
 * v1 is DCR-only (CIMD is supported server-side but needs hosting infra that
 * doesn't exist yet — spec §11); this seam is where CIMD would slot in.
 */
export async function ensureClientId(d: Discovered): Promise<string> {
  const cached = await getCachedClientId(d.issuer);
  if (cached) return cached;

  const clientId = await registerClient(d);
  await setCachedClientId(d.issuer, clientId);
  return clientId;
}

async function registerClient(d: Discovered): Promise<string> {
  const res = await postJson(d.registrationEndpoint, {
    client_name: "dreambase-mcp",
    application_type: "native",
    redirect_uris: [LOOPBACK_REDIRECT],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });

  if (res.status === 429) {
    const retry = res.headers.get("retry-after");
    throw new HttpError(
      `Client registration is rate-limited${retry ? ` (retry after ${retry}s)` : ""}. Try again shortly.`,
    );
  }
  if (res.status !== 201) {
    throw new HttpError(
      `Dynamic client registration at ${redact(d.registrationEndpoint)} failed with ${res.status}.`,
    );
  }

  const body = parseJson<DcrResponse>(res.text, d.registrationEndpoint);
  if (!body.client_id) {
    throw new HttpError("Client registration returned no client_id.");
  }
  return body.client_id;
}
