# Foundations: The Perception and Design Canon

The research chain behind this skill's rules, with what each source actually says (and where popular paraphrases go wrong). Read this when you need to justify a recommendation, resolve a disagreement about "the rules," or decide when a rule may bend.

The through-line: **Bertin** (theory, 1967) → **Cleveland & McGill** (experiment, 1984) → **Mackinlay** (automation, 1986) → **Heer & Bostock** (web-scale replication, 2010) → **Munzner** (synthesis + task framing, 2014). When one citation must carry the encoding ranking, cite Munzner's marks-and-channels chapter — it's the validated modern synthesis.

## Bertin — the visual variables (Semiology of Graphics, 1967)

Two planar dimensions (position x, y) plus six retinal variables: **size, value (lightness), texture, color (hue), orientation, shape**. Each variable has "levels of organization": *selective* (pick a group at a glance), *associative* (group across variation), *ordered* (read ranking without a legend), *quantitative* (read ratios).

- Only **position and size are quantitative**. Value is ordered but not quantitative. **Hue and shape are selective/associative only** — this is the origin of "don't use hue or rainbows for quantitative data."
- Bertin split color into hue and value as separate variables; popular lists that say just "color" lose the distinction that matters.
- Derived from cartographic theory, not experiments — Cleveland & McGill is the experimental successor.

## Cleveland & McGill — graphical perception (JASA 1984)

The experimentally derived accuracy ranking of elementary perceptual tasks for *proportional judgments of quantitative data*, most → least accurate (grouped items are ties):

1. Position along a common scale
2. Positions along nonaligned scales
3. Length, direction, angle
4. Area
5. Volume, curvature
6. Shading, color saturation

Corollaries from the paper itself: dot charts beat pies; grouped bars beat stacked (stacked segments off the baseline become nonaligned-position judgments); framed-rectangle charts beat shaded choropleths.

Common misreadings to avoid: **hue is not in this ranking at all** (it lacks a perceptual ordering for quantity — restatements putting "hue" at the bottom are importing Mackinlay/Munzner); and only the position/length/angle portions were tested experimentally — area/volume/shading placements rest on psychophysical theory (Weber, Stevens).

## Heer & Bostock — crowdsourced replication (CHI 2010)

Replicated Cleveland–McGill for web-rendered charts: the ranking held. Additional validated findings worth using directly:

- position > length ≳ angle > area for proportion judgments.
- Rectangular ≈ circular area judgment accuracy; 1:1-aspect rectangles were the *worst* (viewers proxy area with side length) — so squarified treemaps are not perceptually optimal.
- Charts under ~40px tall degrade comparisons; **little accuracy benefit beyond ~80px height** on a 0–100 scale.
- **Gridlines improve accuracy** — keep them ≥ ~8px apart; overly dense gridlines steeply increase error.

## Tufte — graphical integrity and economy (Visual Display, 1983)

Verified definitions:

- **Data-ink ratio** = data-ink ÷ total ink; principles: maximize it, erase non-data-ink, erase redundant data-ink — "**within reason**" (Tufte's own qualifier, usually dropped; this is a redesign heuristic, not an absolutist rule).
- **Chartjunk** = non-data or redundant ink that tells the viewer nothing new (moiré vibration, heavy grids, the self-promoting "duck").
- **Lie factor** = (effect size shown) ÷ (effect size in data); integrity requires ≈ 1 (0.95–1.05).
- **Small multiples** — "for a wide range of problems… the best design solution."
- Six principles of graphical integrity: proportional representation; thorough labeling; show data variation, not design variation; deflated/standardized monetary units; dimensions in the graphic ≤ dimensions in the data; don't quote data out of context.

What later research modifies: Bateman 2010 and Borkin 2013/2015 show relevant embellishment can aid recall without harming simple-chart comprehension (see `infographics.md` for exact scope and limits). What stands uncontested: **the lie factor and proportional integrity**. Fair synthesis: minimalism is a strong default for analytical work; decoration is a scoped tool for narrative work; distortion is never licensed.

## Shneiderman — the information-seeking mantra (1996)

Verbatim: "**Overview first, zoom and filter, then details-on-demand.**" A design sequence for *interactive* interfaces, not a rule of static composition. The same paper's taxonomy is usually dropped: 7 data types × 7 tasks — the last three tasks being **relate** (view relationships), **history** (undo/replay), and **extract** (export selections); dashboards routinely forget all three.

Refinements worth knowing: Shneiderman offered it as distilled practice wisdom, not validated law (Craft & Cairns 2005 documented the validation gap). For very large/dense data, a **details-first** entry can beat overview-first (van den Elzen & van Wijk 2014); Keim's visual-analytics variant is "analyze first, show the important, zoom/filter, analyze further, details on demand."

## Munzner — nested model and what-why-how (2009; VAD 2014)

**Nested model** — four levels, each feeding the next: (1) domain situation → (2) data/task abstraction → (3) visual encoding & interaction idiom → (4) algorithm. Errors cascade outward-in, and each level needs its own kind of validation: a lab study can't rescue a wrong abstraction; benchmarks can't validate an encoding. **Most bad dashboards are level-2 failures** — pin the data/task abstraction before debating chart types.

**What-why-how**:

- *What*: dataset types (tables, networks/trees, fields, geometry); attribute types (categorical, ordinal, quantitative).
- *Why*: task = action + target. Actions: analyze (discover/present/enjoy; produce), search (lookup/browse/locate/explore), query (identify/compare/summarize). Targets: trends, outliers, features, distributions, correlations, topology, shape.
- *How*: encode (marks & channels), manipulate (change/select/navigate), facet (juxtapose/partition/superimpose — small multiples live here), reduce (filter/aggregate/embed).

**The modern channel rankings** (cite these rather than raw Cleveland–McGill):

- *Magnitude channels (ordered data)*: position on common scale → position on unaligned scale → length → tilt/angle → area → depth → color luminance/saturation → curvature → volume.
- *Identity channels (categorical data)*: spatial region → color hue → motion → shape.

The two-list structure resolves the perennial confusion: hue is a poor magnitude channel but the second-best identity channel.

## Mackinlay — effectiveness by data type (ACM TOG 1986)

Extended Cleveland–McGill into separate effectiveness rankings for quantitative, ordinal, and nominal data (the APT system) — the ancestor of automated chart recommendation and the formal grounding for "match the encoding to the attribute type."
