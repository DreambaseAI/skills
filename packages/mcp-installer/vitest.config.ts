import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
    // The integration smoke test is env-gated on DREAMBASE_MCP_E2E_URL and skips
    // itself when that is unset, so it is safe to leave in the default run.
  },
});
