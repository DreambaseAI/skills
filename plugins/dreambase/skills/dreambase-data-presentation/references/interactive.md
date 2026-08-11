# Interactive and Animated Decks

What to build when the charts move, when the audience can touch something, and when a person with a clicker is driving. Most of this is settled research, and most of it contradicts the instinct to make a deck "more interactive."

## Contents

1. [The structural model](#the-structural-model)
2. [Sequencing](#sequencing)
3. [Animation](#animation)
4. [ECharts settings for decks](#echarts-settings-for-decks)
5. [Which interactions earn their place](#which-interactions-earn-their-place)
6. [Live data](#live-data)
7. [Presenter and remote mechanics](#presenter-and-remote-mechanics)
8. [Accessibility](#accessibility)
9. [Worth studying](#worth-studying)

## The structural model

Segel & Heer's design-space analysis of 58 narrative visualizations gives the vocabulary. Their **author-driven ↔ reader-driven spectrum** runs: linear ordering / heavy messaging / no interactivity, through to no prescribed ordering / no messaging / free interactivity. Business presentations sit hard on the author-driven end — and their paper says so directly, noting that business presentations use Slide Shows rather than the other genres.

Three hybrid structures matter, and picking the right one is the first interaction decision:

**Interactive Slideshow — the default for a presented deck.** Interaction lives *"within the confines of each slide,"* linear between slides. Their reasoning is exactly the presenter's requirement: it *"ensures that the user only moves forward in the presentation when he is ready to do so, and allows the user to repeat steps if desired,"* and it draws *"discrete boundaries between different story segments, similar to a cut in film."*

**Martini Glass — the default for the deck as a whole.** An author-driven stem (your linear argument) opening into a reader-driven mouth (free exploration). In deck terms: the stem is the talk, the mouth is the appendix or the live dashboard you open for Q&A. Segel & Heer note this is the most common structure across the interactive visualizations they examined.

**Drill-Down Story** — reader picks their own entry point. This is the self-serve version you ship as the link, not the thing you present.

Compose them: the deck is a Martini Glass overall, and **each individual slide is a small Martini Glass** — assert first, then open the control. That's Segel & Heer's own observation about interactive slideshows: individual slides *"often function in the martini glass style, again communicating author-intended messages prior to prompting the user to interact."*

**Why not scrollytelling.** Scroll is right for a reader alone with a page and wrong for a room. Presentation remotes emit discrete page events; scroll position is analog, so you cannot reliably land on a frame while talking; momentum scrolling smears badly over screen-share; and there is no way to step backward precisely to answer a question. Build the scrollytelling version as the shareable artifact if you want one — but not as the thing you present.

## Sequencing

Hullman et al. studied how audiences actually want narrative visualizations ordered, and the result **contradicts "overview first, zoom and filter, details on demand"** as a narrative rule:

**Transition preference: Temporal > (Dimension | Measure) > Granularity.** Time is the preferred axis of change. General-to-specific — the Shneiderman mantra — ranked *last* as a story transition. (The mantra is about exploratory interfaces, not narration; this is a genre difference, not a contradiction of Shneiderman.)

**The preference cliff is between changing one thing and changing two.** Changing three is no worse than two — the damage is done at the second. So: **change exactly one thing per step.** New series, new time window, new grouping — pick one.

**Parallelism** (repeating a transition pattern across sections, so section 3 moves the way section 2 did) has a *proven memory benefit*, but the comprehension benefit was **not** statistically significant. Use it; don't oversell it.

**One peak, near the middle.** Context → several findings → one decisive slide → implications. A deck with three climaxes has none.

## Animation

Heer & Robertson ran two controlled experiments on animated transitions in statistical graphics. The headline: *"animated transitions can significantly improve graphical perception"* — animation beat static in every condition tested, and staged animation beat direct animation in most.

But the qualifications are where the craft is:

- **Heavy staging increased error.** Their recommendation is verbatim *"the use of simple staging"* — two stages, not five.
- **Timing:** stages run *"around a full second, rather than around a half-second each."* Their experiments used 1.25 s and 2 s totals.
- **Axis rescaling is the biggest measured harm.** Use a common scale across steps where you can. If you must rescale, keep the gridlines visible *through* the change and fade them after.
- **Slow-in slow-out**, because *"the use of acceleration should improve spatial and temporal predictability."*
- **Never reuse a mark to mean a different data point.** The eye tracks objects; reassigning one lies to it.

**The ethics rule, and it is a hard one:** *"In data schema changes, animation is only appropriate when there is a data dimension shared between the starting and ending states. Without a shared structure between graphics, animation may be ill-defined or misleadingly convey false relations. In such cases, we advocate using either static or dissolve transitions (as in cinema) to indicate the independence between graphics."*

Pair that with Tversky's **Congruence Principle** — the format of the graphic must correspond to the format of the concept — and progressive reveal sorts itself out. A line wiping left to right along a time axis is congruent. Bars representing *categories* growing up from zero is not: it animates growth that does not exist in the data.

**Highlight, don't withhold.** Render all data on entry at 25–35% opacity and bring the focus series to full in ~150 ms, rather than adding series one at a time. Progressive *addition* lets a build land on a conclusion the complete chart wouldn't support — three rising quarters revealed before the falling fourth is rhetoric wearing a data costume. Progressive *emphasis* cannot do that, and satisfies the same signalling goal.

Durations live in `slide-craft.md`.

## ECharts settings for decks

ECharts' defaults are tuned for dashboards, not decks. Four changes and one trap:

| Option | Default | For a deck |
|---|---|---|
| `animationDurationUpdate` | **300 ms** | **700–1000 ms** — the default is far under Heer & Robertson's ~1 s per stage |
| `animationEasingUpdate` | `cubicOut` | **`cubicInOut`** — the default is ease-out only; the research wants slow-in *and* slow-out |
| `animationThreshold` | **2000** | Know it exists: a chart with more than 2000 graphic elements **silently loses all animation** |
| `aria.enabled` | **`false`** | `true` — ECharts ships inaccessible by default |

**The trap that breaks stepped decks:** `setOption(option, /* notMerge */ true)` removes and recreates every component, which **throws the animation away entirely**. Merge (the default) and keep stable `id` / `name` / `groupId` values across steps. ECharts diffs **by the `name` of the data** — if names change between steps, points get destroyed and recreated instead of moving. Use `replaceMerge` when you genuinely need to remove a series without nuking the chart.

For morphing between chart *types* (bar → pie, scatter → bar), `universalTransition` is the mechanism — but re-read the ethics rule above before using it. A morph between two encodings of the same data dimension is legitimate; a morph between unrelated graphics is exactly what Heer & Robertson say to render as a dissolve.

## Which interactions earn their place

| Interaction | Presented (someone drives) | Shared link |
|---|---|---|
| Scenario slider / what-if | **Yes — best in class** | Yes |
| Before/after toggle (2 states) | **Yes — as two labeled steps** | Yes |
| Animated transition between encodings | **Yes** | Yes |
| Small-multiple → drilldown | Yes, if reversible with the back key | Yes |
| Live "as of now" tile | Only if snapshot-backed | Maybe |
| Sortable / filterable table | Appendix only | Yes |
| "Find your X" lookup | Pre-loaded examples only | **Yes — best in class** |
| Tooltip / rollover | **No** for anything load-bearing | Yes, as verification |
| Draggable wipe slider | Convert to a toggle | Yes |
| Free-form zoom / pan | No | Yes |

**Why tooltips fail on stage, specifically:** with a clicker in hand there is no cursor on screen at all. This isn't a preference — it's a hardware fact, and it's the same conclusion NYT reached from web analytics ("assume no one will ever see it"). Direct-label the two or three points you'll actually mention; put the tooltip in the shared link.

**Own your defaults out loud.** A default view is an argument, not a neutral state — which slice is selected, which date range is preset, and which comparison is on all encode a claim. Say what you chose and why.

**The sharpest test for whether an interaction belongs**, from Bret Victor: *can the audience rebut you by modifying your model?* If the control only lets them admire the finding, it's decoration. A deck is an argument aimed at a decision, and Victor himself disowns "any article with interactive pictures" as the failure mode.

## Live data

The strongest verified practice in the field is: **don't be live.** Observable Framework's data loaders *"generate static snapshots of data during build"*; Quarto's `freeze` stores computational results and re-uses them; Evidence defaults to static site generation with live-ish rendering as the opt-in exception. The leading tools solve the live-data problem by refusing to be live at presentation time.

The risks are worth naming because most are not technical failures:

1. **The talk track desynchronizes from the numbers.** You rehearsed "up 14%." A pipeline lands at 9:02 and it's 13.6%. Everything worked correctly and you now misstate a number on the record. This is the top risk.
2. Network failure at presentation time — conference wifi, VPN-gated warehouses, expired tokens.
3. Query latency: four seconds is nothing in a dashboard and an eternity on stage.
4. Cost and blast radius — every rehearsal and every backward navigation re-fires the query.
5. Credential exposure: a deck is a file people forward.
6. Non-reproducibility — six months later nobody can reconstruct what the slide said.
7. Silent partial data: a late-arriving partition makes "today" look like a cliff, rendered with total confidence.

**Mitigations, in priority order:**

1. **Snapshot at build.** The deck ships with its numbers.
2. **"Data as of" stamp on every data-bearing slide** — per chart, not once on slide 1. Record the *data* timestamp (max event time or partition), not the render time.
3. **Frozen fallback, always.** If you do query live, bundle the last-known-good snapshot and fall back on error or timeout with a visible "showing cached data from X" chip. Never fall back to an empty chart.
4. **Hard timeout ~1.5–2 s.** A presenter cannot wait.
5. **Pre-warm at deck open**, not at slide entry — makes backward navigation free.
6. **A "lock data" toggle** that freezes values for the duration of the talk. This kills risk 1 outright.
7. **Diff-and-warn in rehearsal:** compare live values against the numbers baked into the speaker notes and warn before the presenter walks on.
8. **Keep the live surface tiny.** One status tile can be live; the chart carrying the argument should not be.
9. **Export a static PDF of every slide** as the record of what was shown.

## Presenter and remote mechanics

**Remote key codes, verified from Logitech's own documentation** for the R400/R700/R800 — the most common presenter hardware:

| Button | Sends |
|---|---|
| Next | **PageDown** |
| Previous | **PageUp** |
| Blank screen | **`.`** (period) |
| Start / stop | **F5** / Escape |

Three consequences that are otherwise folklore:

1. **A remote is a USB HID keyboard sending PageUp/PageDown — not arrow keys.** A deck binding only arrows and space **will not respond to a presenter remote.**
2. **The blank button sends period.** That's why reveal.js binds both `B` and `.` to pause — the `.` binding exists for hardware, not humans. Implement blackout without binding `.` and you break the remote's blank button.
3. **The start button sends F5, which reloads a browser deck.** And reveal.js ships `hash: false` by default, so a presenter idly pressing it loses their place entirely. Set `hash: true` and `preventDefault()` on F5 in presentation mode.

Note the R500 is driver-mediated through Logitech's app and does *not* publish its keystrokes — don't assume it sends PageUp/PageDown. Kensington and Spotlight codes are unverified.

**Defensive bindings** — use `event.code` (physical key) so keyboard layout is irrelevant:

```js
const NEXT  = new Set(['ArrowRight','ArrowDown','PageDown','Space','Enter']);
const PREV  = new Set(['ArrowLeft','ArrowUp','PageUp','Backspace']);
const BLANK = new Set(['KeyB','Period']);
```

Plus: **debounce ~250 ms** (remotes emit key-repeat on a long press and will skip three steps), never require a modifier (remotes can't send them), never require the mouse on the critical path, and let `Escape` exit fullscreen or overview gracefully rather than destroying state.

**Autoplay nothing.** A chart animating on a timer will animate while you're answering a question. Every animation is step-triggered. This is also WCAG 2.2.2.

**Every step is a URL.** Deep-linking is off by default in reveal.js; turn it on so a presenter can jump, a colleague can link to slide 14, and an accidental reload is survivable.

## Accessibility

**Keyboard.** All functionality operable by keyboard (SC 2.1.1), no traps (2.1.2) — modal help overlays and lightboxes are the real 2.1.2 risk in a deck, so bind a standard exit. Preserve a meaningful focus order across slide changes (2.4.3). Don't build a shortcut-only deck: tab and shift-tab move between components, arrows move within them.

**Announcing slide changes.** Use a persistent, initially-empty live region with **`aria-live="polite"` and `aria-atomic="true"`** — never `assertive`, which interrupts whatever the user is currently reading, i.e. the slide they just asked to leave. The timing rule people get wrong: the live region must exist in the DOM *before* the change; start empty, then change the content in a separate step.

Announce **slide title plus position** ("Slide 7 of 22. Revenue by segment, 2019 to 2025"), not the whole slide — normal traversal reads the content once focus moves. Don't announce every fragment step, only fragments that change meaning, or you create a firehose.

**Exposing a live chart's data — three layers:**

1. **`aria` on the chart.** In ECharts this is `aria.enabled: true` (off by default). Be aware the auto-generated description reads data points as one uninterruptible string and **truncates at 10** (`maxCount`). Fine for a five-slice pie, useless for a 200-point line — set `aria.label.description` to a human sentence stating the takeaway. Decals (the colourblind-safety pattern fill) need **both** `aria.enabled` and `aria.decal.show`.
2. **A visible text takeaway** next to the chart. This is simultaneously the best accessibility affordance and the best design practice — it isn't a fallback, it's the headline.
3. **A real data table.** Chartability rates a missing table **critical**. Ship it in the appendix or behind a disclosure on the slide.

**Motion:** honour `prefers-reduced-motion` — keep the state change, drop the movement.

## Worth studying

Two interactive pieces are close to perfect templates for a data deck, and both are still live:

- **NYT, "Budget Forecasts, Compared With Reality"** (2010, on `archive.nytimes.com`) — a fixed two-panel frame, prose on the left, animated chart on the right, and the control introduced *halfway through* with a sentence inviting its use. That is the interactive-slideshow structure executed exactly.
- **Bloomberg, "What's Really Warming the World?"** — one fixed axis, one line that never moves, each step overlaying a single candidate cause. It is the "change one thing per step" rule as an entire piece.

Also worth reading for craft: Gapminder (annotated graph inside a slide show — the structure Segel & Heer cite), Distill.pub's guide (archived, not active) for interactive-article typography, and Bret Victor's explorable explanations for the standard the medium is capable of.
