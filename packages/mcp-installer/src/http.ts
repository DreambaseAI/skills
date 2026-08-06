import { USER_AGENT } from "./config";

export interface HttpResponse {
  status: number;
  headers: Headers;
  text: string;
}

export interface HttpOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  /** Abort the request after this many ms (default 15s). */
  timeoutMs?: number;
}

/**
 * A thin wrapper over the native `fetch` with a timeout, our User-Agent, and a
 * uniform result shape. It deliberately returns the raw body text (not parsed)
 * so callers decide how to interpret non-2xx responses; discovery, for example,
 * expects a 401.
 *
 * Never logs request/response bodies or headers — those can carry tokens and
 * authorization codes (security §9). Use {@link redact} before printing URLs.
 */
export async function request(
  url: string,
  opts: HttpOptions = {},
): Promise<HttpResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts.timeoutMs ?? 15_000,
  );
  try {
    const res = await fetch(url, {
      method: opts.method ?? "GET",
      headers: { "user-agent": USER_AGENT, ...opts.headers },
      body: opts.body,
      signal: controller.signal,
      redirect: "manual",
    });
    const text = await res.text();
    return { status: res.status, headers: res.headers, text };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new HttpError(`Request to ${redact(url)} timed out`);
    }
    throw new HttpError(
      `Request to ${redact(url)} failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** GET a URL and parse the body as JSON, erroring on non-2xx or bad JSON. */
export async function getJson<T>(url: string): Promise<T> {
  const res = await request(url, { method: "GET" });
  if (res.status < 200 || res.status >= 300) {
    throw new HttpError(
      `GET ${redact(url)} returned ${res.status} (expected 2xx)`,
    );
  }
  return parseJson<T>(res.text, url);
}

/** POST an `application/x-www-form-urlencoded` body. Returns the raw response. */
export async function postForm(
  url: string,
  form: Record<string, string>,
  headers: Record<string, string> = {},
): Promise<HttpResponse> {
  return request(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
      ...headers,
    },
    body: new URLSearchParams(form).toString(),
  });
}

/** POST a JSON body. Returns the raw response. */
export async function postJson(
  url: string,
  json: unknown,
  headers: Record<string, string> = {},
): Promise<HttpResponse> {
  return request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(json),
  });
}

export function parseJson<T>(text: string, url: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(`Response from ${redact(url)} was not valid JSON`);
  }
}

/**
 * Strip query strings and userinfo from a URL before it appears in a log or
 * error message — authorization codes and tokens live in query params.
 */
export function redact(url: string): string {
  try {
    const u = new URL(url);
    u.search = "";
    u.username = "";
    u.password = "";
    return u.toString();
  } catch {
    return "<url>";
  }
}

export class HttpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HttpError";
  }
}
