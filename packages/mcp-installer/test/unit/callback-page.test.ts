import { describe, expect, it } from "vitest";
import { callbackSuccessHtml } from "../../src/oauth/callback-page";

describe("callbackSuccessHtml", () => {
  const html = callbackSuccessHtml();

  it("declares a utf-8 charset (prevents the mojibake bug)", () => {
    expect(html).toContain('<meta charset="utf-8"');
  });

  it("has no latin-1 mojibake artifacts", () => {
    expect(html).not.toContain("â€");
  });

  it("is a self-contained page with no external resource requests", () => {
    expect(html.startsWith("<!doctype html>")).toBe(true);
    // No network fetches — the loopback server closes right after responding.
    expect(html).not.toMatch(/<link[^>]+href=|<script[^>]+src=|src="http/);
  });

  it("shows the Dreambase branding and success copy", () => {
    expect(html).toContain("Dreambase MCP");
    expect(html).toContain("Authorization complete");
  });
});
