# Applications

The idiom changes across surfaces. What stays constant is the grammar; what changes is the legibility floor, the production ceiling, and the legal exposure.

## Contents

1. [Web and product surfaces](#web-and-product-surfaces)
2. [Print and packaging](#print-and-packaging)
3. [Apparel and merch](#apparel-and-merch)
4. [Data visualisation](#data-visualisation)
5. [Composing with other Dreambase skills](#composing-with-other-dreambase-skills)

## Web and product surfaces

HTML/CSS/SVG and React components — the lowest-risk surface, and the one where the style most often fails by becoming unreadable.

**Scale.** The 4–9 pt band converts to roughly **5–12 px at 1×**. On screen that's genuinely small, so:

- Use 11–12 px as the working floor for anything a user must read, and reserve 8–10 px for texture — tick labels, corner codes, revision blocks.
- **Never put an interactive control or an error message in the micro band.** Compliance labelling has no interaction; a UI does.
- On retina displays hairlines need care: a 0.5 px rule renders inconsistently. Use `1px` with a muted colour rather than a sub-pixel rule, or draw rules in SVG where you control rendering exactly.

**Accessibility is where this style gets dangerous.** The aesthetic's whole logic is a legibility floor set by print processes — which has no bearing on WCAG. Non-negotiables:

- Body text meets **4.5:1**, large text **3:1**. Micro-typography does *not* get an exemption because it looks technical.
- Micro-text must still meet contrast, and it must be **real text**, never baked into an image.
- Support 200% zoom without reflow breakage — dense compartment grids break badly if built with fixed heights.
- The tick strips, crosshairs, corner brackets, and registration marks are decorative: `aria-hidden="true"`, and never the sole carrier of meaning.
- If a code (QR/barcode) carries information, provide the encoded value as text too.

**Implementation notes.**

- Tick strips: `repeating-linear-gradient` for uniform ticks; SVG when every fifth tick differs — cleaner than nth-child gymnastics.
- Draw rules with `border` or SVG `line`, not `box-shadow`. This idiom has no shadows.
- `font-variant-numeric: tabular-nums lining-nums slashed-zero` on every numeric run.
- No border radius. No shadows. No gradients. If the design system's default components carry those, override them explicitly.

## Print and packaging

The surface the style is actually *from*, so authenticity is easiest and the production constraints are real rather than simulated.

**Work in millimetres**, at real sizes. The style collapses when scaled — a plate designed at 40 mm wide and printed at 200 mm looks like a poster of a plate, which may be the intent, but decide it deliberately.

**Respect the process you're actually printing with:**

| Process | Positive rule | Reverse rule | Positive copy | Reverse copy |
|---|---|---|---|---|
| Flexo / rotary label | 0.005″ (0.13 mm) | **0.015″ (0.38 mm)** | 6 pt | **8 pt** |
| Screen print | ≥0.2 mm line, ≥0.3 mm border | — | — | — |
| Pad print | — | — | 6 pt (100% black at 6–7 pt) | — |
| Moulded relief | 0.3–0.8 mm stroke | — | ≥20 pt **bold sans only** | — |

**Single colour wherever possible** — it's the honest constraint and it's cheaper. If you need a second colour, spend it on the one safety accent.

**Gradients cannot fade to zero.** Flexo drops below a 2% dot; screen printing loses 3–5% highlights entirely. If a gradient is unavoidable, band it deliberately rather than letting it vanish.

**Set trim, bleed, and a real clear-space rule.** Then violate the clear space nowhere — the one alignment discipline real plates *do* observe is mandated clear space.

**The "hairline data block on brushed metal" look** comes from photo-anodised aluminium, which resolves ≥150 lines/mm — about 25× flexo. That's why those plates carry 4-pt data blocks and dense Data Matrix codes no ink process could hold. If you're imitating that look in a process that can't hold it, the detail will fill in and mud.

## Apparel and merch

**This is the surface where the legal guardrail is serious**, because a garment is itself a product placed on the market. Read `marks-and-legal.md` before building, and raise it with the user before, not after.

The short version: a t-shirt carrying a mark that misleads as to the meaning **or form** of a real conformity mark is squarely within the prohibition — no confusion needs to be proven. Use invented marks with invented identifiers, or tier (c)/(d) informational symbols, and keep real certification marks off the artwork entirely.

### The garment-graphic formula

Observed consistently across real product. This is applied mode — composed, centred, single ink:

1. **A small micro-type block above** the main graphic — one or two lines, mono caps, tracked (`RESILIENT SUPPLY CHAINS`).
2. **One large display word**, condensed, centred, roughly chest-column width (`REINDUSTRIALIZE`).
3. **A hairline rule**, then a supporting line beneath it (`ZERO DOWNTIME MANUFACTURING`).
4. **Two or three boxed tags** — a short code in an outline box (`R-24`), a territory (`U.S.A.`), a small glyph.
5. **A slash-separated tagline footer** (`MORE FACTORIES / MORE OUTPUT / MORE RESILIENCE`).
6. **A small emblem** at the bottom centre.

Proven variants: **vertical rotated type up the side seam** (`RESILIENCE > LAB / FABRICATION CELLS / LOGISTICS — GM / DIV 2`); **a spec block as a lower-corner texture detail** (`UNIT ID: / DIVISION: / STATUS: / CLEARANCE: / ROLE: / LOCATION:`) — this is the nested simulated fragment, and it's what makes the piece feel real; **three diagonal slashes at the shoulder**.

The whole thing lives in **one ink** — light grey or white on a dark garment is the default. The micro-type is texture; the display word is the message.

**Garment types beyond the tee**, all common in this idiom and each with its own placement logic: **coach jackets and anoraks** (big back print, small left-chest mark, wordmark down both sleeves), **bomber and racing jackets** (chest patches, sponsor-style micro-logos scattered across panels, a circular back emblem), **workwear shirts** (chest pocket flag tag, small mark). Sleeve-running wordmarks and sponsor-cluster panels are two of the strongest moves available and neither appears on a tee.

**Embroidered patches** deserve their own note, since they recur: build them from **bar-array letterforms** (see `identity-system.md`), keep to 2–3 thread colours, allow a merrowed or hemmed border, and remember embroidery cannot hold detail below roughly 3 mm — micro-type has to become texture blocks or be dropped entirely.

Related artifacts requested alongside apparel: **credential badges and lanyards** (laminated pouch, QR, ID number, issue date, a coloured `RESTRICTED ACCESS` or `TEMPORARY PASS` tab, a role line), hang tags, woven neck labels, **packaging boxes**, and **shipping containers** — the container is a recurring hero mockup in this style, carrying a huge bar-array mark plus a corner spec block.

**Craft notes:**

- Screen print holds ≥0.2 mm lines. The micro band that works on a printed label **does not survive garment printing** — expect to scale the whole system up 2–4× and lose the smallest tier entirely. On a tee, "micro" means roughly 6–8 pt at final size, not 4.
- DTG and embroidery are coarser still; embroidery cannot hold this idiom below roughly 3 mm stroke.
- Keep the composition inside a chest-width column — roughly 250–300 mm on an adult tee. The idiom's density reads as a *block*, and a block wider than the chest looks like a placemat.
- Care-tag pastiche is the strongest and most-used move in this genre — and the care symbols are live registered trademarks. Build an **original symbol family using the modular construction logic** (see `lineage.md` for the IEC 80416 grid) rather than reproducing GINETEX's set.
- A real garment sold commercially needs a **real** care label with real content. If you're designing one, that's a compliance job, not a graphics job — say so.

## Data visualisation

The idiom applied to charts, dashboards, and analytical displays. It suits data work unusually well because the vocabulary is *already* about precision and measurement — but the failure modes compound.

**What transfers well:**

- Tick strips and graduated rules as axes — the aesthetic's rulers are literally axes.
- `LABEL: value` pairs as stat blocks and KPI readouts.
- Hairline rules and compartments instead of card shadows.
- Tabular figures throughout, which is already the visualisation rule.
- Monochrome plus one accent — which is already the good-practice palette discipline.
- Revision blocks and "data as of" stamps as legitimate, honest provenance furniture.
- Direct labelling over legends, which the idiom does naturally.

**What does not transfer:**

- **The micro type band.** Axis labels and data labels must be readable — they're the message, not texture. Keep the compliance-scale type for chrome (source lines, revision codes, corner marks) and use normal sizes for anything encoding data.
- **Deliberate misalignment.** The incoherence rules apply to *mark bands*, never to data. A chart's axes, gridlines, and marks must align exactly — misalignment in a data display is an accuracy failure, not a style.
- **Decorative density.** Ornamental crosshairs over a plot area add nothing and obscure marks.

**Every chart still passes `dreambase-visualization-design`'s integrity gate.** Style never buys an exemption from an honest axis, and a technical-looking chart that misleads is worse than a plain one — because the aesthetic itself is a claim to rigor.

**The specific risk here:** this style *signals* measurement and precision. Applying it to soft or uncertain data borrows credibility the numbers haven't earned. If the data is directional, say so plainly on the artifact — the idiom has perfect furniture for exactly that (a tolerance note, a method line, a confidence stamp).

## Composing with other Dreambase skills

- **`dreambase-visualization-design`** — governs every chart. This skill supplies the visual register; that one decides the form, encoding, and integrity. It wins on any conflict about how data is encoded.
- **`dreambase-echarts`** — renders the charts. Expect heavy `graphic`-layer use for tick strips, corner marks, and callouts, and near-total suppression of default chrome (no shadows, no rounded corners, hairline axis lines, direct labels).
- **`dreambase-data-stories` / `dreambase-data-presentation`** — when the micrographic treatment is the styling layer on a report or deck. Those own the argument and the structure; this owns the surface.
- **`dreambase-industrial-schematics`** — the closest neighbour, and they genuinely overlap in the emissive register (see `visual-grammar.md`), so the boundary is finer than "one glows and one doesn't." Schematics is **cinematic and dimensional** — a camera angle, perspective, depth cues, rendered machinery photographed as precision hardware. Micrographics stays **flat and frontal** even when it glows, and keeps the `LABEL: value` document grammar. **If the piece has a camera angle, it's schematics; if it has a form field, it's micrographics.** They can share an identity — a matte orange container and a glowing red terminal from the same brand — but not a single composition.
- **A brand skill, `design.md`, or brand tokens** — the accent colour and the wordmark come from the brand; everything else stays in the idiom. And remember the authentic move is that **the wordmark doesn't harmonize** with the system around it.
