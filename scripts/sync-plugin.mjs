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
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = join(repoRoot, "plugins", "dreambase");
const sourceRoot = join(repoRoot, "skills");
const targetRoot = join(pluginRoot, "skills");
const skills = JSON.parse(
  readFileSync(join(pluginRoot, "plugin-skills.json"), "utf8"),
);
const checkOnly = process.argv.includes("--check");

function fail(message) {
  console.error(`sync-plugin: ${message}`);
  process.exitCode = 1;
}

function filesUnder(root) {
  const files = [];
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = join(path, entry.name);
      if (entry.isSymbolicLink()) {
        fail(`release payload contains symlink: ${relative(repoRoot, full)}`);
        continue;
      }
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) files.push(relative(root, full));
    }
  };
  visit(root);
  return files.sort();
}

function digest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

if (!Array.isArray(skills) || skills.length === 0) {
  throw new Error("plugin-skills.json must contain at least one skill name");
}
if (
  new Set(skills).size !== skills.length ||
  skills.some(
    (name) =>
      typeof name !== "string" ||
      !/^dreambase-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name),
  )
) {
  throw new Error(
    "plugin-skills.json must contain unique dreambase-<kebab-case> names",
  );
}

for (const name of skills) {
  const source = join(sourceRoot, name);
  if (!existsSync(join(source, "SKILL.md"))) {
    throw new Error(`canonical skill is missing SKILL.md: ${name}`);
  }
}

if (!checkOnly) {
  rmSync(targetRoot, { recursive: true, force: true });
  mkdirSync(targetRoot, { recursive: true });
  for (const name of skills) {
    cpSync(join(sourceRoot, name), join(targetRoot, name), {
      recursive: true,
      dereference: true,
    });
  }
  cpSync(join(repoRoot, "LICENSE"), join(pluginRoot, "LICENSE"));
  cpSync(
    join(repoRoot, "THIRD_PARTY_NOTICES.md"),
    join(pluginRoot, "THIRD_PARTY_NOTICES.md"),
  );
  rmSync(join(pluginRoot, "licenses"), { recursive: true, force: true });
  cpSync(join(repoRoot, "licenses"), join(pluginRoot, "licenses"), {
    recursive: true,
  });
  console.log(
    `sync-plugin: materialized ${skills.length} skills in ${targetRoot}`,
  );
}

if (!existsSync(targetRoot) || lstatSync(targetRoot).isSymbolicLink()) {
  fail(
    `missing real plugin skills directory: ${relative(repoRoot, targetRoot)}`,
  );
} else {
  const installed = readdirSync(targetRoot).sort();
  if (JSON.stringify(installed) !== JSON.stringify([...skills].sort())) {
    fail(`plugin skill inventory differs from plugin-skills.json`);
  }
  for (const name of skills) {
    const source = join(sourceRoot, name);
    const target = join(targetRoot, name);
    const sourceFiles = filesUnder(source);
    const targetFiles = filesUnder(target);
    if (JSON.stringify(sourceFiles) !== JSON.stringify(targetFiles)) {
      fail(`${name} file inventory is out of sync`);
      continue;
    }
    for (const file of sourceFiles) {
      if (digest(join(source, file)) !== digest(join(target, file))) {
        fail(`${name}/${file} is out of sync`);
      }
    }
  }
}

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

if (!process.exitCode) {
  console.log(`sync-plugin: payload matches ${skills.length} canonical skills`);
}
