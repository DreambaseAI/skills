import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";
import {
  bundledSkillNames,
  installSkills,
  skillStatus,
} from "../../src/skills";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const repoSkillsDir = resolve(packageDir, "../../skills");

/** The canonical skill names, straight from the repo root. */
function canonicalSkillNames(): string[] {
  return readdirSync(repoSkillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.endsWith("-workspace"))
    .map((e) => e.name)
    .sort();
}

describe("skills", () => {
  // `<package>/skills` is gitignored and materialized by the pack step, so the
  // suite runs the same sync the publish pipeline does before asserting on it.
  beforeAll(() => {
    execFileSync(
      process.execPath,
      [join(packageDir, "scripts", "sync-skills.mjs")],
      { cwd: packageDir, stdio: "pipe" },
    );
  });

  it("bundles every skill from the repo root", () => {
    expect(bundledSkillNames().sort()).toEqual(canonicalSkillNames());
  });

  it("bundles the MCP usage skill", () => {
    expect(bundledSkillNames()).toContain("dreambase-mcp");
  });

  it("does not bundle the contributor-only meta-skill", () => {
    expect(bundledSkillNames()).not.toContain("dreambase-skill-creator");
    expect(bundledSkillNames()).not.toContain("skill-creator");
  });

  it("installs skills into a target dir and reports status", async () => {
    const dir = mkdtempSync(join(tmpdir(), "dreambase-skills-"));
    const results = await installSkills([dir]);
    expect(results[0]?.installed.sort()).toEqual(canonicalSkillNames());
    expect(existsSync(join(dir, "dreambase-mcp", "SKILL.md"))).toBe(true);

    const status = skillStatus([dir]);
    expect(status[0]?.present).toContain("dreambase-mcp");
    expect(status[0]?.missing).toHaveLength(0);
  });
});
