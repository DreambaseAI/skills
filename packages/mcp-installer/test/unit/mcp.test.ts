import { afterEach, describe, expect, it, vi } from "vitest";

import { callTool, parseMcpResponse } from "../../src/mcp";
import { BASE, WHOAMI_RESULT } from "../fixtures/server-responses";

const rpcResult = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    content: [{ type: "text", text: JSON.stringify(WHOAMI_RESULT) }],
  },
};

describe("parseMcpResponse", () => {
  it("accepts a plain JSON response", () => {
    expect(
      parseMcpResponse(
        JSON.stringify(rpcResult),
        new Headers({ "content-type": "application/json" }),
        `${BASE}/mcp`,
      ),
    ).toEqual(rpcResult);
  });

  it("selects the terminal JSON-RPC result after SSE progress events", () => {
    const body = [
      'event: message\ndata: {"jsonrpc":"2.0","method":"notifications/progress"}',
      `event: message\ndata: ${JSON.stringify(rpcResult)}`,
      "",
    ].join("\n\n");

    expect(
      parseMcpResponse(
        body,
        new Headers({ "content-type": "text/event-stream; charset=utf-8" }),
        `${BASE}/mcp`,
      ),
    ).toEqual(rpcResult);
  });
});

describe("callTool", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("decodes the Dev server's SSE result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            `event: message\ndata: ${JSON.stringify(rpcResult)}\n\n`,
            {
              status: 200,
              headers: { "content-type": "text/event-stream" },
            },
          ),
      ),
    );

    await expect(callTool(`${BASE}/mcp`, "token", "whoami")).resolves.toEqual(
      WHOAMI_RESULT,
    );
  });
});
