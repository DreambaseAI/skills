# Dashboard Architecture and Interaction

How to structure dashboard pages, design interactions, and keep monitoring separate from storytelling.

## Classify the dashboard first

Choose one primary mode — mixing all four on one page without hierarchy is the root cause of most failed dashboards:

- **Monitoring** — detect status, exceptions, and changes quickly.
- **Analytical** — explore causes, segments, relationships, and detail.
- **Operational** — support repeated actions and workflow decisions.
- **Strategic** — track a small number of long-term outcomes and drivers.

## Structure the page

For monitoring dashboards:

- Aim for an at-a-glance overview on the intended display.
- Put the most important information in the first visual region.
- Keep a small number of primary views, often two or three.
- Show exceptions and thresholds clearly.
- Provide a path from overview to detail.

For analytical dashboards:

- Start with orientation and summary.
- Group related views; use coordinated filtering and highlighting.
- Provide detail on demand.
- Allow additional pages or scrolling when the analysis genuinely requires it.

For all dashboards:

- Design at the final target size.
- Use a stable reading order; align cards, charts, and controls to a clear grid.
- Group by question or workflow, not merely by data source.
- Keep global filters distinct from local controls; display active filters and date ranges; make reset behavior obvious.
- Show data freshness and definitions for ambiguous metrics.
- Keep critical information out of hover-only states.
- Use responsive layouts that preserve priority.
- Avoid a wall of equally prominent tiles — equal prominence means no hierarchy, and no hierarchy means the user does the triage the dashboard should have done.

## Progressive disclosure

Reveal detail in layers (overview → exception or selected segment → supporting explanation → record-level detail). This is Shneiderman's information-seeking mantra applied to dashboards: overview first, zoom and filter, then details-on-demand.

Do not hide the primary finding behind interaction. Use interaction to expand understanding, not to repair an unclear default state.

## Dashboard metadata

Include when relevant: source systems, last refresh time, metric owner, definition or formula, data coverage, active filters, known limitations, forecast-versus-actual status, confidentiality level.

## Interaction design

Give every interaction a specific analytical purpose. Useful interactions: filter, highlight, sort, drill down, drill through, zoom or brush, compare selection with baseline, reveal exact values, open supporting records.

Requirements:

- Preserve orientation after interaction; show current state; offer a clear reset.
- Keep controls close to the content they affect; use consistent interaction patterns.
- Support keyboard operation; provide visible focus states.
- Never require hover for essential information.
- Avoid interactions that merely animate or decorate.

## Monitoring versus storytelling

Use dashboards for repeated monitoring and exploration. Use a report, annotated chart sequence, memo, or presentation when the goal is to explain a specific finding and recommend action. (For narrative infographics, see `infographics.md`.)

Do not force a dashboard to behave like a presentation, and do not force an explanatory story to expose every possible filter and view.

For explanatory communication: state the point; show only the evidence needed to support it; arrange views in a deliberate sequence; use annotations and emphasis; end with the implication or decision.

For exploratory communication: keep titles neutral; preserve context under filtering; make definitions and state visible; support multiple legitimate paths without overwhelming the default view.
