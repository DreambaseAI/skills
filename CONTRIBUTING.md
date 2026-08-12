# Contributing

This repo ships three things from one tree: the **`dreambase` plugin**
(`plugins/dreambase/`), the **skills** (`skills/`), and the **`@dreambase/mcp`
installer** (`packages/mcp-installer/`).

## Contributing a skill

The authoritative standards live in
**`skills/dreambase-skill-creator/`**. If you're working in Claude Code, just
describe the skill you want — the meta-skill triggers automatically and walks the full loop
(interview → draft → test → evaluate → iterate).

The short version:

1. Copy `skills/dreambase-skill-creator/assets/skill-template/` to `skills/dreambase-<name>/`.
2. Fill in `SKILL.md` — frontmatter `name` must match the directory name and carry the `dreambase-` prefix.
3. Add 2–3 realistic test prompts to `evals/evals.json`, then run the eval loop described in `skills/dreambase-skill-creator/references/eval-loop.md`.
4. Add its name to `plugins/dreambase/plugin-skills.json`, then run `pnpm
   sync:plugin` to create the matching plugin symlink. Every canonical root
   skill ships with the plugin, and `.claude/skills` already points at the full
   root tree for in-repo discovery.
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

`skills/` is the single source of truth. Each entry under
`plugins/dreambase/skills/` is a committed symlink back to that root. Never put
a second copy of a skill inside the plugin; rebuild and verify the links with:

```bash
pnpm sync:plugin
pnpm check:plugin
```

Stores that do not preserve or follow symlinks receive a generated standalone
artifact. Build it with `pnpm build:plugin` and upload/package
`dist/dreambase/`, never the source plugin directory.

After editing any manifest:

```bash
claude plugin validate ./plugins/dreambase --strict
claude plugin validate ./.claude-plugin/marketplace.json --strict
node scripts/sync-plugin.mjs --check
node scripts/validate-release.mjs
```

Keep `version` identical across
`plugins/dreambase/.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`,
`.codex-plugin/plugin.json`, and the Claude/Cursor marketplace files. The Codex
marketplace entry does not duplicate the version. Record every release in
`CHANGELOG.md`.

See `RELEASE_CHECKLIST.md` for store-specific legal, OAuth, annotation, demo,
and test-case gates that cannot be verified from this repository alone.

## Changing the installer

```bash
cd packages/mcp-installer
pnpm install
pnpm sync:skills   # materialize <package>/skills from the repo root
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test
```

Scope check before adding a client writer: hosts that can run the MCP OAuth dance
from a config entry (Claude Code, Cursor, Codex) belong to the plugin, not here.
The installer covers hosts that can't. For a new header-only harness, copy
`src/clients/openai.ts` — the reference-config + `shimCommand()` pattern.

`<package>/skills` is generated and gitignored; edit the tree at the repo root.
