#!/usr/bin/env node
/**
 * Rebuild assets/option-index.json from the official ECharts option outline.
 * Run when bumping the supported ECharts version. Zero dependencies.
 *
 * Usage:
 *   node scripts/build-option-index.mjs [--from <url-or-file>]
 *
 * Default source: https://echarts.apache.org/en/documents/option-parts/option-outline.json
 *
 * Output shape (recursive, compacted to keep the vendored file small):
 *   { p: "propName", t: "type", d: "default", c: [children] }
 * Series variants (arrayItemType) become children of "series" named by variant.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_URL = "https://echarts.apache.org/en/documents/option-parts/option-outline.json";

function compact(node) {
  const out = {};
  const name = node.prop ?? node.arrayItemType;
  if (name !== undefined) out.p = String(name);
  if (node.type !== undefined) out.t = Array.isArray(node.type) ? node.type.join("|") : String(node.type);
  if (node.default !== undefined) out.d = String(node.default);
  if (node.isArray) out.arr = 1;
  if (Array.isArray(node.children) && node.children.length) {
    out.c = node.children.map(compact);
  }
  return out;
}

async function load(source) {
  if (/^https?:/.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`fetch failed: ${res.status} ${source}`);
    const raw = await res.text();
    return { outline: JSON.parse(raw), raw };
  }
  const raw = readFileSync(source, "utf8");
  return { outline: JSON.parse(raw), raw };
}

const args = process.argv.slice(2);
const fromIdx = args.indexOf("--from");
const source = fromIdx !== -1 ? args[fromIdx + 1] : DEFAULT_URL;

const { outline, raw } = await load(source);
if (!Array.isArray(outline.children)) {
  throw new Error("unexpected outline shape: missing top-level children[]");
}

const index = {
  source,
  sourceSha256: createHash("sha256").update(raw).digest("hex"),
  generated: new Date().toISOString(),
  root: outline.children.map(compact),
};

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/option-index.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(index));
const kb = Math.round(Buffer.byteLength(JSON.stringify(index)) / 1024);
console.log(`wrote ${outPath} (${kb} KB, ${index.root.length} top-level options)`);
