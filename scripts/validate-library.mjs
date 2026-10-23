import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
for (const path of ["plugin.json", "mcp.json", ".mcp.json", ".claude-plugin", ".codex-plugin", ".cursor-plugin", ".agents/plugins"]) {
  assert.ok(!existsSync(join(root, path)), `Product integration packaging belongs outside this community library: ${path}`);
}
const baseline = readJson("store/main-skills.json");
const skills = readdirSync(join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(root, "skills", entry.name, "SKILL.md")))
  .map((entry) => entry.name);
for (const name of baseline) assert.ok(skills.includes(name), `Missing preserved library skill ${name}`);
console.log(`Validated ${skills.length} community skills.`);
