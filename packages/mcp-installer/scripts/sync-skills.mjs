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

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageDir, "..", "..");
const source = join(repoRoot, "skills");
const target = join(packageDir, "skills");

if (!existsSync(source)) {
  console.error(
    `sync-skills: no skills directory at ${source}.\n` +
      `This script expects to run inside the DreambaseAI/skills repo, where the ` +
      `canonical skills tree lives at the repo root.`,
  );
  process.exit(1);
}

const names = readdirSync(source, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.endsWith("-workspace"))
  .map((e) => e.name)
  .sort();

if (names.length === 0) {
  console.error(`sync-skills: ${source} contains no skill directories.`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
for (const name of names) {
  cpSync(join(source, name), join(target, name), {
    recursive: true,
    dereference: true,
  });
}

console.log(`sync-skills: copied ${names.length} skills → ${target}`);
console.log(names.map((n) => `  ${n}`).join("\n"));
