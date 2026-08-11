---
name: dreambase-data-presentation
description: >-
  Design and build data presentations — slide decks, board and investor decks,
  QBRs, analytics readouts, launch and sales decks, conference talks, and
  interactive web decks — that hold up in a room, in an inbox, and on a phone.
  Use whenever the user wants slides or a presentation: "make a deck", "turn
  this into slides", "board deck", "pitch deck", "QBR", "readout", "all-hands",
  "present these results", "PowerPoint", "pptx", "Google Slides", "keynote",
  "talk", "webinar", "speaker notes", "slidedoc", "reveal.js", or an
  interactive/HTML deck — even if they only say "put this in slides" or "we're
  presenting this Thursday". Covers storyline, slide layout and type specs,
  staged chart reveals, presenter mechanics, accessibility, and the build path
  (self-contained HTML, .pptx, Google Slides, or a spec). Composes with
  dreambase-data-stories, dreambase-visualization-design, dreambase-echarts,
  and any brand guide, design.md, or .potx the user supplies.
---

# Data Presentations

A presentation is a data story constrained by a room, a clock, and a person talking over it. Those three constraints change almost every design decision — which is why a deck is not a report with page breaks.

## The rule everything else serves

**Every content slide's title is a full-sentence assertion, left-justified, no more than two lines.** Not a topic. Not a label.

> "Q3 revenue grew 12% on enterprise renewals" — yes.
> "Q3 Results" — no.

This is the most over-determined rule in the entire field. Six independent traditions arrived at it separately: Alley's assertion-evidence (28 pt, ≤2 lines, left-justified), Duarte, Reynolds ("write a declarative statement rather than a title"), Doumont ("a complete sentence, with a subject and a verb… no more than 12 words or so"), consulting action titles ("NEVER have a title that is longer than two lines"), and NYT-style claim-titling. Nothing else in the canon has that much agreement behind it.

It also solves problems that look unrelated: the title is the only element that survives being viewed on a phone in Slack; the titles read in sequence are the argument (horizontal logic); and a slide whose title states the conclusion still works when it's forwarded without you.

## First fork: reading condition, not audience seniority

Decide *how the artifact will be consumed* before designing anything. This is the single highest-leverage decision, and getting it wrong is what produces the deck everyone complains about.

| | **Presented** | **Sent** | **Reference** |
|---|---|---|---|
| Condition | Room or screen share, you narrate | Inbox, read once, no narration | Looked up, scanned, quoted |
| Words in content zone | ≤ 20 | ≤ 60 | unbounded |
| Series per chart | ≤ 3 | ≤ 5 | ≤ 8 |
| Elements in content zone | 1 | 1–3 | 3–6 |
| Body floor | 48 px / 24 pt | 28 px / 14 pt | 24 px / 12 pt |
| Title | assertion | assertion | assertion |

The density variable is the reading condition, never the seniority of the audience. An exec deck isn't sparser because execs are busy; it's sparser because someone is talking over it.

Two consequences worth stating plainly:

- **Most analytics work is not a presentation.** Duarte classifies "Research Findings," "Reports," and "Status Update" as *slidedocs* — read, not presented. If it will be emailed, design a slidedoc and say so: ~100 words/page (175 ceiling), and **at 250+ words per page, stop making slides and write a document**.
- **Never present a slidedoc aloud, and never send a presented deck without a companion.** If real narrative is needed for the sent version, put it in speaker notes and export notes pages — don't thicken the slides.

## Skill composition

- **`dreambase-data-stories` — for the argument.** It owns the Big Idea, the pyramid/arc, and audience tiering. This skill owns the slide, the room, and the presenter. When both apply: get the Big Idea and storyline there, then bring them here. When it isn't available, `references/deck-genres.md` carries enough storyline structure to work standalone.
- **`dreambase-visualization-design` — for every chart.** Its selection matrix and integrity gate stay in force. This skill adds what it doesn't cover: legibility at room distance, staged reveals, and one-chart-carries-one-claim.
- **`dreambase-echarts` — when charts render.** Deck-specific animation settings are in `references/interactive.md`; don't accept ECharts' defaults for a deck.
- **`dreambase-public-reports` — when the audience is external.** Its redaction rules govern before anything ships.
- **A brand skill, `design.md`, `.potx`, or a brand URL — whenever offered.** `references/brand-theming.md` has the extraction procedure per input type. Absent any brand input, derive a system rather than reaching for defaults.

## Non-negotiables

1. **Assertion titles**, per above. A deck whose titles don't read as a coherent argument on their own isn't finished.
2. **Every number traces to data you were given.** This is the failure mode that defines the category: AI deck tools accept only text input, so when a layout has a number-shaped hole, the number gets invented — published fact-checks of them report accuracy rates low enough that fabricated statistics have been attached to real named organizations. A number with no source is a bug, not a placeholder.
3. **Nothing load-bearing below the room floor** — 32 px / 16 pt presented. The message itself ≥ 80 px / 40 pt, so the slide survives a phone.
4. **Animate only between states that share a data dimension.** Otherwise cut or dissolve. Heer & Robertson: "Without a shared structure between graphics, animation may be ill-defined or misleadingly convey false relations."
5. **Highlight, don't withhold.** Render all data on slide entry at 25–35% opacity and bring the focus series up — rather than adding data progressively. Progressive *addition* lets you land on a conclusion the full chart doesn't support; progressive *emphasis* can't.
6. **Nothing essential in a tooltip or hover.** On stage there is no cursor at all — the presenter is holding a clicker. Direct-label on the slide; save tooltips for the shared link.
7. **Every slide gets a real title placeholder, alt text on every visual, and a source line.** The title placeholder is how screen readers navigate a deck; shape order in the file *is* the reading order.
8. **Vary the layout, and decide it before you build.** Assign an archetype to every slide in the storyline — full-bleed chart, chart+reasoning, comparison, small multiples, KPI row, single KPI, statement, table, image. **Never three consecutive slides on the same archetype; ≥5 distinct archetypes per 20 slides; no archetype over 40% of the deck.** This rule loses a fight with rule 1 if you let it: "assertion title, one chart" applied faithfully produces title-over-chart forever, and the deck passes every content rule while looking machine-made. **Assertion-evidence constrains the argument, not the layout** — the *evidence form* is what varies. If you're building a third title-over-chart slide in a row, change the evidence or merge the slides.
9. **Don't validate against audience preference.** Three independent studies found audiences prefer the design they learn *less* from. Test comprehension ("what's the decision?"), never "does this look good?"

## Workflow

1. **Frame.** Audience and their decision; reading condition (above); genre; room and surface (projector / big screen / Zoom share / PDF); time budget; brand input; whether it must land in someone's existing template. Ask when the answer changes the artifact — especially reading condition and output path.
2. **Storyline.** Pick the genre outline from `references/deck-genres.md`. Write titles only, in order, and read them straight through. If the argument isn't there in the titles alone, fix it now — no amount of layout rescues a broken storyline.
   **Then add an archetype column** — one per slide, chosen against rule 8 — and read the archetype sequence as a line. Any run of three identical labels is a bug you fix here, in the outline, where it costs nothing. Retrofitting variation after the slides exist never happens.
3. **Evidence.** One chart or number per claim, chosen through `dreambase-visualization-design`. Identify the hero chart. Charts that don't prove a title go to the appendix.
4. **System.** Tokens once for the whole deck: canvas, grid, type scale, palette, motion. `references/slide-craft.md` for the specs, `references/brand-theming.md` when brand input exists.
5. **Slides.** Lay out against the grid, building each slide as the archetype you assigned it in step 2. If a slide is fighting its archetype, the evidence is wrong for that claim — change the evidence, don't quietly fall back to title-over-chart.
6. **Interaction and builds.** Only where they earn it (`references/interactive.md`). Default to zero interaction and one build sequence per slide, five steps maximum.
7. **Build.** Choose the output path from `references/build-paths.md` — the path follows from what the user has and needs, not from a default.
8. **Gate.** Run the pre-ship checklist in `references/slide-craft.md`, plus the visualization-design integrity gate on every chart.

## Choosing the output path

Routed by what the user hands over and how the deck gets used — full decision table and mechanics in `references/build-paths.md`.

| Situation | Path |
|---|---|
| Live/interactive charts, you control the surface | Self-contained HTML deck (reveal.js + ECharts, inlined, zero network) |
| Must open in PowerPoint; no corporate template | pptxgenjs with real slide masters and placeholders |
| Corporate `.potx` or existing deck supplied | `pptx-automizer` — author into the actual template |
| Google Slides required | Slides API, within its real limits (no native charts, no SVG, no animation) |
| Static, text-and-image, needs to be tiny | Marp (single-file zero-network by default) |
| Someone else builds it | Storyline + slide-by-slide spec + design system |

Two constraints that decide more than they look like they should: **nothing renders live web content inside a PowerPoint or Google Slides slide** (Microsoft retired the Web Viewer add-in in December 2024; Slides has no embed element), and **no tool converts HTML/CSS into faithful *and* editable PPTX**. So "interactive inside PowerPoint" is always: static slide carrying the full claim, plus a QR/link to the live version, plus the link in the speaker notes — the interactive version is never the only path to the information.

## References — read what the task needs

- `references/deck-genres.md` — canonical outlines for board, investor, QBR, readout, launch, sales, all-hands, keynote, and slidedoc, with the metrics each requires and its failure modes. **Read first for any new deck.**
- `references/slide-craft.md` — the numeric system: canvas and the pt↔px bridge, safe areas, grid, type scale, contrast, motion, density, presenter ergonomics, the generated-deck tells, and the pre-ship checklist. Read when designing or reviewing slides.
- `references/interactive.md` — the interactive-slideshow model, staged chart reveals and their ethics, ECharts settings for decks, live-data discipline, presenter/remote mechanics, keyboard and a11y. Read for any deck with builds, interaction, or animation.
- `references/build-paths.md` — the four build paths with verified mechanics and gotchas: self-contained HTML, pptxgenjs, pptx-automizer, Google Slides API, plus PDF export. Read before building any file.
- `references/brand-theming.md` — extracting a design system from a design.md, website, PDF guide, .potx, or a lone logo; deriving an accessible palette from one brand color; light/dark pairs; the brand-safe checklist. Read whenever brand input exists.
- `references/presenters.md` — the verified canon (Alley, Duarte, Reynolds, Knaflic, Minto, Zelazny, Tufte and Doumont's rebuttal, Rosling, Evans, Meeker, Amazon), what the empirical research actually supports, where the authorities genuinely conflict, and the do-not-cite list. Read when justifying a choice or when a stakeholder invokes a name.

## Output discipline

State the reading condition, genre, and output path up front — they're design decisions the user needs to see, not implementation details. Deliver the design layer even when the output is plain markdown: layout archetype per slide, type and color intent, what's a build step, what's in the notes.

Every chart passes the visualization-design integrity gate. Every deck passes the titles-only read-through and the cold-reader test. Observation, interpretation, and recommendation stay visibly separated — the temptation to blend them is strongest in a room, where nobody can pause to check.

When asked to make the data look better than it is, the honest moves are still available and usually better theatre: a sharper assertion title, a more legible chart, an emphasis build that directs attention to what's genuinely true. Explain the risk of the rest, and deliver what the data supports.
