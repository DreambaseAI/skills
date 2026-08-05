# Source Vocabulary

The real artifacts the style borrows from, in enough detail to build convincingly. Every system here has an internal logic; reproducing the logic is what separates the style from a costume.

**Reproduce the logic, not the artwork.** The care symbols are live registered trademarks and IEC 60417 is a licensed copyrighted database — see `marks-and-legal.md`. What follows is documented so you can *understand and adapt* these systems, not clone them.

## Contents

1. [Care labels](#care-labels)
2. [Rating plates](#rating-plates)
3. [Equipment symbols](#equipment-symbols)
4. [The IP code](#the-ip-code)
5. [Date and batch codes](#date-and-batch-codes)
6. [Machine-readable codes](#machine-readable-codes)

## Care labels

Two standards, and mixing them is the most common tell.

| | **ISO 3758** (GINETEX, Europe) | **ASTM D5489** (US, under the FTC Care Labeling Rule 16 CFR 423) |
|---|---|---|
| Washtub temperature | **Numeral in °C** — 30/40/50/60/70/95 | **Dots** |
| Mechanical action | Bars beneath | Bars beneath |
| Vocabulary | normal / mild / very mild **process** | Normal / Permanent press / Delicate |

**The correction that matters: in ISO/GINETEX, dots never appear in the washtub.** The washtub carries a numeral for temperature and bars for mechanical action. Dots appear only on the **iron** and the **tumble-dry circle**. A washtub with dots is an American label — fine if that's what you intend, wrong if you're drawing a European one.

### The five base shapes

| Shape | Treatment |
|---|---|
| Washtub (trapezoid, wavy top) | Domestic washing |
| Triangle | Bleaching |
| Square | Drying — circle inside = tumble; lines inside = natural drying |
| Iron | Ironing and pressing |
| Circle | Professional textile care — letters inside specify solvent |

### The construction system — the real design lesson

The symbols are a **modular system on a 100-unit grid, where the module is the drying square.** Everything derives from it:

| Element | Units |
|---|---|
| Drying square | 100 × 100, stroke 9, dot Ø 12 |
| Washtub | 149 at the rim, 140 at the base, 100 high (drawn visibly heavier — stroke ~21) |
| Triangle | 123 × 106 |
| Iron | 149 at base, 85 at top, 100 high, dot Ø 9 |
| Circle | 112 × 112 on a 100 baseline, stroke 9 |
| Prohibition cross | 130 × 95, centred vertically and horizontally over the symbol |
| Bar | thickness 9; double bar = two bars of 9 with a 9 gap |

**The single most important detail: the inter-symbol gaps are deliberately unequal** — 10, 22, 20, 17 running left to right. They're derived per-pair from the adjacent shapes' silhouettes, not from a uniform rhythm. **Evenly-spaced symbols are the number-one giveaway of a fake.** If you build your own symbol family, derive the gaps from the shapes the way this system does.

Other fixed rules worth carrying into an original system: clear space equals one square module on all four sides; minimum row width 10 mm (excluding the ® ); the row is five symbols, though some national laws require six or seven.

**Symbol order is mandated**, in both ISO 3758 and GINETEX's booklet: **wash → bleach → dry → iron → professional care.** The seven-slot expansion (tumble *and* natural drying, dry *and* wet cleaning) is why real labels drop a second row beneath the square and the circle.

### The modifier grammar

This is the part worth stealing wholesale as a design lesson, because it's a complete language built from four operators:

- **Numerals** inside the washtub — maximum temperature in °C.
- **Dots** — severity/temperature, on the iron and tumble-dry circle only. More dots, hotter.
- **Bars beneath** — reduced mechanical action. One bar = mild process, two = very mild.
- **Diagonal cross over** — the treatment is prohibited.

Four operators, five base shapes, and the entire domain is covered without language. That combinatorial economy is the thing to imitate.

### The rest of the tag

Fibre content percentages, the **RN number** (a US identifier issued by the FTC in place of a company name, 16 CFR 303.20), country of origin, size, and increasingly a QR or care URL. Printed on satin, nylon ribbon, Tyvek, or cotton twill.

## Rating plates

Also called nameplate, data plate, or spec label. **A rating plate is not one standard — it's an accretion of unrelated legal obligations from different jurisdictions**, which is exactly why it looks unstyled and cramped.

Two constraints drive the entire look:

1. **The CE mark's 5 mm minimum height** is the tallest mandated element, so it effectively sets the plate's minimum size and scale.
2. **47 CFR 15.19 mandates a quoted paragraph that may not be altered**, and the rule itself contemplates type down to 4 pt. That forces a wall of micro-type next to normal-sized ratings — hence **two type sizes and nothing in between.** Anything at an intermediate size reads as designed, and therefore fake.

### Typical contents

Model number · serial number · input voltage/frequency/current · output specs · wattage · IP rating · class symbol · polarity diagram · operating temperature range · manufacturer and responsible-party address · batch/date code · country of manufacture · agency marks · the label's own artwork part number.

### Observed layout conventions

From direct reading of real plates (see the primary-observation notes in the research; no public manufacturer artwork spec exists, so treat these as observation rather than standard):

- **A hairline box around the whole plate**, a rule separating the identity block from the ratings block, and often a second rule above the agency-mark strip.
- **`LABEL: value` pairs** — label in caps, colon, value in regular weight. Colons align in a column when set as a table and don't when set as running lines; both occur.
- **Punctuation is field structure:** `:` after a label, `/` between fields inside one spec (`100-140V / 9.5-6A / 50-60Hz`), `;` between spec groups.
- **Bilingual parentheticals run inline** — `Model No(型号):`, `AC INPUT RATING (交流輸入):`. Mixed scripts on one line is normal.
- **Density is intentionally maximal.** Margins tight and uniform; whitespace appears only where a mandated clear-space rule forces it.
- **Everything flush-left off one margin**, agency marks either flush-right on the same lines or centred in their own strip.
- **Single colour** — black on silver/white/grey, or white on black. Colour appears only where a mark requires it.
- **The brand wordmark is stylistically alien** to everything else and often carries the only colour. It sits *on top of* the system rather than being integrated. Don't harmonize it.
- **Variable data is a separate physical layer** — the serial/barcode sticker is applied over the printed plate, often slightly rotated, overlapping the printed border. Reproducing that misregistration is one of the strongest authenticity moves available.
- **The plate carries its own part number** in the margin outside the frame. The artwork is itself an inventoried component.

## Equipment symbols

IEC 60417 *Graphical symbols for use on equipment*. Verified numbers worth knowing:

| Number | Meaning |
|---|---|
| 5031 | Direct current (solid line over dashed) |
| 5032 | Alternating current (tilde) |
| 5033 | Both direct and alternating current |
| **5172** | **Class II equipment** — the double square |
| 5017 | Earth / ground (general) |
| 5018 | Functional earthing |
| 5019 | Protective earth |
| 5020 | Frame or chassis |
| 5021 | Equipotentiality |
| 6032 | Do *not* connect to protective earth |
| 6092 | Class II with functional earthing |

**"Read the manual" is ISO, not IEC** — ISO 7000-0790 for equipment (plain black pictogram), or ISO 7010-M002 where a safety sign is required (blue filled disc, white pictogram). Getting this wrong is a small error that a technical reader will catch instantly.

**5172 carries a layout rule in its own application note:** the double square must be positioned so it's obvious it belongs to the technical information and can't be confused with the manufacturer's name or other identification. In practice — **the Class II symbol lives inside the ratings block, never up in the branding zone.**

### The DC polarity diagram

The small target-and-tail figure: an outer arc (the barrel/sleeve) carrying one sign, a short connecting line, and a centre dot carrying the opposite sign. The EIAJ RC-5320A convention is outer negative, centre positive — and the entire reason the diagram gets printed is that it's the only unambiguous way to state which way round a given supply is. It sits immediately adjacent to the `OUTPUT:` line, at or slightly above surrounding cap height.

## The IP code

IEC 60529. Format: `IP` + first numeral (solids) + second numeral (liquids) + optional additional letter (A–D) + optional supplementary letter (H/M/S/W).

Typesetting rules that are frequently got wrong:

- **No spaces, no hyphens, no periods.** `IP65`, never `IP 65` or `IP-65`. "IPX-8 is thus an invalid IP code."
- **Both positions must always be filled** — `IPX4`, `IP5X`, `IPXX`.
- **`X` means the characteristic was not declared or not tested. It does not mean zero.** `0` means no protection. These are different claims.
- `IP` is uppercase and set solid with the digits.

## Date and batch codes

| Format | Meaning | Example |
|---|---|---|
| **YYWW** | Two-digit year, two-digit week — the dominant format | `2436` = week 36 of 2024 |
| YWW | Single-digit year, for small packages | `436` |
| YYWWD | Year, week, day-of-week (1–7) | `24365` |
| YYMM | Year-month. Rarer. | `2408` |
| WWYY | Reversed — some European and passive-component marking | `3624` |
| Julian YYDDD | Day-of-year | `24155` = 155th day of 2024 |

Week numbering follows the ISO-8601 week calendar. **Date code and lot code are separate markings** — the date code says when, the lot code identifies the production batch for traceability and is typically longer and alphanumeric (`LOT: K4A2210-07`). They're sometimes combined.

Letter-based year/month encodings exist but are manufacturer-specific with no universal convention — so inventing one is legitimate, provided you're consistent within a project.

## Machine-readable codes

**Render real codes. Never draw fake ones.** This is the sharpest instance of the no-fake-data rule, because a fake is trivially detectable — anyone can point a phone at it.

Fakes fail structurally, not by bad luck:

- **Code 128** requires 11-module characters where bar widths sum even and space widths sum odd, plus a mod-103 check character.
- **EAN-13** imposes five independent constraints, including an L/G parity pattern that itself encodes the first digit.
- **QR** decoders won't even attempt a read without three 7×7 finder patterns at a 1:1:3:1:1 ratio.

There is **no cost argument for faking one**: a complete MIT zero-dependency QR encoder covering all 40 versions and 4 ECC levels is under 1,000 lines, a Data Matrix SVG encoder is ~557 lines / 4.3 kB, Code 128 hand-rolls in ~120 lines, and Code 39 in ~50. Encoders expose a boolean module matrix, so emitting SVG is a short loop.

**Never use a barcode font for Code 128 or EAN.** Those fonts compute no check digit, so text set in them is unscannable. **Code 39 is the only exception**, because it's discrete and self-checking.

Verified quiet zones — get these right or the code won't scan regardless of how correct the modules are:

| Symbology | Quiet zone |
|---|---|
| QR | 4 modules |
| Data Matrix | 1 module |
| Code 128 | 10× module width |
| UPC-A | 9× module width |

Standard practice sets the human-readable interpretation beneath the symbol in a mono or condensed face — and that text should match what the code actually encodes.

**Encode something true.** A QR pointing at a real URL, a Code 128 carrying a real SKU or build hash. If there's nothing true to encode, leave the code out — its absence costs nothing, and a code that decodes to `lorem ipsum` is worse than no code at all.
