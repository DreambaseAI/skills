# gauge — a single value shown as a dial or progress ring against a fixed min/max scale

## When to use

- One KPI against a known scale or target: utilization, SLA compliance, score out of 100, capacity used.
- Progress toward a goal where the "how far along the arc" reading matters more than exact history.
- Do NOT use for comparing many values — a gauge shows one number per series; use a bar chart instead.
- Do NOT use for values without a meaningful, fixed `min`/`max` — the arc position is meaningless then; prefer a plain stat/number display.

## Data schema

`data` is an array of objects, each with a numeric `value` and an optional `name`:

```json
"data": [{ "value": 72.4, "name": "SLA compliance" }]
```

- `value` (number, required) — plotted against the series-level `min`/`max` (defaults 0/100). It is NOT a percentage unless your min/max make it one.
- `name` (string) — rendered by the gauge `title` component below the dial and available as `{b}` in tooltips.
- Each item may also carry per-item `title`, `detail`, and `itemStyle` objects — this is how multi-ring gauges (multiple items or multiple gauge series) get distinct colors and separately positioned readouts via `title.offsetCenter` / `detail.offsetCenter`.
- Most gauges have exactly one item. Multiple items in one series draw multiple pointers/progress arcs on the SAME axis; visually distinct concentric rings are built from multiple gauge series with different `radius` values.

## Working example

```json
{
  "tooltip": { "formatter": "{b}: {c}%" },
  "series": [
    {
      "type": "gauge",
      "min": 0,
      "max": 100,
      "startAngle": 225,
      "endAngle": -45,
      "splitNumber": 5,
      "radius": "85%",
      "progress": { "show": true, "width": 14, "roundCap": true },
      "axisLine": {
        "roundCap": true,
        "lineStyle": {
          "width": 14,
          "color": [
            [0.6, "#e74c3c"],
            [0.85, "#f1c40f"],
            [1, "#2ecc71"]
          ]
        }
      },
      "pointer": { "length": "60%", "width": 5, "itemStyle": { "color": "auto" } },
      "axisTick": { "distance": -14, "lineStyle": { "color": "#fff", "width": 1 } },
      "splitLine": { "distance": -14, "length": 14, "lineStyle": { "color": "#fff", "width": 2 } },
      "axisLabel": { "distance": 22, "fontSize": 11 },
      "title": { "offsetCenter": [0, "70%"], "fontSize": 14 },
      "detail": {
        "formatter": "{value}%",
        "valueAnimation": true,
        "fontSize": 28,
        "offsetCenter": [0, "40%"]
      },
      "data": [{ "value": 72.4, "name": "SLA compliance" }]
    }
  ]
}
```

## Key options

- `min` = 0, `max` = 100 — the axis scale; every visual (pointer angle, progress arc, color-stop positions) derives from these.
- `startAngle` = 225, `endAngle` = -45 — arc extent in degrees, counterclockwise convention (225 to -45 is the classic 270-degree dial); use 180 to 0 for a half circle.
- `radius` = '75%', `center` = ['50%', '50%'] — size/placement inside the container; shrink radius when adding outer labels.
- `progress.show` = false — the filled value arc. Turn it on for modern progress-ring gauges; `progress.width` = 10 should match `axisLine.lineStyle.width`.
- `axisLine.lineStyle.color` — array of `[stopFraction, color]` pairs. Each fraction (0-1 of the axis range) is the END of its color zone, so stops must be ascending and the last should be 1.
- `pointer.show` = true, `pointer.length` = '60%', `pointer.width` = 6 — hide the pointer (`"show": false`) for pure progress-ring style.
- `detail` — the big numeric readout: `formatter` (string like `"{value}%"`), `fontSize` = 30, `offsetCenter` = [0, '40%'], `valueAnimation` = true.
- `title.offsetCenter` = [0, '20%'] — position of the `name` label; move it below `detail` to avoid overlap.
- `splitNumber` = 10 — number of major splits; each split gets `axisTick.splitNumber` = 5 minor ticks.
- `axisTick.distance` = 10, `splitLine.distance` = 10, `axisLabel.distance` = 15 — offsets from the axis line; negative values pull ticks/lines INSIDE a thick axisLine band.

## Gotchas

- Passing a bare number in `data` (e.g. `"data": [72.4]`) instead of `{ "value": 72.4 }` — the item has no `name`, so tooltip `{b}` and the title render empty, and per-item styling is impossible. Always use the object form.
- Value above `max` or below `min` — the pointer clamps at the end of the arc and the reading silently lies. Set `min`/`max` to the real domain (e.g. `max: 200` for a 0-200 ms metric), never leave the 0-100 default for non-percentage data.
- `axisLine.lineStyle.color` stops not ending at 1 or not ascending — zones past the last stop get no color and the band looks truncated or renders in unexpected default colors. Stops are cumulative end-fractions, not per-zone widths.
- Turning on `progress` without matching widths — if `progress.width` differs from `axisLine.lineStyle.width`, the value arc floats off-center of the track and looks broken. Set both to the same number.
- `detail.formatter` given as `"{c}"` — the detail component uses `{value}`, not the tooltip's `{a}/{b}/{c}` placeholders, so `{c}` prints literally.
- Multiple concentric gauges sharing one center but forgetting to set distinct `radius` (and hiding duplicate axes with `"axisLine": {"show": false}` etc. on inner series) — the rings paint on top of each other and appear as one garbled dial.
- Gauge ignores `xAxis`/`yAxis`/`grid` (its `coordinateSystem` is `'none'`); adding a stray empty `xAxis` alongside it can render blank axis lines behind the dial. Position with `center`/`radius` only.
