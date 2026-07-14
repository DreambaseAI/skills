# Contributing a Skill

The authoritative standards live in the meta-skill: **`skills/dreambase-skill-creator/`**. If you're working in Claude Code, just describe the skill you want — the meta-skill triggers automatically and walks the full loop (interview → draft → test → evaluate → iterate).

The short version:

1. Copy `skills/dreambase-skill-creator/assets/skill-template/` to `skills/dreambase-<name>/`.
2. Fill in `SKILL.md` — frontmatter `name` must match the directory name and carry the `dreambase-` prefix.
3. Add 2–3 realistic test prompts to `evals/evals.json`, then run the eval loop described in `skills/dreambase-skill-creator/references/eval-loop.md`.
4. Validate before committing:
   ```bash
   node skills/dreambase-skill-creator/scripts/validate-skill.mjs --all
   ```
5. Commit the skill *with* its `evals/`; never commit `*-workspace/` run outputs (gitignored).

PRs should include: what the skill does, the eval results from the latest iteration, and anything you tried that didn't work (so the next person doesn't retry it).
