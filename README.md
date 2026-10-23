# Dreambase skills

Optional Dreambase skills for visualization, storytelling, presentations, public
reporting, visual design, and skill creation. This repository is the source for
these eight skills and their supporting references, scripts, assets, and evaluations.

The Dreambase MCP plugin and its `dreambase-mcp` skill now live in
[DreambaseAI/plugin](https://github.com/DreambaseAI/plugin). Install the plugin
when you need Dreambase data access; install the skills here when you need their
specialized output workflows.

## Install skills

```bash
# Browse the library
npx skills add DreambaseAI/skills --list

# Install selected skills
npx skills add DreambaseAI/skills --skill dreambase-echarts --skill dreambase-data-stories

# Install the full optional library
npx skills add DreambaseAI/skills --all
```

You can also copy a skill directory into your agent's skills folder. Each skill
is self-contained and keeps its evaluation prompts beside its instructions.

## Skills

| Skill | What it does |
|---|---|
| [`dreambase-echarts`](skills/dreambase-echarts/) | Author Apache ECharts option JSON for the Dreambase renderer — includes an offline option-schema lookup CLI and a structural config validator |
| [`dreambase-visualization-design`](skills/dreambase-visualization-design/) | Design, critique, and improve charts, dashboards, and infographics using evidence-based visualization, perceptual, accessibility, and integrity principles |
| [`dreambase-data-stories`](skills/dreambase-data-stories/) | Design reports, executive summaries, slide decks, infographics, and scrollytelling pieces that blend charts, illustration, typography, and narrative — built on the practices of FT, NYT Graphics, The Pudding, and Reuters |
| [`dreambase-data-presentation`](skills/dreambase-data-presentation/) | Design and build data presentations — board, investor, QBR, readout, launch, sales, and keynote decks — as interactive self-contained web decks, native .pptx, Google Slides, or a build spec, with verified slide-craft specs, staged chart reveals, and presenter mechanics |
| [`dreambase-public-reports`](skills/dreambase-public-reports/) | Create disclosure-safe public artifacts from real or sensitive data using transformed visuals, constructive and honest storytelling, and explicit approval for visible percentages, rates, deltas, ratios, or indexes |
| [`dreambase-industrial-schematics`](skills/dreambase-industrial-schematics/) | Create dark cinematic industrial/HUD technical schematics — orbital process rings, cel-shaded exploded machinery, holographic 2D/3D wireframe mesh charts with monochromatic hue themes, tick-strip components — as portable SVG/HTML, with zero-dep ring/ruler and 3D-mesh generators |
| [`dreambase-micrographic-design`](skills/dreambase-micrographic-design/) | Design in the micrographics style — compliance-labelling visual language (rating plates, care tags, spec sheets) used as intentional design: hairline rules, boxed compartments, tick scales, `LABEL: value` pairs, mark clusters, micro-typography, monochrome plus one safety accent — with the certification-mark legal guardrail |
| [`dreambase-skill-creator`](skills/dreambase-skill-creator/) | Create, improve, validate, and evaluate Dreambase agent skills using this repository's conventions and eval loop |

For a data artifact, use the separate MCP plugin to get verified data, then use
`dreambase-data-stories` for narrative, `dreambase-visualization-design` for
chart decisions, and `dreambase-echarts` for option JSON. Add
`dreambase-data-presentation` for decks or `dreambase-public-reports` for public
artifacts derived from confidential data.

## Install or migrate the MCP plugin

```bash
npx plugins add DreambaseAI/plugin --yes
```

The planned short form, `npx plugins add dreambase/plugin --yes`, requires the
installer alias release. Until it is published, use the actual repository
address above. Plugin installation and OAuth authorization are separate steps;
see [plugin setup](https://github.com/DreambaseAI/plugin#connect-and-verify).

Version 2.0.0 of the plugin contains only the MCP skill. The eight optional
skills in this library no longer ship inside it. Install any you use with
`npx skills add DreambaseAI/skills --skill <name>`.

The old Claude and Codex marketplace catalogs retain the `dreambase` identity
and redirect to the new plugin repository. Refresh the old marketplace and
update the installed plugin, or reinstall from the new source. Cursor users
should reinstall from the new repository; its old local-path catalog is removed.
No data is moved by this split: the hosted MCP endpoint remains
`https://app.dreambase.com/mcp`.

A future `plugins` installer release also redirects the old skills-repo plugin
address to the new source. Ordinary `skills` commands continue installing this
library. See the [installer migration notes](https://github.com/DreambaseAI/plugin/blob/main/docs/installer-migration.md).

## Development

```bash
npm run check:skills
```

This validates the preserved eight-skill inventory, resource paths, and
frontmatter. There is no plugin build or submission artifact in this repository.
The Claude and Codex catalogs are compatibility redirects only. Plugin changes
and marketplace release tooling belong in
[DreambaseAI/plugin](https://github.com/DreambaseAI/plugin).

## Contributing and license

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the skill creation and evaluation
workflow. Keep main skill instructions concise and move conditional detail into
`references/`. Commit evaluations; generated evaluation workspaces are ignored.

[MIT](LICENSE). The ECharts metadata remains covered by
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
