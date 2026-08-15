#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactRoot = join(repoRoot, "dist", "dreambase");
const buildArtifact = process.argv.includes("--build");
const errors = [];

function fail(message) {
  errors.push(message);
}

function canonicalSkills() {
  return readdirSync(join(repoRoot, "skills"), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        /^dreambase-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name) &&
        existsSync(join(repoRoot, "skills", entry.name, "SKILL.md")),
    )
    .map((entry) => entry.name)
    .sort();
}

function verifyNoLinks(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const full = join(path, entry.name);
    if (entry.isSymbolicLink()) {
      fail(`artifact contains symlink: ${relative(repoRoot, full)}`);
    } else if (entry.isDirectory()) {
      verifyNoLinks(full);
    }
  }
}

function verifyMainSkillsPreserved(skills) {
  const baselinePath = join(repoRoot, "store", "main-skills.json");
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8")).sort();
  const missing = baseline.filter((name) => !skills.includes(name));
  if (missing.length > 0) {
    fail(
      `skills from the pre-release main inventory are missing: ${missing.join(", ")}`,
    );
  }
}

function copy(relativePath) {
  const source = join(repoRoot, relativePath);
  const target = join(artifactRoot, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true, dereference: true });
}

const skills = canonicalSkills();
if (skills.length === 0) fail("canonical skills directory is empty");
verifyMainSkillsPreserved(skills);

for (const path of [
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  ".mcp.json",
  "mcp.json",
  "assets/logo.png",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "licenses/Apache-2.0.txt",
  "README.md",
  "SETUP.md",
]) {
  if (!existsSync(join(repoRoot, path))) fail(`missing plugin file: ${path}`);
}

if (lstatSync(join(repoRoot, "skills")).isSymbolicLink()) {
  fail("canonical skills directory must not be a symlink");
}

if (buildArtifact && errors.length === 0) {
  rmSync(artifactRoot, { recursive: true, force: true });
  mkdirSync(artifactRoot, { recursive: true });
  for (const path of [
    ".claude-plugin",
    ".codex-plugin",
    ".cursor-plugin",
    ".mcp.json",
    "mcp.json",
    "assets",
    "skills",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "licenses",
    "README.md",
    "SETUP.md",
  ]) {
    copy(path);
  }
  verifyNoLinks(artifactRoot);
}

if (errors.length > 0) {
  console.error(errors.map((message) => `✗ ${message}`).join("\n"));
  process.exit(1);
}

if (buildArtifact) {
  console.log(
    `build-plugin: materialized root plugin with ${skills.length} skills in ${artifactRoot}`,
  );
} else {
  console.log(
    `build-plugin: root plugin is complete and preserves all ${skills.length} canonical skills`,
  );
}
