/** Context passed to a client writer when configuring a target. */
export interface WriteContext {
  /** App base URL (e.g. https://app.dreambase.com). */
  base: string;
  /** The MCP endpoint URL (`<base>/mcp`). */
  mcpUrl: string;
  /** The MCP server key/name to write into client config. */
  serverName: string;
}

export type WriteAction = "wrote" | "updated" | "ran" | "printed" | "skipped";

export interface WriteResult {
  action: WriteAction;
  /** Config file touched, if any. */
  configPath?: string;
  /** Human-readable note (e.g. next steps). */
  note?: string;
}

/** What `doctor` finds when inspecting a client's config. */
export interface ClientStatus {
  installed: boolean;
  configPath: string;
  /** True when the config has an entry pointing at the expected MCP URL. */
  configured: boolean;
  detail?: string;
}

export interface ClientWriter {
  id: "claude-desktop" | "openai";
  displayName: string;
  /**
   * Whether the client implements MCP OAuth natively. Every writer here is
   * header-only (`false`) — a client that drives OAuth itself is served by the
   * `dreambase` plugin, not this installer. The field stays because the install
   * flow keys the installer-owned OAuth step off it, and a future native target
   * would flip it back on.
   */
  nativeOauth: boolean;
  /** Best-effort: is this client installed on the machine? */
  detect(): Promise<boolean>;
  /** Absolute path to the client's MCP config file (for reporting). */
  configPath(): string;
  /** Configure the client. */
  write(ctx: WriteContext): Promise<WriteResult>;
  /** Remove the Dreambase entry from the client's config. */
  remove(ctx: WriteContext): Promise<WriteResult>;
  /** Inspect current config state (for `doctor`). */
  status(ctx: WriteContext): Promise<ClientStatus>;
}
