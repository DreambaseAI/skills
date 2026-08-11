# The Storytellers: Verified Practice of the Field's Best

Distilled working principles from the most revered data-storytelling practitioners, verified against primary sources (July 2026). Read this when deciding *how* a story should be told, when justifying a bespoke form, or when a stakeholder asks "make it like the NYT/FT."

## Contents

1. [The practitioners](#the-practitioners)
2. [Cross-cutting principles](#cross-cutting-principles)
3. [Attribution corrections](#attribution-corrections)

## The practitioners

### Nadieh Bremer (Visual Cinnamon) — bespoke forms from the data outward

Astronomer-turned-designer; *Data Sketches* (with Shirley Wu) documents her full process across 24 projects. Start from the actual data and goal, not a chart-type catalog; sketch before code — and when the data's structure is unknowable, "sketch with code" with disposable prototypes; iterate toward a visual metaphor (her royal-genealogy network became glowing star constellations after she noticed the resemblance). Bespoke shapes make stories memorable where generic charts don't. — visualcinnamon.com · datasketch.es

### Giorgia Lupi (Pentagram) — data humanism

Her 2017 manifesto's actual tenets (verbatim section headers): **embrace complexity · move beyond standards · sneak context in (always) · remember that data is imperfect (as we are)**. "Numbers are always placeholders for something else." *Dear Data* (with Stefanie Posavec): 52 weeks of hand-drawn personal-data postcards — data as intimate, imperfect, human. Density can be a feature when it invites slow reading. — giorgialupi.com · dear-data.com

### The Pudding — visual essays on cultural questions

"The Pudding explains ideas debated in culture with visual essays." Their process: pick questions that spark debate among friends; open with a **single data point**, then zoom out; workshop the arc "like a movie script, not critiquing a bar chart"; visuals carry the narrative with sparse prose; collect original data when none exists (they hand-measured 80 pairs of jeans for the pockets piece). — pudding.cool, process guides "How to Make Dope Shit" parts 1–3

### NYT Graphics — scroll is the interaction

Archie Tse's three rules (Malofiej 2016, verbatim): (1) "If you make the reader click or do anything other than scroll, something spectacular has to happen." (2) "If you make a tooltip or rollover, assume no one will ever see it." (3) Interactivity must work on all platforms or not exist. "Readers just want to scroll"; most visuals are static; animation triggers on scroll; "we are writing and editing a lot more text." Amanda Cox (reliably reported secondhand): "The annotation layer is the most important thing we do." — github.com/archietse/malofiej-2016

### Mike Bostock — examples and tools as user interfaces

D3 creator, Observable co-founder, ex-NYT. "Examples are lightweight and informal… capable of expressing big ideas with immediate impact" (*For Example*, Eyeo 2013). Ship small disposable examples, one idea each; build the repertoire before the abstraction; judge tools as user interfaces ("Programmers are people, too"); make work forkable. His NYT work (rent-vs-buy calculator, *512 Paths to the White House*) shows direct manipulation winning when the reader has a genuine personal input. — bost.ocks.org/mike

### John Burn-Murdoch (Financial Times) — annotation as argument

The COVID trajectory charts: log scale, one saturated line in a sea of grey, doubling-time references, technical choices justified in plain language *on the chart*. "Text is where people's attention goes first. If we're not using that, we're really missing an opportunity." Claim-titles that answer the reader's question; direct labels over legends; iterate in public daily. "Don't just make charts for chart people. Make stories for all people." — ft.com/john-burn-murdoch; GIJN webinar coverage 2025

### Reuters Graphics — clarity at wire-service scale

Physical-scale metaphors make abstract numbers visceral (*Drowning in Plastic*'s rendered pile of 1M bottles). "That little publish now button is not the end for us" — graphics must survive syndication across clients and formats. Automate the repeatable chart so human craft concentrates on the exceptional story; put chart tools in every reporter's hands. — reuters.com/graphics

### David McCandless / Information is Beautiful — beauty as invitation, with a caveat

"Knowledge compression": at-a-glance gestalt, relative-not-absolute figures (the Billion Dollar-o-Gram's core move), data as creative medium. Take the aesthetics and shareability; heed the documented critique — Stephen Few (2011, verbatim): his visualizations "display information in ways that hide much that's relevant and essential." The boundary: area-scaled blobs are perceptually imprecise; when the comparison matters, position/length wins. Beauty earns attention; encoding earns trust. — informationisbeautiful.net

### FiveThirtyEight — uncertainty as the first-class citizen

(Site shuttered March 2025; use archives.) The 2020 forecast redesign (Anna Wiederkehr): lead with the **distribution**, not the point estimate — ballswarms of simulated outcomes, 100-dot scenario arrays; reframe the metaphor (weather, not coin flip); a guide layer teaching readers how to read the graphic inside the graphic (Fivey Fox); modular cards, each one lens on the model; published design rationale. Gelman et al. (2020) honestly note uncertainty-device effectiveness "is hard to judge" — intuition, not measurement. Alumni carrying the practice: Katie Marriner (AP), Gus Wezerek (NYT Opinion), Julia Wolfe (Reuters), Reuben Fischer-Baum (Washington Post).

## Cross-cutting principles

The synthesis this skill's workflow is built on. Contested ones are marked — knowing where the masters disagree is part of the craft:

1. **Annotation is narration.** The text layer is the journalism, not garnish. The single strongest consensus in the set (Tse, Cox, Burn-Murdoch, Lupi).
2. **Title the claim, not the variables.** *Context-dependent*: exploratory tools and neutral wire graphics deliberately title the question instead.
3. **Scroll over click**; nothing load-bearing in a tooltip. *Mildly contested*: direct manipulation wins when the reader has a genuine personal input (rent-vs-buy, find-your-cohort).
4. **One idea per view.** *Contested by Lupi explicitly* — "embrace complexity" rewards slow reading. Resolution: audience and dwell time. News readers scroll; gallery viewers linger; executives triage.
5. **Bespoke over template — when the story demands it.** Everyone who ships daily defaults to standard forms and automation, reserving bespoke craft for the exceptional story.
6. **Sketch before code — flexibly.** Externalize form ideas cheaply; "sketch with code" when data structure is unknowable.
7. **Humanize the data point** — physical scale, a single person's row, hand-collected weeks. *Test*: does the humanizing layer add meaning or hide it?
8. **Show the distribution, not just the number.** Uncertainty honestly displayed, with the humility that device effectiveness is under-measured.
9. **Explain technical choices on the chart** — log scales, per-capita, smoothing, in plain language where the reader is looking.
10. **Design for the constrained reader first** — mobile, syndication, static fallback.
11. **Work in public; iterate as a product** — publish process and rationale.
12. **Beauty earns attention; encoding earns trust.** The explicitly contested axis of the field (McCandless vs. Few) — use beauty as the invitation and accurate encoding as the substance, and you get both sides' best.

## Attribution corrections

Claims that circulate widely but failed primary-source verification — do not cite them:

- Bostock: "Better Dataviz through Custom Tools" and "Design is a Search Problem" are not verifiable talk titles; "examples are the primary means by which people learn" is not verbatim. Cite *For Example* (2013) and *What Makes Software Good?* (2016).
- Burn-Murdoch: "Making charts that make an argument" is not a verified talk title.
- Reuters has no graphics Pulitzer (their 2018 Pulitzers were photography and international reporting).
- Amanda Cox's annotation-layer quote is reliably reported secondhand (Kirk 2012; ChartAccent 2017), not primary-verified — attribute it as such.
