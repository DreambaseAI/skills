# Page Design and Typography

The layout and type system that makes a data story feel designed rather than generated. This is the largest gap in generic output: mechanically correct content set in default type on an ungridded page.

## Typography system

Set a deliberate system before writing a single page:

- **Two faces, assigned roles**: a display face with personality for headlines and big numbers, a workhorse for body and labels. The pairing carries the artifact's character — choose it to match the story's tone (authoritative, urgent, exploratory), never default to the renderer's default stack. (Aligns with anthropics `frontend-design`: "typography carries the personality of the page"; and `theme-factory`'s curated pairings are a legitimate shortcut.)
- **A modular scale**, not ad-hoc sizes: e.g. 11/14/18/24/36/54. Reports: body 10–11pt print / 16–18px screen, generous leading (1.4–1.6). Presentation slides: titles 36–44pt, body ≥18pt spoken / ≥14pt slidedoc (aligns with anthropics `pptx` floors).
- **Numeric craft** (from Vercel's web-interface-guidelines, verified conventions):
  - `font-variant-numeric: tabular-nums` (or a tabular figure set) wherever numbers stack or compare — tables, KPI rows, axis labels.
  - Real typographic marks: curly quotes, en-dashes for ranges (2019–2024), minus signs (−4.2%, not hyphens), non-breaking spaces between value and unit (10 MB).
  - Consistent decimal precision per measure; thousands separators; compact notation ($2.4M) used consistently.
- **Hierarchy through weight and size, not decoration**: no underlined headings, no accent bars under titles (a named `pptx` anti-pattern), no ALL-CAPS body.
- Line length 45–75 characters for body text; `text-wrap: balance` (or manual breaks) on headlines to kill widows.

## Grid and layout

- **Pick a grid and commit**: 12-column for reports and web, 3–4 content regions for slides. Every element aligns to it — "deliberate alignment, no accidental placement." Near-alignment reads as sloppiness; exact alignment reads as intent.
- **Whitespace is structure**: margins and spacing encode grouping (Gestalt proximity). Dense ≠ rigorous; a page's restraint signals editing.
- **One focal point per page/slide/screen**: the eye's first landing spot is a design decision. Big number, hero chart, or headline — pick one; everything else is subordinate.
- **Page rhythm** in reports: vary density deliberately (full-bleed chart page → dense evidence spread → breathing-room transition). Uniform density is monotony; random density is chaos.
- **Covers and section openers** earn their page: title as claim, one hero visual or number, date/source/author. No wall of logos.

## Color as a system

- 4–6 named colors total: background, ink, one signature accent, 2–3 chart categoricals (inherit chart-color rules from `dreambase-visualization-design`'s `color-accessibility.md` — ≤6 hues, CVD-safe, never color-only meaning).
- "Spend your boldness in one place" (`frontend-design`): one signature element — the hero chart, the big number, the cover — carries the strong color; everything else stays quiet.
- The same palette runs across every artifact from the same analysis (report, deck, one-pager) — cross-format consistency is what makes a set of artifacts feel like one story.
- Avoid the recognizable AI-default palettes (cream+serif+terracotta, near-black+acid-green) — named by `frontend-design` as generative tells.

## Tables in documents

- Tabular numerals, right-aligned numbers, decimal-aligned where precision varies.
- Subtle horizontal rules only (no vertical rules, no zebra unless rows are long); units in the header, not repeated per cell.
- Emphasize the column the argument depends on — bold or tint one column, not a rainbow of conditional formatting.

## Pull quotes, callouts, and big numbers

- A big-number callout (large numeral + one-line label + context line) beats a one-value chart. Derive it from real data and give it the comparison that makes it meaningful (vs. target, vs. last period).
- Pull quotes and callout boxes are for the argument's hinge points, one per spread/section at most — a page of callouts has none.
- Annotation boxes on charts follow `dreambase-visualization-design` rules: observation on the chart, interpretation clearly marked.

## Format mechanics — delegate, don't reinvent

When building actual files, use the established mechanics skills if available in the environment, and keep this skill's role to the design system:

- **.pptx** → anthropics `pptx` skill (pptxgenjs creation, XML editing, thumbnails, validation). Its palettes/layouts are sane defaults; this skill's story structure and type system override where they conflict.
- **.docx** → anthropics `docx` skill (mechanics only — it carries no design opinions; this skill owns the design layer entirely).
- **PDF output** → anthropics `pdf` skill or print-CSS from HTML.
- **HTML artifacts / scrollytelling** → `dreambase-echarts` for charts; standard web craft for the page (contrast, keyboard access, responsive breakpoints — see `web-design-guidelines`-style audits).

If a mechanics skill isn't available, build clean HTML/markdown and say what tooling would produce the final format.
