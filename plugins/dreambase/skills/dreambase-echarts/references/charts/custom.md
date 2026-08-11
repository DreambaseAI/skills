# custom — bespoke and illustrative visualizations

The escape hatch from standard chart types: a `custom` series draws whatever `renderItem` returns for each data item, positioned by any coordinate system (cartesian, polar, geo, calendar). This is how ECharts builds range bars, Gantt charts, hexbins, error bars, contours, spiral races, and illustration-style graphics that standard series can't express.

## When to use

- The form doesn't exist as a built-in series: ranges (from–to bars), Gantt/timeline blocks, hexbins, polygons, error bars/whiskers, profile/flame charts, bespoke editorial forms.
- An editorial/data-story piece needs a designed, non-standard visual that still binds to real data and axes.
- Do NOT reach for custom when a built-in + styling gets there — `pictorialBar` covers icon/ISOTYPE-style repetition, `graphic` covers decorative overlays and annotation illustrations, and rich `itemStyle`/`label` covers most "make it beautiful" asks. Custom series cost more to write, review, and maintain.

## How renderItem works

`renderItem(params, api)` is called once per data item and returns a graphic element description (or a `group` of them):

- `api.value(i)` — read dimension i of the current datum.
- `api.coord([x, y])` — convert data values to pixel coordinates in the bound coordinate system.
- `api.size([dx, dy])` — the pixel size spanned by a data-space extent (e.g. bar widths from value ranges).
- `api.style()` — the item's resolved style (respects `itemStyle`, palette, emphasis).
- `params.coordSys` — the coordinate system's pixel bounds; use it to clip (`{ type: 'rect', ... , clipPath }` or manual bounds checks) so marks don't spill outside the grid when zoomed.

Returned element `type`s: `rect`, `circle`, `sector`, `polygon`, `polyline`, `line`, `arc`, `text`, `path` (arbitrary SVG path — the illustrative workhorse), `image`, or `group`.

**Dreambase renderer contract:** `renderItem` is a function — the one series type where a JS-source string is unavoidable in our pure-JSON contract. Emit it as a self-contained function string (no closures over outside variables; everything comes from `params`/`api`), and keep it small.

## Working example — range ("profit") bars

Each datum is `[from, to, value]`; bars span from→to on x and reach value on y — impossible with a standard bar series:

```json
{
  "tooltip": {},
  "xAxis": { "scale": true },
  "yAxis": {},
  "series": [{
    "type": "custom",
    "renderItem": "function (params, api) { var y = api.value(2); var start = api.coord([api.value(0), y]); var size = api.size([api.value(1) - api.value(0), y]); return { type: 'rect', shape: { x: start[0], y: start[1], width: size[0], height: size[1] }, style: api.style() }; }",
    "dimensions": ["from", "to", "profit"],
    "encode": { "x": [0, 1], "y": 2, "tooltip": [0, 1, 2], "itemName": 3 },
    "data": [
      { "value": [10, 16, 3, "A"] },
      { "value": [16, 18, 15, "B"] },
      { "value": [18, 26, 12, "C"] },
      { "value": [26, 32, 22, "D"] }
    ]
  }]
}
```

`encode` matters doubly here: it drives axis extents and tooltip content, since ECharts can't infer meaning from what renderItem draws.

## Key options

- `renderItem` — the render function (JS-source string per the contract).
- `coordinateSystem` = `'cartesian2d'` — also `'polar'`, `'geo'`, `'calendar'`, `'none'` (pure free-form drawing).
- `dimensions` + `encode` — name dimensions and bind them to axes/tooltip; always set both.
- `clip` = `false` — set `true` whenever the chart can zoom, or marks draw outside the grid.
- `itemStyle`, `emphasis` — styling that `api.style()` picks up, so hover states work for free.

## The illustrative toolkit (compose, don't reinvent)

For "creative/designed" visuals, combine three layers:

1. **`custom` series** — bespoke *data-bound* marks (`path` type takes arbitrary SVG path data — draw designed shapes that still scale with values).
2. **`pictorialBar`** — icon/symbol repetition and pictorial bars (`symbol` accepts `image://` URLs and `path://` SVG data; `symbolRepeat: true` gives ISOTYPE-style unit counts, `symbolClip: true` gives partial-fill progress icons).
3. **`graphic` component** — non-data decorative/annotation layers: illustrations, callout art, watermarks, hand-drawn-feel embellishments positioned in pixels or percentages.

Design rule (from `dreambase-visualization-design`): decoration frames, it never encodes — keep the data marks proportionally honest and put the artistry in shape design, color, texture, and the `graphic` layer, not in distorted geometry.

## Study set

Official gallery (echarts.apache.org/examples → "Custom" section): `custom-profit` (range bars), `custom-error-bar` / `custom-error-scatter` (uncertainty whiskers), `custom-gantt-flight`, `custom-hexbin`, `custom-polar-heatmap`, `custom-spiral-race`, `custom-calendar-icon`, `custom-wind`, `custom-cartesian-polygon`, `custom-profile`.

Community collection — `apache/echarts-custom-series` (npm-installable prebuilt custom series; requires the host app to import and register them, so confirm with the renderer before specifying): `barRange`, `lineRange`, `violin`, `contour`, `liquidFill`, `segmentedDoughnut`, `stage`, `wordCloud`.

## Gotchas

- No `dimensions`/`encode` → empty tooltips and wrong axis extents; ECharts can't infer meaning from drawn shapes.
- Series-level `label` is not a documented custom-series option (there's no standard mark to attach it to) — draw value labels as `text` elements inside the renderItem group instead.
- Closures in `renderItem` over outer variables break under the JSON contract — everything must come through `params`/`api`.
- Forgetting clipping → marks bleed outside the grid on dataZoom.
- `api.size()` needs data-space *extents*, not absolute values — `api.size([to - from, h])`, not `api.size([to, h])`.
- Performance: renderItem runs per datum; for >1k items keep the returned group shallow and avoid `path` recalculation of static shapes.
