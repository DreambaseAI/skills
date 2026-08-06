// Ported verbatim (not imported) from the Dreambase AS
// `lib/oauth-provider/server/core/canonicalize.ts`. The client-side `iss` check
// MUST canonicalize the expected issuer with the SAME rules the AS uses to emit
// `iss`, or a semantically-identical issuer would compare unequal. Keeping a
// copy here honours the spec's "talks to the server only over documented HTTP"
// decoupling — there is no shared package.
//
// Rules: lowercase scheme+host (URL does this), drop the fragment, strip
// trailing slashes on the path, preserve port/path-case/query, and REJECT URLs
// with userinfo or an opaque origin (both would let two distinct URIs collapse
// into one canonical string — a real mix-up-attack signal).

export class InvalidUrlError extends Error {
  constructor(raw: string) {
    super(`not an absolute URL: ${raw}`);
    this.name = "InvalidUrlError";
  }
}

export function canonicalizeUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new InvalidUrlError(raw);
  }
  if (url.username !== "" || url.password !== "") {
    throw new InvalidUrlError(raw);
  }
  if (url.origin === "null") {
    throw new InvalidUrlError(raw);
  }
  const path = url.pathname === "/" ? "" : url.pathname.replace(/\/+$/, "");
  return `${url.origin}${path}${url.search}`;
}
