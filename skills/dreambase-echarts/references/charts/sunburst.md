# sunburst — hierarchical part-to-whole as concentric rings, one ring per depth

## When to use

- Show a hierarchy where the radial position encodes depth and arc angle encodes share of the parent (category → subcategory → product breakdowns, file trees, taxonomy sizes).
- Good for 2-4 levels with modest node counts per ring; the center-out shape makes "which branch dominates" instantly readable.
- NOT for deep or wide trees (5+ levels or hundreds of leaves) — arcs become slivers and labels collide; prefer `treemap`, which uses area far more efficiently.
- NOT for a single flat level — that is just a `pie`. If precise sibling comparison matters, prefer a sorted `bar`.

## Data schema

Same recursive tree as treemap: nodes of `{name, value, children}`. Leaves need a numeric `value`; a branch's `value` is optional and defaults to the sum of its children. There is no separate "root" object — `data` is the array of top-level branches, and the chart's blank center circle is the implicit root (clicking a node zooms it to center when `nodeClick: 'rootToNode'`).

```json
{
  "series": [{
    "type": "sunburst",
    "data": [
      {
        "name": "branch",
        "children": [
          { "name": "leaf-a", "value": 320 },
          { "name": "leaf-b", "value": 180 }
        ]
      },
      { "name": "flat-leaf", "value": 120 }
    ]
  }]
}
```

## Working example

```json
{
  "tooltip": {
    "trigger": "item",
    "formatter": "{b}: {c}"
  },
  "series": [
    {
      "type": "sunburst",
      "name": "Revenue",
      "radius": ["15%", "85%"],
      "sort": "desc",
      "nodeClick": "rootToNode",
      "label": { "rotate": "radial", "minAngle": 8 },
      "levels": [
        {},
        { "radius": ["15%", "45%"], "label": { "rotate": "tangential" } },
        { "radius": ["45%", "78%"], "label": { "rotate": "radial" } },
        { "radius": ["78%", "85%"], "label": { "position": "outside", "silent": false }, "itemStyle": { "borderWidth": 2 } }
      ],
      "data": [
        {
          "name": "Hardware",
          "children": [
            {
              "name": "Laptops",
              "children": [
                { "name": "Pro", "value": 320 },
                { "name": "Air", "value": 180 }
              ]
            },
            { "name": "Phones", "value": 410 }
          ]
        },
        {
          "name": "Services",
          "children": [
            { "name": "Cloud", "value": 290 },
            { "name": "Support", "value": 120 }
          ]
        }
      ]
    }
  ]
}
```

## Key options

- `radius` = `[0, '75%']` — inner and outer bound of the whole chart. A nonzero inner radius (e.g. `'15%'`) reserves a center circle used as the "back to parent" button after zooming.
- `center` = `['50%', '50%']` — chart position in the container.
- `levels` (unset) — per-ring config; **entry 0 styles the center (root), entry 1 the first data ring**. Each entry can set `radius: [inner, outer]` to control ring thickness plus `label`/`itemStyle` per depth.
- `label.rotate` = `'radial'` — label orientation: `'radial'` (along the radius), `'tangential'` (along the arc), or a number from -90 to 90 degrees (0 = horizontal).
- `label.minAngle` (unset) — hide labels on arcs narrower than this many degrees; the main defense against label soup on thin slices.
- `nodeClick` = `'rootToNode'` — click zooms the clicked node to the center; `false` disables, `'link'` follows `data[i].link`.
- `sort` = `'desc'` — sibling arc ordering by value; `'asc'` or `null` (insertion order) also valid.
- `startAngle` = `90`, `clockwise` = `true` — where the first arc starts and layout direction.
- `itemStyle.borderColor` = `'white'`, `borderWidth` = `1` — the seams between arcs that make rings readable.
- `emphasis.focus` = `'none'` — set `'ancestor'` or `'descendant'` to fade unrelated arcs on hover, which is the interaction sunburst is best at.

## Gotchas

- **Blank chart when leaves lack `value`.** Arc angle is proportional to value; leaves without a numeric `value` contribute zero angle and the whole branch collapses to nothing. Branches may omit `value`, leaves may not.
- **A branch `value` smaller than its children's sum breaks angles.** If you set `value` on a parent, ECharts uses it as the parent's total; children overflow or clip oddly. Either omit branch values or make them >= the children's sum.
- **`levels[0]` is the root, not the first ring.** Off-by-one is the classic mistake: styling `levels[0]` and seeing "nothing change" happens because entry 0 targets the invisible center. Put a `{}` placeholder first, then style rings from index 1.
- **Labels vanish on thin arcs — by design.** Sunburst hides labels that do not fit; it is not a data bug. Use `label.minAngle`, shorter `formatter`, `label.rotate: 'tangential'` on thick inner rings, or `position: 'outside'` on the leaf ring.
- **Everything crowds the outer edge.** Without per-level `radius` in `levels`, ECharts divides the radius evenly across depths; unbalanced trees (one deep branch) make all other rings thin. Set explicit `radius` bands per level.
- **Users "lose" the chart after clicking.** `nodeClick: 'rootToNode'` zooms into the clicked subtree; the way back is clicking the center circle — which does not exist if inner radius is `0`. Keep a nonzero inner radius, or set `nodeClick: false` for static dashboards.
- **No `breadcrumb` here.** Unlike treemap, sunburst has no breadcrumb component; copying one over from a treemap config is silently ignored.
