import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { callbackSuccessHtml } from "./callback-page";

export interface LoopbackListener {
  /** The full redirect URI to register/authorize with, e.g. http://127.0.0.1:54321/callback */
  redirectUri: string;
  /** Resolves with the full callback URL (query intact) on the first hit to /callback. */
  waitForCallback(): Promise<string>;
  /** Tear the listener down (idempotent). */
  close(): void;
}

export interface LoopbackOptions {
  /** Reject `waitForCallback` after this many ms (default 120s). */
  timeoutMs?: number;
  /** Path the AS redirects to (default `/callback`). */
  path?: string;
}

/**
 * RFC 8252 §7.3 loopback redirect listener. Binds `127.0.0.1` (never
 * `0.0.0.0`/`localhost`) on an OS-assigned ephemeral port, serves exactly one
 * callback, then closes. The server registers `http://127.0.0.1/callback`
 * (port-agnostic) via DCR with `application_type: "native"`, so any runtime
 * port matches.
 */
export function startLoopback(
  opts: LoopbackOptions = {},
): Promise<LoopbackListener> {
  const path = opts.path ?? "/callback";
  const timeoutMs = opts.timeoutMs ?? 120_000;

  return new Promise((resolveListener, rejectListener) => {
    let settled = false;
    let resolveCallback: (url: string) => void;
    let rejectCallback: (err: Error) => void;
    const callbackPromise = new Promise<string>((res, rej) => {
      resolveCallback = res;
      rejectCallback = rej;
    });

    const server: Server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      if (url.pathname !== path) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
        return;
      }
      // Single-use: capture the first callback, acknowledge in the browser, done.
      // `charset=utf-8` is required or the browser decodes the page as latin-1
      // and multi-byte characters render as mojibake.
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(callbackSuccessHtml());
      if (!settled) {
        settled = true;
        resolveCallback(url.toString());
        // Let the response flush before closing the socket.
        setTimeout(() => server.close(), 50);
      }
    });

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        server.close();
        rejectCallback(
          new Error(
            `Timed out after ${Math.round(timeoutMs / 1000)}s waiting for the OAuth redirect.`,
          ),
        );
      }
    }, timeoutMs);
    timer.unref?.();

    server.on("error", (err) => {
      if (!settled) {
        settled = true;
        rejectListener(err);
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as AddressInfo;
      const redirectUri = `http://127.0.0.1:${addr.port}${path}`;
      resolveListener({
        redirectUri,
        waitForCallback: () => callbackPromise,
        close: () => {
          clearTimeout(timer);
          server.close();
        },
      });
    });
  });
}
