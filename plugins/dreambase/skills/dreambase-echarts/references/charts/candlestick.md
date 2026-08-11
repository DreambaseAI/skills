# candlestick — open/close/low/high price movement per period (OHLC boxes)

## When to use

- Financial or market-style time series where each period has four values: open, close, lowest, highest (stocks, crypto, energy prices).
- Any per-period range-with-direction data (e.g. daily min/max temperature with start/end readings) where the up/down coloring carries meaning.
- Do NOT use for a single value per period — use `line` or `bar` instead; a candlestick with fabricated open/close values misleads.
- Do NOT use for showing distribution/quartiles — that is `boxplot` (5 values, different semantics), not candlestick.

## Data schema

Each data item is a 4-tuple in **ECharts order (OCLH)**:

```
[open, close, lowest, highest]
```

This differs from the OHLC order many libraries and data feeds use. If your source rows are `[open, high, low, close]`, do NOT reorder the arrays by hand — remap with `encode`:

```json
{ "type": "candlestick", "encode": { "x": 0, "y": [1, 4, 3, 2] } }
```

(there, source columns are `[date, open, high, low, close]` and `encode.y` maps them into OCLH).

Items may also be objects for per-item styling: `{ "value": [open, close, lowest, highest], "itemStyle": { ... } }`.

The x axis must be `type: "category"` with `data` holding the period labels (dates), aligned 1:1 with the series data. Direction is derived from the tuple: close >= open renders as bullish (`color`), close < open as bearish (`color0`).

## Working example

```json
{
  "tooltip": {
    "trigger": "axis",
    "axisPointer": { "type": "cross" }
  },
  "legend": { "data": ["Daily", "MA5"] },
  "grid": { "left": 60, "right": 20, "bottom": 60 },
  "xAxis": {
    "type": "category",
    "data": ["2026-07-06", "2026-07-07", "2026-07-08", "2026-07-09", "2026-07-10", "2026-07-13"],
    "boundaryGap": true
  },
  "yAxis": {
    "type": "value",
    "scale": true,
    "splitArea": { "show": true }
  },
  "dataZoom": [
    { "type": "inside", "start": 0, "end": 100 },
    { "type": "slider", "start": 0, "end": 100, "bottom": 10 }
  ],
  "series": [
    {
      "name": "Daily",
      "type": "candlestick",
      "data": [
        [212.4, 218.1, 211.7, 219.3],
        [218.1, 215.6, 213.9, 220.0],
        [215.6, 221.8, 215.2, 222.5],
        [221.8, 224.4, 220.9, 226.1],
        [224.4, 219.7, 218.3, 225.0],
        [219.7, 223.2, 219.1, 224.8]
      ],
      "itemStyle": {
        "color": "#ef4444",
        "color0": "#22c55e",
        "borderColor": "#ef4444",
        "borderColor0": "#22c55e"
      }
    },
    {
      "name": "MA5",
      "type": "line",
      "data": [null, null, null, null, 218.42, 220.94],
      "smooth": true,
      "showSymbol": false,
      "lineStyle": { "width": 1.5, "opacity": 0.8 }
    }
  ]
}
```

## Key options

- `itemStyle.color` = `#eb5454` — fill of **bullish** (close >= open) candles; `itemStyle.color0` = `#47b262` — fill of bearish candles.
- `itemStyle.borderColor` = `#eb5454` / `itemStyle.borderColor0` = `#47b262` — candle and wick outline for bullish/bearish; set these together with `color`/`color0` or wicks keep the default colors.
- `yAxis.scale` = `false` (axis option, not series) — set `true` so the value axis does not start at 0; prices clustered around e.g. 220 render as invisible slivers otherwise.
- `barWidth` (auto) / `barMinWidth` / `barMaxWidth` — candle body width; useful to cap width when only a few periods are shown.
- `encode` — remap dataset/data columns to `x` and the four `y` dimensions; the only safe way to consume OHLC-ordered sources.
- `large` = `true`, `largeThreshold` = `600`, `progressive` = `3000` — built-in large-dataset optimizations; leave at defaults.
- `markLine` / `markPoint` — annotate support/resistance levels or extremes declaratively.
- `dataZoom` (top-level) — pair `{"type":"inside"}` (wheel/drag zoom) with `{"type":"slider"}` for long histories; give both the same `start`/`end`.

## Gotchas

- **Wrong tuple order silently renders a wrong chart.** `[open, high, low, close]` data fed as-is produces candles with inverted bodies and impossible wicks — no error is thrown because the numbers are still valid. Always confirm OCLH or use `encode.y`.
- **Blank chart with numeric-looking x values:** if `xAxis.type` is `"value"` (or omitted with numeric labels), candlestick has no category to place bodies on and draws nothing usable. Use `xAxis: { type: "category", data: [...] }`.
- **Candles look flat/invisible:** default `yAxis` starts at 0; for prices in a narrow band the whole series compresses into a few pixels. Set `yAxis.scale: true`.
- **Green/red mean the opposite in some markets.** ECharts defaults are red = bullish, green = bearish (Chinese market convention). For Western audiences swap: `color`/`borderColor` green, `color0`/`borderColor0` red — and change all four, not just the fills.
- **Setting only `itemStyle.color` recolors half the candles.** Bearish candles read `color0`/`borderColor0`; forgetting them leaves a mixed default/custom palette.
- **Volume bars belong in a second grid, not the price axis.** Volume magnitudes (millions) crush the price scale. Use two `grid` entries, two `xAxis`/`yAxis` pairs (`gridIndex: 1` on the second), a bar series with `xAxisIndex: 1, yAxisIndex: 1`, and put both x-axis indexes in `dataZoom.xAxisIndex: [0, 1]` so zooming stays in sync.
- **MA overlays must align by index.** A moving-average `line` series shares the category axis, so pad its head with `null` for the periods before the window fills; shifting instead of padding plots the MA against the wrong dates.
