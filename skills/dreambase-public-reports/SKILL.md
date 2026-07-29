---
name: dreambase-public-reports
description: >-
  Create disclosure-safe public reports, data stories, dashboards, infographics,
  and static artifacts that are informed by real or sensitive data without
  publishing the underlying values. Use whenever analytics will be shared
  publicly, externally, on a marketing site, in a public report, or with an
  audience that must see honest trends but not confidential numbers. Apply this
  alongside dreambase-data-stories, dreambase-visualization-design, and
  dreambase-echarts; it governs redaction, transformed chart data, constructive
  tone, and approval for visible percentages, rates, deltas, ratios, or indexes.
---

# Public Reports

Create a static public artifact that communicates what the real data supports without disclosing confidential values. Preserve the shape and direction of the evidence, make the result visually useful, and frame challenges constructively without hiding material facts.

## Skill composition

- Apply `dreambase-data-stories` for the narrative, hierarchy, and artifact design.
- Apply `dreambase-visualization-design` for chart selection, encoding, accessibility, and integrity.
- Apply `dreambase-echarts` when charts render with ECharts.
- Treat this skill as the publication-safety layer. It narrows what may enter the public artifact but never relaxes the other skills' requirements for statistical honesty.

## Public boundary

Treat everything delivered to a public browser or downloadable artifact as public, including:

- visible prose, chart marks, labels, axes, legends, annotations, KPIs, and tooltips;
- HTML, JavaScript, JSON, serialized props, hydration payloads, source maps, and network responses;
- SVG text, titles, descriptions, accessibility trees, screen-reader tables, alt text, and image metadata;
- hidden elements, downloadable data, debug output, comments, and filenames.

Hiding text with CSS or disabling a tooltip does not protect values that remain in shipped source. Retrieve sensitive data only in a private build or server environment, then publish a sanitized representation. If a public artifact updates at runtime, its public endpoint must return only disclosure-safe data.

## Disclosure policy

### Values that stay private

Do not publish raw or recoverable absolute values: counts, totals, currency, revenue, costs, volumes, durations, scores, precise benchmarks, targets, sample sizes, or thresholds. Do not substitute coded field names for protection.

Dates, period names, category names, metric definitions, and methodology may remain when they are not independently sensitive. Check entity names and small cohorts because they can reveal confidential information even without a number.

### Visual evidence without public values

Charts and infographics should still show the real pattern. Build them from a disclosure-safe publication model rather than the source data:

1. Analyze the real values privately.
2. Reduce them to the least precise representation that preserves the intended message: quantized display coordinates, ordinal bands, ranks, coarse bins, or another transformed series.
3. Verify that the transformation cannot be used to reconstruct the source values at a meaningful precision.
4. Ship only the transformed representation and public labels.

Exact normalized series can reveal precise relationships, so quantize or bin when that precision is unnecessary. A visual shape may communicate direction, turning points, relative volatility, and broad magnitude without numeric tick labels.

Use these public defaults unless the user approves a specific exception:

- Keep charts, but remove numeric value labels and numeric axis ticks.
- Disable tooltips or make them qualitative, such as `Improving`, `Stable`, `Softening`, or `Higher activity`.
- Keep metric names and non-sensitive time/category labels so the chart remains interpretable.
- Replace number-first KPI cards with status, direction, and plain-language meaning.
- Describe trends without exact quantities: `continued to grow`, `held broadly steady`, `improved after midyear`, or `remains an area of focus`.
- Make accessibility text and fallback tables follow the same disclosure rules as the visible chart.

### Derived-number approval

Percentages, percentage-point changes, rates, deltas, ratios, multiples, and indexed values can provide useful signal without exposing absolute values, but they still reveal information. Before printing any of them, ask for explicit confirmation and name each proposed disclosure and placement.

Use this approval prompt:

> I can keep all absolute values private. May I publicly show [derived value] in [chart annotation / KPI / prose / tooltip / axis]? I will omit it unless you approve.

Approval is scoped, not blanket. Permission for one growth percentage in the summary does not permit other rates or the same number in a tooltip. Record the approved values and placements before building. In the absence of an answer, proceed with no visible derived numbers.

Transformed, unlabeled chart geometry does not require this confirmation, provided the shipped representation is disclosure-safe and contains no printed number. Raw values still stay private even when a derived number is approved.

## Workflow

1. **Define the audience and public boundary.** Confirm which artifact and files will be published, where data is retrieved, and whether any runtime endpoint is public.
2. **Inventory sensitive fields.** Classify raw values, derived values, identifiers, small cohorts, benchmarks, and metadata that could leak through visible or hidden channels.
3. **Propose optional disclosures.** List any percentage, rate, delta, ratio, multiple, or index that would materially improve understanding. Ask for explicit value-and-placement approval before adding it visibly; continue without them if approval is absent.
4. **Analyze privately.** Establish the supported trends, turning points, uncertainty, and material adverse findings from the source data. Do not write the raw dataset into the public output directory.
5. **Create the publication model.** Transform or bin chart geometry, remove raw values, and retain only the context required to interpret the trend.
6. **Compose the story.** Lead with the strongest supported constructive takeaway. Give positive developments appropriate prominence, then describe material challenges proportionately as opportunities, focus areas, or next steps without changing their factual meaning.
7. **Build static visuals.** Preserve charts and infographics while removing numeric disclosure from every rendering and accessibility surface. Pre-render privately to SVG/PNG when that is safer than client-side chart data.
8. **Audit the artifact.** Inspect rendered content and shipped source, search for source values and unapproved derived values, test tooltips and accessibility output, and verify that no public network request returns private data.

## Constructive honesty

Keep the message positive through selection of useful takeaways, clear progress, and forward-looking action—not through omission or euphemism.

- Surface a material unfavorable trend if excluding it would change the audience's understanding.
- State direction and business meaning plainly, then move to response, learning, or opportunity.
- Use calibrated language. Do not call a decline `stable`, a miss `on track`, or correlation `cause`.
- Keep prominence proportional to materiality. A minor negative need not dominate; a major one cannot be buried in footnotes.
- Separate observation from interpretation and future intent.

**Example**

Source finding: signups rose substantially while activation fell materially.

Public wording: `Interest continued to expand, creating a larger opportunity to improve early activation. Activation softened during the period, and onboarding is the primary focus for the next cycle.`

This is constructive because it pairs progress with action while preserving the tension in the evidence.

## Pre-publication gate

Deliver only when every answer is yes:

- Are all raw absolute values absent from visible content and shipped source?
- Are all visible derived numbers explicitly approved for their exact placements?
- Do chart geometry and qualitative labels preserve the supported trend without implying false precision?
- Are numeric tooltips, numeric axis ticks, KPI values, hidden tables, alt text, and metadata disclosure-safe?
- Does the story include every material trend needed for an honest understanding?
- Is the tone constructive, positive, and evidence-based rather than promotional spin?
- Can a cold reader understand what changed, why it matters, and what happens next?

Include a short public note such as: `To protect confidential information, this report presents trends and relative patterns without underlying values.` Mention approved derived measures separately when used.
