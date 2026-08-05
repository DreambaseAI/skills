# Lineage and Neighbours

Where the vocabulary comes from, what its construction rules actually are, and how this style differs from the aesthetics it gets confused with.

Read this when building an original symbol family (the construction grids below are directly reusable), when justifying an approach, or when a user names a neighbouring style.

## Contents

1. [Where the term came from](#where-the-term-came-from)
2. [The pictogram tradition](#the-pictogram-tradition)
3. [Reusable construction rules](#reusable-construction-rules)
4. [Vernacular and anonymous design](#vernacular-and-anonymous-design)
5. [Differential diagnosis](#differential-diagnosis)
6. [Do not cite](#do-not-cite)

## Where the term came from

The design press canonised this in **Ellis Tree, "The graphic trends you'll want to bookmark for 2026," It's Nice That, 12 January 2026**, under a section headed "In layout: Micrographics." So It's Nice That does use the term, and treats "the aesthetics of technical information" as the originating phrase.

**But the article's central attribution is wrong**, and the primary source proves it. It credits the phrase to content creator Brandon Wang. The phrase is in fact the title of a **2018 Behance visual-research thesis by Karina Yazylyan** — and **Wang credits it by URL in the caption of the very post the article cites.**

Correct genealogy:

- **Karina Yazylyan (2018)** — authored the phrase as the title of her visual-research thesis.
- **Brandon Wang (July 2025)** — popularised it to a mass audience, and appears to be the origin of the **`#micrographics` hashtag**. The hashtag is his naming contribution; the phrase is not.
- **It's Nice That (Jan 2026)** — canonised the trend in the design press, and mis-assigned the coinage.

**Never write "Brandon Wang coined the aesthetics of technical information."** If attribution is needed: *a phrase Brandon Wang popularised, taken from Karina Yazylyan's 2018 visual-research thesis of the same name, which Wang credits in his own post.*

**The term has no formal design definition** — no dictionary, standard, or institution defines it. It also collides with a real, half-century-old information-management term: micrographics means microfilm and microform reduction, and the body now called AIIM was the *National Micrographics Association* in 1975. Present it as a moodboard tag, not established terminology.

Of the adjacent tags in circulation — micrographics, micro design, utilitarian design, technical graphics, spec-sheet aesthetic, FUI, page furniture, contract layouts — **only "vernacular design" and "anonymous design" have real critical literature behind them.** The rest are tags.

## The pictogram tradition

Three canonical systems, and they standardise *different things* — which is why they're worth knowing separately rather than as one lineage.

| | **ISOTYPE** (1925–40s) | **Munich 1972** (Aicher) | **DOT/AIGA** (1974/79) |
|---|---|---|---|
| Governing geometry | No angular grid; discipline is flat silhouette, no perspective, no modelling | **The square.** H/V equalised, diagonals at 45° → permitted angles **90°, 45°, 135°** | No published angular grid; discipline is the rounded-corner symbol field plus figure/ground consistency |
| Unit of composition | The repeated countable sign | The reusable body part | The whole symbol, evaluated against three criteria |
| Quantity | Encoded — **more signs, never bigger signs** | Not a quantity system | Not a quantity system |
| Modularity | Generic sign + modifier | **Kit of parts**, plus sub-symbols | Consistency by peer review, not a parts kit |
| Colour | Seven only; must survive black and white | Blue-led; red deliberately excluded | Black on white; red/green reserved for regulatory |
| Rights | **Copyright** — Pictoright / Arntz Estate | **Copyright** — licensed commercially | **PUBLIC DOMAIN** |

The trajectory is worth holding: ISOTYPE standardises *the sign as a countable unit*; Aicher standardises *the geometry that generates signs*; AIGA standardises *the evaluation procedure and the sign field*, deliberately declining to mandate geometry.

**Only the AIGA set is free to use as artwork.** ISOTYPE and Aicher's system are both licensed.

## Reusable construction rules

The payoff of this file. When you need an original symbol family — which is usually, since the real sets are trademarked or copyrighted — build it on one of these grids rather than drawing freehand.

### The modern registered grid — IEC 80416-1:2008

**The single most implementable spec available**, and the one that actually governs equipment symbols:

- Draw inside a **75 mm master square on a 12.5 mm grid** (6 × 6 modules).
- **50 mm inner square is the nominal size.** Equal-area circle Ø56.6 mm; inscribed circle Ø50 mm; equal-area rectangles 40 × 62.5 mm mutually perpendicular; the 50 mm square rotated 45°; octagon at 15° to the master square's sides.
- **Centre strokes on grid lines.** Fill the field as fully as possible; don't exceed the octagon by more than half a stroke width; never exceed the 75 mm square.
- **Stroke width is 2 mm or 4 mm only** — ≈1/37.5 or ≈1/18.75 of the master. Both weights may be mixed for emphasis.
- **Minimum 3 mm between parallel lines.**
- **Avoid angles under 30°.**
- **Avoid filled areas** unless meaning or legibility demands them.
- **Minimum embedded character height 10 mm** of the 75 mm master.
- **Negation is two diagonal bars crossing at right angles.** Never circle-plus-single-diagonal — that's reserved for prohibition under ISO 3864-1.

### Aicher-style geometric figures

- Work inside a **square field**. Verticals and horizontals equalised, diagonals only at 45° — so permitted angles are **90°, 45°, 135°** and nothing else.
- Fixed parts kit: **round head, torso, limbs as lines of constant breadth.** Same stroke throughout, no tapering.
- **Pose comes from snapping limbs to the permitted angles**, never freehand rotation.
- Props added sparingly as thin simplified lines, only where the message would otherwise be ambiguous.
- **Reuse identical parts across the family** so new pictograms are *assembled, not drawn*.
- Modifier grammar inside the square: negation = one thick bar; bar at left/right edge = wall, top = ceiling, bottom = floor, full criss-cross = secure area; arrow = direction.
- Typographic partner: a light neutral grotesque, set small and unemphatic.

### ISOTYPE-style quantitative pictograms

Relevant when the micrographic treatment meets actual data:

- **One symbol = one fixed quantity**, stated in a key.
- **Never scale a symbol to encode magnitude.** More is more symbols at identical size; partial units are shown by **cutting** the symbol, not shrinking it. (This is the same rule `dreambase-visualization-design` enforces — icons count, never scale by area.)
- Rows run horizontally for quantity; stack vertically for time series or category.
- Build a **base sign + modifier** vocabulary, with modifiers reusable across all base signs.
- Must survive greyscale — use hatching, dots, and tints where colour isn't available.

### DOT/AIGA-style wayfinding

- Every symbol in a **square field with rounded corners**; regulatory symbols may float free.
- **Black figure on white field, never inverted.**
- Keep figure/ground, solid-vs-outline, overlap, orientation, format, scale, colour, and texture **consistent across the whole set**.
- Give each symbol a recognition hierarchy — the most important element reads first.
- Size for distance: ≈1 in cap height per 50 ft.

## Vernacular and anonymous design

The parent concept, and the best-sourced idea in this whole area. Design produced by constraint rather than authorship.

The canonical text is **Bernard Rudofsky, *Architecture Without Architects*** (MoMA, 9 Nov 1964 – 7 Feb 1965), which framed its subject as a communal art "not produced by the specialist but by the spontaneous and continuing activity of a whole people with a common heritage, acting under a community of experience." Its companion in the design-criticism lineage is **Venturi, Scott Brown & Izenour's *Learning from Las Vegas***, which took the same attention to the commercial vernacular.

This matters practically rather than just historically: it names what you're actually borrowing. A rating plate is genuinely anonymous design — nobody art-directed it, and its coherence comes from constraint, not taste. **That's the quality being quoted, and it's why over-composing destroys the effect.** The moment a designer's hand is visible in the arrangement, the artifact stops reading as vernacular and starts reading as pastiche.

## Differential diagnosis

How micrographics differs from the styles it gets confused with. Each of these is a real distinction worth being able to state.

**FUI (fictional/fantasy user interface)** — screen-native, emissive, and future-tense; its practitioners literally design screens to light the scene, and freely admit full functionality is lacking because it isn't needed. Micrographics is print-native, static, ink-on-substrate, and its source content is real and legally binding. *Note there is no canonical definition of FUI, and "Futuristic User Interface" is not an attested expansion* — the practitioners' own words are "fictional UI" or "screen graphics." The revealing seam: when Territory Studio needed something in *Ex Machina* to read as documentation rather than display, they reached for print, referencing manuals and flat-pack instructions.

**Swiss / International Typographic Style** — justifies every formal decision by *reading performance*; the grid's defence is that information will be read more quickly and retained better. **Micrographics deliberately sets type below comfortable reading size**, treating dense specification text as tonal texture the eye registers as *authority* before it registers as language. Same rigour, opposite goal.

**Technical drawing / blueprint** — instrumental. The title block, revision table, and leader lines exist so a part can be manufactured and traced. **Micrographics lifts the same devices as rhetoric**, deploying a title block on an artifact that will never be fabricated, to borrow the credibility of a document that could be.

**Brutalist web design** — its method is *subtraction of control*: raw, unstyled, default blue links, no hierarchy. Micrographics is **hyper-controlled to the half-point**, because its source artifacts are documents whose every measurement is legally specified. Opposite methods, superficially similar rawness.

**Y2K / Frutiger Aero** — glossy, chrome, translucent, future-tense. Micrographics is matte, present-tense, and bureaucratic: it describes what a thing *is* right now under law, not what the future will feel like.

**Normcore** — in its original sense a social posture, which only became a visual style through a documented misreading (the report's own term for the *look* was "acting basic"). And where normcore seeks blankness, micrographics seeks the opposite: **a surface saturated with mandated specificity.**

**MUJI / Japanese utilitarian** — subtractive by its own account; the name literally asserts the absence of a mark. Micrographics is **additive**, treating the mandated inscription as the entire visual event.

**Workwear / military surplus** — MIL-SPEC marking is a contractual deliverable, with point sizes mandated because a soldier must read it after ten washes. Micrographics quotes that grammar **with no contract behind it**, keeping the discipline while discarding the obligation. (The relevant spec for garment labels mandates sans-serif, all capitals, no italic or script, black on white, with per-class minimums like 10 pt for item description and 8 pt for contract number and NSN — a directly usable source grammar.)

## Do not cite

- **"Brandon Wang coined 'the aesthetics of technical information.'"** He credits Yazylyan's 2018 thesis in his own post.
- **Nike campaigns in this idiom — unverified.** The claim traces back through It's Nice That to a studio whose relevant Nike work is explicitly unpublishable, and whose viewable Nike projects use distressed stencil and label-tape lettering rather than this style. Don't repeat "used by Nike" as established.
- **"Words divide, pictures unite"** is not a documented Neurath quotation.
- **"Futuristic User Interface"** as the expansion of FUI — not attested.
- **Müller-Brockmann's *Grid Systems* as 1968** — it's Niggli, 1981.
- **brutalistwebsites.com "curated by Pascal Deville"** as if the site says so — the site carries no curator credit at all.
- **"Balloon"** as a standards term for a part reference — that's industry vernacular; the standard says part references.
- Territory Studio's **"founder"** — say co-founder; there are several.
