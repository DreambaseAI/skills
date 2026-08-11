# graph — nodes and edges of a network/relationship structure

## When to use

- Show relationships without inherent hierarchy or direction constraints: dependency maps, social networks, service topologies, entity relationships.
- Handles cycles fine — this is the fallback when `sankey` (DAG-only) or `tree` (strict hierarchy) reject the data.
- Do NOT use for strict parent-child hierarchies — `tree` gives a cleaner, deterministic layout.
- Do NOT use for flow magnitudes between stages — `sankey` encodes quantity in link width; graph edges are all the same width unless styled per-link.

## Data schema

`data` holds nodes; `links` holds edges. Link `source`/`target` may be a node `name` string or a numeric index into `data` — prefer names.

```json
{
  "categories": [
    { "name": "Service" },              // category names double as legend entries
    { "name": "Database" }
  ],
  "data": [
    {
      "name": "api",                    // node id — unique; also the label text
      "value": 120,                     // shown in tooltip; not used for sizing
      "category": 0,                    // index into categories[] — controls color + legend
      "symbolSize": 40,                 // per-node size in px; NOT derived from value
      "x": 100, "y": 200                // required ONLY when layout: "none"
    }
  ],
  "links": [
    {
      "source": "api",                  // node name (or numeric index into data)
      "target": "postgres",
      "value": 30,                      // optional; tooltip + force edge weight
      "lineStyle": { "width": 3 }       // per-edge style (optional)
    }
  ]
}
```

`nodes`/`edges` are accepted aliases for `data`/`links`.

## Working example

```json
{
  "tooltip": { "trigger": "item" },
  "legend": { "data": ["Service", "Database", "Queue"] },
  "series": [
    {
      "type": "graph",
      "name": "Dependencies",
      "layout": "force",
      "roam": true,
      "draggable": true,
      "label": { "show": true, "position": "right" },
      "edgeSymbol": ["none", "arrow"],
      "edgeSymbolSize": 8,
      "force": { "repulsion": 200, "edgeLength": 80, "gravity": 0.1 },
      "emphasis": { "focus": "adjacency" },
      "categories": [
        { "name": "Service" },
        { "name": "Database" },
        { "name": "Queue" }
      ],
      "data": [
        { "name": "api", "category": 0, "symbolSize": 40, "value": 120 },
        { "name": "auth", "category": 0, "symbolSize": 30, "value": 45 },
        { "name": "worker", "category": 0, "symbolSize": 25, "value": 30 },
        { "name": "postgres", "category": 1, "symbolSize": 35, "value": 80 },
        { "name": "redis", "category": 2, "symbolSize": 20, "value": 25 }
      ],
      "links": [
        { "source": "api", "target": "auth" },
        { "source": "api", "target": "postgres" },
        { "source": "auth", "target": "postgres" },
        { "source": "api", "target": "redis" },
        { "source": "redis", "target": "worker" },
        { "source": "worker", "target": "postgres" }
      ]
    }
  ]
}
```

## Key options

- `layout = 'none'` — `'force'` (physics simulation), `'circular'` (ring), or `'none'` (you supply `x`/`y` per node). The default is `'none'`, so an option without explicit layout and without coordinates renders nothing visible.
- `force.repulsion = 50` — node repulsion strength; raise (150–300) for labeled nodes so they don't overlap.
- `force.edgeLength = 30` — target edge length in px; raise for readable spacing.
- `force.gravity = 0.1` — pull toward center; raise to keep disconnected components from drifting off-canvas.
- `circular.rotateLabel = false` — rotate labels along the ring in circular layout.
- `edgeSymbol = ['none', 'none']` — `[sourceEnd, targetEnd]`; use `['none', 'arrow']` for directed graphs. `edgeSymbolSize = 10`.
- `label.show = false` — node names are hidden by default; set `show: true, position: 'right'` (default position is `'inside'`, unreadable on small symbols).
- `symbolSize` — per-series or per-node pixel size; there is no automatic value-to-size mapping, compute it yourself.
- `roam = false` — enable `true` for pan + zoom on dense graphs; `draggable = false` — `true` lets users reposition nodes (force layout only).
- `emphasis.focus = 'none'` — `'adjacency'` dims all but the hovered node's neighbors.
- `lineStyle.color = '#aaa'`, `width = 1`, `curveness = 0` — set `curveness > 0` (or `autoCurveness: true`) so parallel/reciprocal edges don't overlap into one line.
- `categories` — array of `{ name, itemStyle, symbol }`; node `category` is an index into it.

## Gotchas

- **Default layout is `'none'`, not force.** Omit `layout` and omit node `x`/`y`, and every node lacks a position — the chart is blank with no error. Always set `layout: "force"` or `"circular"` unless you provide coordinates.
- **Legend requires matching names in two places.** The legend toggles categories only when `legend.data` entries equal `categories[].name` exactly. A graph series is not automatically added to the legend by series `name` — no `categories` means no legend interaction.
- **`category` is an index, not a name.** `"category": "Database"` silently fails to color the node; use the numeric position in `categories[]`.
- **Node `value` does not size nodes.** Unlike some libraries, sizing comes only from `symbolSize`. Map value to size yourself (e.g. sqrt scale) or all nodes render at the same default size.
- **Reciprocal edges overlap.** With `curveness: 0` (default), `A->B` and `B->A` draw on the same straight line and look like one undirected edge. Set `lineStyle.curveness: 0.2` or `autoCurveness: true`.
- **Duplicate node names corrupt edge resolution.** Links resolve string endpoints by name; duplicates make edges attach to the wrong node. Keep names unique (use ids as names, pretty text via `label.formatter`).
- **Force layout is nondeterministic.** Node positions differ per render. For stable/reproducible layouts use `layout: "circular"` or precompute `x`/`y` with `layout: "none"`.
- **Large graphs (500+ nodes) crawl under force layout.** Reduce `force.layoutAnimation` work by precomputing positions, or lower iteration cost with fewer labels and `silent: true`.
