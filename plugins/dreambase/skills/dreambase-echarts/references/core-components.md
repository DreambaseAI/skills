# Core components

## Global options (top-level)

These sit at the root of the option object, not inside a component.

```json
{
  "color": ["#5470c6", "#91cc75", "..."],
  "backgroundColor": "rgba(0,0,0,0)",
  "darkMode": "auto",
  "animation": true,
  "useUTC": false,
  "textStyle": { "fontFamily": "sans-serif", "fontSize": 12 }
}
```

- `color` — default palette, applied to series in order.
- `animation` — disable for live/streaming charts.
- `useUTC` — interpret times as UTC vs local.

### `darkMode`
- Values: `"auto"` (default), `true`, `false`.
- `"auto"` — ECharts inspects `backgroundColor` and flips internal defaults (axis label color, splitLine color, etc.) so text stays readable on dark canvases. If you set `backgroundColor` to a dark color, you usually don't need to set `darkMode` explicitly.
- `true` / `false` — force the mode regardless of background. Useful when:
  - You render against a transparent background but the host app is dark themed.
  - You're embedding multiple charts and want consistent text colors independent of each background.
- Mostly used by **theme presets** — most app code can leave it on `"auto"`.

## xAxis / yAxis
```json
{ "type": "value" | "category" | "time" | "log",
  "name": "Revenue", "nameLocation": "middle", "nameGap": 30,
  "min": 0, "max": "dataMax", "scale": true,
  "axisLabel": { "formatter": "{value} USD", "rotate": 0 },
  "axisLine": { "show": true }, "splitLine": { "show": true } }
```
Multi-axis: pass an **array** of two axis objects. Series picks one via `yAxisIndex: 1`.

## tooltip
```json
{ "trigger": "axis" | "item",
  "axisPointer": { "type": "cross" | "shadow" | "line" },
  "formatter": "{b}: {c}",
  "valueFormatter": "(v) => v.toFixed(2)" }
```
For multi-series, prefer `trigger: 'axis'`. For pie/scatter, `trigger: 'item'`.
`formatter` accepts template strings (`{a}` series, `{b}` name, `{c}` value,
`{d}` percent) or a JS function string; the renderer must eval function strings
under its safety policy, so prefer templates or `valueFormatter`.

## legend
```json
{ "data": ["A","B"], "top": "5%", "left": "center", "orient": "horizontal",
  "selected": { "B": false } }
```

## grid — chart drawing area inside the canvas
```json
{ "left": "10%", "right": "5%", "top": 60, "bottom": 50, "containLabel": true }
```
Set `containLabel: true` whenever axis labels rotate or get long — otherwise
labels clip at the canvas edge.

## dataZoom
Two flavors, often used together:
```json
{ "dataZoom": [
    { "type": "inside", "start": 0, "end": 100 },
    { "type": "slider", "start": 0, "end": 100, "bottom": 10 }
] }
```

## visualMap — drives color mapping
Continuous:
```json
{ "type": "continuous", "min": 0, "max": 100,
  "inRange": { "color": ["#50a3ba","#eac736","#d94e5d"] } }
```
Required for `heatmap` and useful for any series that colors by value.
Piecewise buckets and diverging palettes: `patterns/color-themes-and-visualmap.md`.

## dataset — declarative data source (preferred over inlining series.data)
```json
{ "dataset": { "source": [["product","2024","2025"],["Tea",43.3,85.8],["Coffee",83.1,73.4]] },
  "series": [{ "type": "bar" }, { "type": "bar" }] }
```
With `dataset`, series map columns automatically; use `encode` to pick columns
explicitly. Use this whenever data exceeds ~200 inline points.

## title
```json
{ "title": { "text": "Revenue by quarter", "subtext": "FY 2025", "left": "center" } }
```

## toolbox
```json
{ "toolbox": { "feature": { "saveAsImage": {}, "dataZoom": {}, "restore": {}, "magicType": { "type": ["line","bar"] } } } }
```
