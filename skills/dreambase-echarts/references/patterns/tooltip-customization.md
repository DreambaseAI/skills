# Custom tooltips

### Simple — value formatter
```json
{ "tooltip": { "trigger": "axis",
  "valueFormatter": "(v) => Number(v).toLocaleString() + ' USD'" } }
```

### Multi-line with HTML
```json
{ "tooltip": {
  "trigger": "axis",
  "formatter": "(params) => params.map(p => `${p.marker} ${p.seriesName}: <b>${p.value}</b>`).join('<br>')"
} }
```

### Pinned/grouped on cross
```json
{ "tooltip": {
  "trigger": "axis",
  "axisPointer": { "type": "cross", "label": { "backgroundColor": "#283b56" } },
  "extraCssText": "box-shadow: 0 4px 16px rgba(0,0,0,.18); border-radius: 8px;"
} }
```

### Rules
- The agent emits formatter functions as **strings**. The renderer's safety
  policy decides whether to eval. Prefer `valueFormatter` over `formatter`
  when possible — it accepts the same string but with a narrower contract.
