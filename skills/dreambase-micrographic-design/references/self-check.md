# Self-Check

Run these against your own output before returning it. Every check here exists because the failure it catches has actually shipped — each one is cheap, and each one catches something that is invisible in the code and obvious in the render.

For HTML/SVG output, run the snippets in the page (browser console, or a headless eval). For static image output, do the visual equivalents by looking at the render.

**The rule: render it, measure it, then look at it.** Reading your own markup is not verification.

## 1. Empty area — the single most common failure

Composition can be correct in every particular and still fail because a third of it is empty. Measure rather than eyeball; the first fix attempt often just relocates the void.

```js
// % of the artboard not covered by any visible element, plus the worst empty band
(sel => {
  const root = document.querySelector(sel), R = root.getBoundingClientRect();
  const rects = [...root.querySelectorAll('*')].filter(el => {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false;
    if (r.width < 2 || r.height < 2) return false;
    const paints = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none'
      || s.borderTopWidth !== '0px' || el.children.length === 0;
    return paints;
  }).map(el => el.getBoundingClientRect());
  const N = 40, cw = R.width / N, ch = R.height / N; let empty = 0; const rows = [];
  for (let y = 0; y < N; y++) { let rowEmpty = 0;
    for (let x = 0; x < N; x++) {
      const cx = R.left + (x + .5) * cw, cy = R.top + (y + .5) * ch;
      if (!rects.some(r => cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom)) { empty++; rowEmpty++; }
    }
    rows.push(rowEmpty === N);
  }
  let run = 0, worst = 0; rows.forEach(e => { run = e ? run + 1 : 0; worst = Math.max(worst, run); });
  return { emptyPct: Math.round(empty / (N * N) * 100), worstEmptyBandPct: Math.round(worst / N * 100) };
})('.poster')
```

**Pass:** `worstEmptyBandPct` ≤ 8. Treat `emptyPct` ≤ 15 as advisory only.

**`worstEmptyBandPct` is the metric that matters.** `emptyPct` counts any sample point not inside an element box, so **line-height leading between rows of text registers as empty** — a legitimately dense, text-heavy layout can report 40%+ while having no void at all. Don't chase that number. A void is a *contiguous band*, and the band metric is what detects one. If `emptyPct` is high but `worstEmptyBandPct` is low, look at the render and trust your eyes over the percentage.

**If it fails, fix it architecturally, not by nudging.** The usual culprit is a flex spacer pushing a footer down. Make a *texture mass* the flexible element (`flex:1 1 auto` on a line-screen field, dot grid, or illustration band) so growth fills with content rather than air — or shrink the canvas.

## 2. Type registers resolved to distinct faces

The silent killer: a font family name that doesn't exist falls back, two registers collapse into one, and the output reads flat with nothing in the code to show why.

**Do not use `document.fonts.check()` for this.** It returns `false` for a face that is merely *declared but not yet fetched*, so a weight you loaded and never used reports as missing — sending you off to fix a bug that isn't there. Measure rendered width instead; it tests what actually painted.

```js
// Measure the same probe string in each register, and against an explicit fallback.
// A register that matches the generic fallback width did not get its font.
(() => {
  const probe = 'HAMBURGEFONTSIV 0123';
  const widthOf = (family, weight, varSettings) => {
    const s = document.createElement('span');
    Object.assign(s.style, { position:'absolute', left:'-9999px', whiteSpace:'pre',
      fontFamily:family, fontWeight:weight||400, fontSize:'100px',
      fontVariationSettings:varSettings||'normal', letterSpacing:'normal' });
    s.textContent = probe; document.body.append(s);
    const w = s.getBoundingClientRect().width; s.remove(); return w;
  };
  const reg = sel => {
    const el = document.querySelector(sel); if (!el) return { sel, missing:true };
    const s = getComputedStyle(el);
    const actual = widthOf(s.fontFamily, s.fontWeight, s.fontVariationSettings);
    const first  = s.fontFamily.split(',')[0].trim();
    const serif  = widthOf('serif', s.fontWeight);
    const sans   = widthOf('sans-serif', s.fontWeight);
    const mono   = widthOf('monospace', s.fontWeight);
    const fellBack = [serif, sans, mono].some(w => Math.abs(w - actual) < 0.5);
    return { sel, wants:first, width:Math.round(actual), fellBack };
  };
  const rs = ['.r1','.r2','.r3','.r4'].map(reg);
  const pairs = [];
  for (let i=0;i<rs.length;i++) for (let j=i+1;j<rs.length;j++)
    if (rs[i].width && rs[j].width &&
        Math.abs(rs[i].width - rs[j].width) / rs[i].width < 0.03)
      pairs.push([rs[i].sel, rs[j].sel]);
  return { registers: rs, collapsedPairs: pairs };
})()
```

**Pass:** no register has `fellBack: true`, and **`.r2`/`.r3` do not appear together** in `collapsedPairs`.

`fellBack` means the rendered width matches a generic family exactly — the named font never arrived, and the register is silently gone.

`collapsedPairs` means two registers set the same string to the same width, so they are the same face whatever the CSS claims. Weight them by which pair it is:

- **`.r2` + `.r3` — must fix.** The display headline and the squared shout have to be different faces; this is the failure that makes output read flat.
- **`.r1` + `.r2` — acceptable.** A wordmark and a headline may share a family if weight, width, or case make the roles clearly distinct. Only worth changing if the wordmark isn't reading as a separate thing.
- **`.r4` + anything — must fix.** The micro-layer is monospace; if it matches another register it isn't mono.

Width equality is the tell — if registers 2 and 3 set the same string to the same width, they are the same font no matter what the CSS says. Remember **"Archivo Expanded" is not a family**; use `font-variation-settings:'wdth' 125` on Archivo, or a genuine standalone family.

## 3. Contrast

The idiom's love of tone-on-tone micro-type makes this easy to fail, and the technical look is not an accessibility exemption.

```js
(() => {
  const lum = c => { const [r,g,b] = c.match(/\d+/g).map(Number).map(v => { v/=255;
    return v <= .03928 ? v/12.92 : ((v+.055)/1.055) ** 2.4; }); return .2126*r + .7152*g + .0722*b; };
  const bgOf = el => { let n = el; while (n && n !== document.documentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)') return bg; n = n.parentElement; } return 'rgb(255,255,255)'; };
  return [...document.querySelectorAll('.poster *, .social *')]
    .filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
    .map(el => { const s = getComputedStyle(el), L1 = lum(s.color), L2 = lum(bgOf(el));
      const ratio = (Math.max(L1,L2) + .05) / (Math.min(L1,L2) + .05);
      const px = parseFloat(s.fontSize), large = px >= 24 || (px >= 18.66 && +s.fontWeight >= 700);
      return { text: el.textContent.trim().slice(0,32), px: Math.round(px),
               ratio: +ratio.toFixed(2), need: large ? 3 : 4.5, pass: ratio >= (large ? 3 : 4.5) }; })
    .filter(r => !r.pass);
})()
```

**Pass:** empty array, after removing the legitimate exemptions below.

**Expected exemptions — don't "fix" these:**

- **Redaction bars** report a ratio of 1.0 because ink and ground are the same colour. That is the entire point; they are deliberately unreadable. Give them `aria-hidden="true"` and skip them (add `.redact` to the filter). If a redaction bar *is* readable, that's the actual bug.
- **Decorative-only elements** — tick strips, registration crosses, grain, hazard striping — are exempt, but they must be `aria-hidden` and must carry no meaning.

Everything else in the list is a real failure. The technical look is not an accessibility exemption, and tone-on-tone micro-type is where this idiom fails most often.

## 4. Nothing load-bearing in the micro band

```js
[...document.querySelectorAll('.poster *, .social *')]
  .filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
  .map(el => ({ px: parseFloat(getComputedStyle(el).fontSize), t: el.textContent.trim().slice(0,40) }))
  .filter(x => x.px < 11)
```

Review the list by hand. Everything in it must be **texture** — telemetry, source lines, revision codes, corner marks. If the event date, the price, the call to action, or the one number the piece exists to communicate appears here, the design has failed at its job.

Then the **two-second test**: look at the render and find the message. If it takes longer, the micro-layer has buried it.

## 5. The mark survives small

Render the mark at 16 px and look at it. Bar-array marks alias badly — bars merge into a blob, or drop out entirely.

```js
(() => { const svg = document.querySelector('.mark'), vb = svg.viewBox.baseVal;
  const bars = [...svg.querySelectorAll('rect')];
  const minH = Math.min(...bars.map(r => r.height.baseVal.value));
  return { bars: bars.length, minBarPxAt16: +(minH / vb.height * 16).toFixed(2) }; })()
```

**Pass:** `minBarPxAt16` ≥ 0.75. Below that, ship a **simplified few-bar variant** for favicon and small-badge use — don't scale the full mark down.

## 6. Placeholder residue

The most visible failure mode of generated design work, and the cheapest to catch.

```js
(document.body.innerText.match(
  /lorem|ipsum|20XX|\$X+M?|\[company\]|\[name\]|placeholder|TK\b|xxx+|TODO/gi) || [])
```

**Pass:** empty. Also confirm every invented identifier follows the project's declared format, and that no real standard number sits beside an invented mark.

## 7. Codes actually decode

If the piece carries a QR, Data Matrix, or barcode, **decode it with a real decoder** — point a phone at the render, or run it through a decoding library. A code that doesn't scan is worse than no code.

Confirm the decoded value matches the human-readable text set beneath it. If there was nothing true to encode, the correct answer was to leave the code out.

## 8. Mode consistency

A quick read-through, since these are judgement calls no snippet catches:

- **Simulation:** are marks off-baseline, gaps irregular, typography mixed across the mark band? Perfect alignment here reads as fake.
- **Applied:** is it actually art-directed — aligned, balanced, composed? Faked incoherence here reads as sloppy.
- **Four registers present** in applied mode, and visibly distinct.
- **Two or three texture moves**, at least one occupying real area.
- **All four corners carry something.**
- **Squint test:** three or four distinct masses, not scattered marks floating in air.
- Is it **on an object**? A mark on white is not the deliverable.
