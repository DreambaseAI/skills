# Deck Genres and Their Canonical Outlines

Most deck requests are a known genre with a known shape. Recognize it, start from the outline, adapt — don't invent structure from scratch. Each genre below gives the sequence, the required evidence, the audience's decision, and the failure modes.

Every genre inherits the same substrate: **answer first** (Minto's pyramid — the governing thought is a claim, not a topic), **assertion titles**, and **one message per slide**.

## Contents

1. [The persuasion pattern (shared by four genres)](#the-persuasion-pattern)
2. [Board deck](#board-deck) · 3. [Investor pitch](#investor-pitch) · 4. [QBR](#qbr--business-review)
5. [Analytics readout](#analytics-readout) · 6. [Launch / GTM](#launch--gtm) · 7. [Conference talk](#conference-talk--keynote)
8. [Sales deck](#sales-deck) · 9. [All-hands](#all-hands) · 10. [Slidedoc](#slidedoc--the-read-only-deck)
11. [Recurring-metrics conventions](#recurring-metrics-conventions)

## The persuasion pattern

Four genres — sales, keynote, launch, and most fundraising — run the same narrative engine under different vocabularies. Encode it once:

**World change → stakes → future state → (only then) your thing → proof.**

| Duarte's Sparkline | Raskin's five steps | Challenger's Commercial Teaching |
|---|---|---|
| What is | Name a big relevant change | The Warmer |
| Call to adventure | Winners and losers | The Reframe |
| Alternating what-is / what-could-be | Tease the Promised Land | Rational Drowning → Emotional Impact |
| The turn | Features as "magic gifts" | A New Way |
| Call to action → new bliss | Evidence you can deliver | Your Solution |

**In all three, the product or recommendation arrives around the 80% mark.** Leading with yourself — your company, logos, funding, architecture — is the shared, explicit prohibition. The oscillation between what-is and what-could-be is the engine; a single climb is flat.

## Board deck

**Decision:** approve/redirect strategy, and give the CEO what they asked for. **Length:** 15–25 body slides + unbounded appendix.

1. Cover — company, period, date, confidential.
2. **Priorities scorecard, last period** — 3–5 priorities × metric × R/Y/G.
3. **Priorities, next period** — 3–5, each with a metric.
4. **CEO summary — highlights *and* lowlights.** Both, explicitly.
5. **Where we need help** — hiring, customers, partnerships, product, marketing.
6. Financial performance vs. plan + updated forecast.
7. Revenue/sales vs. target, including pipeline.
8. Marketing vs. target.
9. Product engagement — signups, activations, engagement, retention.
10. **Monthly waterfalls for each of: revenue, burn, cash balance, headcount.**
11. Forward-looking org chart, next six months.
12. Product roadmap and major launches.
13. **Working session — 2–3 strategic decisions**, each framed as options plus a management recommendation.
14. Closed session (no materials).
15. Appendix.

**The governing ratio:** roughly two-thirds of board time on decisions not yet made, one-third on past performance. A deck that inverts this is a status report wearing a board deck's clothes.

**Production discipline** (from GitLab's public handbook, the only fully documented chain found): agenda frozen ~6 weeks out, materials locked and distributed **7 days ahead**, memo capped at *"up to four pages with four additional exhibits."* That exhibit cap is the cleanest appendix rule available — steal it.

**Failure modes:** performance review crowding out decisions; lowlights buried or absent; sending materials the night before; metrics whose definitions drift between meetings; no explicit ask.

## Investor pitch

**Decision:** take the next meeting. **Length:** 10–20 slides.

Sequoia's current template: Company Purpose ("define the business in a single declarative sentence") → Problem → Solution → Why Now → Market Potential → Competition → Business Model → Team → Financials → **Vision**. The classic version — the one Airbnb's 2008 deck followed — used Market Size and Product in place of Vision.

**Verified attention data** (DocSend/HBS, 200 startups): decks run ~20 pages, **~50 words per slide**, and get 11–23 seconds of attention per slide. Also: *none* of the successful decks in that dataset had a table of contents. The widely-quoted "21 seconds per slide" figure could not be verified at source — don't cite it as a number.

**The narration fork matters more than the template.** YC's guidance for a narrated 2:30 pitch is 5–7 slides; DocSend's ~20 pages/50 words describes a deck read *alone*. These are different artifacts. Build the one that matches how it will actually be consumed, and if both are needed, build both.

**Failure modes:** table of contents; market size by top-down hand-wave with no bottom-up check; competition slide as a 2×2 with you alone in the good quadrant; team slide of logos with no relevance; no "why now."

## QBR / business review

**Decision:** approve the plan, resource the fixes. **Length:** 10–20 + full metric pack in appendix.

1. **Headline verdict** — did we make the quarter, by how much. One slide.
2. **Scorecard** — metric × actual × plan × prior year × variance × R/Y/G. One table; everything after is detail.
3. Financials first — revenue/bookings, margin, burn.
4. Input metrics by owner (the controllables).
5. Output metrics by function (the lagging results).
6. **Variance / root cause — only for metrics outside routine variation.** Each as: what moved → why, with evidence → what we're doing → by when → owner.
7. Wins and losses, named.
8. Risks and mitigations, with owners and dates.
9. **Decisions requested.**
10. Next-quarter commitments — 3–5 with metrics.
11. Appendix — full pack, segment cuts, methodology.

The Amazon norm worth importing: the body carries only **exceptions**. If a metric is on plan, it appears in the scorecard and nowhere else. "Nothing to see here" is a complete answer and should be said out loud.

**Customer-facing QBR/EBR** is a different genre despite the name: executive summary → key performance metrics (adoption, feature utilization, time-to-value) → ROI in concrete numbers → progress against the *previous* QBR's commitments → benchmarking → health score → shared action plan.

**Failure modes:** walking every metric regardless of variance; root cause as narrative rather than evidence; risks with no owner; no ask.

## Analytics readout

**Decision:** believe the finding, act on the recommendation. This is the genre most likely to actually be a slidedoc — check the reading condition first.

1. **The one-sentence answer**, with its confidence qualifier baked in.
2. **Recommendations — 2–4, ranked by impact × feasibility**, each with owner and next step.
3. The question we were asked, and why it mattered.
4. **How we know** — sources, window, sample/n, method. One slide; detail to appendix.
5. **Findings, one per slide** — assertion headline → one chart → the "so what". Ordered by impact, never chronologically.
6. **What we can't say** — limitations, confounds, intervals, data-quality issues. A named, non-optional slide.
7. Alternative explanations considered and ruled out.
8. Recommendations restated with owners and dates.
9. Open questions / proposed next study.
10. Appendix — full methodology, query and notebook links, every cut, non-significant results, instrument, demographics.

**Failure modes:** chronological narration of the analysis ("first we looked at…"); methodology before the answer; observation and interpretation blended into one confident sentence; limitations omitted because they weaken the story; a finding with no chart that would let someone disagree.

## Launch / GTM

**Decision:** approve the launch and its resourcing. **Length:** 12–18 + appendix.

Launch summary (what ships, when, tier, one-line value prop) → why it matters → target audience (user persona and buyer persona, separately) → positioning statement in one declarative sentence → **message house** (umbrella message over 3 supporting pillars, each with proof) → top 3 differentiators as Differentiator | Value | Proof point → competitive comparison → pricing and packaging → launch tier and what it entitles → plan and timeline → channel plan → sales enablement → **success metrics, leading and lagging, with targets and measurement dates** → risks and dependencies → readiness checklist by function → appendix.

**Failure modes:** features without the value translation; one persona doing duty for both user and buyer; success metrics with no measurement date; tier inflation (everything is T1).

## Conference talk / keynote

**Decision:** none — the outcome is that one idea survives the week. **Length:** governed by the clock, not the slide count.

1. **Hook** — a concrete scene, question, or surprising fact. No agenda slide, no "about me."
2. **Throughline stated** — the one idea, in a sentence, early.
3. **What is** — the status quo they recognize.
4. **Call to adventure** — the gap.
5–6. **Alternating beats** — what could be → back to what is. Repeat as material allows; the oscillation is the engine.
7. **The turn** — the insight that resolves it.
8. **Call to action** — concrete.
9. **New bliss** — the reward, one vivid closing image.

TED does *not* ban bullet points — their own guidance permits progressive reveal. Don't cite that myth.

**Failure modes:** agenda slide; credentials before the hook; a single monotonic climb with no oscillation; the idea arriving in the last 30 seconds; slides that are the script.

## Sales deck

**Decision:** advance the deal to a named next step. **Length:** 12–18 + appendix.

1. **The change in the world** — with a chart; the shift must be evidenced.
2. Winners and losers.
3. **The Promised Land** — the future state in the customer's terms, no product.
4. The obstacles between here and there — three, named.
5–7. One capability per obstacle, each framed as removing *that* obstacle.
8. **Proof** — customer stories tied to the same Promised Land, with outcome numbers.
9. How it works / architecture, for the technical evaluator.
10. Why now — the cost of delay.
11. Commercials.
12. Next steps — a mutual action plan with dates.
13. Appendix — security, compliance, integrations, detailed competitive comparison, full cases.

Titles use the customer's language, not product nouns.

**Discovery is not a deck.** A discovery call gets ≤3 slides of context; its output is a question list and a written recap of what you heard. Any charts are the customer's own data. Running discovery off a pitch deck is the most common failure in this genre.

**Failure modes:** opening with logos and funding; product before context; a feature not tied to a named obstacle; proof stories whose outcome doesn't match the Promised Land you teased.

## All-hands

**Decision:** none formal; the outcome is shared context and a consistent answer to "how are we doing?"

Agenda + how to ask questions (30 s) → **the same 3–5 company KPIs, same chart form every time**, actual vs. plan → highlights, with named people → **lowlights, delivered by the CEO, not delegated** → one rotating deep dive → customer story or demo → what's changing (org, policy, process) → what we need from you → AMA → recording and doc posted.

The AMA mechanics from GitLab's handbook are unusually transferable: questions go in a **document, not chat**, so they survive the meeting; the doc is shared read-only during the call to limit traffic; questions are answered **in queue order**; the queue is pre-seeded with empty rows; attendance is explicitly optional because the doc is the durable artifact; and **Host** (owns content) and **Moderator** (owns time, recording, Zoom) are separate named roles.

**Charts:** identical form every session, so the audience learns to read them once. New chart forms only inside the deep dive.

**Failure modes:** metrics that change shape every session; bad news buried; deep dive crowding out Q&A; chat-based Q&A that evaporates; treating live attendance as mandatory.

## Slidedoc — the read-only deck

Duarte's slidedoc is a real, specified artifact, and it's what most analytics "decks" actually are: *"a document created using presentation software, where visuals and words unite to illustrate one clear point per page,"* meant to be *"read and digested"* without a presenter.

**Word density:** ~100 words/page is concise; up to 175 with document furniture; **beyond 250, stop making slides and write a document.** A presentation, by contrast, may carry one word on a slide.

**Length by use — the most directly encodable table in the corpus:**

| Use | Length |
|---|---|
| Exec said "send me your slides" | **5 slides** — "the tolerance level for people in power" |
| Read at the top of a meeting | **≤10 pages** (≤10 minutes) |
| Pre-read sent ahead | readable in **≤20 minutes** |
| Sent to a potential client | ≤10 pages |
| Distributed *during* a talk | ≤10 pages, and only what they'll hear — otherwise they read instead of listening |
| Reference material | up to 50 pages |

**Other specs:** a 4×3 grid; light background (slidedocs get printed); document furniture — table of contents, page numbers, section heads, hyperlinks for self-navigation, index. And the three-question title test: does the copy support the title; does the title support the overall message (if not, you may not need the page); is it under two lines?

**The failure mode has a name:** the *slideument* — one artifact trying to be both a talk deck and a read deck, failing at both. The rule that resolves it: **do not verbally present slidedocs.**

**Amazon's alternative** is worth offering when the material is genuinely narrative: replace the deck with a six-page memo read silently at the start of the meeting. Bezos on why it's hard: great memos *"are written and re-written, shared with colleagues who are asked to improve the work, set aside for a couple of days, and then edited again with a fresh mind."* If the user wants that quality on a one-day timeline, say so.

## Recurring-metrics conventions

**The 6-12 graph** (Amazon's business-review default): trailing 6 weeks beside trailing 12 months, with the prior-year line and target markers. It shows short-term movement and long-term trend without letting either hide the other. Use it as the default form for any recurring metric page.

**Chart-integrity rules for reported metrics** (a16z's "16 startup metrics" reduces to three):

1. **Never present cumulative charts as growth.** Cumulative curves only go up; they hide a decline completely.
2. **Always label axes.** An unlabeled axis in a business review is a choice.
3. **Never show a percentage without its absolute.** "Up 300%" from a base of two is not a finding.

Add the deck-specific fourth: **the same metric keeps the same chart form, color, and scale across every session.** A reader who learns one chart has learned them all — and a form that changes between meetings makes comparison impossible, which is occasionally the point and always a problem.
