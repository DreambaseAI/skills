# Dreambase community skills

Optional open-source skills for creating clear, useful and enjoyable data artifacts. Use them with Dreambase, another data source, or data you already have. They are independent of the Dreambase product integration and are not required to query data or use its primitives.

## Install

```bash
npx skills add DreambaseAI/skills --list
npx skills add DreambaseAI/skills --skill dreambase-echarts
npx skills add DreambaseAI/skills --skill dreambase-data-stories
```

Install just the skills you want, or use --all for the full library. You can also copy an individual skill directory into your agent's skills folder. Companion skills are optional: use their specialist guidance when installed and the selected skill's standalone fallback otherwise.

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


## Contribute

Run npm run check:skills and read CONTRIBUTING.md. Commit realistic evaluation prompts and fixtures beside each skill. Generated evaluation workspaces stay ignored. Validation checks structure; record actual evaluation results separately.

MIT licensed. The ECharts metadata also carries the notices in THIRD_PARTY_NOTICES.md.
