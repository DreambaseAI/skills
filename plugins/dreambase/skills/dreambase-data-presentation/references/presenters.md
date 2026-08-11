# The Presenters: Verified Practice and What the Research Supports

Distilled from primary sources (August 2026). Read this when justifying a design choice, when a stakeholder invokes a name ("make it like a McKinsey deck"), or when deciding between two authorities who disagree.

The last section lists claims that **failed** verification. Several are near-universally repeated. Do not cite them.

## Contents

1. [The methods](#the-methods)
2. [Measured artifacts](#measured-artifacts)
3. [What the research actually supports](#what-the-research-actually-supports)
4. [Where the canon agrees](#where-the-canon-agrees)
5. [Where it genuinely conflicts](#where-it-genuinely-conflicts)
6. [The numbers](#the-numbers)
7. [Do not cite](#do-not-cite)

## The methods

### Michael Alley — assertion–evidence

The most rigorously tested slide structure in existence. Penn State's published checklist prescribes: *"Begin each body slide with a sentence-assertion headline that is left justified and no more than two lines"*; *"Support the assertion headline with visual evidence… avoid bullet lists"*; *"design your slides so that the audience reads no more than 20 words per minute"*; keep lists to two, three, or four items; and *"leave at least a half-inch of white space below the headline."* Typography: bold sans, 28 pt headline / 18–24 pt body / 12–14 pt references — all on a 4:3 canvas, so normalize by ×1.3333 for widescreen (see `slide-craft.md`).

Effect sizes exist but weren't obtained at source; describe the structure as well-supported without quoting numbers.

### Nancy Duarte — the artifact taxonomy

Her most useful contribution isn't a slide rule, it's the three-way split: **document** (prose, read) → **slidedoc** (prose + visuals, read, one point per page, self-explanatory) → **presentation** (visuals, spoken, requires a presenter). She classifies "Research Findings," "Reports," and "Status Update" as *slidedocs* — which means most analytics work is not a presentation by her own taxonomy.

The **Glance Test**: *"People should be able to comprehend each one in about three seconds."* (Note: this is verifiable from her HBR writing; the duarte.com blog URLs that circulate for it are dead, and there is no separately named "3-second rule" for annotation — use "Glance Test, 3 seconds.")

Her **Sparkline** structures persuasive talks: what is → call to adventure → alternating what-is / what-could-be → call to action → new bliss. Full slidedoc specs are in `deck-genres.md`.

### Garr Reynolds — Presentation Zen

Restraint, simplicity, naturalness. Coined **"slideument"** as a pejorative for the hybrid artifact. For charts specifically: *"write a declarative statement rather than a title."* Prescribes going analog before opening slide software, and a separate handout rather than a dense projected deck.

### Cole Nussbaumer Knaflic — Storytelling with Data

The live↔sent continuum, storyboarding with post-its before software, decluttering, preattentive attributes, and greying the context to colour the point.

**Attribution correction:** the Big Idea's three components (point of view, what's at stake, a complete sentence) are **Duarte's**, from *Resonate* — Knaflic credits her explicitly. Our own `dreambase-data-stories` currently calls it "Knaflic's test"; it should be attributed to Duarte.

### Barbara Minto — the Pyramid Principle

Governing thought at the top, 3–4 grouped supporting arguments, MECE ordering. Two corrections worth carrying: Minto trademarked **SCQ** (situation, complication, question) — the *Answer* is the pyramid apex, not a fourth element of the acronym. And she coined the MECE *acronym* while crediting **Aristotle** for the principle itself.

### Gene Zelazny — Say It With Charts

First published 1985. His chart-selection framework predates Cleveland & McGill, so follow the perceptual literature where they conflict (notably on pie charts) and treat his matrix as heritage. His framework also maps **two** valid forms to several comparison types — the popular one-message-one-chart-type table that circulates is a simplification. Cite the books; his often-quoted McKinsey job title is unverified.

### Consulting deck craft

Action titles ("so what" titles), horizontal logic (the titles read in sequence *are* the argument), vertical logic within a slide, storyline-first ghost decks, and mandatory source footers. Documented convention caps titles at two lines / ~15 words.

**Important sourcing caveat:** McKinsey's own site could not be reached in this research — **zero McKinsey exhibits were actually read**. Everything above comes from ex-consultant writeups and published books. Describe these as *consulting conventions*, not as "McKinsey's rules," and never reconstruct a firm's house style from memory.

### Tufte and Doumont — the density argument

Tufte's *The Cognitive Style of PowerPoint* argues that slide bullet outlines destroy analytical reasoning, and his NASA analysis is genuinely damning — but it is about **Columbia**, not Challenger. (The Challenger material is the O-ring chart analysis in *Visual Explanations*. These get conflated constantly.)

**Jean-luc Doumont's rebuttal exists, is fully verified** (*Technical Communication* 52(1), Feb 2005, pp. 64–70, free at MIT), and is the best counterweight in the canon. He shows the "extremely low resolution" claim is technically wrong — a projected slide is roughly 300 dpi equivalent — and argues Tufte's density prescription misunderstands *oral* communication. His own guidance: a headline that is a complete sentence with subject and verb, ≤12 words, ≤2 lines, *"not a question… but an answer"*; three main points, maximum five; and rules-of-thumb like "N bullets × M words" *"make little sense"* — use visual limits instead.

**The resolution:** Tufte's density argument properly applies to the **paper**, not the projected slide. A skill that applies it to slides has misread him. Both men agree you should also write the document.

### Chris Anderson / TED

The **throughline** — one idea, stated early, that the talk is about. The 18-minute cap. And a correction: **TED does not ban bullet points** — their own guidance permits progressive reveal. That myth circulates widely.

## Measured artifacts

These patterns come from primary files that were downloaded and measured, not from articles about them.

**Benedict Evans** — the most transferable slide grammar found. Five type roles on every slide: headline (the claim, serif) / subhead (the because) / chart definition with units / source / identity footer. Serif for argument, sans for data. One signal red plus charcoal, extended by *tinting the same hue* rather than adding colours. **Zero annotation on the plot** — the benchmark comparison lives in the subhead. 59–106 slides, always 16:9, median ~48 tokens per slide, and only 36–74% of slides are charts.

**Mary Meeker / BOND** — the title grammar is literally `Metric = verdict + number vs. number` ("Global Internet User Growth = Solid But Slowing +6% vs. +7% Y/Y"), applied to content slides *and* section dividers. ~68% of slides carry a source line including the **date of data collection**. The encoding goes in the axis label ("Internet Users (Global Blue Bar)") rather than a legend. Deliberately 4:3 — it's a document that happens to be paginated as slides. Don't copy the density unless you're also building a reference document.

**Amazon** — *"We don't do PowerPoint (or any other slide-oriented) presentations at Amazon. Instead, we write narratively structured six-page memos. We silently read one at the beginning of each meeting in a kind of 'study hall.'"* On why quality varies: great memos *"are written and re-written, shared with colleagues who are asked to improve the work, set aside for a couple of days, and then edited again with a fresh mind."* Offer this when the material is genuinely narrative — and be honest that it can't be done in an afternoon.

**Netflix Culture deck** — declares the format contract on slide 1: *"These slides are meant for reading, rather than presenting."* Visually plain, black text with one green italic emphasis, and a "Seven Aspects" spine slide repeated at every section boundary. Proof that substance beats polish — and that saying which artifact you built is itself a design act.

**Hans Rosling / Gapminder** — one encoding, taught once, then reused by swapping a single axis. The animated bubble chart is narration, not decoration.

**Bret Victor** — the standard the medium is capable of, and the sharpest test for interactivity: can the audience rebut you by modifying your model?

**Publication conventions** worth stealing: Our World in Data's footer contract (`Data source:` in bold, sources semicolon-separated with years, then the URL and licence) — which exists precisely because charts get screenshotted and separated from their page. And the UK Analysis Function's rule, stated outright: headline title = the message, statistical subtitle = metric + geography + period.

## What the research actually supports

The empirical record contradicts the folklore in both directions.

- **"Death by PowerPoint" is not an empirical finding.** PowerPoint vs. no PowerPoint is a clean null (Baker et al. 2018, 48 studies, g = 0.067). The tool isn't the problem; the defaults and the culture are.
- **"One word per slide" is wrong.** Yue, Bjork & Bjork (2013) found abridged on-screen text **beat a no-text control** on transfer (d = 0.60) — and narration over a blank screen was catastrophically worst. Far-paraphrased text was as bad as verbatim. The winning condition is a sentence headline plus minimal keyed labels.
- **Never validate a design against audience preference.** Three independent studies show audiences prefer the design they learn *less* from. Test comprehension, not approval.
- **Mayer's effect sizes are inflated in popular retellings.** The independent meta-analysis of his own corpus (Cromley & Chen 2025, 591 effects) finds g = 0.37, declining year over year. The principles still point the right way — coherence, signalling, segmenting, redundancy — but don't quote the headline numbers.
- **Animation is not automatically better than static** (Tversky et al. 2002), and where it appears to win, the comparison is usually unfair — the animated version carried more information. See `interactive.md` for the conditions under which it genuinely helps.

## Where the canon agrees

Safe to encode as defaults, because every authority arrived independently:

1. **Decide the artifact before designing.** Reynolds ("slideument"), Duarte (three-way split), Knaflic (live↔sent), Doumont (companion handout), Alley (projected ≠ handout), Tufte (write the report).
2. **The title states the conclusion, in a complete sentence, in ≤2 lines.** Six traditions. The most over-determined rule in the field.
3. **Reading only the titles should tell the whole story.**
4. **Never start in slide software.** Analog first — cards, post-its, a dot-dash outline.
5. **One message per surface.**
6. **Grey the context, colour the point.**
7. **Never read the slide aloud** — and this one has real evidence behind it.
8. **Strip logos, footers, and template chrome from body slides.** Consulting decks are the deliberate exception, because they're *read* documents where the source line and page number are load-bearing.

## Where it genuinely conflicts

| Question | The poles | Resolution |
|---|---|---|
| Text on slides | Reynolds: the best slides may have none ↔ Tufte: at the level of scientific journals | The evidence sides with **neither extreme** — abridged text beats both. Sentence headline + minimal labels. |
| Dense hybrid artifacts | Reynolds: the slideument is the disease ↔ Duarte: the slidedoc is a legitimate third form | Both forbid *projecting* a dense artifact. Duarte's "do not verbally present slidedocs" is the bridge. |
| Is PowerPoint itself the problem? | Tufte: inherently defective ↔ Doumont: blame the culture ↔ Alley: blame the defaults | Empirics favour Doumont and Alley (g = 0.067). |
| Pie charts | Zelazny: the form for component comparison ↔ Cleveland/Tufte: avoid | Zelazny is pre-Cleveland & McGill. Follow the perceptual literature. |
| Density per surface | Split across slides ↔ one dense side-by-side surface | Same axis as live-vs-sent: paper is reader-paced, projection is speaker-paced. |
| Rules of thumb | "N bullets × M words" ↔ Doumont: these make little sense | Use **visual** limits (≤2 lines at a given size), not word counts. |

## The numbers

- **≤2 lines** — headline cap. Alley, Duarte, Doumont, and consulting convention, independently.
- **≤12 words** (Doumont) / **~15 words** (consulting action titles).
- **28 pt headline / 18–24 pt body** — Alley's tested typography, on 4:3. Normalize ×1.3333 for widescreen.
- **~21 words per slide** — the tested assertion-evidence density (~42 was the "common practice" comparison).
- **3 seconds** — Duarte's Glance Test.
- **100 words/page concise, up to 175, >250 → write a document** — Duarte's slidedoc thresholds.
- **5 slides** — "the tolerance level for people in power."
- **10 pages / 10 minutes** read at a meeting; **20 minutes** for a pre-read.
- **3 main points, max 5** — Doumont.
- **18 minutes** — TED's cap.
- **~20 pages, ~50 words/slide, 11–23 seconds per slide** — DocSend/HBS, for decks read alone.
- **g = 0.37** — Mayer's corpus, independently meta-analysed. **g = 0.067** — PowerPoint vs. no PowerPoint.

## Do not cite

Widely repeated, and either untraceable to a primary source or contradicted by one.

**Fabricated content.** At least one well-ranking site hosts ~40 plausible-sounding but **AI-generated Zelazny and Minto quotes**. If a Minto or Zelazny quote can't be traced to the actual book, don't use it.

**Misattributions.**
- The Big Idea's three components are **Duarte's**, not Knaflic's.
- **SCQ**, not SCQA, is Minto's trademark.
- The consulting **"Dear box"** and **"so what box"** do not exist. The element is a *takeaway box* or *kicker box*. ("Dear box" is probably a garbling of Zelazny's *Dear Shirley* letter.)
- **10/20/30 is Kawasaki's**, not Steve Jobs' or Apple's.
- Tufte's PowerPoint analysis is about **Columbia**; Challenger is the O-ring material in a different book.

**Myths.**
- **TED does not ban bullet points.**
- **Steve Jobs slide "rules"** — one word per slide, a minimum font size, a maximum bullet count, a three-act keynote structure — are not verifiable from any Apple source; they trace to third-party books.
- **"YC recommends 100 pt type."** Kevin Hale's actual post gives **no numeric font size** — only "use large type, bold text, a simple font, good contrast." Never attribute a size to YC.
- **"Death by PowerPoint"** as a research finding.
- Tufte's *"PowerPoint costs the US economy $X billion"* and the "~40 words per slide" statistic.

**Numbers that don't check out.**
- **DocSend's "21 seconds per slide"** — unverifiable at source. The verified figures are ~19.2 pages, ~50 words/slide, 11–23 seconds. ("19 slides" is secondary rounding of 19.2 pages.)
- **BOND's "339 pages"** — a template artifact in their viewer; the 2019 PDF is 334.
- Any generic slide count for "Benedict Evans' deck" — his decks run 59, 79, 90, and 103 pages depending on the year. Measure the file you're citing.
- Amazon six-pager mechanics beyond the 2017 letter (fonts, margins, appendix caps, "banned company-wide") — folklore.

**Institutional conventions that were not verifiable.** McKinsey/MGI exhibit conventions, IMF chart-pack conventions, a World Bank data-visualization style guide (**no such document was found — don't assert it exists**), Pew's chart palette, and WEF caption formats. If asked to match one of these houses, say what's actually known and ask for a real example file.

**Licensing corrections that matter if you vendor anything.** `owid-grapher` is **no longer MIT** — it's source-available and reuse requires written permission. `bbc/bbplot` has **no licence file at all**. And `#FFF1E5` is the FT's `paper` colour, not "FT pink" (`#fcd0b1`).
