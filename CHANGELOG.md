# Changelog

All notable changes to this repo — the `dreambase` plugin, the skills, and the
`@dreambase/mcp` installer — are recorded here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the plugin follows
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **The `dreambase` plugin (1.0.0)** — one plugin bundling the Dreambase MCP
  server and every skill, published from this repo's marketplace for Claude Code,
  Cursor, and Codex. Manifests in `plugins/dreambase/.claude-plugin/`,
  `.cursor-plugin/`, and `.codex-plugin/`; the MCP server is declared as a remote
  `type: "http"` server so the host owns OAuth and no local process is needed.
- **`dreambase-mcp` skill** — the usage contract for the MCP server: call order,
  the DuckDB dialect and result caps on `query_dataset`, connection discovery,
  async health-report polling, retry rules for non-idempotent writes, and the
  meaning of each error code.
- **`plugins/dreambase/SETUP.md`** — walks a user through account creation,
  connecting a Supabase project, OAuth consent, and verification.
- **`packages/mcp-installer/`** — the `@dreambase/mcp` CLI, moved in from its own
  repository so the plugin, the skills, and the installer ship from one place.

### Changed

- **Installer scope narrowed to header-only hosts.** Claude Code and Cursor are
  served by the plugin, so their client writers were removed; the installer now
  covers Claude Desktop and header-only harnesses via the shim.
- **`skills/dreambase-skill-creator/` moved to `internal/skill-creator/`** — the
  contributor meta-skill is no longer bundled into the shipped plugin.
- **Root `README.md` rewritten** around plugin-first installation.

### Fixed

- **Installer default scopes** were missing `skills:read`, `skills:write`, and
  `datasets:write`. Because the server's `tools/list` is scope-gated, a default
  install silently exposed no skills tools.
