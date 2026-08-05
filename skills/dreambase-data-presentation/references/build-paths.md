# Build Paths

Four ways to produce a deck, and the mechanics of each. The path follows from what the user has and how the deck gets used — there is no default worth defending.

Facts marked **verified** were confirmed by execution or by reading the source of record, not from documentation summaries.

## Contents

1. [Choosing the path](#choosing-the-path)
2. [Self-contained HTML deck](#self-contained-html-deck)
3. [PPTX from scratch](#pptx-from-scratch)
4. [PPTX into a corporate template](#pptx-into-a-corporate-template)
5. [Google Slides](#google-slides)
6. [Spec-only](#spec-only)
7. [Interactive content inside a slide](#interactive-content-inside-a-slide)
8. [Defaults for any file-producing path](#defaults-for-any-file-producing-path)

## Choosing the path

| Situation | Path |
|---|---|
| "Make me a deck" — no template, no PowerPoint requirement | **Self-contained HTML** |
| "I need a .pptx" — no template supplied | **pptxgenjs** with generated masters |
| "Here's our .potx / our deck" — must be on-brand and editable | **pptx-automizer** into the real template |
| Brand exists but only as a PDF/URL/screenshot | Extract tokens → pptxgenjs lookalike, **and say it's a reconstruction** |
| Audience lives in Google Workspace | **Google Slides API**, accepting its capability floor |
| Must be both PPTX and Slides | Generate PPTX → convert via Drive; design defensively (PNG not SVG, no custom fonts, no animation) |
| Static, text-and-image, needs to be tiny | **Marp** — single-file zero-network output by default, ~109 KB |
| Someone else builds it | **Spec-only** |
| Genuinely interactive content | Static hero slide + QR + short URL + URL in notes; live version published separately |

Two hard constraints shape everything below:

- **No tool converts real HTML/CSS into faithful *and* editable PPTX.** LibreOffice has no HTML→Impress import filter (verified in the filter source). Author natively in whichever target you need — don't plan a conversion step.
- **Nothing renders live web content inside a PowerPoint or Google Slides slide** in the general case. Microsoft retired the Web Viewer add-in on 2024-12-02; Google Slides has no embed element at all.

## Self-contained HTML deck

**Vendored reveal.js + ECharts, inlined into one HTML file by a short zero-dependency Node script.** Verified end-to-end: a ~1.85 MB `deck.html` that renders from `file://` with a live chart, makes zero network requests, and exports a correctly-sized 16:9 PDF.

reveal.js wins here because it's simultaneously maintained, trivially inlinable with no build tooling, themed through CSS custom properties (`--r-*`), and equipped with notes, fragments, auto-animate, scroll view, and a print route. Its UMD bundle sets `window.Reveal` with no module loader, no fetch, and no worker — which is exactly what a strict CSP permits.

### Non-negotiables

1. **Vendor, never CDN.** `npm pack reveal.js@<v>` and read from the tarball.
2. **Theme must be CSP-safe.** Only `black`, `white`, `black-contrast`, `white-contrast`, `dracula`, and `serif` are safe — **the other 8 `@import` Google Fonts and break**. Prefer the `-contrast` variants. `serif` is 5 KB using system fonts; the others embed ~575 KB of base64 WOFF. Override `--r-*` variables for brand rather than editing theme CSS.
3. **Set `width: 1920, height: 1080`.** reveal's default is 960×700, which is **not 16:9**.
4. **Never write your own `@page` rule** — reveal injects `@page{size:<w>px <h>px;margin:0}` at runtime and a competing declaration breaks the export.
5. **Escape `</script>`** when inlining JS/CSS, or the first occurrence closes the tag early.
6. **Mount charts on `ready` + `slidechanged`, and mount *all* of them when `Reveal.isPrintView() || Reveal.isScrollView()`**, plus once more on the `pdf-ready` event. Print and scroll views lay out every slide at once and never fire `slidechanged` — miss this and charts export blank.
7. **Inline `<textarea data-template>` for Markdown**, never `data-markdown="file.md"` — that external loader is the only XHR in the entire distribution.
8. **Don't rely on the stock speaker view** in a sandboxed page: `notes.js` calls `window.open`, which is blocked. Use `showNotes: 'separate-page'` or build an in-page overlay.
9. **Every image is a data URI or inline SVG.** A remote `<img src>` is the most common leak.
10. **Set `hash: true`** so a reload (or a remote's F5 button — see `interactive.md`) doesn't lose the presenter's place.

### Structure

```js
Reveal.initialize({
  width: 1920, height: 1080, margin: 0.04,   // true 16:9
  hash: true, slideNumber: 'c/t',
  transitionSpeed: 'fast',                   // 400ms; default 800ms reads sluggish
  pdfSeparateFragments: false,
  plugins: [RevealNotes]
});

function syncSlide(slide) {
  if (!slide) return;
  // Print/scroll views render every slide at once and never fire slidechanged.
  if (Reveal.isPrintView() || Reveal.isScrollView()) mountAll();
  else mountAll(slide);
}
Reveal.on('ready',        (e) => syncSlide(e.currentSlide));
Reveal.on('slidechanged', (e) => syncSlide(e.currentSlide));
document.addEventListener('pdf-ready', () => mountAll(), true);
window.addEventListener('resize', () => charts.forEach((c) => c.resize()));
```

### Size budget

reveal.css ~53 KB + theme (5 KB for `serif`, ~575 KB for the font-embedding themes) + reveal.js ~117 KB + **echarts.min.js ~1.12 MB**. ECharts dominates. To cut it: use `serif.css`, or build a custom ECharts bundle importing only the chart types and components in use.

### PDF export

Chrome's one-shot `--print-to-pdf` produces a blank ~1 KB file because it prints before reveal finishes laying out. reveal signals completion with a **`pdf-ready` event** (not a class), so drive Chrome over CDP and wait for it. Load with `?print-pdf`, wait for `pdf-ready`, then print. Printed page size = `width × (1 + margin)`.

## PPTX from scratch

`pptxgenjs` — but know its shape before promising anything:

- **It is write-only.** There is no load or parse API. If the user has an existing deck or template, this is the wrong tool.
- **Its `ChartType` enum has exactly 10 members**: area, bar, bar3d, bubble, bubble3d, doughnut, line, pie, radar, scatter. PowerPoint itself supports ~17 — waterfall, treemap, sunburst, box-whisker, funnel and friends live in a different XML family (`cx:chartSpace`, "chartex") that pptxgenjs doesn't emit.
- **No embedded workbook, no font embedding.**

**The geometry trap.** PowerPoint's default 16:9 is 13.333 × 7.5 in (12192000 × 6858000 EMU). Google Slides' is 10 × 5.625 in. pptxgenjs's `LAYOUT_16x9` is *also* 10 × 5.625, and its `LAYOUT_WIDE` is documented as 13.3, not 13.333. Same aspect ratio, 1.3333× different absolute coordinates. **Express layout as fractions of the page and read the real slide size from the target** — never hardcode inches from memory. (EMU is 914,400/in and 12,700/pt in both platforms.)

Use `defineSlideMaster` with real placeholders rather than drawing free-floating text boxes — placeholders are what make the deck re-themeable and screen-reader-navigable.

**For chart types pptxgenjs can't make:** render with ECharts and ship SVG plus a PNG fallback, with the underlying numbers on a data appendix slide. Don't fake a native chart you can't make editable.

## PPTX into a corporate template

**`pptx-automizer`** (MIT, actively maintained) is the only credible Node path here. It can `loadRoot()` a real `.potx`, copy slides/shapes/masters, and rewrite chart data (`modify.setChartData`, and `setExtendedChartData` for the chartex types pptxgenjs can't touch), while wrapping pptxgenjs for from-scratch shapes.

Limits worth knowing before you commit: it **cannot create or modify individual slide layouts**, and animations are explicitly out of scope.

This is the only path that preserves the customer's actual masters, layouts, theme, and embedded fonts byte-for-byte. When brand fidelity is the requirement, it's the answer.

If only a brand *guide* exists — a PDF, a URL, a screenshot — extract tokens (see `brand-theming.md`) and build a lookalike with pptxgenjs, **and tell the user explicitly that it's a reconstruction, not their template.**

## Google Slides

The API has a real capability floor. Design to it rather than discovering it:

- **44 `batchUpdate` request types**, and none of them creates a native chart, a layout, a master, a transition, or an animation.
- **Charts are Sheets-linked only** — `CreateSheetsChartRequest`, either `LINKED` or `NOT_LINKED_IMAGE`.
- **No SVG.** `createImage` accepts PNG/JPEG/GIF, ≤50 MB, ≤25 MP, with a URL ≤2 KB.
- **No custom fonts.**
- Write quota is 60/min/user, but a single `batchUpdate` of N requests costs **1 unit** — batch aggressively.
- PPTX→Slides conversion caps at 100 MB; export caps at 10 MB.

For a deck that must exist in both worlds, generate the PPTX and convert via Drive, designing defensively: PNG rather than SVG, simple or image-based charts, no custom fonts, no animation.

## Spec-only

When someone else builds it, hand over: the storyline with final assertion titles in order; per-slide layout archetype, evidence, and speaker notes; the design system (canvas, grid, type scale, palette, motion); chart specs ready for `dreambase-echarts`; and the source/method lines. This is a real deliverable, not a fallback — it's also the highest-brand-fidelity option when the user controls a template you can't see.

For a user who just wants to paste your work into their own deck, hand back **SVG for PowerPoint** (it survives Convert-to-Shape and stays theme-recolorable) and **PNG for Slides**, plus the written content spec and notes.

## Interactive content inside a slide

Verify the constraint before promising interactivity in a native deck:

- **PowerPoint:** the Web Viewer add-in was retired 2024-12-02. Content add-ins can host an HTML5 surface, but every viewer must install the add-in, and non-installers see a saved snapshot image. Viable only when the presenter controls M365 deployment and you've tested slide-show behaviour.
- **Google Slides:** no embed element exists. Add-ons are editor chrome with no present-mode trigger.

**The pattern that always works:** a static slide carrying the full claim, plus a QR code, plus a short URL, plus the URL in the speaker notes — with the live version published separately. Put the link in all three places. The interactive version is never the only path to the information.

## Defaults for any file-producing path

1. Slide size **13.333 × 7.5 in** unless the template says otherwise — and **always read the real size from the target** before computing a coordinate.
2. Emit a real **`title` placeholder on every slide**, positioned off-canvas if it shouldn't be seen. This is how screen readers navigate a deck. Never mark it `hidden`.
3. Emit shapes into the tree in **narration order** — that order *is* the reading order.
4. **Alt text on every non-decorative visual**; mark decoration explicitly as decorative.
5. **Speaker notes on every content slide.**
6. Reference **theme colors and theme fonts**, not literals, so the deck re-themes cleanly.
7. **Compute contrast yourself** — 4.5:1 text, 3:1 large, 3:1 chart marks. The built-in accessibility checker skips transparent boxes and slide backgrounds.
8. **Ship a PNG fallback with every SVG.**
9. For print or large projection: SVG art plus ≥300 DPI PNG fallbacks. 300 DPI at 16:9 is 4000×2250 px; PowerPoint's own default export is only 96 DPI.
10. For a tagged, accessible PDF, export through PowerPoint with document structure tags enabled — raw converters produce untagged PDFs.
11. If the data is confidential and the deck is public, apply `dreambase-public-reports` **before** choosing any of this. Disclosure is orthogonal to output path, and it gets decided first.
