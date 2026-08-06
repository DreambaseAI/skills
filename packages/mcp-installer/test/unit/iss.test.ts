import { describe, expect, it } from "vitest";
import { canonicalizeUrl, InvalidUrlError } from "../../src/oauth/canonicalize";
import {
  parseErrorRedirect,
  validateAuthorizeResponse,
} from "../../src/oauth/iss";

const ISSUER = "https://app.dreambase.test";
const cb = (params: Record<string, string>) =>
  `http://127.0.0.1:5000/callback?${new URLSearchParams(params).toString()}`;

describe("canonicalizeUrl", () => {
  it("lowercases scheme+host and strips a trailing slash", () => {
    expect(canonicalizeUrl("HTTPS://App.Dreambase.Test/")).toBe(
      "https://app.dreambase.test",
    );
    expect(canonicalizeUrl("https://app.dreambase.test/mcp/")).toBe(
      "https://app.dreambase.test/mcp",
    );
  });

  it("preserves path case, query, and non-default port; drops fragment", () => {
    expect(canonicalizeUrl("https://x.test:8443/MCP?a=1#frag")).toBe(
      "https://x.test:8443/MCP?a=1",
    );
  });

  it("rejects userinfo and opaque schemes", () => {
    expect(() => canonicalizeUrl("https://user:pass@x.test")).toThrow(
      InvalidUrlError,
    );
    expect(() => canonicalizeUrl("javascript:alert(1)")).toThrow(
      InvalidUrlError,
    );
    expect(() => canonicalizeUrl("not a url")).toThrow(InvalidUrlError);
  });
});

describe("validateAuthorizeResponse", () => {
  it("accepts a well-formed redirect with matching state + iss", () => {
    const r = validateAuthorizeResponse(
      cb({ code: "abc", state: "s1", iss: ISSUER }),
      { expectedIssuer: ISSUER, expectedState: "s1" },
    );
    expect(r).toEqual({ ok: true, code: "abc", state: "s1", iss: ISSUER });
  });

  it("rejects a state mismatch", () => {
    const r = validateAuthorizeResponse(
      cb({ code: "abc", state: "other", iss: ISSUER }),
      { expectedIssuer: ISSUER, expectedState: "s1" },
    );
    expect(r.ok).toBe(false);
    expect(!r.ok && r.error).toBe("state_mismatch");
  });

  it("rejects a missing code", () => {
    const r = validateAuthorizeResponse(cb({ state: "s1", iss: ISSUER }), {
      expectedIssuer: ISSUER,
      expectedState: "s1",
    });
    expect(!r.ok && r.error).toBe("missing_code");
  });

  it("rejects a missing iss under strict (default)", () => {
    const r = validateAuthorizeResponse(cb({ code: "abc", state: "s1" }), {
      expectedIssuer: ISSUER,
      expectedState: "s1",
    });
    expect(!r.ok && r.error).toBe("missing_iss");
  });

  it("allows a missing iss when strict:false", () => {
    const r = validateAuthorizeResponse(cb({ code: "abc", state: "s1" }), {
      expectedIssuer: ISSUER,
      expectedState: "s1",
      strict: false,
    });
    expect(r.ok).toBe(true);
  });

  it("rejects a wrong iss even when strict:false", () => {
    const r = validateAuthorizeResponse(
      cb({ code: "abc", state: "s1", iss: "https://evil.test" }),
      { expectedIssuer: ISSUER, expectedState: "s1", strict: false },
    );
    expect(!r.ok && r.error).toBe("iss_mismatch");
  });

  it("treats a non-canonical iss (trailing slash) as a mismatch", () => {
    const r = validateAuthorizeResponse(
      cb({ code: "abc", state: "s1", iss: `${ISSUER}/` }),
      { expectedIssuer: ISSUER, expectedState: "s1" },
    );
    expect(!r.ok && r.error).toBe("iss_mismatch");
  });
});

describe("parseErrorRedirect", () => {
  it("extracts error + description", () => {
    expect(
      parseErrorRedirect(
        cb({ error: "access_denied", error_description: "user said no" }),
      ),
    ).toEqual({ error: "access_denied", errorDescription: "user said no" });
  });
  it("returns null when no error", () => {
    expect(parseErrorRedirect(cb({ code: "abc" }))).toBeNull();
  });
});
