#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = repoRoot;
const errors = [];
const readJson = (path) =>
  JSON.parse(readFileSync(join(repoRoot, path), "utf8"));
const error = (message) => errors.push(message);

const manifests = [
  ".claude-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/marketplace.json",
];
const versions = manifests.map((path) => {
  const data = readJson(path);
  return [path, data.version ?? data.metadata?.version];
});
if (new Set(versions.map(([, version]) => version)).size !== 1) {
  error(`manifest versions differ: ${JSON.stringify(versions)}`);
}

const codex = readJson(".codex-plugin/plugin.json");
for (const field of ["name", "version", "description", "author", "interface"]) {
  if (!codex[field]) error(`Codex manifest is missing ${field}`);
}
if (codex.skills !== "./skills/")
  error('Codex manifest skills must be "./skills/"');
if (codex.mcpServers !== "./.mcp.json") {
  error('Codex manifest mcpServers must declare "./.mcp.json"');
}

const codexMarketplace = readJson(".agents/plugins/marketplace.json");
if (
  codexMarketplace.plugins?.length !== 1 ||
  codexMarketplace.plugins[0]?.source?.path !== "./"
) {
  error('Codex marketplace must point its single plugin at the repository root');
}

for (const path of [
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/marketplace.json",
]) {
  const marketplace = readJson(path);
  if (marketplace.plugins?.length !== 1 || marketplace.plugins[0]?.source !== "./") {
    error(`${path} must point its single plugin at the repository root`);
  }
}

const interfaceFields = [
  "displayName",
  "shortDescription",
  "longDescription",
  "developerName",
  "category",
  "capabilities",
  "websiteURL",
  "privacyPolicyURL",
  "termsOfServiceURL",
  "defaultPrompt",
  "brandColor",
  "composerIcon",
  "logo",
];
for (const field of interfaceFields) {
  if (!codex.interface?.[field]) error(`Codex interface is missing ${field}`);
}

for (const urlField of [
  "websiteURL",
  "privacyPolicyURL",
  "termsOfServiceURL",
]) {
  try {
    const url = new URL(codex.interface[urlField]);
    if (url.protocol !== "https:") error(`${urlField} must use HTTPS`);
  } catch {
    error(`${urlField} must be an absolute URL`);
  }
}

const mcp = readJson(".mcp.json");
const cursorMcp = readJson("mcp.json");
if (JSON.stringify(mcp) !== JSON.stringify(cursorMcp)) {
  error(".mcp.json and mcp.json differ");
}
if (mcp.mcpServers?.dreambase?.url !== "https://app.dreambase.com/mcp") {
  error("Dreambase MCP URL is missing or unexpected");
}

const submissionTests = readJson("store/openai/submission-tests.json");
if (submissionTests.positive?.length !== 5) {
  error(
    "OpenAI submission collateral must contain exactly five positive tests",
  );
}
if (submissionTests.negative?.length !== 3) {
  error(
    "OpenAI submission collateral must contain exactly three negative tests",
  );
}

const logo = readFileSync(join(pluginRoot, "assets", "logo.png"));
if (logo.toString("hex", 1, 4) !== "504e47") error("logo.png is not a PNG");
const width = logo.readUInt32BE(16);
const height = logo.readUInt32BE(20);
if (width !== height || width < 512) {
  error(`logo.png must be square and at least 512px; got ${width}x${height}`);
}

const textExtensions = new Set([
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".yml",
  ".yaml",
]);
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", ".context"].includes(entry.name))
      continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (
      textExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))
    ) {
      if (readFileSync(path).includes(0))
        error(`text file contains NUL byte: ${path}`);
    }
  }
};
walk(repoRoot);

if (errors.length > 0) {
  console.error(errors.map((message) => `✗ ${message}`).join("\n"));
  process.exit(1);
}
console.log(
  `validate-release: ${versions[0][1]} manifests and release assets are consistent`,
);
