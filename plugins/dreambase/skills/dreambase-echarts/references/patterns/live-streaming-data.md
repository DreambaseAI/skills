# Live streaming data

For chart configs intended to be incrementally updated by the host app, the
agent should produce a config with a stable structure that the host appends
to via `setOption(partial)`:

```json
{
  "animation": false,
  "xAxis": { "type": "time" },
  "yAxis": { "type": "value", "scale": true },
  "series": [{ "type": "line", "id": "live", "data": [], "showSymbol": false, "smooth": false }]
}
```

The host updates with:
```ts
chart.setOption({
  series: [{ id: 'live', data: existing.concat(newPoint).slice(-500) }]
});
```

### Rules
- Disable `animation` for live data.
- Cap retained data points to a fixed window (e.g. last 500).
- Always set series `id` so partial updates merge correctly.
