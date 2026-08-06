#!/usr/bin/env node
/**
 * Validate Dreambase skills against repo conventions. Zero dependencies.
 *
 * Usage:
 *   node internal/skill-creator/scripts/validate-skill.mjs skills/dreambase-<name> [more...]
 *   node internal/skill-creator/scripts/validate-skill.mjs --all
 *
 * Checks (errors fail the run, warnings don't):
 *   E: SKILL.md exists
 *   E: frontmatter parses and has name + description
 *   E: name is kebab-case, prefixed dreambase-, and matches the directory name
 *   E: description <= 1024 characters
 *   E: scripts/references/assets paths mentioned in SKILL.md exist
 *   W: description shorter than 40 chars (probably missing "when to use")
 *   W: SKILL.md body over 500 lines
 *   W: reference files over 300 lines without a table of contents
 *   W: evals/evals.json missing or invalid JSON
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_DESCRIPTION = 1024;
const MAX_BODY_LINES = 500;
const MAX_REF_LINES_NO_TOC = 300;
const NAME_RE = /^dreambase-[a-z0-9]+(-[a-z0-9]+)*$/;
// The contributor meta-skill lives at `internal/skill-creator/` so it is never
// bundled into the shipped plugin. Its directory name therefore cannot match its
// `dreambase-skill-creator` frontmatter name, and it ships no evals.
const META_SKILL_DIR = "skill-creator";
// Bundled-resource paths the body tells the model to read/run.
// evals/ is excluded: skills mention it as a convention, not a loadable resource.
const LOCAL_PATH_RE = /(?<![\w/])((?:scripts|references|assets)\/[\w./-]+)/g;

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { fields: null, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { fields: null, body: text };
  const block = text.slice(3, end);
  const body = text.slice(end + 4);
  const fields = {};
  let currentKey = null;
  for (const line of block.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (m) {
      currentKey = m[1];
      fields[currentKey] = m[2].trim().replace(/^["']|["']$/g, "").replace(/^>-?$/, "");
    } else if (currentKey && /^[ \t]/.test(line)) {
      fields[currentKey] = `${fields[currentKey]} ${line.trim()}`.trim();
    }
  }
  return { fields, body };
}

function* walkMarkdown(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkMarkdown(full);
    else if (entry.name.endsWith(".md")) yield full;
  }
}

function validate(skillDir) {
  const errors = [];
  const warnings = [];
  const skillMd = join(skillDir, "SKILL.md");

  if (!existsSync(skillMd)) return { errors: ["missing SKILL.md"], warnings };

  const text = readFileSync(skillMd, "utf8");
  const { fields, body } = parseFrontmatter(text);

  if (fields === null) {
    return { errors: ["SKILL.md has no YAML frontmatter (must start with ---)"], warnings };
  }

  const name = fields.name ?? "";
  const description = fields.description ?? "";

  if (!name) {
    errors.push("frontmatter missing required field: name");
  } else {
    if (!NAME_RE.test(name)) errors.push(`name '${name}' must be kebab-case with the dreambase- prefix`);
    if (name !== basename(skillDir) && basename(skillDir) !== META_SKILL_DIR) {
      errors.push(`name '${name}' does not match directory name '${basename(skillDir)}'`);
    }
    if (name.length > 64) errors.push(`name is ${name.length} chars (max 64)`);
  }

  if (!description) {
    errors.push("frontmatter missing required field: description");
  } else {
    if (description.length > MAX_DESCRIPTION) errors.push(`description is ${description.length} chars (max ${MAX_DESCRIPTION})`);
    if (description.length < 40) warnings.push(`description is only ${description.length} chars — likely missing 'when to use' guidance`);
  }

  const bodyLines = body.split("\n").length;
  if (bodyLines > MAX_BODY_LINES) {
    warnings.push(`SKILL.md body is ${bodyLines} lines (target <${MAX_BODY_LINES}) — move detail into references/`);
  }

  const mentioned = new Set();
  for (const m of body.matchAll(LOCAL_PATH_RE)) mentioned.add(m[1].replace(/[.,)]+$/, ""));
  for (const ref of [...mentioned].sort()) {
    if (!existsSync(join(skillDir, ref))) errors.push(`SKILL.md references '${ref}' but it does not exist`);
  }

  const refsDir = join(skillDir, "references");
  if (existsSync(refsDir) && statSync(refsDir).isDirectory()) {
    for (const refFile of [...walkMarkdown(refsDir)].sort()) {
      const content = readFileSync(refFile, "utf8");
      const n = content.split("\n").length;
      if (n > MAX_REF_LINES_NO_TOC && !content.slice(0, 2000).toLowerCase().includes("contents")) {
        warnings.push(`${refFile.slice(skillDir.length + 1)} is ${n} lines with no table of contents`);
      }
    }
  }

  const evalsFile = join(skillDir, "evals", "evals.json");
  if (existsSync(evalsFile)) {
    try {
      const data = JSON.parse(readFileSync(evalsFile, "utf8"));
      if (!data.evals?.length) warnings.push("evals/evals.json has no evals");
    } catch (e) {
      errors.push(`evals/evals.json is not valid JSON: ${e.message}`);
    }
  } else if (basename(skillDir) !== META_SKILL_DIR) {
    warnings.push("no evals/evals.json — add test prompts before shipping");
  }

  return { errors, warnings };
}

function main(argv) {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  let targets;
  if (argv.includes("--all")) {
    const skillsDir = join(repoRoot, "skills");
    targets = readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.endsWith("-workspace"))
      .map((e) => join(skillsDir, e.name))
      .sort();
  } else {
    targets = argv.filter((a) => !a.startsWith("-")).map((a) => resolve(a));
  }
  if (!targets.length) {
    console.log("Usage: validate-skill.mjs <skill-dir>... | --all");
    return 2;
  }

  let failed = false;
  for (const skillDir of targets) {
    const { errors, warnings } = validate(skillDir);
    console.log(`[${errors.length ? "FAIL" : "OK"}] ${basename(skillDir)}`);
    for (const e of errors) console.log(`    error:   ${e}`);
    for (const w of warnings) console.log(`    warning: ${w}`);
    failed ||= errors.length > 0;
  }
  return failed ? 1 : 0;
}

process.exit(main(process.argv.slice(2)));
