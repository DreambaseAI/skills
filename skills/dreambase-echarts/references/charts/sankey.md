# sankey — flow volumes between stages, where link width encodes quantity

## When to use

- Show how a quantity splits and merges as it moves through stages: funnels with drop-off, budget allocation, energy/traffic flow, user journeys.
- Best when there is a clear directional flow and the *magnitude* of each path matters more than exact values.
- Do NOT use for cyclic relationships — sankey requires an acyclic graph and throws on cycles; use `graph` instead.
- For a simple single-path conversion funnel with no branching, prefer the `funnel` series or a bar chart; a sankey with one path per stage adds noise without information.

## Data schema

Sankey needs BOTH `data` (the nodes) and `links` (the flows). Links reference nodes by their `name` string, not by index. Every `source`/`target` string must exactly match a `name` in `data`.

```json
{
  "data": [
    { "name": "Visits" },                 // name is the node id — required, must be unique
    { "name": "Paid", "depth": 3 },       // depth (optional) pins the node to a layout column
    { "name": "Other",
      "itemStyle": { "color": "#999" } }  // per-node style (optional)
  ],
  "links": [
    {
      "source": "Visits",                 // must match a data[].name exactly (case-sensitive)
      "target": "Paid",                   // same — a typo here throws or drops the flow
      "value": 400                        // required number; drives link width and node height
    }
  ]
}
```

`nodes`/`edges` are accepted aliases for `data`/`links`. Node `value` is normally omitted — ECharts derives it from the sum of connected link values.

## Working example

```json
{
  "tooltip": { "trigger": "item", "triggerOn": "mousemove" },
  "series": [
    {
      "type": "sankey",
      "emphasis": { "focus": "adjacency" },
      "nodeAlign": "justify",
      "lineStyle": { "color": "gradient", "curveness": 0.5 },
      "data": [
        { "name": "Visits" },
        { "name": "Signups" },
        { "name": "Trials" },
        { "name": "Paid" },
        { "name": "Churned" },
        { "name": "Dropped" }
      ],
      "links": [
        { "source": "Visits", "target": "Signups", "value": 400 },
        { "source": "Visits", "target": "Dropped", "value": 600 },
        { "source": "Signups", "target": "Trials", "value": 250 },
        { "source": "Signups", "target": "Dropped", "value": 150 },
        { "source": "Trials", "target": "Paid", "value": 180 },
        { "source": "Trials", "target": "Churned", "value": 70 }
      ]
    }
  ]
}
```

## Key options

- `nodeWidth = 20` — pixel width of each node rectangle.
- `nodeGap = 8` — vertical gap between nodes in the same column.
- `nodeAlign = 'justify'` — column placement: `'justify'` spreads columns edge to edge; `'left'`/`'right'` pack nodes toward one side (use `'left'` when sink depths vary).
- `orient = 'horizontal'` — flow direction; `'vertical'` flows top to bottom (swap label position to `'top'` when you use it).
- `layoutIterations = 32` — relaxation passes to reduce link crossings; set `0` to keep nodes in `data` order.
- `lineStyle.color = '#314656'`, `opacity = 0.2` — link color; `'gradient'` blends source node color into target node color and is almost always what you want.
- `lineStyle.curveness = 0.5` — link curvature.
- `label.show = true`, `position = 'right'` — node labels; default color is `'#fff'`, so set `label.color` on light backgrounds.
- `emphasis.focus = 'none'` — set `'adjacency'` to dim everything except the hovered node's flows.
- `draggable = true` — users can drag nodes; set `false` for static dashboards.
- `right = '20%'` — default series margin reserves room for last-column labels; tighten if labels are short.
- `levels` — per-depth styling (array of `{ depth, itemStyle, lineStyle }`), handy to color whole columns.

## Gotchas

- **Cycles throw.** `A -> B -> A` (or any longer loop) makes the layout throw `Sankey is a DAG...` and the chart renders blank. Deduplicate or break cycles before building links; for genuinely cyclic data use `graph`.
- **A link naming a nonexistent node breaks the chart.** `source`/`target` are matched against `data[].name` exactly (case- and whitespace-sensitive). A typo means the graph model can't resolve the edge — nothing renders. Build the node list from the link list programmatically to guarantee agreement.
- **Missing `links` = blank chart.** Sankey has no layout without flows; `data` alone renders nothing. Both arrays are mandatory.
- **Duplicate node names collapse into one node.** Node identity is the name string. Two stages that share a label (e.g. "Other" at two depths) must get distinct names (`"Other (mid)"`, `"Other (end)"`) or their flows merge; use `label.formatter` to display a clean name.
- **Zero or negative link values break the layout.** Node heights are proportional to summed link values; a 0-value link can render invisibly and negatives corrupt the geometry. Filter links to `value > 0`.
- **White labels vanish on white backgrounds.** The default `label.color` is `'#fff'` with `position: 'right'` (outside the node). On a light host theme set `label: { color: "#333" }` explicitly.
- **Tooltip on links shows `source > target : value` only when `value` is set.** Omit link values and hover output is meaningless — always provide them.
