# funnel — stage-by-stage drop-off through a sequential process (widths encode values)

## When to use

- Conversion pipelines with a strict stage order and shrinking counts: visits → signups → trials → purchases.
- Recruiting, sales, or checkout flows where the story is "how much survives each step".
- Do NOT use for unordered part-to-whole composition — that is a pie/treemap job; funnel implies sequence.
- Do NOT use when stage values are nearly equal or non-monotonic — the trapezoids become indistinguishable or misleading; prefer a plain bar chart of stage counts.

## Data schema

`data` is an array of `{ value, name }` objects — one per stage:

```json
"data": [
  { "value": 5000, "name": "Visited" },
  { "value": 3200, "name": "Signed up" },
  { "value": 620,  "name": "Purchased" }
]
```

- `value` (number, required) — controls the trapezoid WIDTH, mapped from series `min`/`max` (defaults 0/100) onto `minSize`/`maxSize` ('0%'/'100%').
- `name` (string, required in practice) — stage label; keys the legend and `{b}` in tooltips. Legend entries must match these names exactly.
- Input order does not control display order by default — `sort: 'descending'` (the default) reorders stages by value. Items may also carry per-item `itemStyle`, `label`, and `labelLine`.

## Working example

```json
{
  "tooltip": { "trigger": "item", "formatter": "{b}: {c} users" },
  "legend": { "top": 0, "data": ["Visited", "Signed up", "Started trial", "Purchased"] },
  "series": [
    {
      "name": "Signup funnel",
      "type": "funnel",
      "sort": "descending",
      "orient": "vertical",
      "gap": 4,
      "top": 40,
      "bottom": 20,
      "left": "10%",
      "width": "80%",
      "min": 0,
      "max": 5000,
      "minSize": "5%",
      "maxSize": "100%",
      "funnelAlign": "center",
      "label": { "show": true, "position": "inside", "formatter": "{b}\n{c}" },
      "itemStyle": { "borderColor": "#fff", "borderWidth": 1 },
      "emphasis": { "label": { "fontSize": 16 } },
      "data": [
        { "value": 5000, "name": "Visited" },
        { "value": 3200, "name": "Signed up" },
        { "value": 1450, "name": "Started trial" },
        { "value": 620, "name": "Purchased" }
      ]
    }
  ]
}
```

## Key options

- `sort` = 'descending' — display order: `'descending'` (widest on top), `'ascending'` (pyramid), or `'none'` to respect data order. Use `'none'` when stage order is semantic, not by size.
- `min` = 0, `max` = 100 — value range mapped to widths. Set `max` to the largest stage value or all bands render at full width distortion.
- `minSize` = '0%', `maxSize` = '100%' — width of the smallest/largest trapezoid. Bump `minSize` (e.g. '5%') so tiny final stages stay visible and labelable.
- `gap` = 0 — pixel gap between stages; 2-4 px gives the classic segmented look.
- `orient` = 'vertical' — `'horizontal'` lays stages left-to-right; then `funnelAlign` controls top/bottom instead of left/right.
- `funnelAlign` = 'center' — `'left'`/`'right'` produce half-funnel (ramp) shapes.
- `label.show` = false, `label.position` = 'outside' — turn labels on explicitly; `'inside'` centers text in each band, `'outside'` draws a labelLine to the side (needs horizontal margin).
- `left` = 80, `top` = 60, `right` = 80, `bottom` = 60, `width`/`height` = 'auto' — funnel positions like a box, not via grid; these defaults leave room for outside labels.
- `legendHoverLink` = true — hovering legend entries highlights the matching stage by `name`.

## Gotchas

- Leaving `max` at its default 100 with real counts (5000, 3200, ...) — every value clamps above max, so all stages render at `maxSize` and the funnel becomes an even rectangle stack. Always set `max` to the top-of-funnel value.
- Expecting data order to be honored — default `sort: 'descending'` silently reorders stages by value, so a non-monotonic funnel (a mid-stage larger than the one above) displays in the wrong sequence. Set `"sort": "none"` to keep the pipeline order you provided.
- Legend `data` names not matching item `name` strings exactly — unmatched legend entries render greyed-out and toggle nothing, because legend links purely by string equality.
- `label.position: "outside"` (the default position) with the series stretched to `left: 0, width: "100%"` — outside labels and label lines are clipped off the canvas edge and appear missing. Either keep horizontal margins or switch to `"position": "inside"`.
- Funnel is not a cartesian series: it ignores `xAxis`/`yAxis`/`grid`. Adding axes "for layout" draws empty axis lines behind it; position with `left/top/right/bottom/width/height` on the series itself.
- A zero or missing `value` on a stage renders a zero-width sliver with `minSize: '0%'` — it is effectively invisible and looks like lost data. Raise `minSize` or filter out empty stages deliberately.
- Duplicate stage `name`s — tooltips and legend cannot distinguish them and per-name emphasis highlights both bands; make stage names unique.
