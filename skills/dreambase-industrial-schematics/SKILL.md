---
name: dreambase-industrial-schematics
description: >-
  Create dark, cinematic technical-schematic illustrations and UI components
  in the cinematic industrial / HUD style used by AI product
  marketing sites like Linear and Vercel — orbital process rings with radial
  tick marks and glowing nodes, monospace uppercase micro-labels, cel-shaded
  exploded machinery (lenses, turbines, engines), holographic 2D/3D wireframe
  mesh charts (extruded donut/pie data-objects with free x/y/z camera rotation
  and wire/translucent/cel fills), monochromatic hue themes (phosphor terminal
  green, ember, mono white, or any brand hue), tick-strip rulers/sliders, and
  dial/gauge components. Use when the user asks for schematic, technical,
  blueprint, HUD, sci-fi, hologram, wireframe, terminal-green, or
  "engineering diagram" style visuals;
  a dark hero graphic or diagram for a landing page; an exploded view of a
  product/system rendered as machinery; a process-loop or lifecycle ring;
  "that Linear look"; or components (sliders, dials, tickers) in this
  aesthetic — even if they can't name the style.
---

# Industrial Schematics — Cinematic Technical Diagrams

The style: **sci-fi HUD instrument graphics fused with exploded
technical illustration**. It treats a software product like precision
hardware — a lens assembly, a turbine, a control dial — photographed in a
dark room. Popularized by Linear, Vercel, and similar AI/dev-tool sites.
Everything here is buildable as SVG/HTML/CSS (no raster tools needed), so
output works in artifacts, landing pages, and React components.

## The three families

**A. Orbital process rings** — a circular process (lifecycle, agent loop,
pipeline) drawn as a tilted ring viewed in perspective: dense radial tick
marks, a thin ring line, glowing node dots at stage positions, one bright
"progress" arc, uppercase monospace labels. Strictly monochrome
white-on-black; depth is conveyed by dimming + blurring the far side.

**B. Cel-shaded machinery** — the product/system as flat-vector hardware
(stacked cylinders, knurled rings, housings), optionally exploded along one
axis. 3–4 flat gray values, zero gradients, a single warm rim-light color on
lit edges only, and a sparse muted-red accent (tick rings, calibration
marks).

**C. Holographic mesh objects** — data objects (extruded donut/pie charts,
dials, surfaces) drawn as 2D or 3D wireframe meshes, viewed from any x/y/z
rotation: structural edges bright, interior grid dim, with a phosphor
bloom. Fills are a choice per scene: **wire** (fully transparent — pure
hologram), **hybrid** (dark translucent fills under the mesh — you can
just see through), or **cel** (opaque flat-shaded faces with rim light —
family B's shading applied to a data object). Often composed with elbow
callout leaders and a perspective dashboard deck of micro-panels below.

Shared vocabulary across all three: radial/linear tick marks, ruler-strip
sliders, node markers (glowing dot + trailing open circle), hairline and
elbow leaders, film grain, and monospace micro-typography.

## Design tokens

Palette (dark-only — this style does not have a light mode; when embedding
in a light page, keep the graphic on its own dark panel):

| Token | Value | Use |
|---|---|---|
| `--industrial-ground` | `#0B0B0C` | Ring scenes: near-black ground |
| `--industrial-ground-warm` | `#1F1D1B` | Machinery scenes: warm charcoal ground |
| `--industrial-steel-1` | `#262422` | Machinery shadow value (barely off ground) |
| `--industrial-steel-2` | `#3B3734` | Machinery mid value (dominant) |
| `--industrial-steel-3` | `#4A4441` | Machinery light value |
| `--industrial-rim` | `#F6D9BC` | Rim-light peach — thin slivers on lit edges only |
| `--industrial-signal` | `#B0413A` | Muted red — tick rings, calibration marks |
| `--industrial-signal-hot` | `#E05A4E` | Bright red — one active mark at most |
| `--industrial-ink` | `#F2F0ED` | Primary labels, ring lines, glow cores |
| `--industrial-ink-dim` | `#8F8C88` | Secondary labels, inactive ticks |
| `--industrial-ink-faint` | `#4A4846` | Far-side elements, disabled marks |

### Monochromatic hue themes

A scene commits to **one hue family** and derives every color from it by
varying only lightness/saturation — lines, glow, fills, labels, and even
the background all carry the same hue. Three named themes cover the
reference material; any brand hue can be substituted using the derivation
formula in `references/recipes.md`:

| Theme | Character | Line / glow | Fills (shadow→light) | Ground |
|---|---|---|---|---|
| `phosphor` | terminal-green hologram | `#57DE8D` | `#091209` → `#1E2F24` (green-black tints) | `#030704` |
| `ember` | the machinery palette above | `#8F8C88` + rim `#F6D9BC` | `#262422` → `#423D39` | `#141210` |
| `mono` | pure instrument white | `#F2F0ED` | `#101010` → `#242424` | `#0B0B0C` |

Swapping hue (green → cyan → amber) is legitimate; mixing hues in one
scene is not — the ember rim + red accents count as a single "warm
neutral" family and stay out of phosphor/mono scenes.

Typography: monospace only (`ui-monospace, "SF Mono", "JetBrains Mono",
Menlo, monospace`), UPPERCASE, letter-spacing `0.2em`–`0.4em`, sizes
10–13px. Two-level hierarchy: primary label in `--industrial-ink`, secondary in
`--industrial-ink-dim` with wider tracking. No sentence case, no bold, no text
blocks — labels are 1–4 words. Density comes from repeating tiny elements
(ticks, dots), never from text.

## Hard rules (why they matter)

- **Flat values only on machinery** — the cel-shaded look dies the moment a
  gradient appears. Model form with 3–4 flat fills; the ground color itself
  is the shadow value.
- **One light source** — rim highlights all fall on the same side
  (top-left by default). A sliver of `--industrial-rim` on a shadow-side edge
  breaks the illusion instantly.
- **One hue per scene** — monochromatic discipline is what separates
  instrumentation from decoration. Rings stay in `mono`; machinery stays
  in `ember`; meshes pick one theme. Never mix hue families in a scene.
- **Perspective is a free parameter, not a default** — meshes and rings
  can be viewed straight-on (2D dial), classically tilted (x≈60°), or from
  any x/y/z rotation. Pick the camera for the job: straight-on for
  in-product components, three-quarter tilt for hero scenes. Whatever the
  rotation, depth cues (near bright/sharp, far dim/blurred) must agree
  with it.
- **Glow is earned** — at most one bright arc and the active node(s) glow.
  If everything glows, nothing reads as "live".
- **Depth cues, not 3D engines** — perspective is faked with ellipse math
  (squash + rotate), far-side dimming, and a blur pass. That keeps output
  as portable SVG.

## Building it

Read `references/recipes.md` before drawing — it has the projection math,
SVG filter snippets (glow, grain, depth-of-field), the node-marker anatomy,
and step-by-step construction for cel-shaded cylinders, exploded views, and
ruler strips. `references/style-guide.md` holds the full anatomy breakdown
of each family plus composition and motion specs.

For ring diagrams and ruler strips, generate the SVG scaffold with the
bundled script instead of hand-computing tick positions:

```bash
# Orbital ring from a JSON config (see --help for all options)
node scripts/industrial-ring.mjs ring config.json -o ring.svg

# Tick-strip ruler/slider
node scripts/industrial-ring.mjs ruler '{"count":64,"progress":0.3}' -o ruler.svg

# Holographic 2D/3D mesh donut/pie — free x/y/z rotation, themed,
# fill: wire | hybrid | cel (see --help for the full config)
node scripts/industrial-mesh.mjs donut '{
  "theme":"phosphor", "fill":"hybrid", "rotate":{"x":62,"y":0,"z":-14},
  "segments":[{"share":0.3,"label":"MCP Tools"},{"share":0.7,"label":"Skills"}]
}' -o mesh.svg
```

`industrial-mesh.mjs` handles the whole 3D problem — Euler rotation,
perspective projection, painter-sorted faces, backface culling (cel),
depth-based line opacity, callout leaders, and theme derivation from any
hue. `depth: 0` gives a flat 2D mesh; `innerR: 0` gives a pie;
`perspective: 0` gives orthographic. Ring diagrams can be themed too:
pass `"ink": "#57DE8D"` (or any theme's line color) to `industrial-ring.mjs`.

The script emits clean, editable SVG — treat its output as the scaffold,
then hand-tune labels, arc placement, and composition. Machinery
illustrations are drawn by hand (no script can art-direct them); follow the
cylinder recipe and keep a written light-direction note while you work.

## Motion (optional, CSS-only)

Animate sparingly — one continuous motion plus one pulse is the ceiling:
slow ring rotation (60–120s linear infinite on the ring group), progress
arc sweep via `stroke-dashoffset`, active-node pulse (opacity 0.6→1,
2–3s), typewriter reveal on a primary label. Wrap all of it in
`@media (prefers-reduced-motion: no-preference)`.

## Quality check before shipping

1. Squint test: the image should read as a single bright focal point (arc
   or active node / rim-lit edge) against near-black — not a busy diagram.
2. Labels: all uppercase mono, tracked, ≤4 words, two brightness levels.
3. Machinery: count the fill values (≤4 grays + rim + accent), verify one
   light direction, zero gradients/strokes.
4. Ring: far side dimmer and blurrier than near side; ticks pass through
   depth-based opacity.
5. Grain/vignette present but subtle (grain alpha ≤ 0.07).
6. Mesh: one hue only (check fills AND labels); structural edges clearly
   brighter than interior grid; if cel-filled, faces are flat values with
   rim on lit edges only; if transparent, no fills fight the mesh.
