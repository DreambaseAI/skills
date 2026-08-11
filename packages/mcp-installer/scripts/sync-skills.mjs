#!/usr/bin/env node
/**
 * Copy the repo-root `skills/` tree into `<package>/skills`.
 *
 * npm can only pack files inside the package directory, and `skillsSourceDir()`
 * (src/skills.ts) reads `<package>/skills` — so the canonical tree at the repo
 * root has to be materialized here before `npm pack` / `npm publish` runs.
 * `prepack` and `prepublishOnly` both call this; run it by hand
 * (`pnpm sync:skills`) when testing `install`/`doctor` from a local checkout.
 *
 * The copied directory is gitignored: the repo root is the single source of
 * truth and a committed duplicate would drift.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageDir, "..", "..");
const source = join(repoRoot, "skills");
const target = join(packageDir, "skills");
const noticesTarget = join(packageDir, "THIRD_PARTY_NOTICES.md");
const licensesTarget = join(packageDir, "licenses");
const pluginSkillsPath = join(
  repoRoot,
  "plugins",
  "dreambase",
  "plugin-skills.json",
);

if (!existsSync(source)) {
  console.error(
    `sync-skills: no skills directory at ${source}.\n` +
      `This script expects to run inside the DreambaseAI/skills repo, where the ` +
      `canonical skills tree lives at the repo root.`,
  );
  process.exit(1);
}

const names = JSON.parse(readFileSync(pluginSkillsPath, "utf8")).sort();

if (!Array.isArray(names) || names.length === 0) {
  console.error(`sync-skills: ${pluginSkillsPath} contains no skill names.`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
for (const name of names) {
  if (!existsSync(join(source, name, "SKILL.md"))) {
    console.error(`sync-skills: canonical skill is missing: ${name}`);
    process.exit(1);
  }
  cpSync(join(source, name), join(target, name), {
    recursive: true,
    dereference: true,
  });
}
cpSync(join(repoRoot, "THIRD_PARTY_NOTICES.md"), noticesTarget);
rmSync(licensesTarget, { recursive: true, force: true });
cpSync(join(repoRoot, "licenses"), licensesTarget, { recursive: true });

console.log(`sync-skills: copied ${names.length} skills → ${target}`);
console.log(names.map((n) => `  ${n}`).join("\n"));
