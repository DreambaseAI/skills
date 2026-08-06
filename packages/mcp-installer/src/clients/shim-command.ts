export interface CommandEntry {
  command: string;
  args: string[];
}

/**
 * The command a header-only / stdio client should run to launch our shim.
 *
 * When published and installed, that's `npx -y @dreambase/mcp shim …` so the
 * client always resolves the package. But when running from a local dev
 * checkout (the CLI isn't inside a `node_modules`), `npx @dreambase/mcp` can't
 * resolve — so we point the entry at the exact binary currently running
 * (`node <abs>/dist/cli.js shim …`), which is what makes local end-to-end
 * testing work before the package is on npm.
 */
export function shimCommand(base: string): CommandEntry {
  const entry = process.argv[1];
  const isLocalDev = Boolean(entry) && !entry!.includes("node_modules");
  if (isLocalDev) {
    return {
      command: process.execPath,
      args: [entry!, "shim", "--url", base],
    };
  }
  return {
    command: "npx",
    args: ["-y", "@dreambase/mcp", "shim", "--url", base],
  };
}

/** Whether a stored command entry launches our shim for `base`. */
export function isShimEntry(
  entry: { args?: string[] } | undefined,
  base: string,
): boolean {
  const args = entry?.args;
  return Boolean(args?.includes("shim") && args.includes(base));
}
