# Visual Grammar

The style, expressed as buildable specifications.

**Read the mode distinction first — it governs every rule below.** Most bad micrographic work comes from applying simulation rules to applied work, which produces something rigid and lifeless, or applied rules to simulation work, which produces something that doesn't convince.

## Contents

1. [The two modes](#the-two-modes)
2. [Why the source looks like this](#why-the-source-looks-like-this)
3. [Shared device library](#shared-device-library)
4. [Typography](#typography)
5. [Scale](#scale)
6. [Colour](#colour)
7. [Texture and imagery](#texture-and-imagery)
8. [Composition](#composition)
9. [Invented telemetry](#invented-telemetry)

## The two modes

| | **Simulation** | **Applied** |
|---|---|---|
| Goal | Produce a plausible *artifact* — a fictional rating plate, a care-tag pastiche, a credential badge, a spec sheet | Design something — apparel, a poster, an identity, a UI — *in the idiom* |
| Test | Would someone who reads plates believe it? | Does it look designed, and does the message land? |
| Composition | **Assembled by constraint.** Deliberate misalignment, irregular gaps, mixed typography across marks | **Art-directed.** Centred, balanced, intentional. Alignment is a virtue again |
| Palette | Monochrome; single ink; light ground | **Free.** Saturated ground, dark grounds, primaries. The accent can be the entire field |
| Display type | There isn't any — everything is at compliance scale | **Free and often warm** — rounded grotesque, serif, geometric. Huge |
| Scale | 4–9 pt band throughout | **Extreme contrast** — enormous display against tiny mono, little in between |
| Content | Internally consistent specs | **Invented telemetry is the point** — world-building through `LABEL: value` |

Both modes share the device library, the micro-typography rules, and the legal guardrail. **Applied is the more common request**, and it's where the style actually lives commercially.

A single piece often nests them: an applied poster containing a simulated spec block, or a garment whose main graphic is art-directed while a corner detail simulates a data plate. That's the strongest use — the simulated fragment gives the composed piece its credibility.

## Why the source looks like this

Every signature traces to a physical or legal constraint on the real artifacts. This matters even in applied mode, because knowing the cause is what lets you break a rule intelligently.

**No gradients.** Every dominant marking process is binary at the mark level. A thermal printhead element either fires or doesn't. Laser marking is a physical surface change with no tonal axis. Moulded relief has no ink at all. **There is nowhere for a gradient to live.**

**No halftones — in the source.** Flexo has a hard 2% minimum dot; screen printing loses 3–5% highlights entirely and suffers 8–35% dot gain. In pad printing the shallow etch required for fine text is chosen *precisely so* fine lines and halftones don't plug. (Applied work reintroduces halftone deliberately as texture — see below. That's a knowing violation, not an accident.)

**Hairline minimums, and an asymmetry.** Flexo: positive rule 0.13 mm, **reverse rule 0.38 mm**. Positive copy 6 pt, **reverse copy 8 pt**. Ink spreads into the counter, so knocked-out elements need roughly 3× the rule weight and +2 pt of type. **This is the most transferable single detail in the idiom** — authentic artwork has visibly chunkier strokes and larger type inside black bars, and reproducing it sells a piece instantly.

**Geometric simplification.** Sharp corners, hairline serifs, and delicate joints are unmanufacturable: moulding guidance calls bold sans-serif mandatory and rejects serifs because thin serifs are "too small to mill." **The primitives — circle, square, triangle, trapezoid — survive a 12 dots/mm printhead and 20 laundry cycles. That's why they're the primitives.**

**Dense information packing.** The regulatory payload is fixed and additive; the plate is not. When the FCC rule concedes that if 4-pt type won't fit the statement moves to the manual, that's a regulator admitting the plate ran out of room. **The density is the trace of a fixed payload meeting a fixed area** — not a stylistic choice.

**Rules and boxes instead of colour.** Colour costs a pass — one per pad cycle, one per screen, none at all for laser. A hairline rule is the cheapest mark available. **So the grouping job colour normally does gets handed to rules, boxed compartments, and reversed bars.** That single economic fact explains most of the layout, and it survives into applied work as a habit.

## Shared device library

The vocabulary both modes draw on:

**Structural**
- Hairline rules — positive 0.25–0.5 pt; reversed rules ~3× heavier
- Boxes, cartouches, and compartments — a box of text reads as a mark
- Reversed banner bars — knocked-out type at the heavier weight and +2 pt
- Corner brackets and registration squares, often accent-coloured
- Crosshairs, crop marks, tick scales and graduated rulers
- Leader lines with callouts — elbowed, never curved

**Typographic**
- `LABEL: value` pairs — the fundamental unit
- Bracketed and boxed tags — `[01]`, `[ NAME ]`, `( STATUS )`, black-box and outline-box labels
- Slash-separated category runs — `AI / ROBOTICS / DEFENSE / INDUSTRY`, `SF NYC LDN`
- Chevron runs — `>>>>>>>`
- Vertical rotated micro-labels running up an edge
- Document metadata — `ISSUE 01`, `DISTRIBUTED BY:`, `DOCUMENT TYPE:`, `01/03`, revision and date codes
- Oversized `®` as a graphic element

**Marks and emblems**
- Invented circular seals — ring of type around a monogram or star
- Equipment symbols — AC/DC, Class II double square, hazard triangle, crossed-out bin (tier (c)/(d) only, see `marks-and-legal.md`)
- Barcodes and 2D codes — **real ones only**
- Hazard stripe blocks — diagonal barricade striping

**Punctuation is structure:** `:` after a label, `/` between fields within one spec (`100-140V / 9.5-6A / 50-60Hz`), `;` between spec groups.

## Typography

**Simulation mode:** condensed grotesque plus mono, at compliance scale, and nothing else. The real constraint is fitting fixed-length strings into a small rectangle.

**Applied mode runs four type registers, not two** — wordmark, display headline, techno/squared, and mono micro-layer. Using fewer is the most common reason generated work looks flat. **`references/identity-system.md` specifies all four; read it before setting any type in applied mode.**

Two things to fix immediately if output feels wrong:

- **The display face is warm, and the headline is sentence case** — not condensed, not all-caps. Caps belong to the techno and micro registers only. A soft, heavy, tightly-tracked sentence-case headline against dense mono micro-type is the actual signature of the style.
- **The squared "techno" face is usually missing.** That wide, stencil-ish industrial face used for years, versions, and one-word shouts (`2026`, `V 1.2`, `24/7`) does a large share of the industrial signalling by itself.

| Role | Reference | Open equivalent (all OFL 1.1) |
|---|---|---|
| Condensed workhorse | DIN 1451 Engschrift | **Barlow Condensed**, **DINish** (self-host) |
| Width-graded system | Univers, Folio | **Archivo** — variable `wdth` 62–125 |
| Neo-grotesque | Helvetica | **Roboto**, **Inter** |
| Codes and serials | OCR-B | **JetBrains Mono** (0/O/l/1 disambiguated), **IBM Plex Mono** |
| Warm display (applied) | — | **Archivo**, **Oswald**, or any brand face — this slot is open |
| Seven-segment | — | **DSEG** (self-host) |

Under a strict CSP nothing loads from Google Fonts — embed as base64 or use a system stack:

```css
--mg-condensed: "Roboto Condensed", "Barlow Condensed", "Arial Narrow",
                "Helvetica Neue Condensed", Bahnschrift, Impact, sans-serif;
--mg-mono: ui-monospace, "SF Mono", "JetBrains Mono", "IBM Plex Mono",
           Menlo, Consolas, monospace;
```

### Micro-typography (both modes)

**Figures.** `font-variant-numeric: tabular-nums lining-nums slashed-zero` on every serial, lot, part, and rating number. Two independent published sources require 0/O and 1/l/I disambiguation for exactly this context.

**Tracking.** +5–12% on caps and small caps (`letter-spacing: 0.05em`–`0.12em`). The guard-rail: if the gaps could fit another letter, you've gone too far. Letterspacing lowercase is permitted **under 9 pt**, which licenses opening tracking as type shrinks.

For a more engineered feel, ISO 3098 spacing is much looser than typographic tracking — character spacing = 2 × stroke width — which is why authentic technical lettering reads wide and slightly under-kerned.

**Caps** are right for labels, codes, headers, and signal words — most of this idiom. Avoid for running text, and **avoid synthetic small caps** (most OFL condensed grotesques have none, and scaled caps read too tall and too light). Prefer letterspaced full caps at reduced size.

**Don't justify.** Flush left, ragged right — which is what real plates do anyway.

## Scale

**Simulation:** the 4–9 pt band, throughout. Five independent regulators converge there — FCC 4 pt, MIL-STD-130N 5.76 pt, UL 969's 1.60 mm test ceiling, FDA 6 pt, EU pharma 9 pt. On screen that's ≈5–12 px at 1×. Below ~4 pt it becomes noise; above ~12 px it stops reading as compliance labelling.

**Applied: extreme scale contrast is the engine.** Enormous display type against tiny mono, with **almost nothing in between**. The two-sizes-and-no-intermediate rule survives from the source — but the two sizes become *huge* and *tiny* rather than *ratings* and *boilerplate*. An intermediate size still reads as designed-by-committee and still kills it.

**ISO 3098 lettering heights** give a ready-made scale on a √2 progression: 1.8 / 2.5 / 3.5 / 5 / 7 / 10 / 14 / 20 mm, stroke = h/10.

## Colour

**Simulation:** monochrome. Black on white, silver, or grey; or white on black. Single-colour printing isn't a preference, it's what one pass gives you.

**Applied: the palette is open, and this is where my first draft was most wrong.** Observed in practice: safety orange, mint green, cream, deep blue, yellow, and black used as **full grounds** — the accent is frequently the entire field, not a sparing highlight. Saturated primaries (red/yellow/blue) appear as flat fills, often with line-screen texture through them.

What stays constant:

- **Flat fills only.** No gradients as ground. Colour is either fully on or fully off.
- **One ground + ink + at most one or two accents.** The discipline is in the *count*, not the saturation.
- **Reversed panels need the weight bump** — ~3× rule weight, +2 pt type, whenever you knock type out of a dark field.
- **Dark grounds are fully legitimate** in applied work, and common. The "light background, print-friendly" rule belongs to the source artifact, not the style.

## Texture and imagery

Absent from the source, central to the practice:

- **Line-screen fills** — horizontal rules struck through solid letterforms and shapes. Probably the single most recognisable applied-mode move.
- **Halftone and dot-matrix imagery** — engravings, blobs, flags, portraits, gradients built from visible dots. A knowing violation of the source's no-halftone constraint.
- **Film grain / noise overlay** at low opacity across the whole composition.
- **Graph-paper and dot grids** as background fields.
- **Hazard striping** — diagonal barricade blocks.
- **Redaction bars** — solid black rectangles struck over body text, as though declassified. Cheap, and it instantly implies an institution with secrets. Use once or twice, over plausible words.
- **Checkerboard blocks** — as a band, a corner fill, or a frame around a headline.

These are what keep applied work from looking like a spreadsheet. Use two or three per composition, not all of them.

### The emissive variant

A significant strand of this work is **screen-lit rather than printed** — and my earlier framing wrongly ruled it out. When the subject is software, AI, or anything with a display, the idiom shifts to a **CRT/LED register**:

- **Glow and bloom** around saturated marks and type on near-black
- **Scanlines** through letterforms and shapes
- **LED-matrix and shutter grids** overlaid on imagery — vertical or crossed bar arrays that break the image into cells
- **Seven-segment digits** for clocks, counters, and countdowns
- **Phosphor colour** — saturated red, amber, yellow, blue against near-black
- Status furniture rendered as though on a monitor: `▪ LIVE` in an outlined box, `WAITING…`, a red-ruled header bar

This shares the emissive quality with `dreambase-industrial-schematics`, and the two genuinely do overlap here. The distinction that still holds: **schematics is cinematic and dimensional** — perspective, depth cues, rendered machinery. **Micrographics stays flat and frontal** even when it glows, and it keeps the `LABEL: value` document grammar. If the piece has a camera angle, it's schematics; if it has a form field, it's micrographics.

Print and emissive are a *surface* choice available within applied mode — not two different styles. A single identity often ships both: a matte orange container and a glowing red terminal.

## Composition

**Simulation mode — assemble by constraint.** Real plates are assembled by regulation, not taste, and no authority can harmonise marks from a dozen standards bodies. Each mark's licence forbids altering its proportions, so the only free variables are position and scale of each intact lockup. So, deliberately:

1. **No shared baseline or x-height across marks.** Optical centring, with cap heights differing up to 3×.
2. **Let each mark bring its own typography** — no type system across the mark band. The strongest authenticity signal available.
3. **Irregular gaps**, varying 2–3× within one band.
4. **Derive spacing from the shapes.** The care-symbol system's gaps are 10, 22, 20, 17 — computed per pair. **Evenly-spaced symbols are the number-one giveaway.**
5. **Satellite text doesn't align to the text grid.**
6. **One or two marks anchor at large size**; the rest pack around them.
7. **Variable data is a separate layer** — a serial sticker applied over the artwork, slightly rotated, overlapping the border.

**Applied mode — compose deliberately.** Centred, balanced, art-directed. Alignment is a virtue again. The idiom's density and micro-detail carry the technical signal; you don't need misalignment too, and faking it here just reads as sloppy.

### Density is enforceable, not aspirational

The most common failure in generated work is a composition that is *correct* but *empty* — right devices, right palette, and a dead void through the middle. The source artifacts have no voids because a fixed payload met a fixed area, and applied work has to earn the same quality deliberately.

**Hard rules:**

- **No empty region larger than ~15% of the canvas.** Measure it. A blank band across the middle is the classic tell.
- **If content doesn't fill the canvas, shrink the canvas** — don't distribute the content to fit. Spacing elements apart to fill space is exactly backwards.
- **Never use a flex spacer to push a footer down.** That is the mechanism that produces the void. Stack blocks in reading order and let the canvas end where the content ends.
- **Every quadrant carries something** — a micro-label, a rule, a tag, a texture field, an illustration. The corners especially: this idiom anchors all four.
- **Whitespace appears between dense blocks, not inside them.** Tight groups separated by clear gutters — not evenly-distributed elements floating in air.
- **Two or three texture moves minimum** in applied mode, and one of them should occupy real area (a halftone image, a line-screen field, a dot grid), not just a hairline.

A useful check: squint at the piece. You should see three or four distinct *masses*. If you see scattered marks with air between them, it isn't finished.

**The strongest work nests the modes:** a composed piece containing one simulated fragment — a spec block in a corner, a data plate on a sleeve, a credential in a hero shot. The simulated fragment lends credibility; the composition makes it a design.

## Invented telemetry

The heart of applied micrographics, and something the source has no equivalent for: **`LABEL: value` applied to narrative rather than measurement.**

Observed in practice: `STATUS: DEPLOYED IN SECTOR`, `FIELD OPERATION: ACTIVE`, `OBSERVATION LAYER: ACTIVE`, `CLEARANCE: LEVEL 3`, `DIVISION: CORE PRODUCTION`, `ROLE: PRIMARY OUTPUT`, `LOCATION: DOMESTIC`, `UNIT ID: HM-FU-01`, plus live clocks, temperatures, `SCANNING THE GLOBE`, `WAITING…`, `● LIVE`.

**This is world-building, and inventing it is the point — not a violation of the no-fake-data rule.** The distinction that matters:

| Invent freely | Must be real |
|---|---|
| Status, clearance, division, role, sector, unit ID | Machine-readable codes — a QR or barcode must scan |
| Issue numbers, revision codes, fictional standards | Actual measurements and specs presented as fact |
| Fictional institutions, seals, and their identifiers | Real conformity marks and real standard numbers |
| Location and operational language | Anything a viewer would reasonably act on |

The rule underneath: **fiction is fine when it reads as fiction; fakery is not fine when it reads as fact.** A `CLEARANCE: LEVEL 3` on a poster invents a world. A wattage rating on a product label that nobody measured is a lie. A barcode that doesn't scan is just bad craft.

The vocabulary works because it implies an institution — an org chart, a division, a supply chain. **Invent the institution first**, then the telemetry writes itself and stays consistent.
