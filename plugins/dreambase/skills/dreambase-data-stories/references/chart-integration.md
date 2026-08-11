# Blending Charts, Illustration, and Layout

The craft the ecosystem doesn't cover: integrating *accurate* data graphics into *designed* narrative layouts. Aesthetic-first tools ignore data integrity; chart-first tools ignore layout. A data story needs both at once.

## The division of labor

- `dreambase-visualization-design` decides the chart: form, encoding, scales, context, accessibility. **Always in force** — every chart in a designed artifact still passes its integrity gate. Beauty never buys an exemption from honest axes.
- This skill decides the chart's *role in the layout*: hero vs. supporting, size, position in the reading flow, how annotation carries the narration, how the chart shares the page's type and color system.
- `dreambase-echarts` builds it (when rendering): standard forms from its references; bespoke/illustrative forms via its `references/charts/custom.md` toolkit (custom `renderItem`, `pictorialBar` for ISOTYPE-style unit icons, `graphic` layer for decorative/annotation art).

## Charts as narrative devices

- **The hero chart**: each story has one chart that *is* the argument. Give it the space (half-page/full-slide), the annotation budget, and the signature color. Every other chart is a supporting exhibit — smaller, quieter, often small-multiple.
- **Headline = claim, chart = evidence**: title the chart with what it shows ("Self-serve churn doubles in month 2"), not what it plots ("Churn by cohort"). The assertion-evidence pattern is the backbone of both slides and story graphics.
- **Annotation as narration**: in a data story, annotations do the talking a presenter would — mark the event, the threshold crossing, the exception, the "read this part." A well-annotated chart needs no surrounding paragraph; if it does, the annotation layer is underbuilt.
- **Progressive disclosure across views**: sequence charts so each answers the question the previous one raised (overview → the anomaly → the anomaly decomposed → the driver). In scrollytelling, one transformation per scroll step — never change axis, filter, and encoding in a single step.
- **A stat beats a chart when there's one number**: big-number callout with comparison context instead of a one-bar chart, a gauge, or a donut-with-a-number.

## Making charts belong to the design

Charts generated with default settings look pasted-in. Integrate them:

- **Shared type system**: chart titles, axis labels, and annotations use the artifact's faces and scale (labels ≈ body-small, chart titles ≈ H3). Tabular numerals on axes.
- **Shared palette**: chart series colors come from the artifact's 4–6 color system. The signature accent marks the series the story is about; context series are muted grays.
- **Quiet chrome**: hairline gridlines, no chart borders or backgrounds distinct from the page — the chart sits *on* the page, not in a box on it.
- **Direct labels over legends** wherever the layout allows — legends force eye travel that breaks reading flow.
- **Consistent forms across the artifact**: the same measure always gets the same chart form and color; a reader who learns one chart has learned them all.

## Illustration rules (inherited and extended)

From `dreambase-visualization-design` (`infographics.md`), enforced here at the layout level:

- **Decoration frames; it never encodes.** Illustration sets tone, marks sections, and humanizes — data marks stay proportionally honest. Icons scale by *count* (ISOTYPE), never by area.
- Topically relevant imagery only (it aids gist recall — Bateman); one illustration style per artifact (one stroke weight, one level of abstraction).
- Illustrative *chart forms* (hand-drawn feel, pictorial marks, custom shapes) are legitimate for narrative audiences when the encoding stays honest — build them with the echarts custom toolkit rather than distorting a standard form.
- Titles and annotations are what readers remember (Borkin 2015) — put craft there before adding any ornament.

## Interactivity budget (web artifacts)

- Default to **scroll as the only interaction** — readers read; they rarely click (the NYT graphics lesson). Anything essential must be visible without interaction.
- Interactivity earns its cost only when the reader's own context matters (find *your* city, *your* cohort) or the data is genuinely explorable after the story lands.
- Every interactive state needs a designed static fallback (print, screenshot, screen reader — see `color-accessibility.md` in the viz-design skill).

## Integration checklist

Before shipping any artifact, verify:

- [ ] Every chart passed `dreambase-visualization-design`'s integrity gate (honest scales, context, accessibility).
- [ ] One hero chart per story/section; supporting charts visibly subordinate.
- [ ] Chart titles state claims; annotations carry the narration.
- [ ] Charts share the artifact's type system and palette; no default-styled charts pasted in.
- [ ] Illustration frames but never encodes; icons count, not scale.
- [ ] Nothing essential is hover-only; static versions exist for every view.
