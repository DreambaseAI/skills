import { resolveBaseUrl } from "./config";
import { discover } from "./discovery";
import { request } from "./http";
import { ReauthRequired } from "./oauth/refresh";
import { TokenSession } from "./oauth/session";
import { getPrompt, listPrompts } from "./prompts";

export interface ShimOptions {
  url?: string;
}

interface RpcMessage {
  id?: string | number | null;
  method?: string;
  params?: { name?: string };
}

/**
 * The stdio↔HTTP proxy for header-only / non-native-OAuth clients (Claude
 * Desktop, the OpenAI stack, …). The client speaks MCP over stdio using
 * newline-delimited JSON-RPC; the shim forwards each message to the stateless
 * `POST <base>/mcp` endpoint with `Authorization: Bearer` injected, refreshing
 * the token on a 401 and retrying once.
 *
 * It is mostly a transparent passthrough (`tools/list`, `tools/call`, …), with
 * two protocol-aware touches so the bundled skills show up as `/` commands:
 *   - `initialize`: the server's response is augmented to advertise a `prompts`
 *     capability, so the client then asks for the prompt list.
 *   - `prompts/list` / `prompts/get`: served LOCALLY from the bundled skills
 *     (the remote server exposes no prompts).
 * A 202 (notification / response-only body) produces no stdout.
 */
export async function runShim(opts: ShimOptions): Promise<void> {
  const base = resolveBaseUrl(opts.url);
  const d = await discover(base);
  const session = await TokenSession.load(d);

  await new Promise<void>((resolve) => {
    let buffer = "";
    const inflight = new Set<Promise<void>>();

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      buffer += chunk;
      let nl: number;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        const p = handleLine(d.mcpUrl, session, line).catch((err) =>
          onFatal(err),
        );
        inflight.add(p);
        void p.finally(() => inflight.delete(p));
      }
    });
    process.stdin.on("end", () => {
      void Promise.allSettled([...inflight]).then(() => resolve());
    });
  });
}

/** Forward one JSON-RPC message and write the response (if any) to stdout. */
async function handleLine(
  mcpUrl: string,
  session: TokenSession,
  line: string,
): Promise<void> {
  const msg = parseMessage(line);
  const id = msg && "id" in msg ? msg.id : undefined;
  const method = msg?.method;
  try {
    // Serve prompts locally so the bundled skills appear as `/` commands.
    if (method === "prompts/list") {
      writeMessage(rpcResult(id, listPrompts()));
      return;
    }
    if (method === "prompts/get") {
      const name = msg?.params?.name;
      const got = name ? getPrompt(name) : null;
      writeMessage(
        got
          ? rpcResult(id, got)
          : rpcError(id, -32602, `Unknown prompt: ${name ?? ""}`),
      );
      return;
    }

    let text = await forwardMessage(mcpUrl, session, line);
    if (!text) return;
    // Enrich a few responses so the report renders nicely without any manual
    // step (Desktop doesn't load our skills or reliably surface prompts):
    if (method === "initialize") {
      text = augmentInitialize(text); // advertise the `prompts` capability
    } else if (method === "tools/list") {
      text = augmentToolsList(text); // inject report + design render directives
    } else if (
      method === "tools/call" &&
      msg?.params?.name === "get_health_report"
    ) {
      text = augmentReportResult(text); // ship rendering guidance with the data
    }
    writeMessage(text);
    return;
  } catch (err) {
    if (err instanceof ReauthRequired) throw err; // fatal — bubble up
    // A request (has id) gets a JSON-RPC error; a notification just logs.
    const message = err instanceof Error ? err.message : String(err);
    if (id !== undefined) {
      writeMessage(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          error: { code: -32000, message },
        }),
      );
    } else {
      process.stderr.write(`dreambase-mcp shim: ${message}\n`);
    }
  }
}

/** POST the message, injecting the bearer; refresh + retry once on 401. */
export async function forwardMessage(
  mcpUrl: string,
  session: TokenSession,
  body: string,
): Promise<string | null> {
  const post = (token: string) =>
    request(mcpUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body,
      timeoutMs: 65_000,
    });

  let res = await post(await session.getAccessToken());
  if (res.status === 401) {
    res = await post(await session.forceRefresh());
  }
  if (res.status === 202) return null; // notification / no response body
  return res.text;
}

function writeMessage(text: string): void {
  process.stdout.write(text.endsWith("\n") ? text : `${text}\n`);
}

function parseMessage(line: string): RpcMessage | undefined {
  try {
    return JSON.parse(line) as RpcMessage;
  } catch {
    return undefined;
  }
}

function rpcResult(id: RpcMessage["id"], result: unknown): string {
  return JSON.stringify({ jsonrpc: "2.0", id: id ?? null, result });
}

function rpcError(id: RpcMessage["id"], code: number, message: string): string {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message },
  });
}

/**
 * Instructions the model receives so it renders a health report the Dreambase
 * way. Delivered two ways (belt and suspenders): appended to the
 * `get_health_report` tool description, and shipped alongside the report data
 * in the tool result — so no skill file or slash command is needed.
 */
const REPORT_RENDER_DIRECTIVE =
  'When a health report\'s status is "completed", present it as a SINGLE ' +
  "self-contained artifact that renders INLINE in the Claude canvas — a dark-themed " +
  "dashboard in Dreambase's style: a circular grade gauge (letter grade A–F plus " +
  "the 0–100 score, colored by tier — excellent ≥90 emerald, good ≥80 green, " +
  "satisfactory ≥70 lime, fair ≥60 yellow, needs-improvement ≥50 amber, poor red), " +
  "a grid of KPI cards, insights grouped by severity (errors, then warnings, then " +
  "successes), and recommendations ordered by priority; remediation SQL as " +
  "copy-runnable blocks with a 'review before running' note. Everything inline (no " +
  "external assets). Do NOT open a new browser tab/window, call window.open, or " +
  "offer a downloadable file — it must display in the inline artifact canvas.";

/**
 * Design-language directive for the data-returning read tools. Desktop/Cowork
 * doesn't load our skills, so — like the report directive — we ride it in on the
 * tool description. Conditioned on rendering an artifact so it only applies when
 * the user actually wants a visual, and points at the canonical (always-current)
 * design doc rather than baking values in.
 */
const DESIGN_DIRECTIVE =
  "If you render this data as an artifact (a chart, dashboard, or KPI card), " +
  "fetch https://dreambase.com/design.md and follow it so the result matches " +
  "Dreambase's design language.";

/** Read tools whose data is chart-worthy and should carry the design directive. */
const DESIGN_TOOLS = new Set([
  "query_dataset",
  "list_aggregates",
  "get_aggregate",
]);

interface ToolsListText {
  result?: { tools?: { name?: string; description?: string }[] };
}
interface ToolCallText {
  result?: { isError?: boolean; content?: { type?: string; text?: string }[] };
}

/**
 * Append render/design directives to tool descriptions so Desktop/Cowork picks
 * them up without a skill install: the report directive on get_health_report,
 * and the design directive on the chart-worthy data reads.
 */
export function augmentToolsList(text: string): string {
  try {
    const obj = JSON.parse(text) as ToolsListText;
    const tools = obj.result?.tools;
    if (Array.isArray(tools)) {
      for (const t of tools) {
        if (typeof t?.name !== "string" || typeof t.description !== "string") {
          continue;
        }
        if (t.name === "get_health_report") {
          t.description += `\n\n${REPORT_RENDER_DIRECTIVE}`;
        } else if (DESIGN_TOOLS.has(t.name)) {
          t.description += `\n\n${DESIGN_DIRECTIVE}`;
        }
      }
    }
    return JSON.stringify(obj);
  } catch {
    return text;
  }
}

/** Ship the render directive alongside a completed report's tool result. */
export function augmentReportResult(text: string): string {
  try {
    const obj = JSON.parse(text) as ToolCallText;
    const content = obj.result?.content;
    if (Array.isArray(content) && !obj.result?.isError) {
      const joined = content.map((c) => c?.text ?? "").join("");
      // Only when the report is complete — not on "generating" poll responses.
      if (joined.includes('"completed"') || joined.includes('"grade"')) {
        content.push({ type: "text", text: REPORT_RENDER_DIRECTIVE });
      }
    }
    return JSON.stringify(obj);
  } catch {
    return text;
  }
}

/** Merge a `prompts` capability into the server's initialize result. */
function augmentInitialize(text: string): string {
  try {
    const obj = JSON.parse(text) as {
      result?: { capabilities?: Record<string, unknown> };
    };
    if (obj.result?.capabilities) {
      obj.result.capabilities.prompts = obj.result.capabilities.prompts ?? {
        listChanged: false,
      };
    }
    return JSON.stringify(obj);
  } catch {
    return text;
  }
}

function onFatal(err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`dreambase-mcp shim: ${message}\n`);
  process.exit(1);
}
