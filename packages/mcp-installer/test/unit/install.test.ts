import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/discovery", () => ({
  discover: vi.fn(async () => ({
    issuer: "https://app.dreambase.test",
    mcpUrl: "https://app.dreambase.test/mcp",
  })),
}));

vi.mock("../../src/clients/detect", () => ({
  detectClients: vi.fn(async () => []),
  writerById: vi.fn(() => ({
    id: "broken",
    displayName: "Broken client",
    nativeOauth: true,
    write: vi.fn(async () => {
      throw new Error("permission denied");
    }),
  })),
}));

vi.mock("../../src/skills", () => ({
  installSkills: vi.fn(async () => []),
}));

import { runInstall } from "../../src/install";

describe("runInstall", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns nonzero when a requested client cannot be configured", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const error = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await expect(runInstall({ clients: ["broken"] })).resolves.toBe(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("Setup incomplete"),
    );
  });
});
