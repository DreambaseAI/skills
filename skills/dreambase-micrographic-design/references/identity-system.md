# Identity System: Marks, Type Registers, and Illustration

The part that makes this idiom read as *designed* rather than *assembled*. Everything below is derived from studying a large body of practitioner work in the style.

If output feels like a spec sheet rather than a brand, this file is what's missing.

## Contents

1. [The mark formula](#the-mark-formula)
2. [Wordmarks](#wordmarks)
3. [The four type registers](#the-four-type-registers)
4. [Seals and secondary marks](#seals-and-secondary-marks)
5. [Illustration](#illustration)
6. [Building the fictional institution](#building-the-fictional-institution)

## The mark formula

**Take a geometric primitive and render it as an array of parallel bars whose lengths are modulated to describe the form.** That single move generates nearly every logo in this idiom, and it's why a whole portfolio of unrelated brands reads as one visual language.

The result reads simultaneously as a **shutter, a waveform, a signal, an aperture, a venetian blind, and an interference pattern** — which is exactly the semantic field the style wants.

**The recipe:**

1. **Pick a primitive** — circle, square, diamond, letterform, radial fan, star, chevron, helix.
2. **Slice it into parallel bars.** Horizontal is the default and most common; vertical and radial are the variants.
3. **Modulate the bar lengths** so the silhouette describes the form — a circle's bars run long at the equator and short at the poles; a letterform's bars follow its skeleton.
4. **Keep the gaps consistent** and the bar weight uniform. The modulation is in *length*, not weight.
5. **Optionally break the grid once** — one bar offset, extended, or dropped — to create a focal incident.

**Observed variants:**

| Primitive | Bar direction | Reads as |
|---|---|---|
| Circle | Horizontal, long at equator | Globe, aperture, sun |
| Circle | Vertical | Barcode wrapped in a disc |
| Letterform (N, S, R, A, H) | Horizontal, following the skeleton | Signal-degraded type |
| Diamond / 4-point star | Horizontal, mirrored | Interference pattern, swarm |
| Radial fan | Tapering blades from a centre | Turbine, warp, sunburst |
| Helix / double strand | Horizontal, offset in pairs | DNA, data structure |
| Overlapping circles | Horizontal scanlines through each | Venn, spectrum, optics |

**Craft notes:**
- Bar count is usually **9–20**. Fewer reads as a flag; more reads as texture and loses the silhouette.
- Gap-to-bar ratio around **1:1 to 1:2**. Tighter fills in at small size; looser falls apart.
- The mark must survive at 16 px — test it, because bar arrays alias badly. Provide a simplified few-bar version for favicon scale.
- **One colour.** These marks are almost never multi-colour; the exception is an overlapping-circle mark where overlaps generate a third hue.
- Works equally as positive (dark bars on light) or knocked out. Remember the reverse-weight rule from `visual-grammar.md`.

## Wordmarks

**Warm, rounded, geometric sans — usually lowercase or sentence case, medium to bold.** This is consistently the opposite of what the compliance source would suggest, and it's deliberate: the wordmark supplies the humanity that the micro-layer withholds.

Observed: soft geometric lowercase (`serro`, `warp`, `mts`, `Record`), sentence-case grotesque (`Nucleus Engineering Office`, `Helix-DB`), extended caps grotesque for institutional names (`CATHEDRAL THERAPEUTICS ®`), and occasionally a **transitional serif** (`Synthetic`) when the brand wants gravity rather than speed.

- **Lockup:** mark to the left, wordmark to the right, optically centred on the mark's midline, with a gap of roughly one bar-array width.
- **`®` is set as part of the lockup** far more often than trademark practice requires — it's a graphic device here, and it belongs to the fiction.
- Pair a **rounded/warm wordmark** with the **hard bar-array mark**. That contrast is the signature; a technical mark plus a technical wordmark reads as generic.

## The four type registers

My earlier guidance said two sizes and one condensed face. That's the *compliance source*. The practiced system runs **four distinct registers**, and using fewer is the most common reason output looks flat.

| Register | Character | Case | Use |
|---|---|---|---|
| **1. Wordmark** | Warm geometric sans, or serif | lowercase / Sentence | The brand name only |
| **2. Display headline** | Tight, heavy neo-grotesque | **Sentence case** | The one big statement: *"Automate the work that built America"*, *"Built to build again"*, *"Grid scale. Nation ready."* |
| **3. Techno / squared** | Wide, squared, stencil-ish industrial | CAPS | Numerals and short shouts: `2026`, `V 1.2`, `ROBOTICS`, `24/7`, `DRS` |
| **4. Micro layer** | Monospace | CAPS, tracked | `UNIT ID:`, `STATUS: ACTIVE`, telemetry, footers |

**Registers 2 and 3 must be visibly different faces, not the same face at two sizes.** If a viewer can't tell them apart, the piece collapses to a two-register system and reads flat. Set them side by side and check before going further.

### Getting register 3 right (the one that silently fails)

**There is no Google Fonts family called "Archivo Expanded."** Expanded is an *instance on Archivo's width axis*, so requesting it by family name falls back silently to regular Archivo — and register 3 disappears into register 2. This is the single most common way the type system breaks.

```css
/* correct — variable axis, not a family name */
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap');
.techno{
  font-family:"Archivo",sans-serif;
  font-variation-settings:'wdth' 125;   /* the expanded instance */
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:-.01em;
}
```

Alternatives that are genuine standalone families, in rough order of usefulness: **Michroma** (wide, squared, single weight — very close to the reference look), **Chakra Petch** (squared with clipped corners), **Saira** (has its own `wdth` axis), **Oswald** or **Anton** (condensed rather than wide — use only when the shout should feel tall, not broad).

Always verify the face actually loaded rather than assuming — a fallback here is invisible in code and obvious in the output.

**The display headline is sentence case, not caps.** This is a correction to my earlier all-caps guidance: caps belong to registers 3 and 4. Display headlines are set tight, heavy, and in sentence case — often with a full stop. That's what keeps the work from reading as a warning label.

Register 3 is the one most often missing from generated work. It's the squared, wide, slightly stencil face used for years, versions, and one-word shouts — and it does a lot of the industrial signalling on its own.

## Seals and secondary marks

- **Circular seal:** text set around a ring (name above, descriptor below, separated by bullets or stars), a small emblem at the centre, optionally a second thin ring. Reads as an institutional stamp. Set the ring text at small size with wide tracking.
- **Boxed monogram lockup:** the mark plus one line of institutional descriptor inside a hairline box, with a small code tag hanging off a corner.
- **Compass rose** — `N / W / E / S` micro-labels around a mark.
- **Registration crosses** `+` scattered at grid intersections.
- **Chevron runs** `>>>>>` in the accent colour, used as directional emphasis and as pure rhythm.
- **Checkerboard blocks** — racing/finish-line connotation, used as a band or a corner fill.
- **Redaction bars** — solid black rectangles struck over body text, as though the document were declassified. A strong, cheap device that instantly implies an institution and a secret. Use once or twice, over *plausible* words.

## Illustration

Four distinct illustration modes appear, and mixing more than two in a piece gets noisy:

1. **Technical line drawings** — machinery, robot arms, drones, drawn as clean vector elevations or isometrics with uniform thin stroke, no shading, plus **leader lines with callout labels** and dimension marks. This is the exploded-diagram register, and it's the most credible one.
2. **Halftone photography** — a photograph reduced to visible dots, usually one flat colour, often a flag, a flower, a portrait, or a machine.
3. **Dot and bar fields** — scattered dot grids, gradient dot fields, arrays that read as data.
4. **Product photography on plain sweeps** — the artifact shot cleanly against a neutral ground, with micro-labels composited around it.

Blueprint-style outline diagrams — thin strokes on a saturated ground with `+` registration marks and a light grid — bridge modes 1 and 3 and are especially effective on yellow, blue, or orange fields.

## Building the fictional institution

The single highest-leverage move, and the reason this work feels solid rather than decorative: **the invented organisation is a full identity system, not a garnish.**

Before designing anything, establish:

- **A name and a descriptor** — `Nucleus Engineering Office`, `Homeland Machines Inc. / Industrial Systems Division`, `Reindustrializing Center of America`.
- **A mark**, via the bar-array formula.
- **A wordmark**, warm, in one of the register-1 styles.
- **One saturated ground colour** — safety orange is the house default of this idiom; cream, sepia, acid yellow, mint, deep blue, and black all recur.
- **A telemetry vocabulary** — the specific label set this org uses: `UNIT ID`, `DIVISION`, `CLEARANCE`, `SECTOR`, `ROUTING`, `TIER`, `STATUS`.
- **An identifier format** — `HM-FU-01`, `RDG-06-CTRL`, `OVR-01`, `NEO-06`. Pick a pattern and hold it.
- **A territory and a date stamp** — `U.S.A.`, `NEW YORK, NEW YORK`, `© 2026`.

Then apply it across artifacts. The work in this idiom is nearly always shown **on a physical object**: a shipping container, a coach jacket or anorak, an embroidered patch, a laminated credential, a packaging box, a printed magazine spread, a hardware panel. **Producing the system and then mocking it onto two or three objects is the deliverable** — a logo on white is not.
