# Style guide — anatomy, composition, motion

## Where this style comes from

HUD / instrument-panel design is the screen-graphics language of films
like Oblivion, The Martian, and Iron Man:
instrument readouts, dials, tick marks, mono type on black. AI/dev-tool
brands (Linear most visibly, also Vercel, Raycast-adjacent work) fused it
with classic technical illustration — exploded axonometric drawings of
lenses and engines — to say "this software is precision hardware". The
result is cinematic: shallow depth of field, film grain, a single bright
element in a dark frame, like a product photographed in a black studio.

## Family A anatomy — orbital process ring

From outermost to innermost layer:

- **Tick corona**: 100–180 radial ticks just outside or inside the ring
  line, 14–30px long, 1–1.5px wide. Opacity varies with depth. This is the
  signature texture — without it the ring is just a circle.
- **Ring line**: 1–1.5px, ink at ~65% near / ~20% far. Sometimes a second
  concentric ring at 0.6× radius, much fainter, carrying its own sparse
  dot markers.
- **Progress arc**: one bright glowing segment, 30–70° of sweep, marking
  "where the process is now". Its leading end meets the active node.
- **Nodes**: 3–7 stage markers on the ring (see recipes §3). Exactly one
  is active/glowing.
- **Labels**: primary = stage names at nodes, horizontal. Secondary =
  category names ("LOOP TRIGGER", "BUG TRIAGE") rotated along the ring's
  inside, dimmer, wider tracking. Far-side labels get the DOF blur.
- **Interior dot field** (optional): a sparse grid of 1px dots suggesting
  a data surface inside the ring, ≤15% opacity.
- **Atmosphere**: grain over everything; optional faint light shaft
  crossing the ellipse; vignette toward corners.

Composition: the ring bleeds off at least one edge of the frame at larger
sizes — cropping it is what makes it feel photographed rather than
diagrammed. Put the active node + arc in the upper third when the diagram
accompanies copy. Multiple rings can nest/offset to suggest a system of
loops (keep secondary rings far dimmer).

## Family B anatomy — cel-shaded machinery

- **Subject**: invented-but-plausible hardware. Map the product concept to
  a mechanism: pipeline → turbine stages; model/agent → lens assembly
  (input glass → processing barrel → output mount); infra → engine block.
- **Values**: ground `#1F1D1B`; three steels (see tokens); rim `#F6D9BC`;
  red accents. Nothing else. The shadow side of the object merges into the
  ground — silhouette dissolving into black is desirable.
- **Rim light**: the single most identifying feature. Thin peach slivers
  along lit edges, covering maybe 2–5% of the object's area. It should
  look like one softbox top-left.
- **Red accents**: a dashed tick ring near the "lens" opening, calibration
  marks on a ruler strip, at most one hot-red active mark. Red never fills
  a large shape.
- **Props**: a ruler/tick-strip slider floating in a lower corner grounds
  the scene as an instrument panel. Small mono labels with hairline
  leaders ("STAGE 02", "INTAKE") are optional; keep ≤4 per scene.

Composition: object on a strong diagonal (30–45°), centered mass but
asymmetric detail. Exploded views read best moving from lower-left
(smallest part) to upper-right (housing), gaps widening along the axis.
Leave 20%+ pure ground on at least two sides.

## Family C anatomy — holographic mesh scene

The third reference set (phosphor-green wireframe donuts over dashboard
decks) composes three layers:

- **The mesh object**: an extruded donut/pie (or dial, surface, bar
  volume) hovering above the deck, tilted x≈55–65° with a small z spin.
  Structural edges bright with bloom; interior grid (radial spokes,
  concentric rings, wall lines) at ~30% — the two-level line hierarchy is
  what makes it read as engineered mesh rather than clip-art wireframe.
  Fill mode sets the mood: `wire` = pure hologram, `hybrid` = translucent
  dark surfaces (the reference look), `cel` = solid machined object
  (family B shading — the ember pie-chart reference).
- **Callout ring**: 3–6 elbow leaders labeling segments (recipes §11),
  distributed around the object, never crossing it.
- **The deck** (optional): a dashboard panel lying in perspective below
  the object — rounded-rect panels sharing the object's rotation
  (`rotXYZ` the panel corners), each holding one micro-visual: big-number
  stat + delta, tiny line chart, dotted-world-map, mini bars, % dial ring,
  labeled hairline bars. Everything themed with the scene hue; panel
  titles 10–11px mono uppercase. A particle stream (dots along converging
  curves, brightening toward the sink) can connect object to deck —
  opacity-varied 1–1.5px dots, never solid lines.

Monochrome hue discipline (SKILL.md themes) applies to the whole scene:
deck text, chart bars, map dots, and particles all carry the theme hue.

## Choosing a family

- Process, lifecycle, loop, pipeline stages, "how the agent works" → ring.
- Product/system as an object, "under the hood", architecture hero,
  brand illustration → machinery.
- Dashboard/UI component (progress, scrubber, gauge, stepper) → ruler
  strip or a face-on dial (ring with `tilt: 0`, cropped).
- Proportions/composition data (share-of, breakdown, segments) or an
  "analytics as hologram" hero → mesh object (donut/pie), 3D for heroes,
  flat 2D (`depth: 0`, straight-on) for in-product graphics.
- When several could work: rings explain processes, meshes explain data,
  machinery impresses. Landing-page hero → machinery or a mesh scene with
  deck; docs/feature section → ring.

## Motion specs

| Element | Animation | Duration | Notes |
|---|---|---|---|
| Ring group | continuous rotation | 60–120s linear | rotate the whole projected group in screen plane, or re-render angle offset |
| Progress arc | dashoffset sweep | 4–8s ease-in-out | pause 1–2s at each node |
| Active node | opacity pulse 0.6↔1 | 2–3s | scale pulse ≤1.15× |
| Primary label | typewriter reveal | 40–70ms/char | on section enter only |
| Ruler active tick | steps() advance | 80–150ms/step | like a film counter |
| Machinery | none, or 8–12s slow drift/parallax | — | exploded gaps may breathe ±6px |

One continuous motion + one pulse per scene, maximum. Everything inside
`@media (prefers-reduced-motion: no-preference)`.

## Embedding

The style is dark-only by design. In light-mode pages, keep the graphic on
its own `--industrial-ground` panel with a 12–16px radius; don't invert it. For
React, render the generated SVG inline (filters and textPath survive; they
often break in `<img>` on older Safari when referenced cross-document).
Set `role="img"` and an `aria-label` describing the process — the labels
inside are decorative-scale and screen readers should get the summary
instead.
