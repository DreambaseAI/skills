import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const baseline = readJson("store/main-skills.json");
const skills = readdirSync(join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(root, "skills", entry.name, "SKILL.md")))
  .map((entry) => entry.name);
for (const name of baseline) assert.ok(skills.includes(name), `Missing preserved library skill ${name}`);
assert.ok(!skills.includes("dreambase-mcp"), "The MCP skill is maintained only in DreambaseAI/plugin");
for (const path of [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json", ".codex-plugin/plugin.json", ".mcp.json", "mcp.json"]) {
  assert.ok(!existsSync(join(root, path)), `Obsolete plugin component: ${path}`);
}
const claude = readJson(".claude-plugin/marketplace.json");
assert.equal(claude.name, "dreambase");
assert.equal(claude.plugins.length, 1);
assert.equal(claude.plugins[0].name, "dreambase");
assert.deepEqual(claude.plugins[0].source, { source: "github", repo: "DreambaseAI/plugin" });
const codex = readJson(".agents/plugins/marketplace.json");
assert.equal(codex.name, "dreambase");
assert.equal(codex.plugins.length, 1);
assert.equal(codex.plugins[0].name, "dreambase");
assert.deepEqual(codex.plugins[0].source, { source: "url", url: "https://github.com/DreambaseAI/plugin.git" });
console.log(`Validated ${skills.length} library skills and Claude/Codex compatibility redirects.`);
