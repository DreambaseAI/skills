# Narrative Structure

How to structure the argument before designing a single page. The story is decided at the outline level; layout only makes it legible.

## Answer first (the pyramid principle)

Executive artifacts lead with the conclusion, then support it — never build to a reveal. Barbara Minto's pyramid (The Minto Pyramid Principle): one governing thought at the top, supported by 3–4 grouped arguments, each supported by evidence. The military version is BLUF — bottom line up front.

- The **governing thought is a claim, not a topic**: "Churn is concentrated in month-2 self-serve users; fixing onboarding recovers ~$2M ARR" — not "Churn analysis."
- Each section answers the question its parent raises. If a section doesn't support the governing thought, it goes to the appendix or gets cut.
- Order groups by MECE logic (mutually exclusive, collectively exhaustive) and by what the audience will ask next.

This inverts narrative instinct — journalists and novelists build tension; executives triage. Use the three-act arc *within* sections and for standalone stories; use the pyramid for anything a decision-maker reads.

## The Big Idea

Before outlining, write one complete sentence that (a) states your point of view, (b) conveys what's at stake, (c) is a full sentence (Knaflic's test). If you can't, the analysis isn't finished — go back to the data. This sentence becomes the title of an exec summary, the headline of slide 1, or the hook of an infographic.

## Story arcs for narrative formats

For data stories, visual essays, and presentations that earn attention rather than assume it:

1. **Hook** — why this matters now (a surprising number, a tension, a question).
2. **Context/baseline** — what normal looks like; the minimum needed to interpret what follows.
3. **Build** — evidence in deliberate sequence, each view answering the question the previous one raised.
4. **Climax/insight** — the finding, given the most visual weight in the whole piece.
5. **Resolution** — implication, recommendation, next step.

One idea per view/scene. If a chart needs a paragraph to explain its role in the argument, split it into two charts or cut it.

## Format-specific conventions

### Executive summary

- One page. Answer first, three to four supporting points, each with its number and its "so what."
- Every number carries context (vs. what, over what period, why it matters) — a bare KPI is not a finding.
- The cold-reader test: someone with no context extracts the decision and the ask in 30 seconds. Test this literally (hand it to a fresh reader — or a fresh model instance — and ask "what's the decision?").
- State confidence and caveats in one honest line, not a hedge-everything paragraph.
- Deliver the design layer, not just the content: even when the deliverable is markdown, specify the visual hierarchy — headline treatment, which numbers become big-number callouts, what gets the emphasis color, table styling — so whoever produces the final artifact inherits the design intent. Content without layout guidance is half the deliverable (`page-design.md` has the system to draw from).

### Slides — presentation vs. slidedoc

Decide which you're making (Duarte's distinction):

- **Presentation slides** (spoken over): one idea per slide, headline states the claim ("assertion-evidence" style: title = assertion, body = the evidence chart), minimal text, big type. The presenter is the narration.
- **Slidedoc** (read unaccompanied, sent around): denser, self-explanatory, full sentences allowed, annotations carry the narration. Most "decks" that get emailed are slidedocs pretending to be presentations — design for how it will actually be consumed.
- Slide titles across the deck should read as a coherent argument on their own (flip through titles only — is the story there?).

### Report / long document

- Open with the exec summary (pyramid); the body earns its length with evidence and method.
- Sections open with their conclusion as the heading or first sentence, then support.
- Layer detail: body for the argument, appendix for completeness. Never make the main thread wade through completeness.

### Infographic

See `dreambase-visualization-design`'s `references/infographics.md` — one message, three-act structure, 5-second rule. This skill adds the layout/typography layer on top of those rules.

## Audience tiering

The same analysis often ships as multiple artifacts. Design them as one system, not three documents:

- **Exec tier**: the decision, the three numbers that matter, the ask (one page / three slides).
- **Manager tier**: + drivers, comparisons, and what changes operationally.
- **Analyst tier**: + method, data lineage, uncertainty, reproducibility.

Cut down from the full story; never pad up from a summary. Keep the same headline claim, palette, chart forms, and terminology across tiers so the artifacts corroborate each other.

## Observation vs. interpretation discipline

Inherited from `dreambase-visualization-design` and non-negotiable in narrative formats, where the temptation is strongest: what the data shows (observation), what plausibly explains it (interpretation), what to do (recommendation) — visibly separated, never blended into one confident sentence.
