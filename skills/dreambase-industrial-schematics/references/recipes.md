# Construction recipes

Everything is plain SVG (optionally wrapped in HTML/CSS for motion). No
libraries, no canvas, no 3D engine.

## 1. Ring projection math

A tilted circle is an ellipse. For a ring of radius `r`, tilted `tilt`
degrees away from the viewer and rotated `rot` degrees in the screen plane,
a point at ring-angle `θ` (0° = 12 o'clock, clockwise) projects to:

```js
function project(angleDeg, r, tilt, rot, cx, cy) {
  const a = ((angleDeg - 90) * Math.PI) / 180;      // 0° at top, clockwise
  const x0 = r * Math.cos(a);
  const y0 = r * Math.sin(a) * Math.cos((tilt * Math.PI) / 180); // squash
  const rr = (rot * Math.PI) / 180;                  // in-plane rotation
  return {
    x: cx + x0 * Math.cos(rr) - y0 * Math.sin(rr),
    y: cy + x0 * Math.sin(rr) + y0 * Math.cos(rr),
    depth: (Math.sin(a) + 1) / 2,   // 0 = far side (top), 1 = near side
  };
}
```

- `tilt` 55–70° gives the cinematic ellipse in the references; 0° is a
  face-on dial.
- `rot` −10° to −25° keeps the composition dynamic (avoid 0° — it looks
  like a chart).
- Use `depth` for both opacity (`0.15 + 0.85 * depth^1.2`) and to split
  elements into a far group (blurred) and near group (sharp).
- Ticks: outer point at `r`, inner point at `r - tickLen`, both projected
  with the same function. Never draw ticks as a dasharray on the ellipse —
  they must point at the center to read as instrumentation.

`scripts/industrial-ring.mjs` implements all of this; prefer it for scaffolds.

## 2. Glow (the "live" highlight)

```svg
<filter id="glow" x="-300%" y="-300%" width="700%" height="700%">
  <feGaussianBlur stdDeviation="4" result="b1"/>
  <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b2"/>
  <feMerge>
    <feMergeNode in="b1"/><feMergeNode in="b2"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

Apply to: the bright progress arc, active node dots, nothing else. The arc
is a sampled path along the ellipse between two ring-angles, `stroke`
= ink, `stroke-width` 3–5, `stroke-linecap="round"`, drawn twice — once
wide at 25% opacity (halo), once thin at full opacity (core).

## 3. Node marker anatomy

At ring-angle θ (matching Linear-style references):

1. **Open circle**: r ≈ 7, `fill="none"`, stroke ink at 70% opacity,
   stroke-width 1.2 — sits exactly on the ring line.
2. **Glowing dot**: r ≈ 3.5, fill ink, `filter="url(#glow)"`, offset ~6px
   toward the outside of the ring (it "leads" the open circle).
3. **Primary label**: 12px mono uppercase, tracking 0.25em, placed 24–40px
   outward along the radial direction; `text-anchor` start on the right
   half, end on the left half.
4. **Secondary label** (optional, e.g. "LOOP TRIGGER"): 10px, ink-dim,
   tracking 0.4em, placed *inside* the ring and rotated to the local
   tangent so it tracks the curvature.

Inactive nodes: drop the glow dot, dim the open circle to 35%.

## 4. Depth of field + grain (the cinematic pass)

Split the scene into `<g id="far">` and `<g id="near">` by `depth < 0.45`.

```svg
<filter id="dof"><feGaussianBlur stdDeviation="2.2"/></filter>
<!-- far group: filter="url(#dof)" opacity="0.5" -->

<filter id="grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope="0.05" intercept="0"/></feComponentTransfer>
</filter>
<!-- topmost layer: <rect width="100%" height="100%" filter="url(#grain)"/> -->
```

Optional vignette: a radial gradient rect from transparent center to 60%
ground color at the corners. Blurring a few *labels* (not just ticks) at
the far side sells the camera-focus effect — set `filter="url(#dof)"` on
far-side text too.

## 5. Cel-shaded machinery (hand-drawn, not scripted)

Think of the object as a stack of cylinders on one axis (a camera lens: hood
→ barrel → knurled focus ring → mount). Draw in this order:

1. **Pick the axis** — a single vector, e.g. 30° down-right. Every
   cross-section is an ellipse perpendicular to it; every section shares
   the same ellipse aspect ratio. Write the axis and light direction in a
   comment at the top of the SVG.
2. **Silhouette first** — block each cylinder segment as one flat
   `--industrial-steel-2` path (two ellipse arcs joined by straight walls).
   Vary radii aggressively: fat housing, thin collar, fat ring. Real
   hardware alternates.
3. **Carve with shadow** — recessed bands, seams, and the underside get
   `--industrial-steel-1` (or the ground color itself for deep gaps). No strokes;
   form is shape-on-shape.
4. **Raise with light** — front-facing facets and raised bands get
   `--industrial-steel-3`.
5. **Rim light last** — thin `--industrial-rim` slivers (2–6px) only where the
   light hits: the top-left arc of each ellipse edge, the lit long edge of
   the barrel. This is the money layer; if it's on both sides it's wrong.
6. **Detail via repetition** — knurling = a run of small rects following
   the ellipse (place with the projection function, radius = segment
   radius); bolt heads = tiny hexagons at equal angles; vents = repeated
   slots. 8–40 repeats each; repetition is what makes it look engineered.
7. **Accent** — one red tick ring (dasharray ellipse in `--industrial-signal`) or
   a few `--industrial-signal-hot` marks. One accent zone per composition.

### Exploded views

Separate segments along the axis vector only — never sideways. Gaps grow
slightly toward the viewer end (e.g. 40, 52, 68px). Keep every part's
ellipse aspect identical. Optionally add 0.75px `--industrial-ink-faint` hairlines
connecting mating faces, and park a ruler strip in a lower corner as a
"calibration" prop.

## 6. Ruler / tick-strip slider

A rounded-rect track (`--industrial-steel-1` fill, or transparent on black) with
40–80 vertical tick rects (1.5–2px wide, evenly spaced): completed ticks in
`--industrial-signal` at 60% opacity, remaining ticks in `--industrial-ink-faint`, one
active tick full-height in `--industrial-signal-hot` or ink with glow. Generate
with `industrial-ring.mjs ruler`. As an HTML component, the same reads as a
progress/scrubber bar; animate the active index with a CSS custom property.

## 7. Assembly order for a full scene

ground rect → vignette → far group (blurred) → ring/machinery/mesh faces →
near group → mesh lines → labels/callouts → glow elements → grain rect.
Grain is always last.

## 8. Full 3D: free x/y/z rotation + perspective

The two-parameter tilt in §1 is a special case. For arbitrary camera
angles, work in a screen-style frame (x right, y down, z toward the
viewer), rotate with Euler angles applied Rx → Ry → Rz, then project:

```js
function rotXYZ({x, y, z}, r) {           // r = {x, y, z} in degrees
  const R = (d) => (d * Math.PI) / 180;
  let c = Math.cos(R(r.x)), s = Math.sin(R(r.x));
  [y, z] = [y * c - z * s, y * s + z * c];      // Rx: tilt away/toward
  c = Math.cos(R(r.y)); s = Math.sin(R(r.y));
  [x, z] = [x * c + z * s, -x * s + z * c];     // Ry: swing left/right
  c = Math.cos(R(r.z)); s = Math.sin(R(r.z));
  [x, y] = [x * c - y * s, x * s + y * c];      // Rz: spin in-plane
  return { x, y, z };
}
// perspective: d = camera distance in px (1200–2000 feels like the refs;
// 0 or Infinity = orthographic/isometric)
const f = d > 0 ? d / (d - p.z) : 1;
screen = { x: cx + p.x * f, y: cy + p.y * f };
```

Model objects flat in the XY plane (z = 0 top surface, z = −depth bottom),
then rotate. The classic reference camera is `{x: 55–65, y: 0, z: −10 to
−20}`; straight-on 2D is `{x: 0, y: 0, z: 0}` with `perspective: 0`.
Depth cues must follow the rotation: map each element's post-rotation z to
opacity (near bright, far dim) rather than hardcoding "top half is far".

## 9. Holographic mesh objects (2D/3D wireframe)

`scripts/industrial-mesh.mjs donut` implements all of this; read its
`--help` for the config. The construction, for building other mesh objects
by hand:

1. **Tessellate** the object into faces in object space: top/bottom
   polygons plus wall quads every ~6° of arc. Keep each face's outward
   normal (a direction vector — rotate it with the same `rotXYZ`, no
   projection).
2. **Fill mode decides the face pass**:
   - `wire` — no fills at all; the mesh is fully transparent (pure
     hologram).
   - `hybrid` — every face filled with a near-black theme tint at ~0.85
     opacity, back-faces at ~half that; drawn painter-sorted (far → near).
     This is the reference look: you *just* see through the object.
   - `cel` — opaque flat shading: cull back-faces (normal z ≤ 0), sort,
     fill by quantized light `b = dot(N, L)` into shadow/mid/light, and
     stroke the top edge of well-lit wall quads (`b > 0.55`) with the rim
     color. Family B's shading on a data object.
3. **Line pass** (wire/hybrid): structural edges bright (top arcs 1.4px,
   verticals 1.2px, bottom arcs 1px), interior grid dim (0.6px at ~30%
   base): radial spokes, concentric rings on the top face, vertical wall
   lines, horizontal wall rings. Scale every line's opacity by its
   post-rotation depth. Draw lines after faces (see-through lines are the
   aesthetic in hybrid; in cel keep only a faint top outline + rim).
4. **Bloom**: wrap the whole line group in a small blur-merge filter
   (stdDeviation ~1.6) — cheap phosphor glow that beats per-line filters.
5. **Explode** a segment by offsetting it along its mid-angle direction in
   object space *before* rotation.

2D meshes are the same pipeline with `depth: 0` (top face only); pies are
`innerR: 0`.

## 10. Monochromatic hue theming

Derive an entire scene from one hue: convert the hue to HSL, keep H fixed,
and produce every role by varying S/L only (implemented in
`industrial-mesh.mjs` as `deriveTheme`):

| Role | S | L |
|---|---|---|
| line / glow | 0.75 | 0.62 |
| line-dim (secondary labels, grid) | 0.40 | 0.40 |
| rim (cel lit edges) | 0.80 | 0.82 |
| fill shadow | 0.30 | 0.05 |
| fill mid | 0.32 | 0.09 |
| fill light | 0.30 | 0.14 |
| background | 0.30 | 0.025 |

The background carrying a trace of the hue (not pure black) is what makes
the scene feel lit by its own phosphor. Use the same derivation for
dashboard micro-panels, chart bars, and text in the scene — a stray
neutral gray reads as a compositing mistake.

## 11. Elbow callout leaders

The labeling system for mesh/machinery objects: anchor dot on the object →
short 45° diagonal → horizontal rule → label sitting on the rule.

- Anchor: 3px filled dot (line color, glow) inside a 6.5px open circle.
- Leader: 1px, ~70% opacity; diagonal ~70px, horizontal ~130px. Route
  *away* from the object: horizontal direction from the anchor's side of
  center, vertical from whether the anchor is above or below center —
  leaders must never cross the mesh.
- Label: 13px mono uppercase, tracked, baseline ~8px above the rule;
  optional value/sub-line 11px in line-dim below the rule.
- 3–6 callouts per scene, staggered so no two rules share a y.
