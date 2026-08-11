# Slide Craft: the numeric system

The specifications a deck is built from. Slides differ from documents and web pages in three ways that change every number: a fixed frame, a viewer who may be 10 metres away, and a person talking over it.

Values marked **derived** are arithmetic on verified inputs; values marked **convention** have no authoritative source and are practitioner judgement. Both are usable — but don't present a convention as a standard.

## Contents

1. [Canvas and the pt↔px bridge](#canvas-and-the-ptpx-bridge)
2. [Safe areas and grid](#safe-areas-and-grid)
3. [Slide anatomy](#slide-anatomy)
4. [Type](#type)
5. [Color and contrast](#color-and-contrast)
6. [Motion](#motion)
7. [Layout archetypes](#layout-archetypes)
8. [Presenter ergonomics](#presenter-ergonomics)
9. [The generated-deck tells](#the-generated-deck-tells)
10. [Pre-ship checklist](#pre-ship-checklist)

## Canvas and the pt↔px bridge

| Format | Inches | Points | CSS px |
|---|---|---|---|
| **PowerPoint 16:9 (default)** | 13.333 × 7.5 | **960 × 540** | 1280 × 720 |
| PowerPoint 4:3 | 10 × 7.5 | 720 × 540 | 960 × 720 |
| **Google Slides 16:9 (default)** | 10 × 5.625 | **720 × 405** | 960 × 540 |
| reveal.js default | — | — | 960 × 700 (**not 16:9**) |

**Work at 1920 × 1080 and the conversion is exact: 1 pt = 2 px.** A 13.333 in slide is 960 pt wide; 1920/960 = 2.000. At a 16 px root, `1rem = 16px = 8pt`. This is what makes decades of pt-based typographic advice directly usable in a web deck. *(derived)*

Two traps this exposes:

- **The Google Slides trap.** Its canvas is 720 pt wide, not 960. The same nominal point size renders **33% larger** there. Multiply by 1.3333 when porting a pt spec from PowerPoint, and never assume — read the actual page size from the target file.
- **The legacy-advice trap.** Essentially all classic slide-type guidance was written for the 720 pt 4:3 canvas. Normalizing to widescreen (×1.3333): Alley's 28 pt headline → 37.3 pt; his 18–24 pt body → 24–32 pt; Kawasaki's 30 pt floor → 40 pt.

A useful convergence check: reveal.js ships a 40 px body on a 960 px canvas, which is width-relatively identical to 40 pt on a 960 pt PowerPoint slide — the same place Kawasaki's floor lands after normalization. Three unrelated lineages agree on the body floor. *(derived)*

## Safe areas and grid

Safe areas come from **SMPTE ST 2046-1:2009 §5.1**, which specifies for 1920×1080: safe action = 93% = 1786 × 1004; safe title = 90% = **1728 × 972**. Captions (CEA-708/RP 218) use 80%.

| Zone | Box | Margins L/R, T/B |
|---|---|---|
| **Safe title (default)** | 1728 × 972 | **96 / 54 px** |
| Safe action (bleed limit) | 1786 × 1004 | 67 / 38 px |

A deck isn't broadcast, but honour title-safe anyway: boardroom displays overscan, Zoom and Teams float toolbars and caption bars over the bottom of a shared screen, 16:9 content letterboxes on 16:10 projectors, and social/Slack previews crop.

**The grid** *(derived — exact arithmetic on the title-safe width)*:

```
outer margin   96 px L/R, 64 px T/B
content width  1728 px
12 columns × 100 px + 11 gutters × 48 px = 1728   ✓
8 columns  × 174 px +  7 gutters × 48 px = 1728   ✓
spacing scale  8 16 24 32 48 64 96 128 px
```

Use 12 columns when the deck carries KPI rows and small-multiple grids (12 divides by 2, 3, 4, 6); 8 when it's mostly text plus one chart. Clean splits, all verified to 1728: `12` full · `6+6` (840 each) · `8+4` (1136+544) · `4+4+4` (544 each) · `3+3+3+3` (396 each) · `3+9` (396+1284).

## Slide anatomy

Anchored on Alley's layout rule — leave at least a half-inch of whitespace below the headline, which is 72 px at 1080. *(derived)*

| Zone | y @1080 | Contents | Size |
|---|---|---|---|
| Eyebrow (optional) | 64–88 | section/category, uppercase, tracked | 24 px |
| **Title (assertion)** | 96–262 | full sentence, ≤2 lines, left-justified | 72 px / lh 1.15 |
| Alley gap | 262–336 | mandatory whitespace (≥72 px) | — |
| **Content well** | 336–960 | chart, table, image, evidence | 32–56 px |
| Footer | 992–1016 | source + method (left), page no. (right) | 24 px |

Content well = **1728 × 624 px**, about half the frame. Target ≥30% of the well unpainted, which lands a well-made slide near two-thirds empty by area. *(derived, not a published rule — the sourced parts are SMPTE's 19% title-safe reserve and Alley's half-inch gap.)*

## Type

**Scale** — IBM Carbon's accelerating scale doubled for slide canvas. An accelerating scale is right for slides: tight steps at label sizes, huge jumps at display sizes, where a single geometric ratio either explodes at the top or collapses at the bottom. *(derived)*

| Role | px @1920 | pt | Notes |
|---|---|---|---|
| Cover display | 168 | 84 | 1–3 words |
| KPI number | 136 | 68 | tabular figures required |
| Section divider | 96 | 48 | |
| **Title (assertion)** | **72** | **36** | ≤2 lines, left-justified |
| Lead / callout | 56 | 28 | |
| **Body** | **48** | **24** | room floor |
| Secondary / data label | 40 | 20 | |
| Chart annotation | 32 | 16 | absolute room floor |
| Axis tick | 28 | 14 | prefer direct labels |
| Source / footnote | 24 | 12 | not room-readable by design |

**Floors.** Presented: nothing readable below 32 px/16 pt, body ≥48 px/24 pt, title ≥64 px/32 pt (target 72). Read deck: floor 20 px/10 pt, body ≥28 px/14 pt.

**The phone-in-Slack rule.** A 16:9 slide inline in Slack on a phone renders at roughly 0.18–0.20× a 1920 master, so a 48 px body arrives at ~9 px and an axis tick is invisible. A slide that must survive forwarding carries **exactly one thing ≥ 80 px / 40 pt** and nothing else that matters. Design the *title* to be the message — which is the assertion-evidence prescription — and this solves itself. *(The method is sound; the specific Slack render widths are estimates, not measured values.)*

**Discipline.** Five sizes is a good deck; more than seven is unsystematized. Ban in-between sizes — if something "needs" 60 px, it needs 56 or 72. Two families maximum: a display face for titles and KPI numbers, a neutral sans for body. Line-height 1.10–1.15 on titles, 1.35–1.45 on body. Negative tracking on display sizes, zero at title, positive only on all-caps eyebrows — and caps never for content (Alley: avoid all capitals, italics, and underline).

**Numbers.** `font-variant-numeric: tabular-nums lining-nums` anywhere numbers stack, align in a column, or change in place. Proportional figures make an animated counter shimmy as digits change; old-style figures dip below the baseline and look wrong in a KPI. Reserve a true mono face for code, IDs, and timestamps — not narrative numbers.

## Color and contrast

The governing criteria are **SC 1.4.3** (4.5:1 text, 3:1 large — large being ≥18 pt/24 px, or ≥14 pt bold/18.66 px), **SC 1.4.6** (7:1 / 4.5:1), and the one nobody uses: **SC 1.4.11**, requiring **3:1 for graphical objects** — which covers chart bars, lines, and points.

| Element | AA | Presented target | Read target |
|---|---|---|---|
| Body < 24 px | 4.5:1 | **7:1** | 4.5:1 |
| Large text ≥ 24 px | 3:1 | **4.5:1** | 3:1 |
| Slide title | 3:1 | **7:1** (it's the message) | 4.5:1 |
| Chart marks | 3:1 (1.4.11) | **3:1 vs background *and* vs adjacent series** | 3:1 |
| Labels on marks | 4.5:1 | 4.5:1 | 4.5:1 |
| Gridlines, rules | — | **1.5–2:1, deliberately below** | 1.3–1.8:1 |

**On projection.** WCAG says nothing about projectors — the words don't appear in the Understanding document for 1.4.3, and the formula bakes in a fixed 5% viewing-flare constant that a lit room far exceeds. Targeting the AAA figure for projected decks is sound engineering judgement, but it is not a compliance claim. *(convention)*

**Room decisions.**

| Situation | Background |
|---|---|
| Projector, lights on | **Light** — projected "black" is only as black as the room |
| Projector, lights down | Either; dark reduces glare |
| LED wall / large TV | Dark works (emissive black is real black) |
| Zoom/Meet share | **Light** — you can't know the viewer's ambient light |
| Will be printed | Light, mandatory |

Never pure `#000` on pure `#FFF`. A near-white base (`#FAFAF8`–`#F7F7F5`) with near-black ink (`#141414`–`#1A1A1A`) is still ~18:1 without the glare. Keep background and ink as two tokens so the whole deck inverts in one place.

**Accent budget** *(convention)*: one primary accent (the "this is the point" color), one secondary (comparison/prior period), one alert hue used *only* for genuinely bad news, a 5–7 step neutral ramp, and ≤6 categorical hues in any chart — beyond that you needed a different chart.

**The red/green problem.** Around 1 in 12 men have a colour vision deficiency, and most cases involve the green cones — so the finance-deck convention of red-down/green-up fails for a meaningful share of any large audience. Use **blue ↔ orange** as the bidirectional pair; it survives deuteranopia, protanopia, and greyscale printing. Never encode with colour alone — add the sign (`+4.2%` / `−4.2%`), a glyph, or position. If brand mandates red/green, force ≥3:1 luminance separation so they survive a CVD simulation. Reserve red exclusively for negative; a red that also appears as decoration destroys the semantic.

## Motion

Two findings govern everything here. Tversky's **Congruence Principle**: the format of the graphic must correspond to the format of the concept. And Heer & Robertson, on animated transitions in statistical graphics: animation beats static in most conditions, staged beats direct — but *heavy* staging increased error, so "we recommend the use of simple staging," with stages around a full second rather than half.

| Event | Duration | Easing |
|---|---|---|
| Hover / press | 70–110 ms | `cubic-bezier(0.2, 0, 0.38, 0.9)` |
| Emphasis change (highlight, dim siblings) | 150 ms | `cubic-bezier(0.2, 0, 0.38, 0.9)` |
| **Element reveal** (fade + 16 px rise) | **240 ms**, stagger 60 ms, ≤5 items | `cubic-bezier(0, 0, 0.3, 1)` |
| **Slide change** | **400 ms** | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| Section divider (act break) | 700 ms, ≤4 per deck | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| **Chart values** (same encoding) | **1000 ms** | ease-in-out |
| **Chart schema** (bars → pie, drill) | staged 2 × 600 ms, 100 ms dwell | ease-in-out |
| Axis rescale | 400 ms in its own stage | ease-in-out |
| KPI counter | ≤800 ms | ease-out (needs tabular figures) |
| `prefers-reduced-motion` | 0 ms transform, ≤100 ms opacity | linear |

reveal.js defaults to an 800 ms slide transition, which reads sluggish — set it to fast (400 ms). Nielsen Norman's range for professional-feeling motion tops out around 400 ms, and 500 ms is where animation "starts to feel like a real drag."

**Build ethics — the rules that actually matter:**

1. **Only animate between states sharing a data dimension.** Without shared structure, animation "may be ill-defined or misleadingly convey false relations" (Heer & Robertson) — use a cut or a dissolve instead, as cinema does.
2. **A reveal must be congruent with the data's own order.** A line wiping left-to-right is congruent — the x-axis *is* time. Bars for *categories* growing from zero is not; it implies growth that isn't in the data. Bars for *time periods* appearing in sequence is fine.
3. **Never reveal in an order that lands on a conclusion the full chart doesn't support.** Three rising quarters, then the falling fourth as a "reveal," is a rhetorical move dressed as a data move.
4. **Highlight-based builds beat entrance-based builds.** All data visible at 25–35% on entry, focus series to 100% in 150 ms. This satisfies signalling without ever hiding data.
5. **No decorative slide transitions.** Cut, or a 400 ms fade/push. Cube, morph, ripple, page-curl are seductive details in Mayer's sense — they violate coherence.
6. **Budget:** ≤1 build sequence per slide, ≤5 steps per build.
7. Wrap all motion in `prefers-reduced-motion` — vestibular reactions to triggered animation include nausea and migraine (WCAG 2.3.3). Keep the state change, drop the movement.

## Layout archetypes

**Assign an archetype to every slide before laying out a single one.** Uniform slide rhythm is the loudest signal of a generated deck, and it is the most common failure in generated work by a wide margin.

### Why this rule gets missed

It loses a fight with a rule you're already following. "Assertion title, one idea, chart as evidence" — applied faithfully, slide after slide — produces *title over one chart*, forever. The deck passes every content rule and still looks machine-made, because **assertion-evidence constrains the argument, not the layout.** The evidence is what varies: sometimes a chart, sometimes three numbers, sometimes a table, sometimes one sentence at display size.

If you find yourself building a third consecutive title-over-chart slide, the content rule is not telling you to do that. Change the evidence form or merge the slides.

### The archetypes

| Archetype | Grid | Use |
|---|---|---|
| Full-bleed chart | 12 | The hero chart; one claim, maximum evidence |
| Chart + reasoning | 8 + 4 | Chart with annotation stack or takeaway box |
| Comparison | 6 + 6 | Two states, two scenarios, before/after |
| Small multiples | 4+4+4 or 3×3 | Many comparable groups |
| KPI row | 3+3+3+3 | 3–4 headline numbers with context lines |
| Single KPI | centred | One number that *is* the slide |
| Statement | centred, display size | Act break, the turn, the ask |
| Table | 12, ≤7 rows | Exact lookup only |
| Full-bleed image | 12 | Once per section at most |

### The hard rules

1. **Never three consecutive slides on the same archetype.** Two is the ceiling. This is the one to check while building, not afterwards — it's local, so it needs no counting.
2. **≥5 distinct archetypes per 20 slides**, and ≥3 in any deck of 8 or more.
3. **No single archetype exceeds 40% of the deck.** If more than four slides in ten are title-over-chart, the deck has one layout with decoration.
4. **Every section gets at least one non-chart slide** — a statement, a KPI row, or a divider. A section that is nothing but charts has no rhythm.
5. **Declare the archetype per slide in the storyline**, before layout. Variation is designed in; it cannot be retrofitted, and auditing at the end always comes too late to fix cheaply.

### Quick audit

Write the archetype sequence as a single line and read it:

```
S1 cover · S2 statement · S3 KPI-row · S4 full-bleed-chart · S5 chart+reasoning
S6 chart+reasoning · S7 comparison · S8 statement · S9 small-multiples · S10 single-KPI
```

Any run of three identical labels is a bug. A line with only two distinct labels is a bug. If you can't produce this line, you didn't assign archetypes — go back and do it.

Left-align by default (Alley). Centre only covers, section dividers, statement slides, and single-KPI slides.

## Presenter ergonomics

**What goes where.** On the slide: the assertion, the evidence, direct labels on the points you'll mention, the source footer. In the notes: the transition sentence into the next slide, method and sample size, the exact numbers you'll say aloud, the anticipated objection and your answer, a timing checkpoint. Never put the script on the slide — the audience reads instead of listening, which is Mayer's redundancy penalty.

**Timing.** The 2 min/slide planning anchor is convention, not research; its only quasi-authoritative source is Kawasaki's 10 slides / 20 minutes. *(convention)*

| Talk | Main-body slides |
|---|---|
| 5 min | 4–6 |
| 10 min | 8–12 |
| 20 min | 10–15 |
| 30 min | 15–22 |
| 45–60 min | 25–40 (dividers every 5–7) |

Correct for reality: build steps cost slide-time (a 4-step build ≈ 4 slides), a chart you actually walk through costs 2–4 minutes rather than 1, and section dividers are nearly free.

**Appendix** *(convention)*. Main deck ends at the ask. Everything else goes behind an "Appendix" divider, same grid and type scale but reference-density. Number them `A1, A2…` so you can say "A7" and someone can jump there, and keep a hidden index slide listing them — that's what you actually navigate from during Q&A. For a decision meeting: one backup slide per anticipated objection, each titled with an assertion that *answers* the objection.

## The generated-deck tells

Specific, documented, and worth forbidding explicitly.

| Tell | Rule |
|---|---|
| Blue→purple gradients (traced to Tailwind's `indigo-500` default) | No gradients as background. Flat fills. |
| Template purple accents | Don't use `#6366F1` / `#8B5CF6` / `#7C3AED` unless it's genuinely the brand colour |
| Inter/Roboto everywhere | Name the typeface as a decision; if Inter, pair it with a different display face |
| Three rounded cards with thin line icons | ≤1 icon per slide, or zero. Never a row of icons above headings |
| Centred everything | Left-align by default |
| Every slide the same layout | ≥5 archetypes per 20 slides; ≤2 consecutive sharing one |
| Soft shadows at 0.1 opacity on everything | No shadows on content blocks — hairline or a background tint step |
| Rounded-xl on everything | One radius token, applied to at most one element class |
| Weightless headlines ("Build faster. Ship smarter.") | Every title carries a number or a verb of change |
| Stock photography | Prefer data as the image; if a photo, full-bleed, once per section |

The root cause is worth remembering: without specific constraints, a model returns the median of its training corpus. Every rule above is a constraint that moves the output off that median.

## Pre-ship checklist

- [ ] Titles read alone as a coherent argument, in order.
- [ ] Every title is a full sentence with a number or verb of change, ≤2 lines, left-justified.
- [ ] Every number traces to supplied data. No invented figures, benchmarks, or sources.
- [ ] Reading condition declared, and density matches it.
- [ ] Nothing load-bearing below 32 px/16 pt; each slide has one element ≥80 px/40 pt.
- [ ] Contrast targets met, including 3:1 for chart marks against background *and* adjacent series.
- [ ] No meaning carried by colour alone.
- [ ] Charts pass the `dreambase-visualization-design` integrity gate.
- [ ] Animation only between states sharing a data dimension; builds highlight rather than withhold.
- [ ] Nothing essential is hover-only.
- [ ] Every slide has a title placeholder; every visual has alt text; shape order matches reading order.
- [ ] Source line on every slide carrying data; method and caveats in the notes.
- [ ] **Archetype sequence written out as a line and read.** No run of three identical labels; ≥5 distinct archetypes per 20 slides; no archetype over 40% of the deck; every section has at least one non-chart slide.
- [ ] Nothing crosses the title-safe box; no text overlaps a plot area; nothing truncated.
- [ ] `prefers-reduced-motion` honoured.
- [ ] Cold-reader test: someone with no context extracts the decision and the ask.
