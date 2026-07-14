# Color and Accessibility

Color roles, palette limits, and the accessibility requirements every deliverable must meet. Accessibility is a design input, not a post-processing step — retrofitting it after layout usually means redesigning.

## Color system

Assign color by role:

- **Neutral** colors for most data — the default state of a chart is quiet.
- **One emphasis color** for the primary focus.
- **Semantic** colors only when meaning is stable and culturally appropriate.
- **Sequential** scales for low-to-high values; **diverging** scales for values around a meaningful center; **categorical** palettes for unordered groups.

Rules:

- Never use color as the only carrier of status or category (WCAG 1.4.1, Level A). Reinforce with labels, position, shape, pattern, or icons.
- No rainbow scales — they aren't perceptually ordered and create false boundaries.
- Categorical palettes: target ≤6 distinct hues, 8 as a hard ceiling. Beyond that, group into "Other," facet into small multiples, or change encodings. CVD-safe categorical palettes realistically max out at 4–6 distinguishable hues (this is why ColorBrewer's colorblind-safe filter eliminates most large qualitative schemes).
- Keep the same category color consistent across related views.
- Don't assign red/green automatically when better-or-worse is ambiguous — and remember red-green confusion is the most common CVD.
- Preserve legibility in grayscale where practical.

### Color-vision deficiency

Red-green CVD affects roughly 1 in 12 men (~8%) and 1 in 200 women (~0.5%) of Northern European descent; prevalence is lower in other populations — don't state the 8% figure unqualified. Deuteranomaly is the most common form.

Test palettes with a simulator: Viz Palette (projects.susielu.com/viz-palette) simulates deuteranopia/protanopia/tritanopia and flags confusable pairs at realistic mark sizes; ColorBrewer (colorbrewer2.org) has a colorblind-safe filter. A "safe" palette does not excuse redundant encoding — WCAG 1.4.1 still applies.

## Contrast requirements (WCAG 2.2, Level AA)

| Element | Requirement | SC |
|---|---|---|
| Ordinary text (axis labels, legends, annotations) | ≥ 4.5:1 | 1.4.3 |
| Large text (≥18pt / ≥14pt bold) | ≥ 3:1 | 1.4.3 |
| Graphical objects required for understanding (bars, lines, points, slice boundaries) | ≥ 3:1 against adjacent colors | 1.4.11 |
| UI components and focus indicators | ≥ 3:1 | 1.4.11 |

Adjacent stacked segments or pie slices that don't reach 3:1 against each other need separators or borders. Avoid extremely thin lines for important information, rotated text where possible, and any text below 12px (Chartability's floor — stricter than WCAG, which has no font-size minimum, but the right bar for charts).

## Interaction accessibility

- All chart functionality — tooltips, filtering, zoom, selection — operable by keyboard alone (WCAG 2.1.1), with a visible focus indicator (2.4.7).
- Tooltips must be dismissible, hoverable, and persistent (1.4.13) — a tooltip that vanishes when the pointer moves toward it fails AA.
- Never put essential information only in a hover state.

## Nonvisual access

Provide:

- A concise **text summary** of the main finding.
- **Alt text** for each meaningful visual (see below).
- A **data table** or accessible equivalent when exact values matter — a real HTML table adjacent to the chart (optionally collapsed) is the most robust screen-reader path. For SVG charts, the production-proven pattern is `role="img"` + a takeaway-bearing accessible name + a separate HTML table; in-SVG ARIA table semantics have inconsistent screen-reader support.
- Logical keyboard and reading order; descriptive titles for visuals and controls; text equivalents for interactive states.

### Writing alt text

Two complementary models, both worth knowing:

- **Cesal's formula** (Amy Cesal, Nightingale 2020): `[Chart type] of [type of data] where [reason for including the chart / takeaway]`, with the data source linked in surrounding text. Keep it short — screen readers read alt text linearly with no ability to scan back.
- **The four-level model** (Lundgard & Satyanarayan, IEEE VIS 2021): L1 chart type/axes/encodings → L2 statistics (extrema, outliers, comparisons) → L3 trends and patterns → L4 domain context. Their study found blind and sighted readers both rank **L3 (the trend) most useful**, and blind readers value L4 interpretation least. So: lead with the trend and key statistics; never stop at L1 ("bar chart of sales by region" alone fails the reader); keep editorializing out.

House pattern combining both:

`[Chart type] showing [measures] across [dimensions and period]. Main pattern: [takeaway]. Notable values or exceptions: [details]. Source and limitations: [source/caveat].`

## Quick audit (adapted from Chartability's critical tests)

Chartability (Frank Elavsky, chartability.fizz.studio, CC-BY-SA) extends POUR with three viz-specific principles — Compromising (tensions), Assistive (reduces load), Flexible (adapts to preferences) — across 50 heuristics, 14 critical. The critical ones to check on every deliverable:

- Geometries and large text ≥3:1 contrast; regular text ≥4.5:1.
- Information available without visuals (screen-reader path exists).
- A human-readable data table is provided.
- Anything mouse-interactive is also keyboard-interactive.
- A title, summary, or caption exists.
- No text below 9pt/12px.
- Color never carries meaning alone.
