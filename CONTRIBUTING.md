# Contributing

This repo ships three things from one tree: the **`dreambase` plugin**
(`plugins/dreambase/`), the **skills** (`skills/`), and the **`@dreambase/mcp`
installer** (`packages/mcp-installer/`).

## Contributing a skill

The authoritative standards live in the meta-skill: **`internal/skill-creator/`**.
It lives outside `skills/` because everything under `skills/` is bundled into the
shipped plugin, and the meta-skill is for contributors only. If you're working in
Claude Code, just describe the skill you want — the meta-skill triggers
automatically and walks the full loop (interview → draft → test → evaluate →
iterate).

The short version:

1. Copy `internal/skill-creator/assets/skill-template/` to `skills/dreambase-<name>/`.
2. Fill in `SKILL.md` — frontmatter `name` must match the directory name and carry the `dreambase-` prefix.
3. Add 2–3 realistic test prompts to `evals/evals.json`, then run the eval loop described in `internal/skill-creator/references/eval-loop.md`.
4. Add the two symlinks so the skill is discoverable in-repo and ships with the plugin:
   ```bash
   ln -s ../../skills/dreambase-<name> .claude/skills/dreambase-<name>
   ln -s ../../../skills/dreambase-<name> plugins/dreambase/skills/dreambase-<name>
   ```
   Then add it to the `skills` array in `plugins/dreambase/.codex-plugin/plugin.json`.
5. Validate before committing:
   ```bash
   node internal/skill-creator/scripts/validate-skill.mjs --all
   ```
6. Commit the skill *with* its `evals/`; never commit `*-workspace/` run outputs (gitignored).
7. List it in the skills table in `README.md`.

PRs should include: what the skill does, the eval results from the latest
iteration, and anything you tried that didn't work (so the next person doesn't
retry it).

## Changing the plugin

`skills/` is the single source of truth — the plugin's `skills/` directory is
only relative symlinks into it, and a marketplace dereferences them into the
plugin cache on install. Don't copy a skill in.

After editing any manifest:

```bash
claude plugin validate ./plugins/dreambase --strict
claude plugin validate ./.claude-plugin/marketplace.json --strict
```

Keep `version` identical across
`plugins/dreambase/.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`,
`.codex-plugin/plugin.json`, and both `marketplace.json` files, and record the
change in `CHANGELOG.md`.

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
