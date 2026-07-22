#!/usr/bin/env node
// industrial-mesh.mjs — generate holographic 2D/3D mesh objects (extruded
// donut/pie charts, flat mesh dials) as SVG, with free x/y/z rotation,
// wire | hybrid | cel fill modes, and monochromatic hue theming.
// Zero-dependency Node (>=18). Part of the dreambase-industrial-schematics skill.
//
// Usage:
//   node industrial-mesh.mjs donut <config.json | '{...json...}'> [-o out.svg]
//   node industrial-mesh.mjs --help

import { readFileSync, writeFileSync } from "node:fs";

const MONO = `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace`;

const DEFAULTS = {
  width: 1600,
  height: 1100,
  cx: null, // default width/2
  cy: null, // default height*0.48
  outerR: 420,
  innerR: 200, // 0 = pie instead of donut
  depth: 110, // extrusion height; 0 = flat 2D mesh
  rotate: { x: 62, y: 0, z: -14 }, // degrees, applied Rx -> Ry -> Rz
  perspective: 1600, // camera distance in px; 0 = orthographic
  segments: 5, // count, or [{ share, label, sub, explode }]
  gapDeg: 2.5, // angular gap between segments
  fill: "hybrid", // wire (transparent) | hybrid (dark translucent + mesh) | cel (flat shaded)
  fillOpacity: 0.88, // used by hybrid
  theme: "phosphor", // phosphor | ember | mono | { hue: "#4ADE80" }
  grid: { radial: 6, rings: 1, zRings: 1 }, // mesh density (degrees / counts)
  bg: null, // default from theme; "transparent" to skip
  glow: true,
  grain: 0.04,
};

// ---------------------------------------------------------------- color

function hexToHsl(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) fail(`bad hex color "${hex}"`);
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
}

function hslToHex(h, s, l) {
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Everything in a scene derives from ONE hue — lightness/saturation vary, hue never does.
function deriveTheme(hueHex) {
  const { h } = hexToHsl(hueHex);
  return {
    line: hslToHex(h, 0.75, 0.62),
    lineDim: hslToHex(h, 0.4, 0.4),
    rim: hslToHex(h, 0.8, 0.82),
    fillShadow: hslToHex(h, 0.3, 0.05),
    fillMid: hslToHex(h, 0.32, 0.09),
    fillLight: hslToHex(h, 0.3, 0.14),
    bg: hslToHex(h, 0.3, 0.025),
  };
}

const THEMES = {
  phosphor: deriveTheme("#4ADE80"), // terminal-green hologram
  ember: {
    // family-B neutral steels with warm peach rim (reference machinery palette)
    line: "#8F8C88", lineDim: "#55524F", rim: "#F6D9BC",
    fillShadow: "#262422", fillMid: "#35312E", fillLight: "#423D39", bg: "#141210",
  },
  mono: {
    line: "#F2F0ED", lineDim: "#8F8C88", rim: "#FFFFFF",
    fillShadow: "#101010", fillMid: "#1A1A1A", fillLight: "#242424", bg: "#0B0B0C",
  },
};

// ----------------------------------------------------------------- math

function fail(msg) {
  process.stderr.write(`industrial-mesh: ${msg}\n`);
  process.exit(1);
}

const rad = (d) => (d * Math.PI) / 180;
const fmt = (n) => (Math.round(n * 100) / 100).toString();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Screen-style frame: x right, y down, z toward the viewer.
function rotXYZ(p, r) {
  let { x, y, z } = p;
  let c = Math.cos(rad(r.x)), s = Math.sin(rad(r.x));
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(rad(r.y)); s = Math.sin(rad(r.y));
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rad(r.z)); s = Math.sin(rad(r.z));
  [x, y] = [x * c - y * s, x * s + y * c];
  return { x, y, z };
}

const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
function norm(v) {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

function makeProjector(cfg) {
  return (p) => {
    const q = rotXYZ(p, cfg.rotate);
    const f = cfg.perspective > 0 ? cfg.perspective / (cfg.perspective - q.z) : 1;
    return { x: cfg.cx + q.x * f, y: cfg.cy + q.y * f, z: q.z };
  };
}

// Object-space point on the donut: angle 0 = 12 o'clock, clockwise; z=0 is
// the top surface, z=-depth the bottom. ex/ey = explode offset in-plane.
function pt(angleDeg, r, z, ex = 0, ey = 0) {
  const a = rad(angleDeg - 90);
  return { x: r * Math.cos(a) + ex, y: r * Math.sin(a) + ey, z };
}

// ----------------------------------------------------------------- build

function renderDonut(raw) {
  const cfg = { ...DEFAULTS, ...raw };
  cfg.rotate = { ...DEFAULTS.rotate, ...(raw.rotate || {}) };
  cfg.grid = { ...DEFAULTS.grid, ...(raw.grid || {}) };
  cfg.cx = cfg.cx ?? cfg.width / 2;
  cfg.cy = cfg.cy ?? cfg.height * 0.48;
  const T =
    typeof cfg.theme === "string"
      ? THEMES[cfg.theme] || fail(`unknown theme "${cfg.theme}" (phosphor|ember|mono or {hue})`)
      : deriveTheme(cfg.theme.hue);
  const bg = cfg.bg ?? T.bg;
  const P = makeProjector(cfg);
  const rotDir = (v) => rotXYZ(v, cfg.rotate); // rotate a direction (normals)
  const L = norm({ x: -0.45, y: -0.6, z: 0.66 }); // light: upper-left, toward viewer
  const isPie = cfg.innerR <= 1;
  const flat = cfg.depth <= 0;
  const opaque = cfg.fill === "cel";
  const wire = cfg.fill !== "cel"; // wire + hybrid both draw the full mesh

  // segments -> [{a0, a1, label, sub, ex, ey}]
  const rawSegs =
    typeof cfg.segments === "number"
      ? Array.from({ length: cfg.segments }, () => ({ share: 1 / cfg.segments }))
      : cfg.segments;
  const total = rawSegs.reduce((s, x) => s + (x.share ?? 1 / rawSegs.length), 0);
  let cursor = 0;
  const segs = rawSegs.map((s) => {
    const sweep = ((s.share ?? 1 / rawSegs.length) / total) * 360;
    const a0 = cursor + cfg.gapDeg / 2, a1 = cursor + sweep - cfg.gapDeg / 2;
    cursor += sweep;
    const mid = rad((a0 + a1) / 2 - 90), ex = (s.explode || 0) * Math.cos(mid), ey = (s.explode || 0) * Math.sin(mid);
    return { ...s, a0, a1, ex, ey };
  });

  const faces = []; // { pts:[{x,y,z}...], n, zAvg }
  const lines = []; // { pts, weight, base, zAvg, color }
  const step = Math.max(2, cfg.grid.radial);

  const arc = (r, z, a0, a1, ex, ey) => {
    const out = [];
    const n = Math.max(3, Math.ceil((a1 - a0) / step));
    for (let i = 0; i <= n; i++) out.push(P(pt(a0 + ((a1 - a0) * i) / n, r, z, ex, ey)));
    return out;
  };
  const zAvg = (pts) => pts.reduce((s, p) => s + p.z, 0) / pts.length;
  const pushLine = (pts, weight, base, color) => lines.push({ pts, weight, base, color, zAvg: zAvg(pts) });
  const pushFace = (pts, n) => faces.push({ pts, n, zAvg: zAvg(pts) });

  for (const s of segs) {
    const { a0, a1, ex, ey } = s;
    const topN = rotDir({ x: 0, y: 0, z: 1 });

    // --- faces
    const topPts = [...arc(cfg.outerR, 0, a0, a1, ex, ey), ...(isPie ? [P(pt(0, 0, 0, ex, ey))] : arc(cfg.innerR, 0, a1, a0, ex, ey))];
    pushFace(topPts, topN);
    if (!flat) {
      pushFace([...arc(cfg.outerR, -cfg.depth, a0, a1, ex, ey), ...(isPie ? [P(pt(0, 0, -cfg.depth, ex, ey))] : arc(cfg.innerR, -cfg.depth, a1, a0, ex, ey))], { x: -topN.x, y: -topN.y, z: -topN.z });
      const nSlices = Math.max(3, Math.ceil((a1 - a0) / step));
      for (const [r, inward] of isPie ? [[cfg.outerR, false]] : [[cfg.outerR, false], [cfg.innerR, true]]) {
        for (let i = 0; i < nSlices; i++) {
          const b0 = a0 + ((a1 - a0) * i) / nSlices, b1 = a0 + ((a1 - a0) * (i + 1)) / nSlices;
          const m = rad((b0 + b1) / 2 - 90);
          const nrm = rotDir({ x: Math.cos(m) * (inward ? -1 : 1), y: Math.sin(m) * (inward ? -1 : 1), z: 0 });
          const quad = [P(pt(b0, r, 0, ex, ey)), P(pt(b1, r, 0, ex, ey)), P(pt(b1, r, -cfg.depth, ex, ey)), P(pt(b0, r, -cfg.depth, ex, ey))];
          quad.n = nrm;
          pushFace(quad, nrm);
          // rim light: lit outer-wall quads get a bright top edge (cel/hybrid)
          if (!inward && cfg.fill !== "wire" && dot(nrm, L) > 0.55)
            pushLine([quad[0], quad[1]], 1.4, 1, T.rim);
        }
      }
      for (const [a, sign] of [[a0, -1], [a1, 1]]) {
        const t = rad(a - 90);
        const nrm = rotDir({ x: -Math.sin(t) * -sign, y: Math.cos(t) * -sign, z: 0 });
        pushFace([P(pt(a, isPie ? 0 : cfg.innerR, 0, ex, ey)), P(pt(a, cfg.outerR, 0, ex, ey)), P(pt(a, cfg.outerR, -cfg.depth, ex, ey)), P(pt(a, isPie ? 0 : cfg.innerR, -cfg.depth, ex, ey))], nrm);
      }
    }

    // --- mesh lines (wire + hybrid; cel keeps only a faint top outline)
    if (wire) {
      pushLine(arc(cfg.outerR, 0, a0, a1, ex, ey), 1.4, 1, T.line);
      if (!isPie) pushLine(arc(cfg.innerR, 0, a0, a1, ex, ey), 1.4, 0.9, T.line);
      if (!flat) {
        pushLine(arc(cfg.outerR, -cfg.depth, a0, a1, ex, ey), 1, 0.55, T.line);
        if (!isPie) pushLine(arc(cfg.innerR, -cfg.depth, a0, a1, ex, ey), 1, 0.5, T.line);
      }
      for (const a of [a0, a1]) {
        const rIn = isPie ? 0 : cfg.innerR;
        pushLine([P(pt(a, rIn, 0, ex, ey)), P(pt(a, cfg.outerR, 0, ex, ey))], 1.2, 0.9, T.line);
        if (!flat) {
          pushLine([P(pt(a, cfg.outerR, 0, ex, ey)), P(pt(a, cfg.outerR, -cfg.depth, ex, ey))], 1.2, 0.8, T.line);
          if (!isPie) pushLine([P(pt(a, rIn, 0, ex, ey)), P(pt(a, rIn, -cfg.depth, ex, ey))], 1.2, 0.7, T.line);
        }
      }
      // interior grid — dimmer than structural edges
      for (let a = a0 + step; a < a1; a += step) {
        pushLine([P(pt(a, isPie ? 0 : cfg.innerR, 0, ex, ey)), P(pt(a, cfg.outerR, 0, ex, ey))], 0.6, 0.3, T.line);
        if (!flat) {
          pushLine([P(pt(a, cfg.outerR, 0, ex, ey)), P(pt(a, cfg.outerR, -cfg.depth, ex, ey))], 0.6, 0.3, T.line);
          if (!isPie) pushLine([P(pt(a, cfg.innerR, 0, ex, ey)), P(pt(a, cfg.innerR, -cfg.depth, ex, ey))], 0.6, 0.25, T.line);
        }
      }
      for (let i = 1; i <= cfg.grid.rings; i++) {
        const r = cfg.innerR + ((cfg.outerR - cfg.innerR) * i) / (cfg.grid.rings + 1);
        pushLine(arc(r, 0, a0, a1, ex, ey), 0.6, 0.3, T.line);
      }
      if (!flat)
        for (let i = 1; i <= cfg.grid.zRings; i++) {
          const z = (-cfg.depth * i) / (cfg.grid.zRings + 1);
          pushLine(arc(cfg.outerR, z, a0, a1, ex, ey), 0.6, 0.3, T.line);
          if (!isPie) pushLine(arc(cfg.innerR, z, a0, a1, ex, ey), 0.6, 0.25, T.line);
        }
    } else {
      pushLine(arc(cfg.outerR, 0, a0, a1, ex, ey), 0.8, 0.35, T.line);
    }
  }

  // --- assemble svg
  faces.sort((a, b) => a.zAvg - b.zAvg); // painter: far first
  const zs = lines.map((l) => l.zAvg);
  const zMin = Math.min(...zs, 0), zMax = Math.max(...zs, 1);
  const depthOpa = (z) => 0.35 + 0.65 * ((z - zMin) / (zMax - zMin || 1));

  const faceSvg = faces
    .filter((f) => !(opaque && f.n.z <= 0)) // backface cull only when fully opaque
    .map((f) => {
      const b = dot(f.n, L);
      const fill = cfg.fill === "wire" ? "none" : b > 0.5 ? T.fillLight : b > 0.12 ? T.fillMid : T.fillShadow;
      if (fill === "none") return "";
      const o = opaque ? 1 : f.n.z > 0 ? cfg.fillOpacity : cfg.fillOpacity * 0.55;
      const d = `M ${f.pts.map((p) => `${fmt(p.x)} ${fmt(p.y)}`).join(" L ")} Z`;
      return `<path d="${d}" fill="${fill}" opacity="${fmt(o)}"/>`;
    })
    .join("\n    ");

  const lineSvg = lines
    .sort((a, b) => a.zAvg - b.zAvg)
    .map((l) => {
      const d = `M ${l.pts.map((p) => `${fmt(p.x)} ${fmt(p.y)}`).join(" L ")}`;
      return `<path d="${d}" fill="none" stroke="${l.color}" stroke-width="${l.weight}" opacity="${fmt(l.base * depthOpa(l.zAvg))}" stroke-linecap="round"/>`;
    })
    .join("\n    ");

  // --- callout leaders
  const callouts = [];
  for (const s of segs) {
    if (!s.label) continue;
    const aMid = (s.a0 + s.a1) / 2;
    const a = P(pt(aMid, cfg.outerR, 0, s.ex, s.ey));
    const right = a.x >= cfg.cx;
    const dx = right ? 1 : -1;
    const dy = a.y >= cfg.cy ? 55 : -55; // route away from the object, never across it
    const e1 = { x: a.x + 70 * dx, y: a.y + dy };
    const e2 = { x: e1.x + 130 * dx, y: e1.y };
    callouts.push(`<!-- callout: ${esc(s.label)} -->
    <circle cx="${fmt(a.x)}" cy="${fmt(a.y)}" r="3" fill="${T.line}" filter="url(#glow)"/>
    <circle cx="${fmt(a.x)}" cy="${fmt(a.y)}" r="6.5" fill="none" stroke="${T.line}" stroke-width="1" opacity="0.6"/>
    <path d="M ${fmt(a.x)} ${fmt(a.y)} L ${fmt(e1.x)} ${fmt(e1.y)} L ${fmt(e2.x)} ${fmt(e2.y)}" fill="none" stroke="${T.line}" stroke-width="1" opacity="0.7"/>
    <text x="${fmt(right ? e1.x + 8 : e1.x - 8)}" y="${fmt(e1.y - 8)}" fill="${T.line}" font-family="${MONO}" font-size="13" letter-spacing="2.4" text-anchor="${right ? "start" : "end"}">${esc(String(s.label).toUpperCase())}</text>
    ${s.sub ? `<text x="${fmt(right ? e1.x + 8 : e1.x - 8)}" y="${fmt(e1.y + 18)}" fill="${T.lineDim}" font-family="${MONO}" font-size="11" letter-spacing="2" text-anchor="${right ? "start" : "end"}">${esc(String(s.sub).toUpperCase())}</text>` : ""}`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.width}" height="${cfg.height}" viewBox="0 0 ${cfg.width} ${cfg.height}" role="img">
  <defs>
    <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow" x="-300%" y="-300%" width="700%" height="700%">
      <feGaussianBlur stdDeviation="4" result="b1"/>
      <feMerge><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="${cfg.grain}" intercept="0"/></feComponentTransfer>
    </filter>
  </defs>
  ${bg !== "transparent" ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""}
  <!-- faces (painter-sorted, far to near) -->
  <g>
    ${faceSvg}
  </g>
  <!-- mesh lines${cfg.glow ? " (phosphor bloom)" : ""} -->
  <g${cfg.glow ? ` filter="url(#bloom)"` : ""}>
    ${lineSvg}
  </g>
  <!-- callouts -->
  <g>
    ${callouts.join("\n    ")}
  </g>
  ${cfg.grain ? `<rect width="100%" height="100%" filter="url(#grain)"/>` : ""}
</svg>`;
}

// ------------------------------------------------------------------- cli

const HELP = `industrial-mesh.mjs — holographic 2D/3D mesh SVG scaffolds

  node industrial-mesh.mjs donut <config.json|'{json}'> [-o out.svg]

donut config (defaults shown):
${JSON.stringify(DEFAULTS, null, 2)}

  segments: 5                       -> equal unlabeled segments
  segments: [{ "share": 0.178, "label": "Segment 01", "sub": "17.8%", "explode": 60 }, ...]
  innerR: 0    -> pie | depth: 0 -> flat 2D mesh
  rotate: euler degrees applied Rx -> Ry -> Rz (x tilts away, z spins in-plane)
  perspective: camera distance px (0 = orthographic)
  fill: "wire" (transparent) | "hybrid" (dark translucent + mesh) | "cel" (flat shaded)
  theme: "phosphor" | "ember" | "mono" | { "hue": "#4ADE80" }
`;

const argv = process.argv.slice(2);
if (!argv.length || argv.includes("--help") || argv.includes("-h")) {
  process.stdout.write(HELP);
  process.exit(0);
}
if (argv[0] !== "donut") fail(`unknown mode "${argv[0]}" (expected: donut)`);
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
const svg = renderDonut(cfg);
if (outPath) {
  writeFileSync(outPath, svg);
  process.stderr.write(`wrote ${outPath}\n`);
} else {
  process.stdout.write(svg);
}
