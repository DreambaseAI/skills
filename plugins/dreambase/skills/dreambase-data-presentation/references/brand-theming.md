# Brand Ingestion and Theming

How to turn whatever the user hands over into a deck system — and what to do when they hand over nothing.

The goal is always the same output shape regardless of input: a token set plus a short **brand report** recording provenance and confidence per field. That way a later, better brand input is a drop-in replacement rather than a redesign.

## Contents

1. [Six input scenarios](#six-input-scenarios)
2. [Turning a bag of colors into a system](#turning-a-bag-of-colors-into-a-system)
3. [Deriving a palette from one brand color](#deriving-a-palette-from-one-brand-color)
4. [Chart palettes](#chart-palettes)
5. [Light and dark pairs](#light-and-dark-pairs)
6. [The brand-safe checklist](#the-brand-safe-checklist)

## Six input scenarios

### 1. A `design.md` or brand guidelines in Markdown — highest confidence

Read it, and also glob for `brand.md`, `BRANDING.md`, `design-system.md`, `tokens.json`, `theme.ts`, `tailwind.config.*`, and `:root` blocks in CSS. Extract by regex first (hex, `rgb()`, `hsl()`, `oklch()`, `--custom-property: <color>`, `font-family` declarations), then use judgement for the prose rules. Named roles in the file always beat inferred ones.

### 2. A link to a live website — highest practical value, most failure modes

In order of reliability:

1. **Declared CSS custom properties.** Walk `document.styleSheets` for `:root` rules and read the declarations. Don't try to iterate `getComputedStyle` for this — you can't enumerate custom properties that way reliably.
2. **The `prefers-color-scheme: dark` block**, if present — this hands you their dark pairing for free, already authored by their designers.
3. Computed styles on real elements (body, headings, primary buttons, links).
4. An area-weighted color histogram of a screenshot.
5. Screenshot quantization as a last resort.

Also pull the logo (prefer the SVG), and the actual font stacks rather than the display names.

### 3. A PDF brand guide — richest rules, hardest parsing

Brand PDFs almost always print their hex values as text next to each swatch, so a regex over the text layer catches most of the palette without touching pixels. Then read 3–6 key pages as images — "color", "typography", "logo usage", "incorrect usage" — for swatch chips, the clear-space diagram, and the do-not grid.

Two cautions: **map Pantone to sRGB only with an explicit warning** (it isn't lossless, and guessing silently is the kind of error a brand team notices), and watch for CMYK-derived hexes that will look dull on screen. Extract the embedded font table to learn exact family names even when the files aren't extractable. Capture the do-not rules verbatim into the report.

Confidence: high for rules, medium for color values.

### 4. A `.potx` / `.pptx` / Google Slides theme — the most precise input, routinely overlooked

A `.potx` is a ZIP. Unzip and read `ppt/theme/theme1.xml`:

- `a:clrScheme` children in fixed order: `dk1`, `lt1`, `dk2`, `lt2`, `accent1`–`accent6`, `hlink`, `folHlink`. **The six accents are the chart palette** — that's what PowerPoint uses for series colors.
- `dk1`/`lt1` are usually system colors (`<a:sysClr val="windowText"/>`), so read the **`lastClr` attribute**, not `val`.
- `a:fontScheme` gives you major (heading) and minor (body) fonts, which map directly onto the same split in every other target.

If you have the actual file, prefer building *into* it via `pptx-automizer` (see `build-paths.md`) over reconstructing a lookalike.

### 5. Just a logo image

**If SVG, parse it** — every `fill`, `stroke`, `stop-color`, and inline style is an *exact* brand value, not an estimate. Deduplicate, drop pure white/black (usually the knockout), and rank by path area where computable.

**If raster, quantize** — but strip the transparent or white matte *first*, or the dominant color comes back as "the background." Downsample and skip anti-aliased edge pixels, which are blends rather than brand colors. Prefer **median cut** over k-means: it's deterministic, which matters when the same deck must build twice identically. Then filter clusters by chroma (`C > 0.04` in OKLCH) to separate brand hues from neutrals.

Take the highest-chroma, highest-area cluster as the primary and derive the rest. A monochrome logo gives you exactly one color — which is the case the derivation below is designed for.

### 6. Nothing at all

**Do not guess a brand.** Ship a deliberately neutral, high-quality system and say so.

Sensible default: a near-neutral surface pair (not pure white/black — around L 0.98 and L 0.16 in OKLCH, to avoid glare and smear), one restrained accent, and the **Okabe–Ito** palette for charts so the data is correct-by-default even with no brand. Mark every token as a default in the report, so brand ingestion later is a swap with zero template changes.

Then ask **one** good question rather than six: *"Do you have a logo, a website, or a PowerPoint template?"* — in increasing order of value to you.

## Turning a bag of colors into a system

Given N extracted colors and no stated roles:

1. Convert everything to OKLCH.
2. **Neutrals** are `C < 0.03`. Sort by lightness: lightest becomes surface, darkest becomes text. If there are fewer than two, generate them.
3. **Primary** = highest `C × area` among non-neutrals; break ties by "appears in the logo."
4. **Secondary** = next highest chroma whose hue differs from primary by >40°.
5. **Semantic colors** only if a color lands near the conventional windows (green ~140–160°, amber ~70–90°, red ~25–30°) *and* the brand hasn't already claimed it. **If the brand primary is red, don't also use it for errors** — pick a distinguishable red, and add a non-color channel.
6. Everything else goes to an extended set available to charts but not to chrome.

Record every inference and its confidence. Never silently invent a role.

## Deriving a palette from one brand color

All of this is implementable in plain JS with no dependencies. Work in OKLCH — it's perceptually uniform, so holding lightness constant across hues actually produces colors that *look* equally light, which is the thing HSL gets wrong and why HSL-derived ramps show the classic bright band in the middle.

**Step 0.** `#RRGGBB` → linear sRGB → Oklab → OKLCH, giving `(L₀, C₀, H₀)`.

**Step 1 — build an 11-step ramp.** Hold hue constant, walk a fixed lightness curve:

```
step:  50    100   200   300   400   500   600   700   800   900   950
L:    0.97  0.94  0.89  0.82  0.74  0.65  0.57  0.49  0.41  0.33  0.24
```

Scale chroma by a bell that peaks near 500–600 and falls to ~15% at the ends, so the extremes desaturate naturally. **Gamut-map every step** by holding L and H and reducing C to the sRGB boundary via binary search — never by clipping channels, which shifts hue. Finally **re-anchor**: find the step whose lightness is nearest L₀ and overwrite it with the exact original hex, so the user's brand color appears verbatim in the output.

**Step 2 — assign roles by target contrast, not by eye.** This is Leonardo's central idea and it's the right one: generate colors *from* contrast ratios rather than picking colors and checking afterward. Binary-search L at fixed (C, H) until the contrast target is hit — the same search as gamut mapping with a different objective.

| Role | Against | Target |
|---|---|---|
| Primary text | Surface | ≥ 7:1 (decks get projected in bright rooms) |
| Secondary text | Surface | ≥ 4.5:1 |
| Muted text / captions | Surface | ≥ 4.5:1 — **don't relax this for footnotes** |
| Solid accent | Surface | ≥ 3:1 (it's a graphical object) |
| Text on accent | Accent | ≥ 4.5:1 |
| Chart series | Plot background | ≥ 3:1 (SC 1.4.11) |
| Meaning-bearing borders/axes | Adjacent | ≥ 3:1 |

**Build to WCAG 2.2 AA.** APCA was marked exploratory and **removed from WCAG 3 in July 2023**, and no replacement has been chosen — the contrast algorithm for WCAG 3 is still undetermined, and WCAG 3 itself is plausibly around 2030. Treat APCA as an optional advisory check; never present it as a standard.

## Chart palettes

**Start from Okabe–Ito** when there's no brand constraint — eight colors designed for Color Universal Design, deliberately avoiding the yellow-green range where CVD confusion is worst, and spanning a wide luminance range so brightness works as a second separation channel when hues collapse:

```
#000000  #E69F00  #56B4E9  #009E73  #F0E442  #0072B2  #D55E00  #CC79A7
```

Note `#F0E442` (yellow) fails 3:1 against white — darken or swap it on light backgrounds.

**For a brand-flavored categorical palette**, don't just recolor everything in the brand hue — series have to be distinguishable:

1. Series 1 = brand primary, or the ramp step that clears 3:1 against the plot background.
2. Generate remaining hues at near-constant L and C, spaced around the wheel — but *not* evenly. Weight the spacing away from the ~90–140° yellow-green region, mirroring Okabe–Ito's logic.
3. **Vary L deliberately** (±0.08) so the palette survives greyscale printing and CVD.
4. **Validate programmatically:** simulate protanopia, deuteranopia, and tritanopia, then assert a perceptual distance floor between every pair under every simulation. Rotate hue or push lightness apart and re-run on failure.
5. Assert every series clears 3:1 against the plot background.
6. **Cap at 6–7 series.** Beyond that no palette is honestly distinguishable — change the chart form (small multiples, direct labels, highlight-one-and-grey-the-rest) rather than adding a ninth color.

If brand-derived series fail CVD validation, fall back to Okabe–Ito with the brand color substituted into the nearest-hue slot, and record the substitution.

Sequential ramps: monotonic L, single hue. Diverging: two hues with L peaking at the neutral midpoint. Both are straightforward in OKLCH.

## Light and dark pairs

Keep primitives (ramps, spacing, radii, type scale) mode-independent and vary only the semantic layer. Note that **the design-tokens format defines no mode or theme mechanism** despite common belief, so file-per-mode is the correct implementation, and it's what both token pipelines and Figma variable modes reduce to anyway.

**Dark is not an inversion:**

1. **Invert tone position, not color.** The role map is identical; only which ramp step fills it changes — light surface ≈ step 50, dark surface ≈ step 950.
2. **Never pure black** (~L 0.14–0.18). Pure black causes halation with light text and kills elevation.
3. **Reduce chroma in dark mode** (×0.75–0.85) and raise lightness for solids. A saturated brand color that reads well on white is often garish on near-black.
4. **Re-run every contrast assertion per mode.** A pair that passes in light frequently fails in dark. This is where most hand-built dark themes break.
5. **Elevation is lightness in dark, shadow in light.**
6. **Charts need dimmer gridlines and brighter series in dark** — on a dark field, equal contrast reads as equally present.
7. **The logo needs a mode variant.** Use the brand's knockout/reversed version. If only one was supplied, don't auto-invert a multicolor logo — place it on a small white or brand-colored plate.
8. **Don't invert images.**

## The brand-safe checklist

### Logo

- **Clear space is a ratio, never a fixed value** — conventionally the height of a key logo element. Compute the exclusion rect at render and assert nothing intersects it. Default when unknown: 0.5 × logo height on all sides.
- **Minimum size** is specified separately for print and digital. Default when unknown: 24 px / 12 mm for a wordmark, 16 px / 8 mm for a mark-only lockup. Fail rather than ship an illegible logo.
- **Near-universal do-nots to enforce by default:** don't stretch, skew, or rotate; don't recolor; don't add shadow, glow, outline, or bevel; don't place on a busy photo without a scrim or solid plate; don't rebuild the lockup or change mark/wordmark spacing; don't use the mark as a bullet or texture; don't crop.
- Prefer the vector. If only raster exists, never scale above 1×.

### Color

**Never alter brand colors for accessibility.** WCAG explicitly exempts logotypes from contrast minimums, and 1.4.11 exempts logos too. The logo renders in its exact brand colors, always.

When the brand primary fails 4.5:1 as body text, **add rather than alter**:

1. Keep the brand color for display type, fills, and accents — those only need 3:1.
2. Derive a brand-adjacent accessible text color from the ramp (same hue, lightness pushed to hit 4.5:1). It's *derived from* the brand, not a replacement.
3. Document the substitution so the brand owner can approve it.

**The chart-only extended palette is the key move.** Most brands ship 1–3 colors; six series need six. Create a namespaced chart palette that is **explicitly declared as an extension, not part of the brand**: series 1 is the brand primary, the rest are derived and CVD-validated, and the extension never appears in chrome, headers, or near the logo. Brand teams object to *altered brand colors*; a declared data-visualization extension is standard, defensible practice.

### Typography

- **Check the license before embedding.** Google Fonts (OFL) is safe; many desktop and subscription licenses don't permit embedding in a distributed file. If unlicensed, use the exact metric fallback and say so — don't silently substitute.
- Preserve the heading/body split; it maps directly onto PowerPoint's major/minor font slots.
- Never fake a weight. Synthetic bold and oblique are a do-not in most guides, and they look it.

### Assertions the build should actually check

```
[ ] every text/background pair ≥ 4.5:1 (≥ 3:1 large), per mode
[ ] every chart series vs. plot background ≥ 3:1, per mode
[ ] every series pair distinguishable under 3 CVD simulations
[ ] ≤ 7 categorical series, or the chart form changes
[ ] logo at or above minimum size, clear space unobstructed
[ ] logo in unaltered brand colors, correct mode variant
[ ] every color traces to a token — no silently approximated brand hex
[ ] every figure traces to a data source
[ ] every exhibit carries a source line
[ ] brand font embedded, or the fallback documented
[ ] no placeholder residue: "Lorem", "20XX", "$XXM", "[Company]"
```

That last one matters more than it looks. Placeholder residue in a shipped deck is the single most visible failure mode of generated presentations, and it's trivially checkable.
