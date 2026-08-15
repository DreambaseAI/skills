# Dreambase

The `dreambase` plugin: the Dreambase MCP server plus the agent skills for
querying it and turning the results into charts, reports, and decks.

## Install the plugin

**Claude Code**

```
/plugin marketplace add DreambaseAI/skills
/plugin install dreambase@dreambase
```

**Cursor** — add this repo as a plugin marketplace in Cursor's plugin settings,
then install `dreambase`.

**Codex** — point Codex at this repo's marketplace and install `dreambase`.

```bash
codex plugin marketplace add DreambaseAI/skills
codex plugin add dreambase@dreambase
```

The plugin declares the MCP server as a remote `type: "http"` connection, so your
host runs the OAuth sign-in itself the first time a Dreambase tool is called — no
local process, no token to paste. Restart your client after installing, then run
`whoami` followed by `list_workspaces` to confirm it works.

New to Dreambase? [`SETUP.md`](SETUP.md)
walks through creating an account, connecting a Supabase project, and completing
consent.

## What the MCP server does

`https://app.dreambase.com/mcp` exposes your Dreambase workspace to an agent:

| Area | Tools |
|---|---|
| Identity | `whoami`, `list_workspaces` |
| Dashboards | `list_dashboards` |
| Datasets | `list_datasets`, `get_dataset`, `query_dataset`, `plan_datasets`, `save_dataset` |
| Metric snapshots | `list_aggregates`, `get_aggregate` |
| Connections | `list_connections`, `get_connection`, `search_connection` |
| Connector setup | `list_connectors`, `request_connector_connection`, `get_connection_request` |
| Database health | `create_health_report`, `list_health_reports`, `get_health_report` |
| Workspace Skills | `list_skills`, `get_skill`, `create_skill`, `update_skill` |

`query_dataset` runs a sandboxed read-only DuckDB `SELECT` over one dataset, so
an agent can compute an answer instead of paging through rows. Access is gated by
OAuth scopes *and* your workspace membership: the tool list you see is exactly
what your grant allows. The `dreambase-mcp` skill teaches an agent how to drive
all of it correctly.

## The skills

All nine canonical skills ship with the plugin and are also installable on their
own. This preserves the complete root skillset while adding plugin-based
installation.

| Skill | What it does |
|---|---|
| [`dreambase-mcp`](skills/dreambase-mcp/) | The usage contract for the Dreambase MCP server — call order, the `query_dataset` DuckDB dialect and its result caps, connection discovery, async health-report polling, retry rules for non-idempotent writes, and what each error code means |
| [`dreambase-echarts`](skills/dreambase-echarts/) | Author Apache ECharts option JSON for the Dreambase renderer — includes an offline option-schema lookup CLI and a structural config validator |
| [`dreambase-visualization-design`](skills/dreambase-visualization-design/) | Design, critique, and improve charts, dashboards, and infographics using evidence-based visualization, perceptual, accessibility, and integrity principles |
| [`dreambase-data-stories`](skills/dreambase-data-stories/) | Design reports, executive summaries, slide decks, infographics, and scrollytelling pieces that blend charts, illustration, typography, and narrative — built on the practices of FT, NYT Graphics, The Pudding, and Reuters |
| [`dreambase-data-presentation`](skills/dreambase-data-presentation/) | Design and build data presentations — board, investor, QBR, readout, launch, sales, and keynote decks — as interactive self-contained web decks, native .pptx, Google Slides, or a build spec, with verified slide-craft specs, staged chart reveals, and presenter mechanics |
| [`dreambase-public-reports`](skills/dreambase-public-reports/) | Create disclosure-safe public artifacts from real or sensitive data using transformed visuals, constructive and honest storytelling, and explicit approval for visible percentages, rates, deltas, ratios, or indexes |
| [`dreambase-industrial-schematics`](skills/dreambase-industrial-schematics/) | Create dark cinematic industrial/HUD technical schematics — orbital process rings, cel-shaded exploded machinery, holographic 2D/3D wireframe mesh charts with monochromatic hue themes, tick-strip components — as portable SVG/HTML, with zero-dep ring/ruler and 3D-mesh generators |
| [`dreambase-micrographic-design`](skills/dreambase-micrographic-design/) | Design in the micrographics style — compliance-labelling visual language (rating plates, care tags, spec sheets) used as intentional design: hairline rules, boxed compartments, tick scales, `LABEL: value` pairs, mark clusters, micro-typography, monochrome plus one safety accent — with the certification-mark legal guardrail |
| [`dreambase-skill-creator`](skills/dreambase-skill-creator/) | Create, improve, validate, and evaluate Dreambase agent skills using this repository's conventions and eval loop |

How they compose: `dreambase-mcp` gets the data out.
`dreambase-data-stories` shapes the narrative artifact,
`dreambase-visualization-design` decides each chart, and `dreambase-echarts`
builds and validates the rendered config. When the artifact is a deck,
`dreambase-data-presentation` takes the storyline and owns the slide, the room,
and the presenter. Add `dreambase-public-reports` when the artifact uses
confidential real data but must communicate honest trends without publishing the
underlying values.

### Installing a skill without the plugin

```bash
# Interactive — pick from the repo's skills
npx skills add DreambaseAI/skills

# See what's available without installing
npx skills add DreambaseAI/skills --list

# Install specific skills by name (repeat --skill for several)
npx skills add DreambaseAI/skills --skill dreambase-mcp --skill dreambase-echarts

# Or point at one skill's directory directly
npx skills add https://github.com/DreambaseAI/skills/tree/main/skills/dreambase-echarts

# Everything, no prompts
npx skills add DreambaseAI/skills --all
```

Or copy a directory into your skills folder: `cp -r skills/dreambase-<name> ~/.claude/skills/`
(per-user), or into `<your-project>/.claude/skills/` (per-project).

## Repository structure

```
.agents/plugins/marketplace.json  # Codex marketplace
.claude-plugin/
├── marketplace.json             # Claude marketplace
└── plugin.json                  # Claude plugin manifest
.cursor-plugin/
├── marketplace.json             # Cursor marketplace
└── plugin.json                  # Cursor plugin manifest
.codex-plugin/plugin.json        # Codex plugin manifest
.mcp.json                        # Remote HTTP MCP server (Claude/Codex)
mcp.json                         # Remote HTTP MCP server (Cursor)
assets/logo.png                  # 1024x1024 brand mark
SETUP.md                         # Guided first-run setup
skills/dreambase-<name>/         # Canonical skill and plugin component
├── SKILL.md                      # Required: frontmatter + instructions
├── scripts/                      # Optional: executable helpers
├── references/                   # Optional: docs loaded on demand
├── assets/                       # Optional: templates, files used in output
└── evals/evals.json              # Test prompts + assertions (committed)
scripts/build-plugin.mjs          # Validate and build store artifacts
store/main-skills.json            # Cannot-delete baseline for pre-release skills
dist/dreambase/                   # Generated, symlink-free store artifact
```

This is a single-plugin repository, so the repository root is also the plugin
root. `skills/` is both the canonical source and the standard auto-discovered
plugin component directory—there is no copied or symlinked second tree to
drift. `pnpm check:plugin` verifies the manifests and guarantees every skill in
the pre-release `main` inventory remains present. `pnpm build:plugin` creates a
self-contained `dist/dreambase/` submission artifact.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). The short version: open this repo in
Claude Code and describe the skill you want — the `dreambase-skill-creator`
meta-skill triggers automatically and walks the full loop (interview → draft →
test → evaluate → iterate). Validate before committing:

```bash
node skills/dreambase-skill-creator/scripts/validate-skill.mjs --all
```

## Conventions

- **Naming**: directory name = frontmatter `name` = `dreambase-<kebab-case>`.
- **SKILL.md** stays under ~500 lines; push detail into `references/`.
- **Descriptions** state what the skill does *and* when to trigger it (be
  generous with trigger phrases — models under-trigger).
- **Eval prompts** live in `evals/evals.json` and are committed; run outputs
  (`*-workspace/` directories) are gitignored.
- **Scripts** are Node-first: zero-dependency `.mjs` (Node built-ins only) or
  POSIX shell. We're a Node/Next.js shop and Node is guaranteed everywhere our
  skills run.

## License

[MIT](LICENSE)
