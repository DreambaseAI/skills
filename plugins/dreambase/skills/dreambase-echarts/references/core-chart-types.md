# Core chart types

Minimal working snippets for the most common series types. For intricate types (sankey, treemap, sunburst, tree, graph, gauge, funnel, boxplot, map, calendar) read `references/charts/<type>.md` instead — their data schemas are easy to get wrong from memory.

## line — trend over an ordered axis
```json
{
  "xAxis": { "type": "category", "data": ["Mon","Tue","Wed","Thu","Fri"] },
  "yAxis": { "type": "value" },
  "series": [{ "type": "line", "data": [120,200,150,80,170], "smooth": true }]
}
```
Key options: `smooth`, `step`, `areaStyle`, `stack`, `symbol`, `showSymbol`,
`connectNulls`, `emphasis`. For time data, use `xAxis.type: "time"` with
`[timestamp, value]` pairs — see `patterns/time-series-with-zoom.md`.

## bar — categorical comparison
```json
{
  "xAxis": { "type": "category", "data": ["Q1","Q2","Q3","Q4"] },
  "yAxis": { "type": "value" },
  "series": [{ "type": "bar", "data": [120,135,142,168] }]
}
```
Key options: `stack`, `barWidth`, `barGap`, `barCategoryGap`, `barMaxWidth`,
`label`, `itemStyle.borderRadius`. Horizontal bars: swap the xAxis/yAxis types.

## pie — part-of-whole
```json
{
  "series": [{
    "type": "pie",
    "radius": ["40%", "70%"],
    "data": [{"name":"A","value":40},{"name":"B","value":30},{"name":"C","value":30}],
    "label": { "formatter": "{b}: {d}%" }
  }]
}
```
Key options: `radius` (two values = donut), `roseType`, `avoidLabelOverlap`,
`itemStyle`, `labelLine`. No axes — pie charts ignore xAxis/yAxis.

## scatter — correlation between two variables
```json
{
  "xAxis": { "type": "value" },
  "yAxis": { "type": "value" },
  "series": [{ "type": "scatter", "data": [[10.0,8.04],[8.0,6.95],[13.0,7.58]] }]
}
```
Key options: `symbolSize` (a function string for bubble charts), `itemStyle.color`.

## heatmap — 2D matrix intensity
```json
{
  "xAxis": { "type": "category", "data": ["A","B","C"] },
  "yAxis": { "type": "category", "data": ["X","Y","Z"] },
  "visualMap": { "min": 0, "max": 10, "calculable": true, "orient": "horizontal", "left": "center", "bottom": "5%" },
  "series": [{ "type": "heatmap", "data": [[0,0,3],[1,0,7],[2,0,4],[0,1,1],[1,1,9]] }]
}
```
Requires `visualMap` — without it nothing renders. Data tuples: `[xIdx, yIdx, value]`.

## candlestick — OHLC financial
```json
{
  "xAxis": { "type": "category", "data": ["2024-01-01","2024-01-02"] },
  "yAxis": { "type": "value" },
  "series": [{ "type": "candlestick", "data": [[20,34,10,38],[40,35,30,50]] }]
}
```
Data tuple order matters: `[open, close, lowest, highest]`. For volume + MA
overlays see `charts/candlestick.md`.

## radar — multi-dimensional comparison
```json
{
  "radar": { "indicator": [{"name":"Sales","max":100},{"name":"Marketing","max":100},{"name":"Dev","max":100}] },
  "series": [{ "type": "radar", "data": [{ "value": [80,60,70], "name": "Team A" }] }]
}
```
Requires the top-level `radar.indicator` component — series values map to
indicators by position.

## gauge — single dial
```json
{ "series": [{ "type": "gauge", "data": [{ "value": 72, "name": "Score" }] }] }
```
Key options: `min`, `max`, `axisLine.lineStyle.color` (gradient stops). For
multi-ring or progress gauges read `charts/gauge.md`.
