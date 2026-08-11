---
name: dreambase-data-stories
description: >-
  Design best-in-class data-story artifacts — reports, executive summaries,
  slide decks, one-pagers, infographics, and scrollytelling pieces — that
  blend accurate charts, illustration, great typography, and narrative
  structure into easy-to-consume stories. Use whenever the user wants to
  present, summarize, or communicate analytics or data to an audience: "make
  a report", "exec summary", "board deck", "slides", "one-pager", "data
  story", "writeup of these results", or "make this presentable" — even if
  they don't mention design. Always apply dreambase-visualization-design for
  the charts themselves; use dreambase-echarts when charts will actually
  render.
---

# Data Stories

Turn analysis into artifacts people actually read, understand, and act on. The bar is the work of the field's best — FT, NYT Graphics, The Pudding, Reuters — where accurate charts, deliberate typography, and narrative structure combine into something that reads effortlessly. "Mechanically correct content in default styling" is the failure mode this skill exists to prevent.

## Skill composition (non-optional wiring)

- **`dreambase-visualization-design` — always.** Every chart in every artifact follows its selection matrix, encoding rules, and integrity gate. This skill adds the narrative and layout layers on top; it never overrides honest scales, context, or accessibility. Beauty doesn't buy exemptions.
- **`dreambase-echarts` — when charts render.** Standard forms from its references; bespoke/illustrative forms via its custom-series reference (charts/custom.md in that skill — custom series, pictorialBar, graphic layer).
- **Mechanics skills — when producing files.** If available, delegate .pptx to the `pptx` skill, .docx to `docx`, PDF to `pdf`; this skill owns the design system those mechanics execute.

## Core stance

1. **Story before design, design before build.** The Big Idea (one complete sentence: point of view + stakes) exists before any layout; if it can't be written, return to the analysis.
2. **Answer first for deciders, arc for readers.** Executive artifacts use the pyramid: conclusion, then support. Narrative artifacts use hook → context → build → insight → resolution. Know which you're making.
3. **Annotation is narration.** The text layer — claim-titles, direct labels, callouts — is the product, not garnish. Edit chart text as rigorously as body copy.
4. **One idea per view** for scrolling and deciding audiences; density only for audiences who will linger.
5. **Scroll over click.** Nothing load-bearing hides in a tooltip or behind interaction; clicks must deliver something spectacular.
6. **Bespoke when the story demands it, standard by default.** Custom forms make the exceptional story memorable; automation and standard forms carry the daily work.
7. **Beauty earns attention; encoding earns trust.** Spend craft on typography, composition, and the annotation layer — never on distorting marks.
8. **Design for the constrained reader**: mobile, print, screen-reader, forwarded-without-context.

These distill the verified practice of Bremer, Lupi, The Pudding, NYT Graphics, Bostock, Burn-Murdoch, Reuters Graphics, McCandless (and his critics), and FiveThirtyEight — including where they disagree. Read `references/storytellers.md` for the full principles, quotes, and contested points.

## Workflow

1. **Frame** — audience, decision or takeaway, format, tier (exec/manager/analyst), constraints. Write the Big Idea sentence. (`references/narrative-structure.md`)
2. **Outline the argument** — pyramid for exec artifacts, arc for narrative ones. Slide titles / section heads must read as a coherent argument alone.
3. **Choose the evidence** — for each point, the one chart or number that proves it. Run every chart decision through `dreambase-visualization-design` (its matrix, then its integrity gate). Identify the **hero chart** — the one that *is* the argument.
4. **Design the system** — type pairing and scale, 4–6 color palette, grid — once, for all artifacts from this analysis. (`references/page-design.md`)
5. **Integrate** — charts share the artifact's type and palette; annotation carries the narration; illustration frames but never encodes. (`references/chart-integration.md`)
6. **Build** — via the mechanics skills or clean HTML; bespoke chart forms via dreambase-echarts custom toolkit.
7. **Test the cold reader** — can someone with zero context extract the takeaway (5 seconds for an infographic, 30 seconds for an exec summary)? Fix the artifact, not the reader.

## References — read what the task needs

- `references/narrative-structure.md` — pyramid principle/BLUF, the Big Idea, story arcs, exec-summary/slide/report/infographic conventions, presentation-vs-slidedoc, audience tiering. Read first for any new artifact.
- `references/page-design.md` — typography system, numeric craft (tabular figures, real minus signs), grid, color-as-system, tables, big-number callouts, format-mechanics delegation. Read when designing the artifact's look.
- `references/chart-integration.md` — hero charts, assertion-evidence titling, annotation-as-narration, making charts belong to the design, illustration rules, interactivity budget, the pre-ship checklist. Read when placing charts into layouts.
- `references/storytellers.md` — the verified practice of the field's masters, the 12 cross-cutting principles, and which are contested. Read when choosing a storytelling approach or justifying a bespoke form.

## Output discipline

Deliverables state their format, audience tier, and Big Idea up front, and always include the design layer — hierarchy, callouts, type and color intent — even when the output format is plain markdown; the content alone is half the deliverable. Every chart passes the visualization-design integrity gate; every artifact passes the cold-reader test; observation, interpretation, and recommendation stay visibly separated. When asked to make data "more impressive" than it is, apply the integrity playbook: explain the risk, deliver what the data honestly supports, styled so well nobody misses the distortion.
