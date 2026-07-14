# Time series with zoom

Goal: display a long time series, give the user pan+zoom, keep render fast.

```json
{
  "tooltip": { "trigger": "axis", "axisPointer": { "type": "cross" } },
  "xAxis": { "type": "time" },
  "yAxis": { "type": "value", "scale": true },
  "dataZoom": [
    { "type": "inside", "throttle": 50 },
    { "type": "slider", "bottom": 10, "height": 24 }
  ],
  "series": [{
    "type": "line",
    "showSymbol": false,
    "sampling": "lttb",
    "data": [["2024-01-01T00:00:00Z", 12.3], ["2024-01-01T01:00:00Z", 14.1]]
  }]
}
```

### Rules
- Use `xAxis.type: 'time'`; pass ISO strings or epoch ms.
- `sampling: 'lttb'` thins to visible pixel density without losing peaks — this is the perf lever for line series (`large: true` is a scatter/bar option, not line).
- Hide symbols (`showSymbol: false`) when point count > 200.
