#!/usr/bin/env node
/**
 * Look up valid ECharts option properties, types, and defaults from the
 * vendored index (offline). Zero dependencies.
 *
 * Usage:
 *   node scripts/echarts-option.mjs <path> [--depth N]     # subtree at path
 *   node scripts/echarts-option.mjs --find <term>          # search prop names
 *   node scripts/echarts-option.mjs --desc <path>          # full prose (network)
 *
 * Path syntax: dot-separated. Series variants are addressed as
 * "series-sankey" or "series.sankey" interchangeably:
 *   node scripts/echarts-option.mjs series-sankey --depth 2
 *   node scripts/echarts-option.mjs tooltip.axisPointer
 *   node scripts/echarts-option.mjs xAxis.axisLabel --depth 2
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const INDEX_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/option-index.json");
const { root } = JSON.parse(readFileSync(INDEX_PATH, "utf8"));

function findChild(nodes, name) {
  return nodes.find((n) => n.p === name);
}

function resolvePath(path) {
  // normalize "series-sankey.links" -> ["series","sankey","links"]
  const segs = path.replace(/^series-/, "series.").split(".").filter(Boolean);
  let nodes = root;
  let node = null;
  const walked = [];
  for (const seg of segs) {
    node = findChild(nodes, seg);
    if (!node) return { node: null, walked, missing: seg, siblings: nodes.map((n) => n.p) };
    walked.push(seg);
    nodes = node.c ?? [];
  }
  return { node, walked };
}

function fmt(node) {
  let s = node.p ?? "(item)";
  if (node.t) s += ` (${node.t}${node.arr ? "[]" : ""})`;
  else if (node.arr) s += " (Array)";
  if (node.d !== undefined) s += ` = ${node.d}`;
  return s;
}

function printTree(node, depth, indent = "") {
  console.log(indent + fmt(node));
  if (!node.c) return;
  if (depth <= 0) {
    console.log(`${indent}  … ${node.c.length} nested options (increase --depth to expand)`);
    return;
  }
  for (const child of node.c) printTree(child, depth - 1, indent + "  ");
}

function search(term, nodes = root, prefix = "", hits = []) {
  for (const n of nodes) {
    const name = n.p ?? "";
    const path = prefix ? `${prefix}.${name}` : name;
    if (name.toLowerCase().includes(term.toLowerCase())) hits.push({ path, node: n });
    if (n.c && hits.length < 200) search(term, n.c, path, hits);
  }
  return hits;
}

async function fetchDesc(path) {
  // option-parts files are keyed by top-level part: option.<part>.json
  const segs = path.replace(/^series-/, "series.").split(".");
  const part = segs[0] === "series" && segs[1] ? `series-${segs[1]}` : segs[0];
  const url = `https://echarts.apache.org/en/documents/option-parts/option.${part}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${url}`);
  const doc = await res.json();
  // keys inside a part file are relative to the part root, e.g. "nodeAlign", "links.value"
  const key = (segs[0] === "series" && segs[1] ? segs.slice(2) : segs.slice(1)).join(".");
  if (!key) {
    console.log(`Documented options in ${part}:\n  ${Object.keys(doc).slice(0, 80).join("\n  ")}`);
    return;
  }
  const entry = doc[key];
  if (!entry?.desc) {
    const close = Object.keys(doc).filter((k) => k.includes(key.split(".").pop())).slice(0, 15);
    console.log(`No prose found for '${key}' in ${part}. Closest keys:\n  ${close.join("\n  ")}`);
    return;
  }
  const text = entry.desc
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (_, code) => `\n${code}\n`)
    .replace(/<[^>]+>/g, "")
    .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  console.log(`# ${key}\n\n${text}`);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log("Usage: echarts-option.mjs <path> [--depth N] | --find <term> | --desc <path>");
  console.log(`Top-level options:\n  ${root.map((n) => n.p).join(", ")}`);
  process.exit(2);
}

if (args[0] === "--find") {
  const hits = search(args[1] ?? "");
  if (!hits.length) console.log("no matches");
  for (const h of hits.slice(0, 60)) console.log(`${h.path}  ${h.node.t ? `(${h.node.t})` : ""}${h.node.d !== undefined ? ` = ${h.node.d}` : ""}`);
  if (hits.length > 60) console.log(`… ${hits.length - 60} more matches`);
} else if (args[0] === "--desc") {
  await fetchDesc(args[1] ?? "");
} else {
  const depthIdx = args.indexOf("--depth");
  const depth = depthIdx !== -1 ? Number(args[depthIdx + 1]) : 1;
  const { node, walked, missing, siblings } = resolvePath(args[0]);
  if (!node) {
    console.error(`'${missing}' not found under '${walked.join(".") || "(root)"}'.`);
    console.error(`Valid options there:\n  ${siblings.join(", ")}`);
    process.exit(1);
  }
  printTree(node, depth);
}
