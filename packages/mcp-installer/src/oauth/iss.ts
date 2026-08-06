// Client-side RFC 9207 validator, ported from the Dreambase AS reference impl
// `lib/oauth-provider/server/core/iss.ts` (the AS ships this exact logic for
// "consumers (Dream CLI, mcp-remote) to mirror"). Only the client-side
// `validateAuthorizeResponse` is needed here — the AS-side redirect *builders*
// live on the server.
//
// It compares the *raw* received `iss` against the canonical expected issuer,
// so any non-canonical `iss` (trailing slash, case difference) is rejected —
// closing the mix-up attack where a code from one AS is fed to another.

import { canonicalizeUrl } from "./canonicalize";

export type IssValidationError =
  | "invalid_response_url"
  | "missing_code"
  | "state_mismatch"
  | "missing_iss"
  | "iss_mismatch";

export interface ValidateIssOptions {
  /** Expected AS issuer. Canonicalized internally before the comparison. */
  expectedIssuer: string;
  /** Expected CSRF state; a mismatch is reported as `state_mismatch`. */
  expectedState?: string;
  /**
   * RFC 9207: clients SHOULD reject responses without `iss`. A present-but-wrong
   * `iss` is ALWAYS rejected regardless of this flag. Defaults to strict.
   */
  strict?: boolean;
}

export type ValidateIssResult =
  | { ok: true; code: string; state?: string; iss?: string }
  | {
      ok: false;
      error: IssValidationError;
      code?: string;
      state?: string;
      iss?: string;
    };

/**
 * Validate an authorization-response redirect URL: enforce `state` match and
 * RFC 9207 `iss` *before* the caller ever touches the authorization code.
 */
export function validateAuthorizeResponse(
  responseUrl: string,
  opts: ValidateIssOptions,
): ValidateIssResult {
  let params: URLSearchParams;
  try {
    params = new URL(responseUrl).searchParams;
  } catch {
    return { ok: false, error: "invalid_response_url" };
  }
  const code = params.get("code") ?? undefined;
  const state = params.get("state") ?? undefined;
  const iss = params.get("iss") ?? undefined;

  // An error redirect carries `error`/`error_description` instead of a code.
  const errorCode = params.get("error") ?? undefined;

  if (!code) {
    return { ok: false, error: "missing_code", code, state, iss };
  }
  if (opts.expectedState !== undefined && state !== opts.expectedState) {
    return { ok: false, error: "state_mismatch", code, state, iss };
  }
  if (iss === undefined) {
    if (opts.strict !== false) {
      return { ok: false, error: "missing_iss", code, state, iss };
    }
  } else if (iss !== canonicalizeUrl(opts.expectedIssuer)) {
    return { ok: false, error: "iss_mismatch", code, state, iss };
  }
  // `errorCode` is only reachable when a code was somehow also present; the
  // missing-code branch above handles the normal error-redirect case.
  void errorCode;

  return { ok: true, code, state, iss };
}

/** Parse an OAuth error redirect into `{ error, error_description }` if present. */
export function parseErrorRedirect(
  responseUrl: string,
): { error: string; errorDescription?: string } | null {
  let params: URLSearchParams;
  try {
    params = new URL(responseUrl).searchParams;
  } catch {
    return null;
  }
  const error = params.get("error");
  if (!error) return null;
  return {
    error,
    errorDescription: params.get("error_description") ?? undefined,
  };
}
