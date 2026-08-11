# treemap — hierarchical part-to-whole as nested rectangles sized by value

## When to use

- Show how a total decomposes across a hierarchy (disk usage, budget lines, org revenue) where **area = magnitude** and you have 2-4 levels of nesting.
- Good when leaf counts are large (hundreds of rectangles still read); pair with `leafDepth` for drill-down instead of rendering everything at once.
- NOT for comparing precise values between siblings — area comparison is imprecise; prefer a sorted `bar` chart.
- NOT for flat, single-level data with under ~10 items — a bar or pie communicates the same thing with less machinery. For emphasizing ring-shaped hierarchy/proportion at each depth, prefer `sunburst`.

## Data schema

Recursive tree of nodes. Each node: `{name, value, children}`. `value` on a branch is optional — ECharts sums children when omitted — but if you set it, it should be >= the sum of its children (the layout trusts your number).

```json
{
  "series": [{
    "type": "treemap",
    "data": [
      {
        "name": "branch",
        "value": 620,
        "children": [
          { "name": "leaf-a", "value": 380 },
          { "name": "leaf-b", "value": 240 }
        ]
      },
      { "name": "flat-leaf", "value": 210 }
    ]
  }]
}
```

`value` may also be an array (e.g. `[size, colorMetric]`); then `visualDimension` picks which index drives color mapping (default `0`).

## Working example

```json
{
  "tooltip": {
    "trigger": "item",
    "formatter": "{b}: {c} MB"
  },
  "series": [
    {
      "type": "treemap",
      "name": "Disk Usage",
      "roam": false,
      "nodeClick": "zoomToNode",
      "breadcrumb": { "show": true, "top": "bottom" },
      "label": { "show": true, "formatter": "{b}" },
      "upperLabel": { "show": true, "height": 22 },
      "levels": [
        { "itemStyle": { "borderColor": "#999", "borderWidth": 0, "gapWidth": 2 } },
        { "itemStyle": { "borderColor": "#ddd", "borderWidth": 2, "gapWidth": 1 }, "upperLabel": { "show": true } },
        { "colorSaturation": [0.35, 0.6], "itemStyle": { "gapWidth": 1, "borderColorSaturation": 0.6 } }
      ],
      "data": [
        {
          "name": "src",
          "value": 620,
          "children": [
            { "name": "components", "value": 380 },
            { "name": "utils", "value": 140 },
            { "name": "styles", "value": 100 }
          ]
        },
        {
          "name": "node_modules",
          "value": 1450,
          "children": [
            { "name": "react", "value": 320 },
            { "name": "echarts", "value": 890 },
            { "name": "lodash", "value": 240 }
          ]
        },
        { "name": "public", "value": 210 }
      ]
    }
  ]
}
```

## Key options

- `levels` (unset) — per-depth styling array; entry 0 is the root level. The idiomatic way to set borders/gaps and color rules per depth; without it all depths share one style and nesting is hard to read.
- `leafDepth` (unset = drill-down disabled) — max depths shown at once; setting it (e.g. `1` or `2`) enables click-to-drill-down.
- `nodeClick` = `'zoomToNode'` — click behavior; `false` disables, `'link'` follows `data[i].link`.
- `breadcrumb.show` = `true` — the navigation trail (default position bottom); shows the path while zoomed/drilled. Turn off for static thumbnails.
- `upperLabel.show` = `false` — renders the parent's name in a band above its children; enable it (with a `height`, default 20) so branch names stay visible.
- `label.show` = `false` at series root in the raw schema, but treemap's theme default renders labels inside leaves; set `label` explicitly to control `formatter`.
- `roam` = `true` — mouse-wheel zoom and drag pan. Set `false` inside scrollable dashboards, otherwise the chart hijacks scroll.
- `visibleMin` = `10` — nodes whose rendered area (px²) is below this are hidden; children hidden via `childrenVisibleMin`.
- `squareRatio` (≈1.618 golden ratio) — target rectangle aspect ratio for the squarified layout.
- `itemStyle.gapWidth` = `0` — spacing between sibling rectangles; a few px per level is what makes hierarchy legible.
- `width`/`height` = `'80%'` — treemap does not fill the container by default; set `'100%'` (with `left`/`top`) to use all space.

## Gotchas

- **Blank chart from missing `value` on leaves.** Leaves with no numeric `value` get zero area and vanish; branches may omit `value` (summed from children) but every leaf needs one.
- **Data must be an array at the top.** `data: {name, children}` (a single root object not wrapped in `[...]`) renders nothing — pass `data: [root]` or the list of top-level branches.
- **Tiny nodes silently disappear.** `visibleMin: 10` hides any node under 10 px²; with skewed data users report "missing" items. Lower `visibleMin` or enable drill-down via `leafDepth` rather than assuming a data bug.
- **Only the first level appears interactive-less.** If you set `leafDepth: 1`, only depth-1 tiles render and children appear on click — this is by design, not a data-loss bug. Remove `leafDepth` to show all levels at once.
- **Scroll hijacking.** Default `roam: true` captures wheel events for zoom, which breaks page scrolling when the chart is embedded in a scrollable dashboard. Set `roam: false` (or `'move'` to keep panning only).
- **`upperLabel` invisible without space.** Enabling `upperLabel.show` without `itemStyle.borderWidth`/`gapWidth` (or its `height`) on branch levels leaves no band to draw in; give the branch level a border width ~= upperLabel height via `levels`.
- **Colors look flat/identical across depths.** Treemap maps color by top-level index and darkens by depth via `colorSaturation`; if you hardcode `itemStyle.color` at the series root every node becomes one color. Use `levels[].color` / `colorSaturation` instead.
