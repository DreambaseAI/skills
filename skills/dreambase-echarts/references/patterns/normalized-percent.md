# 100% stacked

ECharts has no native percent-stack flag — convert data to percentages in
your data prep step, then stack as usual.

```ts
// in your route handler before passing to ECharts
const totals = rows.map(r => r.a + r.b + r.c);
const pct = rows.map((r, i) => ({
  a: (r.a / totals[i]) * 100,
  b: (r.b / totals[i]) * 100,
  c: (r.c / totals[i]) * 100,
}));
```

```json
{
  "yAxis": { "type": "value", "max": 100, "axisLabel": { "formatter": "{value}%" } },
  "series": [
    { "type": "bar", "name": "A", "stack": "pct", "data": [55, 40, 30] },
    { "type": "bar", "name": "B", "stack": "pct", "data": [25, 35, 50] },
    { "type": "bar", "name": "C", "stack": "pct", "data": [20, 25, 20] }
  ]
}
```
