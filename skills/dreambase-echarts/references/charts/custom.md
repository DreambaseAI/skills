# custom — illustrative visuals without custom series

This host accepts **declarative JSON only**. Do not use `series.type: "custom"` or a `renderItem` callback. For forms no built-in series covers, compose `pictorialBar`, stacked offset bars, and the `graphic` overlay.

## When to use

- The form doesn't exist as a built-in series: ranges (from–to bars), Gantt/timeline blocks, ISOTYPE unit counts, decorative annotation.
- An editorial/data-story piece needs designed marks that still bind to real data and axes.
- Do NOT invent a custom series when a built-in + styling gets there — `pictorialBar` covers icon repetition, `graphic` covers decorative overlays, and rich `itemStyle`/`label` covers most "make it beautiful" asks.

## Range bars (from → to) via stacked offset

Each datum is a start and a span. Hide the start series so only the span is visible:

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["Span"] },
  "xAxis": { "type": "value" },
  "yAxis": { "type": "category", "data": ["A", "B", "C", "D"] },
  "series": [
    {
      "name": "Offset",
      "type": "bar",
      "stack": "range",
      "silent": true,
      "itemStyle": { "color": "transparent" },
      "data": [10, 16, 18, 26]
    },
    {
      "name": "Span",
      "type": "bar",
      "stack": "range",
      "data": [6, 2, 8, 6]
    }
  ]
}
```

Gantt/timeline blocks use the same pattern with `xAxis.type: "time"` (offset = start epoch ms, span = duration ms).

Hexbin-style density: use `heatmap`. Error bars / whiskers: use `boxplot` or `candlestick`.

## pictorialBar — icon bars and unit counts

Use built-in symbols (`'rect'`, `'roundRect'`, `'triangle'`, `'diamond'`, `'circle'`, `'pin'`, `'arrow'`) or inline `path://` SVG path data. Do not use remote `image://` URLs.

```json
{
  "xAxis": { "type": "category", "data": ["Q1", "Q2", "Q3", "Q4"] },
  "yAxis": { "type": "value" },
  "series": [{
    "type": "pictorialBar",
    "symbol": "roundRect",
    "symbolRepeat": true,
    "symbolSize": [12, 8],
    "data": [12, 18, 15, 22]
  }]
}
```

- `symbolRepeat: true` — ISOTYPE-style unit counts.
- `symbolClip: true` — partial-fill progress icons.
- `symbolSize` — a number or `[width, height]` pair, computed in the JSON before emit (not a callback).

## graphic — decorative overlays

Non-data annotation: callouts, watermarks, rules, hand-drawn-feel embellishments positioned in pixels or percentages. Keep data marks proportionally honest; put artistry in shape, color, and this layer, not in distorted geometry (from `dreambase-visualization-design`).

```json
{
  "graphic": [{
    "type": "text",
    "left": 24,
    "top": 16,
    "style": { "text": "FY 2025", "fontSize": 12, "fill": "#6b7280" }
  }]
}
```

## Gotchas

- `custom` / `renderItem` will fail validation in this skill — rewrite as stacked offset, pictorialBar, heatmap, boxplot, or graphic.
- `symbolSize` and `formatter` must be numbers or template strings (`"{b}: {c}"`), never function source.
- Forgetting `stack` on both the transparent offset and the visible span un-stacks the range bar.
- `graphic` elements are not data-bound; they do not zoom with `dataZoom`. Put data marks in series.
