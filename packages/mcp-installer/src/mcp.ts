import { HttpError, parseJson, redact, request } from "./http";

/** Thrown when the MCP endpoint rejects the bearer token (HTTP 401). */
export class UnauthorizedError extends Error {
  constructor(
    message = "MCP endpoint returned 401 (token invalid or expired)",
  ) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

interface JsonRpcResponse {
  result?: {
    content?: { type: string; text?: string }[];
    isError?: boolean;
  };
  error?: { code: number; message: string };
}

/**
 * Call a single MCP tool over the stateless Streamable HTTP endpoint. No
 * `initialize` handshake is required in the server's stateless mode; a lone
 * `tools/call` request is handled directly. Both `application/json` and
 * `text/event-stream` MUST be in `Accept` (the SDK returns 406 otherwise), and
 * with `enableJsonResponse` the reply body is a JSON-RPC response.
 *
 * Returns the parsed tool result JSON (the tools encode their data as JSON in
 * `content[0].text`). Throws {@link UnauthorizedError} on 401 so callers can
 * refresh and retry.
 */
export async function callTool<T = unknown>(
  mcpUrl: string,
  accessToken: string,
  name: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const res = await request(mcpUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  if (res.status < 200 || res.status >= 300) {
    throw new HttpError(
      `MCP call to ${redact(mcpUrl)} failed with ${res.status}.`,
    );
  }

  const rpc = parseJson<JsonRpcResponse>(res.text, mcpUrl);
  if (rpc.error) {
    throw new HttpError(`MCP tool "${name}" error: ${rpc.error.message}`);
  }
  const content = rpc.result?.content?.[0]?.text;
  if (rpc.result?.isError) {
    throw new HttpError(
      `MCP tool "${name}" reported an error: ${content ?? ""}`,
    );
  }
  if (content === undefined) {
    throw new HttpError(`MCP tool "${name}" returned no content.`);
  }
  return parseJson<T>(content, mcpUrl);
}

/** Shape of the `whoami` tool result. */
export interface WhoAmI {
  userId: string;
  clientId: string;
  scopes: string[];
}
