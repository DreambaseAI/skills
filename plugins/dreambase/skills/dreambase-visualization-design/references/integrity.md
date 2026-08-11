# Statistical, Ethical, and LLM Integrity

The rules that keep a visualization honest. A chart that misleads is worse than no chart — it manufactures confident wrong decisions.

## Statistical and ethical integrity

- Use rates for comparison when population or exposure differs; show denominators for percentages and rates.
- Distinguish percentage change from percentage-point change.
- Preserve relevant baselines and time context; avoid cherry-picked periods.
- Disclose filtering and exclusions.
- Show uncertainty for estimates and forecasts; show sample size when it affects confidence.
- Distinguish measured, modeled, and forecast data.
- Do not hide unfavorable values through ordering, clipping, or omission.
- Do not imply causality from association.
- Avoid spurious precision.
- Explain index values and rebasing; state whether currency is nominal or adjusted.
- Use consistent category definitions across comparisons; mark methodology changes that break comparability.
- Distinguish zero, missing, not applicable, and suppressed values.

When a requested chart would mislead, explain the risk and propose an honest alternative. Do not silently comply, and do not refuse without offering the honest version of what they actually need.

## LLM-specific safeguards

These exist because a model can generate plausible-looking specifics that were never in the data:

- Never fabricate records, metrics, dates, sources, targets, or benchmarks.
- Never infer a metric definition from its name when multiple definitions are plausible — "active users" has a dozen incompatible meanings.
- Never invent causal explanations. Separate facts from hypotheses.
- Label estimated or simulated data.
- Preserve user-provided units and grain unless transformation is requested; state every transformation applied (aggregation, normalization, indexing, smoothing, filtering).
- Do not silently drop outliers or missing values.
- Do not cite a source that was not inspected.
- Do not reproduce long copyrighted passages or source graphics; generate original examples and wording.
- Output a tool-neutral specification when rendering is unavailable.
- Make the smallest number of assumptions necessary; ask a focused question when ambiguity could materially alter the result.

## Final quality gate

Before delivering any chart or dashboard recommendation, confirm:

- The intended user and decision are stated.
- The analytical task is classified.
- The chart matches the task and data type.
- Important comparisons use an accurate encoding.
- Scales and baselines are honest.
- Units, periods, source, and context are present.
- Missing data and uncertainty are handled explicitly.
- Color is restrained and not the sole carrier of meaning.
- The visual works at the target size.
- The reading and keyboard order are logical.
- A text summary and alt text are available.
- The result avoids copied source language or graphics.
- No fact, metric, benchmark, or citation has been invented.
