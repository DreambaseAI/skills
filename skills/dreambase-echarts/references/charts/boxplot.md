# boxplot — distribution summaries (five-number: min, Q1, median, Q3, max) per category

## When to use

- Comparing the spread/skew of a numeric measure across categories: latency per day, scores per cohort, response times per endpoint.
- Showing variability when a bar of means would hide the distribution.
- Do NOT use when you only have one value per category — that is a bar chart; a boxplot needs a computed five-number summary.
- Do NOT hand ECharts raw observations — ECharts does NOT compute quartiles from raw data in the option. Pre-compute the five-number tuples yourself (or use the `dataTool.prepareBoxplotData` extension outside the option); otherwise prefer a scatter/strip plot of the raw points.

## Data schema

`data` is an array of five-number tuples, one per category, in this EXACT order:

```json
"data": [
  [118, 142, 165, 190, 236],
  [125, 150, 172, 204, 255]
]
```

- Tuple order is `[min, Q1, median, Q3, max]` — low to high. These are pre-computed statistics, not raw samples.
- The Nth tuple pairs with the Nth entry of the category axis `data` (index alignment). With a category `xAxis`, boxes are vertical; put the category axis on `yAxis` for horizontal boxes (`layout` is inferred from which axis is `'category'`).
- The object form `{ "name": "Mon", "value": [118, 142, 165, 190, 236] }` is also valid and enables per-item `itemStyle`.
- Outliers are NOT part of the boxplot series. Add a companion `scatter` series on the same axes whose data points are `[categoryIndex, value]` pairs (or `[categoryName, value]`); the whiskers you pass should already exclude those outliers (e.g. 1.5×IQR fences).

## Working example

```json
{
  "tooltip": { "trigger": "item" },
  "grid": { "left": "10%", "right": "10%", "bottom": "15%" },
  "xAxis": { "type": "category", "data": ["Mon", "Tue", "Wed", "Thu", "Fri"], "boundaryGap": true, "name": "Day" },
  "yAxis": { "type": "value", "name": "Latency (ms)", "scale": true },
  "series": [
    {
      "name": "API latency",
      "type": "boxplot",
      "boxWidth": [7, 40],
      "itemStyle": { "color": "#c8dcf5", "borderColor": "#4477aa", "borderWidth": 1.5 },
      "tooltip": {
        "formatter": "{b}<br/>min: {@[1]}<br/>Q1: {@[2]}<br/>median: {@[3]}<br/>Q3: {@[4]}<br/>max: {@[5]}"
      },
      "data": [
        [118, 142, 165, 190, 236],
        [125, 150, 172, 204, 255],
        [102, 131, 158, 183, 228],
        [140, 168, 195, 230, 290],
        [110, 138, 160, 186, 232]
      ]
    },
    {
      "name": "Outliers",
      "type": "scatter",
      "symbolSize": 8,
      "itemStyle": { "color": "#cc3311" },
      "data": [[0, 312], [1, 330], [3, 355], [3, 20], [4, 305]]
    }
  ]
}
```

## Key options

- `boxWidth` = [7, 50] — `[minPixels, maxPixels]` for box width; the actual width adapts to band size within these bounds. Tighten the max when categories are few and wide.
- `itemStyle.color` = '#fff', `itemStyle.borderColor` = '#000', `itemStyle.borderWidth` = 1 — box fill and the stroke used for box, whiskers, and median line. The fill is white by default, not the theme color.
- `colorBy` = 'series' — all boxes share one color; use the per-item object form with `itemStyle` to color individual boxes.
- `layout` — `'horizontal'` or `'vertical'`; normally leave it unset and let the category axis position decide.
- `xAxisIndex`/`yAxisIndex` = 0 — set these when the outlier scatter must target non-default axes; both series must reference the SAME axes to align.
- `emphasis.focus` = 'none' — set `'series'` to dim other series on hover when boxplot and scatter overlap.
- yAxis `scale: true` (axis option, not series) — starts the value axis near the data instead of 0, which matters because distributions rarely start at 0.

## Gotchas

- Wrong tuple order (e.g. `[Q1, median, Q3, min, max]`) — ECharts draws whatever geometry the numbers imply: whiskers inside the box, inverted boxes, no error thrown. The chart renders but is statistically wrong. Order is strictly `[min, Q1, median, Q3, max]`, ascending.
- Passing raw observations (20 numbers per category) expecting ECharts to compute quartiles — it treats extra elements as garbage dimensions and draws a malformed box or nothing. Quartiles must be pre-computed before building the option.
- Category axis `data` length differing from series `data` length — tuples align by index, so a missing category label shifts every box under the wrong label, and extra tuples beyond the axis data are dropped silently.
- Using a `value`-type x axis with vertical boxes — boxplot expects a category band to size boxes; on a value axis boxes collapse to near-zero width or stack at 0. Make one axis `"type": "category"`.
- Outlier scatter data given as plain values (`[312, 330, ...]`) instead of `[categoryIndex, value]` pairs — scatter then maps values to category indexes 0..N and points land on the wrong categories (or off-chart). Each outlier needs its category coordinate first.
- Forgetting `scale: true` (or min/max) on the value axis — the axis starts at 0, compressing tightly-grouped boxes into unreadable slivers at the top of the chart.
- Default white fill (`itemStyle.color: '#fff'`) on a white background — boxes look like hollow outlines and can seem "not rendered"; set an explicit fill to match your palette.
