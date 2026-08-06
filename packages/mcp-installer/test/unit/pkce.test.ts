import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createPkce, createState } from "../../src/oauth/pkce";

const VERIFIER_RE = /^[A-Za-z0-9._~-]{43,128}$/;

describe("createPkce", () => {
  it("produces a verifier in the RFC 7636 unreserved charset and length", () => {
    for (let i = 0; i < 50; i++) {
      expect(createPkce().verifier).toMatch(VERIFIER_RE);
    }
  });

  it("uses S256 and challenge = base64url(sha256(verifier))", () => {
    const { verifier, challenge, method } = createPkce();
    expect(method).toBe("S256");
    const expected = createHash("sha256")
      .update(verifier)
      .digest()
      .toString("base64url");
    expect(challenge).toBe(expected);
  });

  it("generates a unique verifier each call", () => {
    const a = createPkce().verifier;
    const b = createPkce().verifier;
    expect(a).not.toBe(b);
  });
});

describe("createState", () => {
  it("is a url-safe opaque string", () => {
    expect(createState()).toMatch(/^[A-Za-z0-9._~-]+$/);
    expect(createState()).not.toBe(createState());
  });
});
