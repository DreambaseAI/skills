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
 * `text/event-stream` MUST be in `Accept` (the SDK returns 406 otherwise).
 * Dreambase streams progress-capable calls as SSE, while older deployments
 * may still answer with JSON, so this boundary accepts both wire shapes.
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

  const rpc = parseMcpResponse(res.text, res.headers, mcpUrl);
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

/** Parse one stateless Streamable HTTP response in JSON or SSE form. */
export function parseMcpResponse(
  body: string,
  headers: Headers,
  url: string,
): JsonRpcResponse {
  const contentType = headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("text/event-stream")) {
    return parseJson<JsonRpcResponse>(body, url);
  }

  // A response may contain progress notifications before its terminal JSON-RPC
  // result. Parse complete SSE events and select the final response carrying
  // either `result` or `error`; never concatenate data from separate events.
  const events = body.split(/\r?\n\r?\n/);
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const data = (events[index] ?? "")
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) continue;
    const parsed = parseJson<JsonRpcResponse>(data, url);
    if (parsed.result !== undefined || parsed.error !== undefined) {
      return parsed;
    }
  }

  throw new HttpError(
    `MCP response from ${redact(url)} contained no terminal JSON-RPC event`,
  );
}

/** Shape of the `whoami` tool result. */
export interface WhoAmI {
  userId: string;
  clientId: string;
  scopes: string[];
}
