# Output Templates, Review Rubric, and Anti-Patterns

Standard structures for the three deliverable types, the scoring rubric, and the anti-pattern checklist. Use the template matching the request; don't force every response into one.

## Standard chart recommendation output

```markdown
## Intent
- Audience:
- Decision or question:
- Primary analytical task:

## Recommended visual
- Chart type:
- Why it fits:
- Primary encoding:
- Comparison or baseline:

## Data preparation
- Grain:
- Measures:
- Dimensions:
- Transformations:
- Missing-data treatment:

## Design specification
- X-axis:
- Y-axis:
- Sort order:
- Series:
- Reference lines:
- Labels:
- Color roles:
- Annotations:
- Interaction:

## Accessibility
- Text summary:
- Alt text:
- Non-color distinctions:
- Table fallback:

## Integrity checks
- Units and denominator:
- Scale and baseline:
- Uncertainty:
- Caveats:

## Alternative
- Use instead when:
```

## Standard dashboard brief

```markdown
## Dashboard purpose
- Dashboard mode:
- Primary users:
- Decisions supported:
- Review frequency:
- Target surface:

## Information hierarchy
1. Primary outcome or alert
2. Drivers and comparisons
3. Diagnostic detail
4. Record-level evidence

## Page structure
- Header and freshness:
- Global controls:
- Primary views:
- Secondary views:
- Detail-on-demand:

## Metric contract
| Metric | Definition | Grain | Unit | Target | Direction | Owner | Freshness |
|---|---|---|---|---|---|---|---|

## Interaction contract
| Interaction | Scope | Purpose | Visible state | Reset behavior |
|---|---|---|---|---|

## Accessibility contract
- Reading order:
- Keyboard path:
- Alt text approach:
- Table alternatives:
- Contrast and non-color cues:

## Validation plan
- User tasks:
- Success criteria:
- Known risks:
```

## Standard critique output

Prioritize findings instead of producing an unranked list.

```markdown
## Verdict
[One paragraph on whether the visual supports its intended decision.]

## Preserve
- [Strong element]

## P0: Misleading or unusable
- Issue:
- Why it matters:
- Fix:

## P1: Major comprehension problem
- Issue:
- Why it matters:
- Fix:

## P2: Refinement
- Issue:
- Why it matters:
- Fix:

## Proposed redesign
- Information hierarchy:
- Chart substitutions:
- Layout changes:
- Context to add:
- Elements to remove:

## Accessibility and integrity
- [Required changes]
```

## Review rubric

Score each dimension 0-2 (0 fails or absent; 1 partially works; 2 works clearly and consistently):

| Dimension | Review question |
|---|---|
| Purpose | Is the audience, question, and decision clear? |
| Data fit | Is the correct grain, measure, denominator, and time range used? |
| Chart fit | Does the form match the analytical relationship? |
| Perceptual accuracy | Are important comparisons encoded with accurate visual channels? |
| Scale integrity | Are baselines, domains, and transformations honest? |
| Context | Are targets, units, time, source, and definitions available? |
| Focus | Is the most important information visually dominant? |
| Simplicity | Has nonessential detail been removed without losing meaning? |
| Legibility | Can labels, values, and patterns be read at the target size? |
| Accessibility | Is meaning available without color, hover, mouse, or vision alone? |
| Dashboard architecture | Does the page support overview, attention, and detail? |
| Actionability | Can the user determine what to do next? |

Interpretation: 21-24 strong, ready for normal validation; 16-20 useful but needs targeted revision; 10-15 significant redesign required; 0-9 reframe the problem before refining the visual.

A total score must not conceal a zero in scale integrity, accessibility, or data fit — any zero there blocks delivery regardless of the total.

## Common anti-patterns

Reject or challenge:

- Dashboard with no defined user or decision
- One page containing every available metric
- Grid of equally prominent KPI cards
- Pie chart with many or similar slices; series of pies showing change over time
- Gauge wall
- Arbitrary red/yellow/green thresholds
- Rainbow heatmap
- 3D chart
- Dual axes chosen to make lines appear correlated
- Truncated bar axis
- Unsorted ranking
- Stacked chart used for precise internal comparison
- Map used for nonspatial ranking; choropleth of raw totals
- Average-only chart that hides distribution
- Forecast shown as certain
- Missing data drawn as zero
- Critical details available only on hover
- Tiny labels added to compensate for an unsuitable chart
- Excessive decimal precision
- Decorative animation
- Hidden active filters
- Undefined KPI; no source or update timestamp
- Color-only status
- Dense dashboard used as an explanatory presentation
