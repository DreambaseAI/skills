import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // `skills/` is copied in from the repo root by scripts/sync-skills.mjs; it is
  // linted at the root, not here.
  { ignores: ["dist", "node_modules", "coverage", "skills"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Buffer: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
