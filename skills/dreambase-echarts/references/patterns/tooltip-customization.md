# Custom tooltips

Use ECharts **template strings** only. Do not emit function source for `formatter` or `valueFormatter`.

### Simple — named value
```json
{ "tooltip": { "trigger": "axis", "formatter": "{b}: {c} USD" } }
```

### Item tooltip (pie / scatter)
```json
{ "tooltip": { "trigger": "item", "formatter": "{a} {b}: {c} ({d}%)" } }
```

`{a}` is series name, `{b}` is category/item name, `{c}` is value, `{d}` is percent (pie).

### Pinned/grouped on cross
```json
{ "tooltip": {
  "trigger": "axis",
  "axisPointer": { "type": "cross", "label": { "backgroundColor": "#283b56" } }
} }
```

### Rules
- Prefer `formatter` templates over any per-value script.
- For axis units, put the unit in the template (`"{value} USD"` on `axisLabel.formatter`, `"{b}: {c} USD"` on tooltip).
- Multi-series axis tooltips work with `trigger: "axis"` and the default item list; do not build HTML in a callback.
