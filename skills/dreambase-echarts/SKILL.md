---
name: dreambase-echarts
description: >-
  Author Apache ECharts option (EChartsOption) JSON configs for the Dreambase
  renderer. Use whenever the user wants a chart, graph, plot, dashboard, or any
  data visualization — line, bar, pie, scatter, heatmap, sankey, treemap,
  sunburst, gauge, candlestick, boxplot, funnel, radar, graph/network, map, or
  calendar — or asks to visualize, plot, or chart data, even if they never say
  "ECharts". Also use when editing, debugging, or validating an existing
  ECharts config.
---

# Dreambase ECharts Config Authoring

Produce a single JSON object conforming to the ECharts `EChartsOption` shape. The Dreambase renderer consumes that object directly — the quality bar is a config that renders correctly on first try, which is why every config gets validated before it's returned.

## Output contract (Dreambase renderer)

- Emit **pure JSON** — one option object, no surrounding JS, no comments.
- Callbacks (`formatter`, `symbolSize` functions, …) are emitted as **JS source strings** (e.g. `"formatter": "(params) => ..."`). The renderer's safety policy decides whether to eval them, so prefer declarative equivalents when they exist: template strings (`"{b}: {d}%"`) and `valueFormatter` over `formatter` functions.
- The host owns the chart lifecycle: it calls `chart.resize()` and applies partial updates via `setOption`. Never rely on attaching listeners — for breakpoint behavior use `baseOption` + `media` (see `references/patterns/responsive-resize.md`).
- Inline at most ~200 data points via `series[].data`; past that, use `dataset.source` so data stays tabular and series stay declarative.

## Critical rules

- Time series use `xAxis: { "type": "time" }` with ISO strings or epoch ms — never a category axis of pre-formatted date strings, which breaks zooming and tooltip formatting.
- Dual axes: `yAxis` is an array of two configs; each series binds with `yAxisIndex`. An index pointing past the array renders a blank chart.
- Stacking works by name: every series in one stack shares the same `stack` string. A typo silently un-stacks that series.
- `heatmap` requires a `visualMap`; `radar` series require `radar.indicator`; without them ECharts renders nothing, with no error.
- Set `tooltip` and `legend` on every multi-series chart unless the user opts out — `trigger: "axis"` for cartesian multi-series, `trigger: "item"` for pie/scatter.
- Validate before returning:
  ```bash
  node scripts/validate-option.mjs <config.json>
  ```
  Fix every error and re-run until clean. Treat warnings as advice worth taking unless the user's request contradicts them.

## Picking the chart type

| Want to show | Use |
|---|---|
| Trend over time | line (`xAxis.type: "time"`) |
| Compare categories | bar |
| Distribution of parts | pie (≤7 slices) or treemap (many) |
| Correlation x↔y | scatter / effectScatter |
| Matrix density | heatmap |
| Stock OHLC | candlestick |
| Multi-dimension profile | radar |
| Flow / migration | sankey |
| Hierarchy | treemap / sunburst / tree |
| Single KPI dial | gauge |
| Range distribution | boxplot |
| Geographic | map / geo + scatter |
| Network | graph |
| Pipeline stages | funnel |
| Daily activity | calendar + heatmap |
| Bespoke/illustrative form (ranges, Gantt, hexbin, error bars, data art) | custom (`renderItem`) + pictorialBar + graphic |

## Workflow

1. Pick the type from the table above.
2. Read the matching reference:
   - Common types (line, bar, pie, scatter, heatmap, candlestick, radar): `references/core-chart-types.md` has a working snippet to start from.
   - Intricate types (sankey, treemap, sunburst, tree, graph, gauge, funnel, boxplot, map, calendar): read `references/charts/<type>.md` — their data schemas are easy to get subtly wrong from memory.
   - Bespoke or illustration-style visuals (a form no built-in series expresses, or an editorial/data-story piece): read `references/charts/custom.md` for the `renderItem` contract and the custom + pictorialBar + graphic toolkit.
   - Composite requirements (zoom, dual axis, stacking, small multiples, streaming, theming): the matching recipe in `references/patterns/`.
3. When unsure of an exact option name, type, or default, look it up instead of guessing:
   ```bash
   node scripts/echarts-option.mjs series-sankey --depth 2   # subtree of valid options
   node scripts/echarts-option.mjs --find sampling            # search by name
   ```
   The index is vendored (offline, versioned to the ECharts release in `assets/option-index.json`).
4. Author the config against `references/core-components.md` for axes/tooltip/legend/grid/dataZoom/visualMap/dataset details.
5. Validate (rule above), then return the JSON.

## References

- `references/core-chart-types.md` — minimal working snippets per common type.
- `references/core-components.md` — the component cheatsheet: global options, axes, tooltip, legend, grid, dataZoom, visualMap, dataset, title, toolbox.
- `references/charts/` — one file per intricate chart type with data schema, working example, and gotchas.
- `references/patterns/` — composite recipes: `time-series-with-zoom`, `multi-axis-combo`, `stacked-and-grouped`, `normalized-percent`, `small-multiples`, `responsive-resize`, `tooltip-customization`, `color-themes-and-visualmap`, `live-streaming-data`.
