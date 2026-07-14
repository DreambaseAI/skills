# Color themes & visualMap

### Dark mode
Top-level `darkMode` (`"auto" | true | false`, default `"auto"`) tells ECharts to flip its built-in defaults (axis-label color, splitLine color, tooltip background, etc.) so chart text remains readable on a dark canvas.

```json
{
  "darkMode": true,
  "backgroundColor": "#0b1020",
  "textStyle": { "color": "#e6e6e6" },
  "series": [{ "type": "line", "data": [120, 132, 101] }]
}
```

Rules:
- `"auto"` is the right default — ECharts inspects `backgroundColor` and switches text colors accordingly.
- Force `true` when the chart has a transparent background but renders on a dark host page (e.g. shadcn dark mode + ECharts default `rgba(0,0,0,0)` background).
- Force `false` to lock light defaults regardless of background.
- `darkMode` doesn't change the palette — pair with a different `color` array or `visualMap.inRange.color` for the actual series tints.

### Branded palette
```json
{ "color": ["#5B8FF9","#5AD8A6","#5D7092","#F6BD16","#E8684A","#6DC8EC","#9270CA","#FF9D4D"] }
```
Applies to series in order.

### Sequential color-by-value
```json
{
  "visualMap": {
    "type": "continuous",
    "min": 0, "max": 100,
    "calculable": true,
    "left": "right", "orient": "vertical",
    "inRange": { "color": ["#e0ffff","#006edd"] }
  }
}
```

### Diverging
```json
{
  "visualMap": {
    "min": -10, "max": 10,
    "calculable": true,
    "inRange": { "color": ["#d73027","#ffffbf","#1a9850"] }
  }
}
```

### Piecewise (categorical buckets)
```json
{
  "visualMap": {
    "type": "piecewise",
    "pieces": [
      { "lt": 0, "color": "#d73027", "label": "Loss" },
      { "gte": 0, "lt": 50, "color": "#fee08b", "label": "Low" },
      { "gte": 50, "color": "#1a9850", "label": "High" }
    ]
  }
}
```
