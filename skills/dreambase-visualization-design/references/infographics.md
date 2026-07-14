# Infographics and Data Storytelling

Infographics are explanatory, single-message, author-driven artifacts for broad audiences — the opposite end of the spectrum from dashboards. Different goals mean different rules: engagement and gist retention are the success metrics here, not decision speed or reading precision.

## When an infographic is the right format

| Choose… | When… |
|---|---|
| Single chart | One question, informed audience, embedded in prose/slides; reading precision matters most |
| **Infographic** | One predetermined message, broad/lay audience, standalone artifact (social, marketing, education), consumed once; engagement and gist retention are the success metrics |
| Dashboard | Recurring monitoring/exploration, reader self-serves with filters; success is decision speed and accuracy |
| Written report | Nuance, caveats, methodology, and contested conclusions; visuals become exhibits inside argument |

Decision heuristics: Who drives the path — author-driven narrative → infographic/report; reader-driven exploration → dashboard. How many messages — one → chart or infographic; several monitored KPIs → dashboard. What must be retained — a gist → infographic; a precise value → chart.

A good infographic is *more* single-message-focused than a dashboard, not less — never substitute one format for the other.

## Core principles

**One message (Krum's 5-second rule).** A viewer should grasp the main point within ~5 seconds. If the takeaway can't be stated in one sentence, the analysis isn't done — design waits. This matches Knaflic's "Big Idea": one complete sentence that states your point of view and what's at stake.

**Three-act structure (Krum, Cool Infographics):** hook (why this matters) → key message / "a-ha" (the central insight, given the most visual weight) → conclusion / call-to-action. Knaflic's version: setup → conflict/rising action → resolution.

**Cairo's five qualities** (The Truthful Art) in priority order: **truthful → functional → beautiful → insightful → enlightening**. The ordering is deliberate: truth and function are preconditions for beauty, not trade-offs against it. Cairo's Visualization Wheel frames infographic style as explicit trade-offs (abstraction↔figuration, density↔lightness, functionality↔decoration): a lay-audience infographic legitimately sits further toward figuration and decoration than an analytical chart — as a conscious choice per axis, never a default.

**Titles carry the memory.** Eye-tracking research (Borkin et al. 2015) found titles and text are the most attended and best-recalled elements of a visualization. Write the headline as the takeaway sentence, not a topic label ("Churn halved after onboarding revamp," not "Churn Rates 2024–2025"). Give the piece one clear focal point.

**Reading flow.** Establish explicit hierarchy: dominant headline → hero visual/stat → sequenced sections. Size, color, and position must agree on what's #1. Don't design *for* the F-pattern — NN/g's own clarification says F-scanning is how users cope with unstructured walls of text; counter it with front-loaded headings and visual anchors so the first three fixations hit headline → key visual → takeaway.

## What the embellishment research actually licenses

Use this to calibrate decoration — the findings are routinely overstated in both directions:

- **Bateman et al. 2010 ("Useful Junk?")**: topically relevant pictorial framing on *simple* charts didn't harm comprehension and improved long-term recall of topic and gist. Limits: n=20, one extreme cartoon style, contested comparison charts (Few's rebuttal), and reversed under time pressure (Li & Moacdieh 2014).
- **Borkin et al. 2013/2015**: recognizable objects, pictograms, distinctive forms, and more color increase *memorability*; pictograms didn't hurt recognition or recall. Limit: memorability ≠ comprehension, persuasion, or decision quality — the authors' own caveat.

Practical rules derived from that evidence:

- Relevant pictorial elements and a distinctive visual identity are legitimate in infographics — they aid gist recall without measurably harming simple-data comprehension.
- Decoration frames; it never *encodes*. Keep the data marks themselves clean: don't scale icons by area to show quantity (use icon counts, ISOTYPE-style, or a real chart), don't bend axes for artwork.
- Icons label and speed recognition: one icon family, one stroke weight, always paired with a word — never the sole carrier of meaning.
- Invest the craft budget in the title and annotations — that's what people actually remember.
- Do **not** cite this research to justify decoration in dashboards or analytical charts; the studies used simple single-message graphics and measured memory, not analysis speed.

## Craft norms

- **Big-number callouts** (large numeral + short label + icon) are the accepted way to feature single statistics — not one-value charts or donut-with-a-number-in-it.
- **Text–visual integration**: annotate directly on the visual; the visual carries the argument with text as connective tissue, not paragraphs with pictures. Short scannable blocks.
- **Sourcing footer** (Krum's norm): source names and URLs, data date range, publication date, designer/publisher credit. Vet sources — primary over aggregated, recent over stale; an infographic inherits the credibility of its worst source.
- **Length**: as short as the story allows. The endless-scroller "tower" infographic is an anti-pattern except for genuinely sequential narratives; each screenful works as a self-contained section with its own mini-headline, and the hook is visible without scrolling. (Specific pixel prescriptions are channel folklore, not research — treat as channel constraints.)
- **Data first** (Yau): the story must come out of analysis actually performed — visualization is the end of a data pipeline, not the start. Form and length follow the verified story, never a template.

## Integrity in infographics

Everything in `integrity.md` still applies — a lay audience makes honesty *more* critical, not less, because readers can't audit the data. The extra infographic-specific risks: cherry-picked hero stats, icon-area distortion, decorative precision (a beautiful number with no denominator), and missing sources. When the brief asks for persuasion the data doesn't support, say so and propose what the data honestly supports.
