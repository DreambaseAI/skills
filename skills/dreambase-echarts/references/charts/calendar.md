# calendar — GitHub-style daily grid; a coordinate system that heatmap/scatter series plot onto

## When to use

- Show a daily metric over weeks-to-a-year (commits, sales, workouts, incidents) where weekday/weekend and seasonal patterns matter.
- Use `heatmap` on it for density (filled cells) or `scatter`/`effectScatter` for discrete events (sized dots on days).
- NOT for sub-daily granularity (hours) — use a cartesian `heatmap` with hour/day axes instead.
- NOT for a plain daily trend where patterns-by-weekday are irrelevant — a `line` chart with a time axis is clearer and more compact.

## Data schema

Calendar is a **top-level coordinate-system component, not a series**. Two parts are required and agents routinely miss one:

1. A top-level `calendar` object with a `range`.
2. A series with `coordinateSystem: 'calendar'` whose data rows are `[dateString, value]` pairs:

```json
{
  "calendar": { "range": "2024" },
  "series": [{
    "type": "heatmap",
    "coordinateSystem": "calendar",
    "data": [["2024-06-03", 4], ["2024-06-04", 7]]
  }],
  "visualMap": { "min": 0, "max": 10 }
}
```

`range` formats (all valid): `2024` or `'2024'` (whole year), `'2024-06'` (one month), `['2024-01-01', '2024-06-30']` (explicit span), `['2024-01', '2024-02']` (interpreted as `['2024-01-01', '2024-02-01']`). Date strings in data must fall inside `range`. Multiple calendars are allowed; a series targets one via `calendarIndex` (default `0`).

## Working example

```json
{
  "tooltip": {
    "trigger": "item",
    "formatter": "{c}"
  },
  "visualMap": {
    "min": 0,
    "max": 12,
    "type": "piecewise",
    "orient": "horizontal",
    "left": "center",
    "top": 0,
    "inRange": { "color": ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"] }
  },
  "calendar": {
    "top": 60,
    "left": 40,
    "right": 20,
    "range": "2024-06",
    "cellSize": ["auto", 20],
    "dayLabel": { "firstDay": 1, "nameMap": "en" },
    "monthLabel": { "show": true },
    "yearLabel": { "show": false },
    "itemStyle": { "borderWidth": 1, "borderColor": "#fff" },
    "splitLine": { "show": false }
  },
  "series": [
    {
      "type": "heatmap",
      "coordinateSystem": "calendar",
      "data": [
        ["2024-06-03", 4],
        ["2024-06-04", 7],
        ["2024-06-05", 2],
        ["2024-06-10", 9],
        ["2024-06-11", 12],
        ["2024-06-14", 5],
        ["2024-06-18", 8],
        ["2024-06-21", 3],
        ["2024-06-25", 10],
        ["2024-06-28", 6]
      ]
    }
  ]
}
```

## Key options

Calendar component (top-level `calendar`):

- `range` (required, no default) — the time window; see formats above. Omitting it throws and nothing renders.
- `cellSize` = `20` — cell width/height in px; `['auto', 20]` stretches width to fill the component while fixing height. `'auto'` for both fills the `width`/`height` box.
- `orient` = `'horizontal'` — weeks flow left-to-right; `'vertical'` stacks them downward (better for mobile).
- `dayLabel.firstDay` = `0` (Sunday) — first column's weekday; `1` starts weeks on Monday. `dayLabel.nameMap` takes a locale string (`'en'`) or a 7-string array starting at Sunday.
- `monthLabel.show` = `true`, `nameMap`/`formatter` for localization; `yearLabel.show` = `true` (rendered large at the side — usually turned off for single-month views).
- `itemStyle` — the empty-cell look: `color` = `'#fff'`, `borderColor` = `'#ccc'`, `borderWidth` = `1`.
- `splitLine.show` = `true` — the heavier outline drawn around each month block.
- `left` = `80`, `top` = `60` — generous defaults; tighten them or the grid looks off-center.

Heatmap series on calendar:

- `coordinateSystem` — **must be `'calendar'`**; the default is `'cartesian2d'`.
- `calendarIndex` = `0` — which calendar to plot on when there are several.
- `label.show` = `false` — enable with a `formatter` to print the day number or value in each cell.

## Gotchas

- **Blank chart: heatmap defaults to `coordinateSystem: 'cartesian2d'`.** Without `coordinateSystem: 'calendar'` on the series, ECharts looks for xAxis/yAxis that do not exist and renders nothing (or throws). This is the number-one calendar mistake.
- **Blank/invisible cells: no `visualMap`.** Calendar-heatmap cells get their fill color from a `visualMap` component mapping the value dimension; without one, cells have no color and the grid looks empty. Always add `visualMap` with `min`/`max` spanning your data.
- **Missing `range` throws.** `calendar.range` is required with no default; the component cannot lay out cells for an unspecified window.
- **Data outside `range` is silently dropped.** Rows dated before/after the range simply do not render — no warning. If "half my data is missing", check the range bounds first (remember `['2024-01', '2024-02']` means Jan 1 to Feb 1, not through end of February).
- **Wrong data shape.** Each datum is a `[date, value]` array (or `{value: [date, value]}`); passing `{date: ..., count: ...}` objects or bare numbers plots nothing. Date strings like `'2024-06-03'` are safest.
- **Year view overflows the container.** A full year at the default `cellSize: 20` is ~1100 px wide. Use `cellSize: ['auto', 16]` with explicit `left`/`right`, or `orient: 'vertical'`, so the grid fits instead of clipping.
- **`visualMap` covers the calendar.** Both default to overlapping positions in small containers; pin the visualMap (`top: 0, left: 'center'` or `orient: 'vertical', right: 0`) and push `calendar.top` down to make room.
- **Empty days are not zero days.** Days with no datum show the calendar `itemStyle` background, not the visualMap color for 0. If you want a true zero color, emit `[date, 0]` rows for every day.
