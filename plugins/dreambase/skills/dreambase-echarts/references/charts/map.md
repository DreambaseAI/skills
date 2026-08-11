# map — values shaded onto geographic regions (choropleth) or points placed on a base map

## When to use

- One numeric value per geographic region (states, countries, provinces): a choropleth via `series-map` + `visualMap`.
- Point/bubble data at lat-lng coordinates: a `geo` component as the base map plus `scatter`/`effectScatter` with `coordinateSystem: "geo"`.
- Do NOT use when geography adds nothing (e.g. 5 regions where a sorted `bar` compares values far more precisely) — region area distorts perceived magnitude.
- Do NOT use for dense point-in-time flows or routes without a geo basemap need — consider `lines` series or a plain scatter.

## Data schema

**Hard contract: the config alone cannot load geo data.** The host app must call `echarts.registerMap('<name>', { geoJSON })` (or `{ svg }`) BEFORE `setOption` runs with `map: '<name>'`. The option only references a registered name; if nothing is registered under that exact name, the map area renders blank with no error in the chart itself. In this host (echarts-for-react) that registration happens in app code — the chart option you write must use a map name the host has registered (ask/verify the name; do not invent one).

Choropleth data items are objects matched **by name** against the registered GeoJSON features:

```json
{ "name": "California", "value": 38965193 }
```

- `name` must exactly equal the value of each GeoJSON feature's `properties.name` (case-sensitive, whitespace-sensitive).
- If the GeoJSON keys regions under a different property (e.g. `properties.NAME` or `properties.ST_NM`), set `nameProperty: "NAME"` on the series/geo.
- If your data's names differ from the GeoJSON's (e.g. "USA" vs "United States"), map them with `nameMap: { "United States": "USA" }` (GeoJSON name → data name).
- Regions with no matching data item render in the default `itemStyle.areaColor` (`#eee`), not zero-colored.

For bubble maps, scatter data is `{ "name": "...", "value": [lng, lat, size] }` — **longitude first**, then latitude, then any measure dimensions.

## Working example

Assumes the host has registered a US states GeoJSON as `"USA"`.

```json
{
  "tooltip": {
    "trigger": "item",
    "formatter": "{b}: {c}"
  },
  "visualMap": {
    "min": 0,
    "max": 40000000,
    "left": "left",
    "bottom": 10,
    "text": ["High", "Low"],
    "calculable": true,
    "inRange": { "color": ["#dbeafe", "#3b82f6", "#1e3a8a"] }
  },
  "series": [
    {
      "name": "Population",
      "type": "map",
      "map": "USA",
      "roam": true,
      "emphasis": { "label": { "show": true } },
      "data": [
        { "name": "California", "value": 38965193 },
        { "name": "Texas", "value": 30503301 },
        { "name": "Florida", "value": 22610726 },
        { "name": "New York", "value": 19571216 },
        { "name": "Alaska", "value": 733406 }
      ]
    }
  ]
}
```

## Key options

- `map` = `''` — the registered map name; must match an `echarts.registerMap` call in the host exactly.
- `roam` = `false` — enable `true` for pan+zoom, or `'scale'` / `'move'` to allow only one.
- `zoom` = `1`, `center` — initial viewport; `scaleLimit.min`/`max` caps roam zoom.
- `nameProperty` = `'name'` — which GeoJSON `properties` key identifies a region.
- `nameMap` — object translating GeoJSON region names to your data's names.
- `label.show` = `false` — region name labels; usually enable only under `emphasis`.
- `itemStyle.areaColor` = `'#eee'` — fill for regions without data / outside visualMap.
- `selectedMode` = `false` — set `'single'`/`'multiple'` to make regions clickable-selectable.
- `mapValueCalculation` = `'sum'` — how multiple series on the same map merge values (`'average'`, `'max'`, `'min'`).
- `geoIndex` = `0` — set when reusing a top-level `geo` component instead of the series' own map layout (series geometry options like `zoom`/`center`/`layoutCenter` are then ignored in favor of the geo's).
- `aspectScale` = `0.75` — legacy x/y scaling; leave alone unless the map looks squashed, prefer `projection` for correctness.
- visualMap (top-level): `min`/`max` have **no defaults** — always set them to your data's range; `calculable: true` adds the draggable range handles.

## Gotchas

- **Blank map, zero console errors in the option layer:** `map: 'usa'` when the host registered `'USA'` (or registered nothing). The name is an exact string key into the registry; verify the registered name before writing the option. Registration must complete before the option is applied — a GeoJSON fetch that resolves after render leaves the first paint empty.
- **All regions gray despite data:** data `name`s don't match GeoJSON feature names ("New York" vs "New York State", trailing spaces, different language). Unmatched items are silently dropped. Fix with `nameMap` or `nameProperty` — never by guessing new name spellings blindly; inspect the GeoJSON `properties`.
- **Everything renders one flat color:** `visualMap.min`/`max` missing or wrong scale (e.g. max 100 for values in millions) clamps all values to one end of the ramp. Set `min`/`max` from the actual data extent.
- **Bubble map points pile up at one spot or off-map:** coordinates given as `[lat, lng]` instead of ECharts' `[lng, lat]`, or the scatter series is missing `coordinateSystem: "geo"` (without it, scatter looks for a cartesian grid and renders nothing sensible over the map).
- **Choropleth + bubbles fight over layout:** when combining, declare one top-level `geo` component as the base; give the `map` series `geoIndex: 0` and the scatter `coordinateSystem: "geo"` so both share the same projection, zoom, and roam state instead of drifting apart.
- **World map shows values on the wrong country:** many world GeoJSONs use localized or short names ("Korea" vs "South Korea"). Same silent-drop behavior as above — reconcile with `nameMap`.
- **Do not attach event listeners** (click-to-drill, etc.) in the option or suggest `chart.on(...)` — this host renders options declaratively through echarts-for-react; interactivity beyond `roam`/`selectedMode`/tooltip is the host's concern.
