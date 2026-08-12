# Changelog

All notable changes to this repo — the `dreambase` plugin, the skills, and the
`@dreambase/mcp` installer — are recorded here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the plugin follows
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **The `dreambase` plugin** — one plugin bundling the Dreambase MCP
  server and all nine canonical skills, published from this repo's marketplace for Claude Code,
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
- **Root skills remain canonical and complete.** Every skill present on `main`
  remains byte-for-byte at `skills/`, and the additive `dreambase-mcp` skill is
  included alongside them.
- **Root `README.md` rewritten** around plugin-first installation.

### Fixed

- **Cross-store packaging** keeps the checked-in plugin DRY with links to the
  canonical root skills, then materializes real directories in
  `dist/dreambase/` for stores that ignore or reject symlinks.
- **Codex manifest** now declares its skill directory, MCP server, publisher,
  listing metadata, legal URLs, prompts, and brand assets.
- **Installer safety** now exits nonzero on client-writer failures and refuses
  to overwrite malformed existing JSON configuration.
- **Least-privilege OAuth defaults** request read scopes; write scopes require
  explicit opt-in.
- **Release hygiene** adds CI, npm public/provenance configuration, third-party
  provenance, source-text NUL checks, and store submission gates.
