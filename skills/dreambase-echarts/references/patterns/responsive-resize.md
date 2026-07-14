# Responsive resize

ECharts handles container resize via `chart.resize()`. With
`echarts-for-react` and `autoResize: true` (default), the wrapper observes
the parent. For breakpoint-driven layout changes, use `media` in the option:

```json
{
  "baseOption": {
    "legend": { "orient": "horizontal", "top": "5%" },
    "series": [{ "type": "bar", "data": [120,135,142] }]
  },
  "media": [
    {
      "query": { "maxWidth": 600 },
      "option": {
        "legend": { "orient": "vertical", "right": 0, "top": "middle" }
      }
    }
  ]
}
```

NOTE: when using `baseOption` + `media`, the renderer should set
`option={ baseOption, media }` and pass `notMerge: true`.
