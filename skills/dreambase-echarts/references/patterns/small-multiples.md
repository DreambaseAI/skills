# Small multiples

Render several charts in one option object by defining multiple `grid` /
`xAxis` / `yAxis` instances and binding series to specific axis indices.

```json
{
  "grid": [
    { "left": "5%",  "right": "55%", "top": 40, "bottom": "10%" },
    { "left": "55%", "right": "5%",  "top": 40, "bottom": "10%" }
  ],
  "xAxis": [
    { "gridIndex": 0, "type": "category", "data": ["Q1","Q2","Q3"] },
    { "gridIndex": 1, "type": "category", "data": ["Q1","Q2","Q3"] }
  ],
  "yAxis": [
    { "gridIndex": 0, "type": "value" },
    { "gridIndex": 1, "type": "value" }
  ],
  "series": [
    { "type": "bar", "xAxisIndex": 0, "yAxisIndex": 0, "data": [120,135,142] },
    { "type": "bar", "xAxisIndex": 1, "yAxisIndex": 1, "data": [42,38,35] }
  ]
}
```

### Rules
- One `grid` per panel; reserve space with `left/right/top/bottom` percentages.
- Each axis binds to a grid via `gridIndex`.
- Each series binds to its axes via `xAxisIndex` + `yAxisIndex`.
