# Contributing

This repo is the source for one **`dreambase` plugin**. The repository root is
the plugin root, and `skills/` contains its canonical skills.

## Contributing a skill

The authoritative standards live in
**`skills/dreambase-skill-creator/`**. If you're working in Claude Code, just
describe the skill you want — the meta-skill triggers automatically and walks the full loop
(interview → draft → test → evaluate → iterate).

The short version:

1. Copy `skills/dreambase-skill-creator/assets/skill-template/` to `skills/dreambase-<name>/`.
2. Fill in `SKILL.md` — frontmatter `name` must match the directory name and carry the `dreambase-` prefix.
3. Add 2–3 realistic test prompts to `evals/evals.json`, then run the eval loop described in `skills/dreambase-skill-creator/references/eval-loop.md`.
4. Every canonical skill ships automatically from `skills/`. Add its name to
   the README table. Do not remove or rename an entry in
   `store/main-skills.json`; that file protects the pre-release inventory.
5. Validate before committing:
   ```bash
   node skills/dreambase-skill-creator/scripts/validate-skill.mjs --all
   ```
6. Commit the skill *with* its `evals/`; never commit `*-workspace/` run outputs (gitignored).
7. List it in the skills table in `README.md`.

PRs should include: what the skill does, the eval results from the latest
iteration, and anything you tried that didn't work (so the next person doesn't
retry it).

## Changing the plugin

`skills/` is both the single source of truth and the standard plugin component
directory. Validate the root plugin with:

```bash
pnpm check:plugin
```

Build the exact standalone submission artifact with `pnpm build:plugin` and
upload/package `dist/dreambase/`.

After editing any manifest:

```bash
claude plugin validate ./.claude-plugin/plugin.json --strict
claude plugin validate ./.claude-plugin/marketplace.json --strict
node scripts/build-plugin.mjs
node scripts/validate-release.mjs
```

Keep `version` identical across
`.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`,
`.codex-plugin/plugin.json`, and the Claude/Cursor marketplace files. The Codex
marketplace entry does not duplicate the version. Record every release in
`CHANGELOG.md`.

See `RELEASE_CHECKLIST.md` for store-specific legal, OAuth, annotation, demo,
and test-case gates that cannot be verified from this repository alone.
