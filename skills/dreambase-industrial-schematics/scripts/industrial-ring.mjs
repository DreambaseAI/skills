#!/usr/bin/env node
// industrial-ring.mjs — generate industrial-schematic SVG scaffolds (orbital rings, ruler strips).
// Zero-dependency Node (>=18). Part of the dreambase-industrial-schematics skill.
//
// Usage:
//   node industrial-ring.mjs ring  <config.json | '{...json...}'> [-o out.svg]
//   node industrial-ring.mjs ruler <config.json | '{...json...}'> [-o out.svg]
//   node industrial-ring.mjs --help
//
// Output is deliberately plain, grouped, and commented SVG — a scaffold to
// hand-tune, not a black box.

import { readFileSync, writeFileSync } from "node:fs";

const MONO = `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace`;

const RING_DEFAULTS = {
  width: 1600,
  height: 900,
  cx: null, // default: width/2
  cy: null, // default: height*0.52
  radius: 460,
  tilt: 62, // degrees tilted away from viewer (0 = face-on)
  rotate: -16, // in-plane rotation, degrees
  bg: "#0B0B0C", // set to "transparent" to skip the ground rect
  ink: "#F2F0ED",
  inkDim: "#8F8C88",
  ticks: { count: 144, length: 22, width: 1.3, offset: 0 },
  innerRing: false, // or a number = radius factor (e.g. 0.62)
  arc: { start: -50, sweep: 50, width: 3.5 }, // bright arc; null to skip
  nodes: [],
  // node: { angle, label, sub, active } — angle in ring degrees (0 = top, cw)
  dotField: false, // sparse interior dots
  grain: 0.05, // alpha slope; 0 disables
  dof: true, // blur far side
};

const RULER_DEFAULTS = {
  width: 640,
  height: 44,
  count: 56,
  progress: 0.25, // 0..1 — ticks below this are "completed"
  track: "#1A1817", // rounded track fill; "transparent" to skip
  tick: "#4A4846",
  done: "#B0413A",
  active: "#E05A4E",
  pad: 14,
  radius: 8,
};

// ---------------------------------------------------------------- helpers

function fail(msg) {
  process.stderr.write(`industrial-ring: ${msg}\n`);
  process.exit(1);
}

function deepMerge(base, over) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over || {})) {
    out[k] =
      v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object" && !Array.isArray(base[k])
        ? deepMerge(base[k], v)
        : v;
  }
  return out;
}

function project(angleDeg, r, tilt, rot, cx, cy) {
  const a = ((angleDeg - 90) * Math.PI) / 180; // 0deg = 12 o'clock, clockwise
  const x0 = r * Math.cos(a);
  const y0 = r * Math.sin(a) * Math.cos((tilt * Math.PI) / 180);
  const rr = (rot * Math.PI) / 180;
  return {
    x: cx + x0 * Math.cos(rr) - y0 * Math.sin(rr),
    y: cy + x0 * Math.sin(rr) + y0 * Math.cos(rr),
    depth: (Math.sin(a) + 1) / 2, // 0 far (top of ring), 1 near (bottom)
  };
}

const fmt = (n) => (Math.round(n * 100) / 100).toString();
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function samplePath(from, to, step, r, cfg) {
  const pts = [];
  for (let a = from; a <= to + 1e-9; a += step) {
    const p = project(a, r, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
    pts.push(`${fmt(p.x)} ${fmt(p.y)}`);
  }
  return `M ${pts.join(" L ")}`;
}

// ------------------------------------------------------------------- ring

function renderRing(cfg) {
  cfg = deepMerge(RING_DEFAULTS, cfg);
  cfg.cx = cfg.cx ?? cfg.width / 2;
  cfg.cy = cfg.cy ?? cfg.height * 0.52;
  const { ink, inkDim } = cfg;
  const far = [];
  const near = [];
  const top = [];
  const put = (depth, s) => (depth < 0.45 ? far : near).push(s);
  const opa = (depth) => 0.15 + 0.85 * Math.pow(depth, 1.2);

  // ring line — sampled polyline split into far/near halves
  for (const [a0, a1, bucket] of [
    [270, 450, far], // far half (through 0deg/top)
    [90, 270, near], // near half (through 180deg/bottom)
  ]) {
    const d = samplePath(a0, a1, 2, cfg.radius, cfg);
    const o = bucket === far ? 0.22 : 0.65;
    bucket.push(`<path d="${d}" fill="none" stroke="${ink}" stroke-width="1.2" opacity="${o}"/>`);
  }

  // inner ring
  if (cfg.innerRing) {
    const f = typeof cfg.innerRing === "number" ? cfg.innerRing : 0.62;
    far.push(`<path d="${samplePath(270, 450, 3, cfg.radius * f, cfg)}" fill="none" stroke="${ink}" stroke-width="0.8" opacity="0.1"/>`);
    near.push(`<path d="${samplePath(90, 270, 3, cfg.radius * f, cfg)}" fill="none" stroke="${ink}" stroke-width="0.8" opacity="0.28"/>`);
  }

  // tick corona
  const t = cfg.ticks;
  if (t && t.count > 0) {
    for (let i = 0; i < t.count; i++) {
      const a = (i * 360) / t.count + (t.offset || 0);
      const p1 = project(a, cfg.radius - 4, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
      const p2 = project(a, cfg.radius - 4 - t.length, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
      put(
        p1.depth,
        `<line x1="${fmt(p1.x)}" y1="${fmt(p1.y)}" x2="${fmt(p2.x)}" y2="${fmt(p2.y)}" stroke="${ink}" stroke-width="${t.width}" opacity="${fmt(0.45 * opa(p1.depth))}"/>`
      );
    }
  }

  // interior dot field
  if (cfg.dotField) {
    for (let ri = 0.2; ri <= 0.85; ri += 0.13) {
      for (let a = 0; a < 360; a += 15) {
        const p = project(a + ri * 40, cfg.radius * ri, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
        put(p.depth, `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="1" fill="${ink}" opacity="${fmt(0.12 * opa(p.depth))}"/>`);
      }
    }
  }

  // bright progress arc (halo + core), drawn above everything but grain
  if (cfg.arc) {
    const { start, sweep, width } = cfg.arc;
    const d = samplePath(start, start + sweep, 1.5, cfg.radius, cfg);
    top.push(`<!-- progress arc -->`);
    top.push(`<path d="${d}" fill="none" stroke="${ink}" stroke-width="${width * 2.6}" stroke-linecap="round" opacity="0.25" filter="url(#glow)"/>`);
    top.push(`<path d="${d}" fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" filter="url(#glow)"/>`);
  }

  // nodes + labels
  for (const n of cfg.nodes || []) {
    const p = project(n.angle, cfg.radius, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
    const pOut = project(n.angle, cfg.radius + 34, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
    const ux = pOut.x - p.x, uy = pOut.y - p.y;
    const ul = Math.hypot(ux, uy) || 1;
    const active = !!n.active;
    const g = [];
    g.push(`<!-- node: ${esc(n.label || "")} -->`);
    g.push(`<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="7" fill="none" stroke="${ink}" stroke-width="1.2" opacity="${active ? 0.8 : 0.35}"/>`);
    if (active)
      g.push(`<circle cx="${fmt(p.x + (ux / ul) * 6)}" cy="${fmt(p.y + (uy / ul) * 6)}" r="3.5" fill="${ink}" filter="url(#glow)"/>`);
    if (n.label) {
      const right = pOut.x >= p.x;
      const lx = p.x + (ux / ul) * 26, ly = p.y + (uy / ul) * 26;
      g.push(
        `<text x="${fmt(lx)}" y="${fmt(ly)}" fill="${active ? ink : inkDim}" font-family="${MONO}" font-size="12.5" letter-spacing="3.2" text-anchor="${right ? "start" : "end"}" opacity="${active ? 1 : 0.75}">${esc(String(n.label).toUpperCase())}</text>`
      );
    }
    if (n.sub) {
      // secondary label along the ring's inside, rotated to local tangent
      const pIn = project(n.angle + 4, cfg.radius - 44, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
      const q1 = project(n.angle + 1, cfg.radius - 44, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
      const q2 = project(n.angle + 7, cfg.radius - 44, cfg.tilt, cfg.rotate, cfg.cx, cfg.cy);
      let ang = (Math.atan2(q2.y - q1.y, q2.x - q1.x) * 180) / Math.PI;
      if (ang > 90) ang -= 180;
      if (ang < -90) ang += 180;
      g.push(
        `<text x="${fmt(pIn.x)}" y="${fmt(pIn.y)}" fill="${inkDim}" font-family="${MONO}" font-size="10" letter-spacing="4.5" opacity="0.55" transform="rotate(${fmt(ang)} ${fmt(pIn.x)} ${fmt(pIn.y)})">${esc(String(n.sub).toUpperCase())}</text>`
      );
    }
    (p.depth < 0.45 ? far : top).push(g.join("\n    "));
  }

  const defs = `
  <defs>
    <filter id="glow" x="-300%" y="-300%" width="700%" height="700%">
      <feGaussianBlur stdDeviation="4" result="b1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b2"/>
      <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="dof"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="${cfg.grain}" intercept="0"/></feComponentTransfer>
    </filter>
  </defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.width}" height="${cfg.height}" viewBox="0 0 ${cfg.width} ${cfg.height}" role="img">
${defs}
  ${cfg.bg !== "transparent" ? `<rect width="100%" height="100%" fill="${cfg.bg}"/>` : ""}
  <!-- far side (blurred, dim) -->
  <g${cfg.dof ? ` filter="url(#dof)"` : ""} opacity="0.55">
    ${far.join("\n    ")}
  </g>
  <!-- near side (sharp) -->
  <g>
    ${near.join("\n    ")}
  </g>
  <!-- focal elements -->
  <g>
    ${top.join("\n    ")}
  </g>
  ${cfg.grain ? `<rect width="100%" height="100%" filter="url(#grain)"/>` : ""}
</svg>`;
}

// ------------------------------------------------------------------ ruler

function renderRuler(cfg) {
  cfg = deepMerge(RULER_DEFAULTS, cfg);
  const innerW = cfg.width - cfg.pad * 2;
  const gap = innerW / (cfg.count - 1);
  const activeIdx = Math.round(cfg.progress * (cfg.count - 1));
  const parts = [];
  if (cfg.track !== "transparent")
    parts.push(`<rect width="${cfg.width}" height="${cfg.height}" rx="${cfg.radius}" fill="${cfg.track}"/>`);
  for (let i = 0; i < cfg.count; i++) {
    const x = cfg.pad + i * gap;
    const isActive = i === activeIdx;
    const isDone = i < activeIdx;
    const h = isActive ? cfg.height - 12 : cfg.height - 22;
    const y = (cfg.height - h) / 2;
    const color = isActive ? cfg.active : isDone ? cfg.done : cfg.tick;
    parts.push(
      `<rect x="${fmt(x - 0.9)}" y="${fmt(y)}" width="1.8" height="${fmt(h)}" rx="0.9" fill="${color}" opacity="${isActive ? 1 : isDone ? 0.6 : 0.7}"/>`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.width}" height="${cfg.height}" viewBox="0 0 ${cfg.width} ${cfg.height}" role="img">
  ${parts.join("\n  ")}
</svg>`;
}

// -------------------------------------------------------------------- cli

const HELP = `industrial-ring.mjs — industrial schematic SVG scaffolds

  node industrial-ring.mjs ring  <config.json|'{json}'> [-o out.svg]
  node industrial-ring.mjs ruler <config.json|'{json}'> [-o out.svg]

ring config (defaults shown):
${JSON.stringify(RING_DEFAULTS, null, 2)}

  nodes: [{ "angle": 0, "label": "ISSUE ENTERS TRIAGE", "sub": "LOOP TRIGGER", "active": true }]
  angle: ring degrees, 0 = 12 o'clock, clockwise.

ruler config (defaults shown):
${JSON.stringify(RULER_DEFAULTS, null, 2)}
`;

const argv = process.argv.slice(2);
if (!argv.length || argv.includes("--help") || argv.includes("-h")) {
  process.stdout.write(HELP);
  process.exit(0);
}
const mode = argv[0];
if (!["ring", "ruler"].includes(mode)) fail(`unknown mode "${mode}" (expected ring|ruler)`);
let outPath = null;
const oi = argv.indexOf("-o");
if (oi !== -1) outPath = argv[oi + 1] || fail("-o requires a path");
const cfgArg = argv[1] && argv[1] !== "-o" ? argv[1] : "{}";
let cfg;
try {
  cfg = cfgArg.trim().startsWith("{") ? JSON.parse(cfgArg) : JSON.parse(readFileSync(cfgArg, "utf8"));
} catch (e) {
  fail(`could not parse config: ${e.message}`);
}
const svg = mode === "ring" ? renderRing(cfg) : renderRuler(cfg);
if (outPath) {
  writeFileSync(outPath, svg);
  process.stderr.write(`wrote ${outPath}\n`);
} else {
  process.stdout.write(svg);
}
