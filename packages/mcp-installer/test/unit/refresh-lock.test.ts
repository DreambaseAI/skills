import { existsSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { withRefreshLock } from "../../src/oauth/refresh-lock";
import { dreambaseDir } from "../../src/config";

// The lock is a file under ~/.dreambase; overriding HOME redirects it into a
// throwaway dir (same trick the credential-store tests use).

const KEY = { issuer: "https://as.test", resource: "https://as.test/mcp" };

describe("withRefreshLock", () => {
  let prevHome: string | undefined;

  beforeEach(() => {
    prevHome = process.env.HOME;
    process.env.HOME = mkdtempSync(join(tmpdir(), "dreambase-lock-"));
  });
  afterEach(() => {
    if (prevHome === undefined) delete process.env.HOME;
    else process.env.HOME = prevHome;
  });

  it("serializes overlapping critical sections in one process", async () => {
    let active = 0;
    let maxActive = 0;
    const body = async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 20));
      active--;
      return active;
    };

    await Promise.all([
      withRefreshLock(KEY, body),
      withRefreshLock(KEY, body),
      withRefreshLock(KEY, body),
    ]);

    // If the lock works, the three bodies never overlapped.
    expect(maxActive).toBe(1);
  });

  it("releases the lock file after the critical section", async () => {
    await withRefreshLock(KEY, async () => "done");
    const locks = readdirSync(dreambaseDir()).filter((f) =>
      f.startsWith("refresh-"),
    );
    expect(locks).toHaveLength(0);
  });

  it("reclaims a stale lock (old timestamp) instead of blocking", async () => {
    // Plant a stale lock for this key's file, then confirm we still run.
    let lockFile: string | undefined;
    await withRefreshLock(KEY, async () => {
      lockFile = readdirSync(dreambaseDir()).find((f) =>
        f.startsWith("refresh-"),
      );
    });
    expect(lockFile).toBeDefined();
    const path = join(dreambaseDir(), lockFile as string);
    writeFileSync(
      path,
      JSON.stringify({ pid: process.pid, ts: 0, nonce: "stale" }),
    );

    const ran = await withRefreshLock(KEY, async () => "ran");
    expect(ran).toBe("ran");
    expect(existsSync(path)).toBe(false);
  });

  it("reclaims a lock held by a dead pid", async () => {
    let lockFile: string | undefined;
    await withRefreshLock(KEY, async () => {
      lockFile = readdirSync(dreambaseDir()).find((f) =>
        f.startsWith("refresh-"),
      );
    });
    const path = join(dreambaseDir(), lockFile as string);
    // A very high, almost-certainly-dead pid with a fresh timestamp: only the
    // liveness check can reclaim this.
    writeFileSync(
      path,
      JSON.stringify({ pid: 2 ** 31 - 1, ts: Date.now(), nonce: "orphan" }),
    );

    const ran = await withRefreshLock(KEY, async () => "ran");
    expect(ran).toBe("ran");
  });
});
