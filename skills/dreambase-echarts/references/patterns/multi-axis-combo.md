# Dual y-axis combo

Use when two series share an x-axis but have different units/scales
(e.g. revenue $ vs. churn %).

```json
{
  "tooltip": { "trigger": "axis" },
  "legend": { "top": "5%" },
  "xAxis": { "type": "category", "data": ["Q1","Q2","Q3","Q4"] },
  "yAxis": [
    {
      "type": "value", "name": "Revenue",
      "position": "left",
      "axisLabel": { "formatter": "{value}M" }
    },
    {
      "type": "value", "name": "Churn",
      "position": "right",
      "axisLabel": { "formatter": "{value}%" },
      "splitLine": { "show": false }
    }
  ],
  "series": [
    { "type": "bar",  "name": "Revenue", "yAxisIndex": 0, "data": [120, 135, 142, 168] },
    { "type": "line", "name": "Churn",   "yAxisIndex": 1, "data": [4.2, 3.8, 3.5, 3.1] }
  ]
}
```

### Rules
- `yAxis` is an array of two configs (left, right).
- Hide `splitLine` on the secondary axis to reduce visual noise.
- Series → axis binding via `yAxisIndex` (0 or 1).
