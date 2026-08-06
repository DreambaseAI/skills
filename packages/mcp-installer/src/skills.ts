import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Bundled skills live at `<package>/skills`, one directory per skill. */
export function skillsSourceDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "skills");
}

/** Client skill directories to install into (currently the Claude skills dir). */
export function skillTargetDirs(): string[] {
  return [join(homedir(), ".claude", "skills")];
}

export interface SkillInstallResult {
  dir: string;
  installed: string[];
}

/** Names of the bundled skills (subdirectories of the source dir). */
export function bundledSkillNames(): string[] {
  const src = skillsSourceDir();
  if (!existsSync(src)) return [];
  return readdirSync(src).filter((name) => {
    try {
      return statSync(join(src, name)).isDirectory();
    } catch {
      return false;
    }
  });
}

/**
 * Copy every bundled skill into each client skill directory so agents render
 * `get_health_report` output in Dreambase's house style. Overwrites in place so
 * re-running keeps the skills in sync with the installed package version.
 */
export async function installSkills(
  targets: string[] = skillTargetDirs(),
): Promise<SkillInstallResult[]> {
  const src = skillsSourceDir();
  const names = bundledSkillNames();
  const results: SkillInstallResult[] = [];
  if (names.length === 0) return results;

  for (const dir of targets) {
    mkdirSync(dir, { recursive: true });
    for (const name of names) {
      cpSync(join(src, name), join(dir, name), { recursive: true });
    }
    results.push({ dir, installed: names });
  }
  return results;
}

/** For `doctor`: which bundled skills are present in each target dir. */
export function skillStatus(
  targets: string[] = skillTargetDirs(),
): { dir: string; present: string[]; missing: string[] }[] {
  const names = bundledSkillNames();
  return targets.map((dir) => {
    const present: string[] = [];
    const missing: string[] = [];
    for (const name of names) {
      (existsSync(join(dir, name)) ? present : missing).push(name);
    }
    return { dir, present, missing };
  });
}
