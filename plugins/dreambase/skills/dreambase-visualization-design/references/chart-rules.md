# Chart-Specific Rules

Per-form guidance for individual chart types, plus axes/scales/numbers and titling. Read the section for the form you're recommending or critiquing.

## Contents

1. [Tables](#tables)
2. [Bar and column charts](#bar-and-column-charts)
3. [Dot plots and dumbbell plots](#dot-plots-and-dumbbell-plots)
4. [Line charts](#line-charts)
5. [Area charts](#area-charts)
6. [Slope charts](#slope-charts)
7. [Scatterplots](#scatterplots)
8. [Distribution charts](#histograms-dot-strips-box-plots-and-violins)
9. [Pie and donut charts](#pie-and-donut-charts)
10. [Stacked charts](#stacked-charts)
11. [Heatmaps](#heatmaps)
12. [Maps](#maps)
13. [Bullet graphs](#bullet-graphs)
14. [Gauges](#gauges)
15. [KPI cards](#kpi-cards)
16. [Dual-axis charts](#dual-axis-charts)
17. [Radar charts](#radar-charts)
18. [Treemaps and bubbles](#treemaps-and-bubbles)
19. [Funnels](#funnels)
20. [Axes, scales, and numbers](#axes-scales-and-numbers)
21. [Titles, labels, and annotation](#titles-labels-and-annotation)

## Tables

Use a table when users need exact values, multiple units, detailed records, or repeated lookup.

- Align numbers by decimal place; align text consistently.
- Put comparable measures in consistent columns.
- Use meaningful row order.
- Use subtle separators instead of boxing every cell.
- Use conditional formatting sparingly.
- Label units in headers.
- Freeze useful headers in long tables.
- Provide search, sort, and filter only when needed.
- Do not turn every cell into a colored tile.

Use a graph instead when the primary task is to see shape, pattern, trend, rank, or exception.

## Bar and column charts

Use bars for category comparisons and rankings.

- Start the quantitative axis at zero — bars encode by length, and a truncated baseline changes every length ratio.
- Sort by value unless chronology, process order, or a recognized category order is more meaningful.
- Use horizontal bars for long category labels.
- Keep gaps narrower than bars.
- Use grouped bars for precise comparison between a small number of series.
- Use stacked bars when total and composition both matter; 100% stacked when proportion matters more than totals.
- Avoid stacked bars when segments include both positive and negative values.
- Avoid too many series or categories.
- Label directly when it reduces legend lookup.

## Dot plots and dumbbell plots

Use dots when space is constrained or the zero baseline is not central to the task.

- Use an aligned scale; sort categories.
- Use dumbbells for two comparable values per category.
- Label endpoints or the difference when useful.
- Avoid stems that imply magnitude from zero unless that is intended — dots encode by position, so they don't require a zero baseline the way bars do.

## Line charts

Use lines for ordered, usually continuous change over time.

- Preserve chronological order; use a time range that provides context.
- Show missing periods as gaps unless interpolation is justified and disclosed.
- Use markers for irregular observations or when individual points matter.
- Direct-label a small number of lines near their endpoints.
- Use small multiples when overlapping lines become difficult to trace.
- Use a reference line for a meaningful target, baseline, or event.
- A zero baseline is not required (position encoding, not length), but choose a domain that doesn't manufacture drama.
- Disclose log scales, index rebasing, and transformations prominently.
- Avoid decorative smoothing that suggests values not present in the data.

## Area charts

Use area when accumulated magnitude or total volume matters.

- Keep the baseline at zero — area encodes magnitude.
- Use stacked area to emphasize total and broad composition, never for precise comparison of internal series (only the bottom series sits on a stable baseline).
- Use a line chart or small multiples when component trajectories matter.
- Limit the number of layers.

## Slope charts

Use slope charts for change between two or a few points.

- Use a shared scale; label both endpoints.
- Highlight crossings or reversals only when meaningful.
- Avoid them when intermediate movement is important.

## Histograms, dot strips, box plots, and violins

Use distribution charts instead of bars of averages when variation matters.

- Histograms show distribution shape; explain or justify bin width when it can change the apparent pattern.
- Dot strips suit small or moderate samples where individual observations matter.
- Box plots compactly compare many distributions; define the conventions if the audience may not know them.
- Violin plots only when density shape adds value and the audience can interpret it.
- Show raw points with summaries when sample size permits.

## Scatterplots

Use scatterplots to examine the relationship between two quantitative variables.

- One mark per observation at the correct grain; units on both axes.
- Use transparency, jitter, hexbin, or density methods for overplotting.
- Add a trend line only when statistically and substantively useful; show model uncertainty when available.
- Identify important outliers without labeling every point.
- State sample size when it affects interpretation.
- Never present correlation as proof of causation.

## Pie and donut charts

Default to a sorted bar chart for comparison — angle and area are decoded far less accurately than position and length.

Allow a pie only when ALL of these hold: the values form one meaningful whole; roughly two to five categories; the audience needs a rough impression, not precise comparison; the shares are visibly different; and no comparison across multiple pies is required.

When using a pie: keep it 2D; start at a consistent orientation; order slices meaningfully; label directly; no exploded slices, nested rings, depth, shadows, or gradients.

Do not use a donut merely to place a large number in the center — use a KPI card with context instead.

## Stacked charts

Use stacked charts for totals and composition, not precise comparison of every segment.

- Place the most important segment on the common baseline when possible.
- Keep stack order consistent; match legend order to stack order.
- Direct-label when space allows.
- Use small multiples or grouped bars when internal comparison matters more than the total.
- Avoid excessive segments.

## Heatmaps

Use heatmaps for patterns across a matrix or dense set of comparable cells.

- Order rows and columns to reveal structure.
- Use a perceptually ordered sequential or diverging scale; center diverging scales on a meaningful reference.
- Provide exact values through labels or an accessible table when needed.
- No rainbow scales — they create false boundaries and aren't perceptually ordered.
- Make missing values visually distinct from low values.

## Maps

Use a map only when geographic location or spatial pattern is part of the question.

- Choropleths for normalized rates, ratios, percentages; proportional symbols for totals or counts. A choropleth of raw totals mostly redraws population.
- State the denominator for mapped rates.
- Use an appropriate projection.
- Provide a ranked alternative when precise regional comparison matters.
- Make missing regions explicit.
- Do not use a map as a decorative background for nonspatial data.

## Bullet graphs

Use a bullet graph to compare one primary measure with a target and, when meaningful, qualitative ranges.

- The current measure is the dominant mark; the target is a clear reference marker.
- Use qualitative bands only when their thresholds have real definitions — never invent red/yellow/green cutoffs.
- Keep ranges ordered and visually quiet.
- Label the measure, unit, period, and target.

Prefer a bullet graph over a gauge when space efficiency and comparison accuracy matter.

## Gauges

Avoid gauges by default. Use one only when a bounded state is widely understood, position within the range is the main task, and the circular form has a strong domain convention. Otherwise use a bullet graph, bar, or KPI with a reference.

## KPI cards

Never present a large number without context. Include, as applicable: metric name, current value, unit, reporting period, comparison value or target, absolute and percentage change, direction of better performance, status explanation, last-updated time.

Use color as reinforcement, not the only status indicator.

## Dual-axis charts

Avoid dual axes by default — scale choices can manufacture visual correlation.

Prefer: two aligned charts, indexed series on one scale, small multiples, a scatterplot for direct relationship, or a normalized comparison.

If unavoidable: state why; label both axes and series directly; make units prominent; avoid scale choices that manufacture correlation; test whether separate views communicate more honestly.

## Radar charts

Avoid radar charts for precise comparison — use a table, dot plot, or small multiples. Permit radar only for a small qualitative profile where shape recognition matters more than exact values and all axes share a defensible scale.

## Treemaps and bubbles

Use area-based marks only when approximate magnitude is sufficient and space efficiency matters.

- Do not rely on area for fine comparison — area is decoded with systematic underestimation.
- Label only marks that can be read.
- Use a sorted bar when rank or precise difference matters.
- Avoid encoding an additional quantitative variable by color unless clearly explained.

## Funnels

Use a funnel only for a true sequential process where each stage is a subset of the prior stage.

- Show counts and conversion rates; show loss between stages.
- Keep widths proportional to data if width encodes quantity.
- Use bars or a stage table when they communicate more precisely.
- Do not use a funnel for unrelated categories.

## Axes, scales, and numbers

- Label units once, clearly; use consistent units across comparable views.
- Use readable tick intervals; avoid unnecessary decimal places; use thousands separators or compact notation consistently.
- Do not mix nominal and inflation-adjusted currency without disclosure; do not mix rates and counts on one scale.
- Zero baseline for length-based charts (bar, area); nonzero permitted for position-based charts (line, dot) only when context remains honest.
- Log scales only for multiplicative relationships or very large ranges, labeled clearly.
- Keep scales consistent across small multiples intended for comparison.
- Mark axis breaks explicitly; avoid them when possible.
- Distinguish projections from observed values; distinguish missing values from zeros.

## Titles, labels, and annotation

Use a layered title system:

1. **Headline** — the primary supported takeaway or question.
2. **Subtitle** — measure, population, geography, time period.
3. **Source note** — source, update time, transformations, caveats.

For exploratory dashboards, use neutral titles when the takeaway changes with filters. For explanatory charts, use a message title only when the data supports it.

Prefer direct labels over legends when labels remain readable.

Annotate: important events, threshold crossings, outliers, method changes, missing data, forecast boundaries, material caveats.

Separate observation (what the data visibly shows) from interpretation (a plausible explanation) from recommendation (a proposed action). Never state interpretation or recommendation as measured fact.
