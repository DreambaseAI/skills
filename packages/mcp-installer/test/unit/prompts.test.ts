import { beforeEach, describe, expect, it } from "vitest";
import { getPrompt, listPrompts, resetPromptCache } from "../../src/prompts";

describe("prompts (skills exposed as MCP prompts)", () => {
  beforeEach(() => resetPromptCache());

  it("lists the bundled skills with clean (unprefixed) names + descriptions", () => {
    const { prompts } = listPrompts();
    const names = prompts.map((p) => p.name);
    expect(names).toContain("mcp");
    expect(names).toContain("echarts");
    // The `dreambase-` prefix is stripped for display.
    expect(names.some((n) => n.startsWith("dreambase-"))).toBe(false);
    const mcp = prompts.find((p) => p.name === "mcp");
    expect(mcp?.description).toMatch(/dreambase/i);
  });

  it("returns the skill body (frontmatter stripped) as a user message", () => {
    const got = getPrompt("mcp");
    expect(got).not.toBeNull();
    expect(got!.messages).toHaveLength(1);
    expect(got!.messages[0]!.role).toBe("user");
    const text = got!.messages[0]!.content.text;
    // Body content is present…
    expect(text).toContain("query_dataset");
    // …and the YAML frontmatter block is stripped.
    expect(text.startsWith("---")).toBe(false);
    expect(text).not.toContain("name: dreambase-mcp");
  });

  it("returns null for an unknown prompt", () => {
    expect(getPrompt("nope")).toBeNull();
  });
});
