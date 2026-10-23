# Contributing

This repository maintains optional community skills. Each skill is useful on its own and can compose with other installed skills.

## Contributing a skill

The authoritative standards live in
**`skills/dreambase-skill-creator/`**. If you're working in Claude Code, just
describe the skill you want — the meta-skill triggers automatically and walks the full loop
(interview → draft → test → evaluate → iterate).

The short version:

1. Copy `skills/dreambase-skill-creator/assets/skill-template/` to `skills/dreambase-<name>/`.
2. Fill in `SKILL.md` — frontmatter `name` must match the directory name and carry the `dreambase-` prefix.
3. Add 2–3 realistic test prompts to `evals/evals.json`, then run the eval loop described in `skills/dreambase-skill-creator/references/eval-loop.md`.
4. Add the skill to the README table. Preserve the eight original library skills
   listed in `store/main-skills.json`.
5. Validate before committing:
   ```bash
   node skills/dreambase-skill-creator/scripts/validate-skill.mjs --all
   ```
6. Commit the skill *with* its `evals/`; never commit `*-workspace/` run outputs (gitignored).
7. List it in the skills table in `README.md`.

PRs should include: what the skill does, the eval results from the latest
iteration, and anything you tried that didn't work (so the next person doesn't
retry it).

## Validation

Run `npm run check:skills` before committing. Keep this repository focused on reusable skills, references, scripts and evaluation fixtures.
