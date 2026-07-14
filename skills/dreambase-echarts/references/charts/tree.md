# tree — a strict hierarchy drawn as a node-link diagram

## When to use

- Show parent-child structure where the *shape* of the hierarchy matters: org charts, file systems, taxonomies, decision trees.
- Use `layout: "radial"` when the tree is wide and shallow — it packs many leaves into a circle.
- Do NOT use when node *values* (sizes) are the point — `treemap` or `sunburst` encode value as area; tree only shows structure.
- Do NOT use for graphs with shared children or cycles — a node can appear under exactly one parent; use `graph` for anything non-tree-shaped.

## Data schema

`data` is an array containing ONE root object (or a few roots), each nesting `children` recursively. This is different from sankey/graph — there is no flat `links` array; structure lives entirely in nesting.

```json
{
  "data": [
    {
      "name": "Company",                 // label + tooltip name — required
      "children": [                      // recursion happens here
        {
          "name": "Engineering",
          "collapsed": false,            // optional: start this branch expanded/collapsed
          "children": [
            { "name": "Platform", "value": 12 }   // leaf: no children; value is tooltip-only
          ]
        },
        { "name": "Ops", "value": 4 }
      ]
    }
  ]
}
```

Wrap the root in an array — `"data": { ... }` (a bare object) does not render. `value` is optional and only surfaces in tooltips/labels; it does not size nodes.

## Working example

```json
{
  "tooltip": { "trigger": "item", "triggerOn": "mousemove" },
  "series": [
    {
      "type": "tree",
      "layout": "orthogonal",
      "orient": "LR",
      "symbolSize": 8,
      "initialTreeDepth": -1,
      "expandAndCollapse": true,
      "label": { "position": "left", "verticalAlign": "middle", "align": "right" },
      "leaves": {
        "label": { "position": "right", "verticalAlign": "middle", "align": "left" }
      },
      "emphasis": { "focus": "descendant" },
      "data": [
        {
          "name": "Company",
          "children": [
            {
              "name": "Engineering",
              "children": [
                { "name": "Platform", "value": 12 },
                { "name": "Frontend", "value": 8 },
                { "name": "Data", "value": 5 }
              ]
            },
            {
              "name": "Sales",
              "children": [
                { "name": "AMER", "value": 10 },
                { "name": "EMEA", "value": 6 }
              ]
            },
            { "name": "Ops", "value": 4 }
          ]
        }
      ]
    }
  ]
}
```

## Key options

- `layout = 'orthogonal'` — rectangular layout; `'radial'` fans branches around the root (ignore `orient` in radial mode).
- `orient = 'LR'` — orthogonal direction: `'LR'`, `'RL'`, `'TB'`, `'BT'`. For `'TB'`/`'BT'` move labels to `position: 'top'`/`'bottom'` or rotate them.
- `initialTreeDepth = 2` — levels expanded on first render (root is level 0); `-1` expands everything. The default of 2 hides deeper levels, which reads as "missing data" if you don't expect it.
- `expandAndCollapse = true` — click toggles subtrees; set `false` for a static diagram.
- `symbol = 'emptyCircle'`, `symbolSize = 7` — node marker; per-node overrides allowed in data items.
- `edgeShape = 'curve'` — `'polyline'` gives right-angle org-chart connectors (orthogonal layout only); `edgeForkPosition = '50%'` sets where polylines fork.
- `label` — parent labels; `leaves.label` styles leaf labels separately (the left/right split shown above keeps text out of the drawing).
- `lineStyle.color = '#ccc'`, `width = 1.5`, `curveness = 0.5` — connector styling.
- `emphasis.focus = 'none'` — `'descendant'`, `'ancestor'`, or `'relative'` highlight lineage on hover.
- `roam = false` — enable for big trees to pan/zoom.
- `left/top/right/bottom = '12%'` — generous default margins; shrink for small trees, but keep room on the label side (`'LR'` needs `right` space for leaf labels).

## Gotchas

- **`data` must be an array wrapping the root.** Passing the root object directly (`"data": {...}`) renders nothing — the series expects `data[0]` to be the root. Multiple roots are allowed as extra array entries.
- **Deep trees look truncated by default.** `initialTreeDepth = 2` collapses everything below level 2; users see dots with no children and assume data is missing. Set `initialTreeDepth: -1` when the full tree should be visible.
- **`value` does not size nodes.** Node size is `symbolSize` only. If leaf magnitude matters, map value to `symbolSize` per node, or switch to `treemap`/`sunburst`.
- **Shared child objects render twice, cycles hang layout.** Each node must have exactly one parent; reusing the same subtree under two parents duplicates it visually, and a parent reference cycle never terminates. Deduplicate to a strict tree or use `graph`.
- **Labels get clipped at container edges.** Leaf labels render outside nodes (`position: 'right'` in LR); with tight margins the last column of text is cut off. Keep `right` (or the appropriate side) at ~12% or set explicit `width`.
- **Radial layout + `orient` confusion.** `orient` only applies to `layout: 'orthogonal'`; setting it with radial does nothing — if the tree "ignores" orientation, check `layout`.
- **Collapse state lives in data.** `collapsed: true` on a node overrides `initialTreeDepth` for that branch; a stray `collapsed` flag from upstream data silently hides a subtree.
