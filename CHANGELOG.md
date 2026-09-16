# Changelog

All notable changes to this repo—the `dreambase` plugin and its skills—are
recorded here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the plugin follows
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **The `dreambase` plugin** — one plugin bundling the Dreambase MCP
  server and all nine canonical skills, published from this repo's marketplace
  for Claude Code, Cursor, and Codex. The repository root is the plugin root,
  with `.claude-plugin/`, `.cursor-plugin/`, and `.codex-plugin/` manifests; the
  MCP server is declared as a remote `type: "http"` server so the host owns
  OAuth and no local process is needed.
- **`dreambase-mcp` skill** — the usage contract for the MCP server: call order,
  the DuckDB dialect and result caps on `query_dataset`, schema search,
  `plan_datasets`, connector setup, async health-report polling, retry rules
  for non-idempotent writes, and the meaning of each error code. Focused
  reference files keep the top-level routing guidance compact.
- **`SETUP.md`** — walks a user through account creation,
  connecting a Supabase project, OAuth consent, and verification.
- **Durable-dataset lifecycle in `dreambase-mcp`** — `refresh_dataset` and
  `promote_dataset`, the promotion consent gate (verify, present the
  durable-storage cost and that promotion cannot currently be undone, then wait
  for a separate affirmative reply), and a new
  `references/dataset-lifecycle.md` covering retention, refresh-versus-redefine,
  `CONFLICT` recovery, and the fact that a dataset handle exposes no
  last-refreshed time.

### Changed

- **Root skills remain canonical and complete.** Every skill present on `main`
  remains byte-for-byte at `skills/`, and the additive `dreambase-mcp` skill is
  included alongside them.
- **Root `README.md` rewritten** around plugin-first installation.

### Fixed

- **Single-plugin layout** follows the common root-plugin convention: canonical
  `skills/` are auto-discovered directly, while `dist/dreambase/` remains the
  exact standalone portal artifact.
- **Codex manifest** now declares its skill directory, MCP server, publisher,
  listing metadata, legal URLs, prompts, and brand assets.
- **Least-privilege OAuth defaults** request read scopes; write scopes require
  explicit opt-in.
- **Release hygiene** adds CI, a protected baseline for all pre-release skills,
  third-party provenance, source-text NUL checks, and store submission gates.
- **Corrected the durability rule.** The skill previously told agents that an
  `expiresAt: null` dataset was dashboard-owned and must never be targeted with
  `save_dataset`. Durable also covers promoted datasets, and the guard on
  redefinition is dashboard linkage, not durability — a standalone promoted
  dataset is redefinable and the write preserves its durability.
- **Replaced an unsatisfiable connector test.** Both the eval and the OpenAI
  submission collateral asked the agent to connect Stripe, which has no
  agent-issuable connect link, so a correct agent could not pass. They now
  target GitHub; the `connectLinkAvailable: false` branch is documented in
  `references/connectors.md` instead.
- **Refreshed the rest of the MCP contract** — `get_dataset` routing,
  `list_connections` across `supabase | api | mcp`, the `[EXPERIMENTAL]`
  description prefix, `query_dataset` self-joins and its 500-row/16 KiB cap,
  `list_datasets` cursor paging, rejection of `connectionIds: []`, the
  unscanned-connection guard on saves, honest health-report reporting, and
  `update_skill` needing only `skills:write`.
