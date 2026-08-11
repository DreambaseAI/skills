---
name: dreambase-visualization-design
description: >-
  Design, critique, and improve charts, dashboards, infographics, analytical
  displays, and data stories using evidence-based visualization, perceptual,
  statistical, accessibility, and dashboard principles. Use when selecting
  chart types, reviewing or laying out dashboards, designing KPIs or
  infographics, writing visualization specs, reducing clutter, checking
  whether a chart misleads, or making any "which chart / how should this
  look" decision — even if the user only says "make this look better" or
  "review my dashboard". For authoring the actual ECharts option JSON, use
  dreambase-echarts after the design decisions here.
---

# Visualization and Dashboard Design

Create visualizations that help a defined audience answer a defined question, make a decision, or notice an important condition.

Treat visual design as the final stage of a reasoning process, not decoration. First understand the domain problem, then the analytical operation and data type, then the visual encoding and interaction model (Munzner's nested model — most bad dashboards fail at the abstraction level, before any chart was chosen). Never jump from raw fields to a chart type.

This skill is an original synthesis of broadly accepted guidance. Cite influences when explaining why a recommendation exists; never copy source wording or graphics (`references/sources.md` has the reuse policy).

## Non-negotiable rules

1. Start with the audience, decision, and analytical question.
2. Match the display to the relationship in the data.
3. Prefer visual encodings people can compare accurately.
4. Use the simplest display that preserves the necessary meaning.
5. Show the context needed to interpret every important value.
6. Separate monitoring, exploration, and explanation.
7. Use color to organize and emphasize, not decorate.
8. Never use color as the only carrier of meaning.
9. Preserve statistical honesty, uncertainty, and data limitations.
10. Never invent data, benchmarks, labels, sources, or conclusions.

## Required inputs

Collect or infer: audience and data literacy; the decision or question; data fields, grain, units, time range, definitions; primary comparison, baseline, or target; delivery surface; update frequency; expected interactions; accessibility requirements; brand constraints.

Ask when missing information could change the chart or its interpretation — never guess metric definitions, denominators, business meaning, or causal relationships ("active users" has a dozen incompatible meanings). When minor details are missing, state minimal assumptions and continue.

## Design workflow

1. **Characterize the problem.** One sentence each: who uses this, what they need to know, what action follows, how fast they must understand it, what a costly misunderstanding looks like. Convert vague goals ("show the data") into observable tasks ("detect whether a metric is outside tolerance").
2. **Abstract the analytical operation** before selecting a chart: lookup, compare magnitude, rank, track change, compare two points, deviation from target, distribution, correlation, part-to-whole, flow, spatial, uncertainty, many panels, hierarchy.
3. **Audit the data**: grain, units, time zones, missing-vs-zero, duplicates, denominators, sample size, outliers, cardinality, negatives, whether totals are meaningful, comparability, uncertainty. Resolve or disclose before choosing a visual.
4. **Select the form** from the matrix below. Prefer familiar forms unless a less common one materially improves the task.
5. **Design the encoding.** Map the most important comparison to the most accurately perceived channel (magnitude data): position on a common scale → position on unaligned scales → length → angle/slope → area → color luminance/saturation. Hue is a poor magnitude channel but the second-best identity channel for categories — the two-list distinction (Munzner) resolves most color arguments. Full rankings and evidence: `references/foundations.md`.
6. **Add interpretive context**: units, period, comparison, target, denominator, source, freshness, active filters, definitions, caveats. A number without context is not an insight.
7. **Remove nonessential elements** (3D, gradients-as-decoration, shadows, heavy borders, dense grids, redundant legends, excess precision, purposeless animation) — but don't strip useful structure to achieve minimalism; Tufte's data-ink principle carries his own "within reason" qualifier. Keep labels, reference lines, and explanations that aid comprehension.
8. **Direct attention**: most content quiet, one primary emphasis, highlight exceptions and decision-relevant values, annotate why a highlight matters.
9. **Validate** at each level separately (problem fit, data abstraction, encoding, interaction, performance, accessibility) — a fix at one level can't rescue a failure at another.

## Chart-selection matrix

| Analytical need | Preferred starting point | Good alternatives | Avoid by default |
|---|---|---|---|
| Exact lookup | Table | Highlight table, compact list | Chart forcing estimation |
| Magnitude comparison | Bar chart, dot plot | Lollipop | Pie, bubble, 3D column |
| Ranking | Sorted horizontal bar | Ordered dot plot | Unsorted categories |
| Time trend | Line chart | Column for discrete periods | Pie series, unexplained smoothing |
| Two-point change | Slope chart | Dumbbell, paired dots | Multiple pies |
| Deviation from target | Diverging bar, bullet graph | Variance column, reference line | Standalone traffic light |
| Distribution | Histogram, dot strip, box plot | Violin for expert audiences | Mean-only bar chart |
| Correlation | Scatterplot | Hexbin/density for large data | Dual-axis implying relationship |
| Part-to-whole | Sorted bar, 100% stacked bar | Pie for a few obvious shares | Many slices, nested donuts |
| Flow | Sankey/alluvial when paths matter | Network, funnel for staged loss | Sankey for simple ranking |
| Spatial pattern | Choropleth for rates, symbols for totals | Hex map, small-multiple maps | Map when geography is incidental |
| Uncertainty | Error bars, interval band, fan chart | Scenario small multiples | Single precise line for forecasts |
| Many comparable groups | Small multiples | Faceted table or heatmap | Many overlapping lines |
| Hierarchy | Indented table, tree | Treemap for approximate area | Treemap for precise comparison |

## Format decision

Chart vs. dashboard vs. infographic vs. written report is a design decision in itself: author-driven single message for a broad audience → infographic; reader-driven recurring monitoring → dashboard; contested conclusions needing methodology → report. Full decision table and infographic-specific craft (narrative arc, embellishment evidence, sourcing norms): `references/infographics.md`.

## References — read the one matching the task

- `references/chart-rules.md` — per-chart-type rules (tables, bars, lines, pies, maps, KPIs, dual axes, …), axes/scales/numbers, titling and annotation. Read when recommending or critiquing a specific form.
- `references/dashboards.md` — dashboard modes, page structure, progressive disclosure, interaction design, monitoring vs. storytelling. Read for any multi-view display.
- `references/infographics.md` — infographic and data-story craft, what the memorability research actually licenses, format decision criteria.
- `references/color-accessibility.md` — color roles, palette limits, CVD, WCAG 2.2 thresholds, Chartability audit, alt-text patterns. Read for every deliverable's accessibility section.
- `references/integrity.md` — statistical/ethical rules, LLM-specific safeguards, and the final quality gate. Read before delivering anything.
- `references/output-templates.md` — the standard chart-recommendation, dashboard-brief, and critique output structures, the 12-dimension review rubric, and the anti-pattern checklist. Use the matching template for every deliverable.
- `references/foundations.md` — the verified research canon (Bertin, Cleveland–McGill, Tufte, Shneiderman, Munzner, Heer–Bostock) with exact rankings and the misreadings to avoid. Read when justifying or arbitrating a rule.
- `references/sources.md` — full source list and reuse policy.

## Working with dreambase-echarts

This skill decides *what* to build and *why*; `dreambase-echarts` builds it. When the deliverable is a rendered chart: run this skill's workflow to choose form, encoding, context, and accessibility requirements — then hand the resulting spec to the dreambase-echarts skill to author and validate the option JSON. In critiques of existing ECharts configs, use this skill for the design findings and dreambase-echarts for the mechanical config fixes.

## Output discipline

Every deliverable ends by passing `references/integrity.md`'s final quality gate. When a requested chart would mislead, explain the risk and propose an honest alternative — don't silently comply, and don't refuse without offering what the data honestly supports.
