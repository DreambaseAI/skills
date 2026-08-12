#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(repoRoot, "plugins", "dreambase");
const sourceRoot = join(repoRoot, "skills");
const targetRoot = join(pluginRoot, "skills");
const artifactRoot = join(repoRoot, "dist", "dreambase");
const inventoryPath = join(pluginRoot, "plugin-skills.json");
const checkOnly = process.argv.includes("--check");
const buildArtifact = process.argv.includes("--build");

function fail(message) {
  console.error(`sync-plugin: ${message}`);
  process.exitCode = 1;
}

function digest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function canonicalSkills() {
  return readdirSync(sourceRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        /^dreambase-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name) &&
        existsSync(join(sourceRoot, entry.name, "SKILL.md")),
    )
    .map((entry) => entry.name)
    .sort();
}

function verifyLinks(skills) {
  if (!existsSync(targetRoot) || lstatSync(targetRoot).isSymbolicLink()) {
    fail(`missing plugin skills directory: ${relative(repoRoot, targetRoot)}`);
    return;
  }

  const installed = readdirSync(targetRoot).sort();
  if (JSON.stringify(installed) !== JSON.stringify(skills)) {
    fail("plugin skill links differ from the canonical root inventory");
  }

  for (const name of skills) {
    const target = join(targetRoot, name);
    const source = join(sourceRoot, name);
    if (!existsSync(target) || !lstatSync(target).isSymbolicLink()) {
      fail(`plugin skill must be a symlink: ${relative(repoRoot, target)}`);
      continue;
    }
    if (readlinkSync(target) !== `../../../skills/${name}`) {
      fail(`plugin skill has unexpected link target: ${relative(repoRoot, target)}`);
      continue;
    }
    if (realpathSync(target) !== realpathSync(source)) {
      fail(`plugin skill does not resolve to its canonical root: ${name}`);
    }
  }
}

function verifyArtifactHasNoLinks(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const full = join(path, entry.name);
    if (entry.isSymbolicLink()) fail(`artifact contains symlink: ${relative(repoRoot, full)}`);
    else if (entry.isDirectory()) verifyArtifactHasNoLinks(full);
  }
}

const skills = canonicalSkills();
if (skills.length === 0) throw new Error("canonical skills directory is empty");

const listed = JSON.parse(readFileSync(inventoryPath, "utf8")).sort();
if (JSON.stringify(listed) !== JSON.stringify(skills)) {
  fail("plugin-skills.json must list every canonical root skill exactly once");
}

if (!checkOnly && !buildArtifact) {
  rmSync(targetRoot, { recursive: true, force: true });
  mkdirSync(targetRoot, { recursive: true });
  for (const name of skills) {
    symlinkSync(`../../../skills/${name}`, join(targetRoot, name));
  }
  cpSync(join(repoRoot, "LICENSE"), join(pluginRoot, "LICENSE"));
  cpSync(join(repoRoot, "THIRD_PARTY_NOTICES.md"), join(pluginRoot, "THIRD_PARTY_NOTICES.md"));
  rmSync(join(pluginRoot, "licenses"), { recursive: true, force: true });
  cpSync(join(repoRoot, "licenses"), join(pluginRoot, "licenses"), { recursive: true });
  console.log(`sync-plugin: linked ${skills.length} canonical skills into the plugin`);
}

verifyLinks(skills);

for (const required of ["LICENSE", "THIRD_PARTY_NOTICES.md"]) {
  const source = join(repoRoot, required);
  const target = join(pluginRoot, required);
  if (!existsSync(target) || digest(source) !== digest(target)) {
    fail(`plugin ${required} is missing or out of sync`);
  }
}
if (
  !existsSync(join(pluginRoot, "licenses", "Apache-2.0.txt")) ||
  digest(join(repoRoot, "licenses", "Apache-2.0.txt")) !==
    digest(join(pluginRoot, "licenses", "Apache-2.0.txt"))
) {
  fail("plugin Apache-2.0 license is missing or out of sync");
}

if (buildArtifact && !process.exitCode) {
  rmSync(artifactRoot, { recursive: true, force: true });
  mkdirSync(dirname(artifactRoot), { recursive: true });
  cpSync(pluginRoot, artifactRoot, { recursive: true, dereference: true });
  rmSync(join(artifactRoot, "skills"), { recursive: true, force: true });
  mkdirSync(join(artifactRoot, "skills"), { recursive: true });
  for (const name of skills) {
    cpSync(join(sourceRoot, name), join(artifactRoot, "skills", name), {
      recursive: true,
      dereference: true,
    });
  }
  verifyArtifactHasNoLinks(artifactRoot);
  const artifactSkills = readdirSync(join(artifactRoot, "skills")).sort();
  if (JSON.stringify(artifactSkills) !== JSON.stringify(skills)) {
    fail("built artifact is missing canonical skills");
  } else {
    console.log(`sync-plugin: materialized ${skills.length} skills in ${artifactRoot}`);
  }
}

if (!process.exitCode) {
  console.log(`sync-plugin: plugin links match ${skills.length} canonical skills`);
}
