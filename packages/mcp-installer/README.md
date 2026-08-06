# @dreambase/mcp

## Start with the plugin

If your host supports remote MCP servers natively — **Claude Code**, **Cursor**,
**Codex** — install the `dreambase` plugin instead of this CLI. It declares the
http server, the host runs the OAuth flow itself, and every Dreambase skill comes
with it:

```
/plugin marketplace add DreambaseAI/skills
/plugin install dreambase@dreambase
```

See the [repo README](../../README.md) for the full instructions.

## When to use this installer

Use it for hosts that **cannot** run the MCP OAuth dance from a config entry:

- **Claude Desktop** — its `claude_desktop_config.json` only accepts stdio
  command servers, and a browser-OAuth bridge is unreliable there because
  Desktop spawns and kills the server process on its own schedule.
- **Header-only harnesses** — OpenAI's stack, and other clients that can attach a
  static header but not negotiate OAuth.

For those, the installer owns the OAuth flow up front (one browser round-trip
through its own loopback listener), stores the token, and points the client at
the local **shim** (`dreambase-mcp shim`) — a stdio↔HTTP proxy that injects the
bearer token on every call and refreshes it on `401`. No sign-in ever happens
inside the client's own lifecycle.

```bash
npx @dreambase/mcp
```

This is the open-source reference client for Dreambase's public MCP surface. It
talks to the server only over documented HTTP (OAuth + MCP) — it never needs the
app's code.

## Requirements

- Node.js **20+**
- Claude Desktop, or any header-only MCP client (via the built-in shim)

## Usage

```bash
# Detect installed clients, sign in, and configure them:
npx @dreambase/mcp                     # = `install`

# Only configure specific clients:
npx @dreambase/mcp install --client claude-desktop

# Print a paste-ready shim block for a header-only harness:
npx @dreambase/mcp install --client openai

# Non-interactive (accept detected clients):
npx @dreambase/mcp install --yes

# Diagnose the setup (discovery, token, client config, skills):
npx @dreambase/mcp doctor

# Revoke the token and clear stored credentials:
npx @dreambase/mcp logout [--remove-config]
```

### Flags

| Flag                 | Description                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `--url <base>`       | App base URL (overrides `DREAMBASE_URL`; defaults to the prod app)                                                         |
| `--client <name...>` | Configure only the named client(s): `claude-desktop`, `openai`                                                             |
| `--scopes <list>`    | Space/comma-separated scopes (default: the server's full catalog — see below; intersected with what the server advertises) |
| `-y, --yes`          | Skip prompts                                                                                                               |

The default scope set is every scope the server publishes:

```
workspaces:read dashboards:read datasets:read datasets:write connections:read
health-reports:read health-reports:write skills:read skills:write
```

Requesting all of them matters because the server's `tools/list` is
**scope-gated**: a scope you skip doesn't just block a call, it removes the
matching tools from the connection entirely. Narrow with `--scopes` only when you
deliberately want a reduced tool surface. The requested set is intersected with
the server's advertised `scopes_supported`, so an older server that doesn't know
a scope still authorizes cleanly.

### Environment

| Var                        | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `DREAMBASE_URL`            | Override the app base URL (useful for local testing)   |
| `DREAMBASE_MCP_STORE=file` | Force the `0600` file store instead of the OS keychain |

## How it works

- **Discovery-driven.** Only the default app URL is a constant. Everything else
  is discovered: `POST <base>/mcp` → the `401` `WWW-Authenticate` challenge →
  protected-resource metadata (RFC 9728) → the authorization server's metadata
  (RFC 8414).
- **The shim is the durable piece.** `src/shim.ts` is a stdio↔HTTP MCP proxy that
  attaches the stored bearer and transparently refreshes it. Every client writer
  here is a thin wrapper that tells a client how to launch it.
- **Adding a harness** (pi, hermes, openclaw, …): copy `src/clients/openai.ts`.
  It writes a reference config to `~/.dreambase/<name>-mcp.json` and prints the
  stdio block to paste, using the shared `shimCommand()` helper — the right
  template when the exact config path varies or isn't discoverable.
- **Security.** PKCE **S256** only; `state` and RFC 9207 `iss` are validated
  before the authorization code is used; the loopback listener binds
  `127.0.0.1` only and is single-use; the `resource` is always sent so tokens
  are audience-bound; only the refresh token is persisted, and tokens/codes are
  never logged.

## Skills

The installer copies the repo's skills into `~/.claude/skills/` so agents on
these hosts get the same `dreambase-mcp` usage guidance and presentation skills
the plugin ships.

The canonical tree lives at the **repo root** (`skills/`), not in this package.
npm can only pack files inside the package directory, so `prepack` /
`prepublishOnly` run `scripts/sync-skills.mjs` to copy it into
`packages/mcp-installer/skills` first. That copy is gitignored — run
`pnpm sync:skills` by hand before testing `install` or `doctor` from a local
checkout.

## Platform notes

- **macOS / Windows** — the OS keychain (Keychain / Credential Manager) is used
  automatically.
- **Linux** — the keychain needs `libsecret` + a running secret service (DBus).
  On headless Linux this is usually absent, so the tool falls back to
  `~/.dreambase/credentials.json` (`0600`). Set `DREAMBASE_MCP_STORE=file` to
  force the file store.

## Development

```bash
pnpm install
pnpm sync:skills  # materialize <package>/skills from the repo root
pnpm build        # bundle dist/cli.js
pnpm test         # unit tests
pnpm typecheck
pnpm lint

# End-to-end smoke against a locally running server:
DREAMBASE_MCP_E2E_URL=http://localhost:3000 pnpm test
```

## License

MIT
