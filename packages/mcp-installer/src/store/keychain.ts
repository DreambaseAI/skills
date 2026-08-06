import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { credentialsFilePath, dreambaseDir, KEYCHAIN_SERVICE } from "../config";

/** A minimal secret store: values keyed by an opaque account string. */
export interface Backend {
  name: "keyring" | "file";
  get(account: string): Promise<string | null>;
  set(account: string, value: string): Promise<void>;
  del(account: string): Promise<void>;
}

/**
 * Try the OS keychain via `@napi-rs/keyring`. Returns null when the platform has
 * no usable backend (e.g. headless Linux without libsecret/DBus, correction:
 * document this gap) so the caller can fall back to the `0600` file store.
 *
 * The native module is imported lazily and a set→get→delete round-trip probe is
 * run, because a missing backend only errors at *operation* time, not import.
 */
async function tryKeyringBackend(): Promise<Backend | null> {
  let Entry: new (
    service: string,
    account: string,
  ) => {
    getPassword(): string | null;
    setPassword(password: string): void;
    deletePassword(): boolean;
  };
  try {
    ({ Entry } = await import("@napi-rs/keyring"));
  } catch {
    return null;
  }

  // Probe: prove the backend actually stores and returns a secret.
  try {
    const probe = new Entry(KEYCHAIN_SERVICE, "__probe__");
    probe.setPassword("ok");
    const got = probe.getPassword();
    probe.deletePassword();
    if (got !== "ok") return null;
  } catch {
    return null;
  }

  return {
    name: "keyring",
    async get(account) {
      try {
        return new Entry(KEYCHAIN_SERVICE, account).getPassword();
      } catch {
        // getPassword throws when the entry does not exist.
        return null;
      }
    },
    async set(account, value) {
      new Entry(KEYCHAIN_SERVICE, account).setPassword(value);
    },
    async del(account) {
      try {
        new Entry(KEYCHAIN_SERVICE, account).deletePassword();
      } catch {
        // Deleting a missing entry is a no-op.
      }
    },
  };
}

/**
 * File fallback: a single JSON object at `~/.dreambase/credentials.json`,
 * created `0600` in a `0700` directory. Writes go through a temp file + rename
 * so a crash mid-write can't corrupt the store.
 */
function fileBackend(): Backend {
  const path = credentialsFilePath();

  function readAll(): Record<string, string> {
    try {
      return JSON.parse(readFileSync(path, "utf8")) as Record<string, string>;
    } catch {
      return {};
    }
  }
  function writeAll(all: Record<string, string>): void {
    mkdirSync(dreambaseDir(), { recursive: true, mode: 0o700 });
    const tmp = `${path}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(all, null, 2), { mode: 0o600 });
    renameSync(tmp, path);
  }

  return {
    name: "file",
    async get(account) {
      return readAll()[account] ?? null;
    },
    async set(account, value) {
      const all = readAll();
      all[account] = value;
      writeAll(all);
    },
    async del(account) {
      const all = readAll();
      if (account in all) {
        delete all[account];
        writeAll(all);
      }
    },
  };
}

let cached: Promise<Backend> | undefined;

/**
 * The selected backend (keyring if usable, else the file fallback). Memoized.
 * Set `DREAMBASE_MCP_STORE=file` to force the file store — useful on headless
 * machines where probing the keychain is undesirable, and in tests.
 */
export function getBackend(): Promise<Backend> {
  if (!cached) {
    cached = (async () => {
      if (process.env.DREAMBASE_MCP_STORE === "file") return fileBackend();
      return (await tryKeyringBackend()) ?? fileBackend();
    })();
  }
  return cached;
}

/** For tests: force re-selection on next `getBackend()`. */
export function resetBackendCache(): void {
  cached = undefined;
}
