#!/usr/bin/env node
/**
 * Structurally validate an ECharts option JSON before returning it.
 * Zero dependencies. Catches the mistakes that render a blank chart with no
 * error message. Errors exit 1; warnings are advisory.
 *
 * Usage:
 *   node scripts/validate-option.mjs <config.json>
 *   cat config.json | node scripts/validate-option.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const INDEX_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/option-index.json");
const { root } = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
const KNOWN_TOP = new Set(root.map((n) => n.p).concat(["baseOption", "media"]));
const seriesNode = root.find((n) => n.p === "series");
const KNOWN_SERIES_TYPES = new Set(seriesNode.c.map((n) => n.p));
const SERIES_PROPS = new Map(seriesNode.c.map((n) => [n.p, new Set((n.c ?? []).map((c) => c.p))]));

const MAX_INLINE_POINTS = 200;
const errors = [];
const warnings = [];
const arr = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function validateOption(opt, ctx = "") {
  const at = (p) => (ctx ? `${ctx}.${p}` : p);

  for (const key of Object.keys(opt)) {
    if (!KNOWN_TOP.has(key)) warnings.push(`${at(key)}: unknown top-level option (typo? run echarts-option.mjs --find ${key})`);
  }

  const xAxes = arr(opt.xAxis);
  const yAxes = arr(opt.yAxis);
  const series = arr(opt.series);
  const hasDataset = opt.dataset !== undefined;

  const stacks = new Map();
  series.forEach((s, i) => {
    const sat = at(`series[${i}]`);
    if (!s || typeof s !== "object") return errors.push(`${sat}: not an object`);

    if (!s.type) errors.push(`${sat}: missing "type"`);
    else if (!KNOWN_SERIES_TYPES.has(s.type)) errors.push(`${sat}: unknown series type '${s.type}' (valid: ${[...KNOWN_SERIES_TYPES].join(", ")})`);

    const known = SERIES_PROPS.get(s.type);
    if (known) {
      for (const k of Object.keys(s)) {
        if (!known.has(k)) warnings.push(`${sat}.${k}: not a documented option for series.${s.type} (typo? run echarts-option.mjs series-${s.type})`);
      }
    }

    if (s.xAxisIndex !== undefined && s.xAxisIndex >= Math.max(xAxes.length, 1)) errors.push(`${sat}.xAxisIndex=${s.xAxisIndex} but only ${xAxes.length} xAxis defined`);
    if (s.yAxisIndex !== undefined && s.yAxisIndex >= Math.max(yAxes.length, 1)) errors.push(`${sat}.yAxisIndex=${s.yAxisIndex} but only ${yAxes.length} yAxis defined`);

    if (s.stack !== undefined) stacks.set(s.stack, (stacks.get(s.stack) ?? 0) + 1);

    if (Array.isArray(s.data) && s.data.length > MAX_INLINE_POINTS) {
      warnings.push(`${sat}.data has ${s.data.length} inline points (>${MAX_INLINE_POINTS}) — move to dataset.source`);
    }

    if (s.type === "heatmap" && opt.visualMap === undefined) errors.push(`${sat}: heatmap requires a visualMap component — nothing renders without it`);
    if (s.type === "radar" && opt.radar?.indicator === undefined) errors.push(`${sat}: radar series requires radar.indicator at the top level`);
    if (s.type === "candlestick" && Array.isArray(s.data)) {
      const bad = s.data.findIndex((d) => Array.isArray(d) && d.length !== 4 && d.length !== 5);
      if (bad !== -1) errors.push(`${sat}.data[${bad}]: candlestick tuples must be [open, close, lowest, highest]`);
    }
    if (s.type === "sankey") {
      const nodes = s.data ?? s.nodes;
      const links = s.links ?? s.edges;
      if (!nodes || !links) errors.push(`${sat}: sankey needs both data/nodes and links/edges`);
      else {
        const names = new Set(nodes.map((n) => n.name));
        const badLink = links.findIndex((l) => !names.has(l.source) || !names.has(l.target));
        if (badLink !== -1) errors.push(`${sat}.links[${badLink}]: source/target not present in node names`);
      }
    }
    if (s.type === "pie" && (opt.xAxis || opt.yAxis)) warnings.push(`${sat}: pie ignores xAxis/yAxis — remove them unless another series needs them`);
  });

  for (const [name, count] of stacks) {
    if (count === 1) warnings.push(`${at("series")}: stack '${name}' used by only one series — stacking needs the same stack string on every stacked series`);
  }

  xAxes.forEach((ax, i) => {
    if (ax?.type === "category" && !ax.data && !hasDataset) warnings.push(`${at(`xAxis[${i}]`)}: category axis has no data and no dataset — categories come from one or the other`);
  });

  arr(opt.dataZoom).forEach((dz, i) => {
    if (dz?.type && !["inside", "slider"].includes(dz.type)) errors.push(`${at(`dataZoom[${i}]`)}: type must be 'inside' or 'slider'`);
  });

  const cartesianMulti = series.filter((s) => ["line", "bar", "scatter"].includes(s?.type)).length > 1;
  if (cartesianMulti) {
    if (opt.tooltip === undefined) warnings.push(`${at("tooltip")}: multi-series chart without tooltip — add { "trigger": "axis" } unless the user opted out`);
    if (opt.legend === undefined) warnings.push(`${at("legend")}: multi-series chart without legend — users can't tell series apart`);
  }
}

// --- main ---
const src = process.argv[2]
  ? readFileSync(process.argv[2], "utf8")
  : readFileSync(0, "utf8");

let opt;
try {
  opt = JSON.parse(src);
} catch (e) {
  console.error(`error: not valid JSON — ${e.message}`);
  process.exit(1);
}

if (opt.baseOption) {
  validateOption(opt.baseOption, "baseOption");
  arr(opt.media).forEach((m, i) => {
    if (!m.option) warnings.push(`media[${i}]: missing "option"`);
  });
} else {
  validateOption(opt);
}

for (const e of errors) console.log(`error:   ${e}`);
for (const w of warnings) console.log(`warning: ${w}`);
if (!errors.length && !warnings.length) console.log("ok: no issues found");
process.exit(errors.length ? 1 : 0);
