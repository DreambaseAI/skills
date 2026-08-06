import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bundledSkillNames, skillsSourceDir } from "./skills";

/**
 * The bundled skills, re-exposed as MCP **prompts**. Clients like Claude
 * Desktop surface a server's prompts as `/` slash commands, so this is how the
 * report-formatting guidance reaches Desktop chat (Desktop doesn't read
 * `~/.claude/skills`). The shim serves these locally — the remote server has no
 * prompts of its own.
 */
export interface McpPrompt {
  name: string;
  description: string;
}

interface LoadedPrompt extends McpPrompt {
  body: string;
}

let cache: LoadedPrompt[] | undefined;

function load(): LoadedPrompt[] {
  if (cache) return cache;
  const dir = skillsSourceDir();
  cache = bundledSkillNames().map((dirName) => {
    let md = "";
    try {
      md = readFileSync(join(dir, dirName, "SKILL.md"), "utf8");
    } catch {
      /* a missing skill file yields an empty prompt body */
    }
    const { description, body } = parseSkill(md);
    // The server namespaces prompts as `/mcp__dreambase__<name>`, so drop the
    // redundant `dreambase-` prefix → `/mcp__dreambase__health-report`.
    const name = dirName.replace(/^dreambase-/, "");
    return { name, description, body };
  });
  return cache;
}

/** Split a SKILL.md into its frontmatter `description` and the markdown body. */
function parseSkill(md: string): { description: string; body: string } {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { description: "", body: md.trim() };
  const description = m[1]!.match(/description:\s*(.+)/)?.[1]?.trim() ?? "";
  return { description, body: m[2]!.trim() };
}

/** MCP `prompts/list` result. */
export function listPrompts(): { prompts: McpPrompt[] } {
  return {
    prompts: load().map(({ name, description }) => ({ name, description })),
  };
}

/** MCP `prompts/get` result for one prompt, or null if the name is unknown. */
export function getPrompt(name: string): {
  description: string;
  messages: { role: "user"; content: { type: "text"; text: string } }[];
} | null {
  const p = load().find((x) => x.name === name);
  if (!p) return null;
  return {
    description: p.description,
    messages: [{ role: "user", content: { type: "text", text: p.body } }],
  };
}

/** For tests: clear the memoized prompt cache. */
export function resetPromptCache(): void {
  cache = undefined;
}
