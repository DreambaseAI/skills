import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

// Single source of truth for the version: the CLI reads it from here at build
// time, so `--version` can't drift from package.json.
const { version } = JSON.parse(readFileSync("package.json", "utf8")) as {
  version: string;
};

// A single bundled ESM entry (`dist/cli.js`) with a Node shebang. Bundling keeps
// `npx dreambase-mcp` cold-start fast and lets us ship a lean module graph. The
// `shim` and other subcommands live inside the one binary (dispatched by
// commander), so there is only one bin entry to publish.
export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  clean: true,
  sourcemap: true,
  // @napi-rs/keyring loads a native .node binary at runtime; never bundle it.
  external: ["@napi-rs/keyring"],
  define: {
    __DREAMBASE_MCP_VERSION__: JSON.stringify(version),
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
});
