import { createInterface } from "node:readline/promises";
import { clearScreenDown, emitKeypressEvents, moveCursor } from "node:readline";
import type { Key } from "node:readline";

/** Whether we can prompt interactively (a TTY on both ends). */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/** Yes/no prompt. Returns `defaultYes` immediately when non-interactive. */
export async function confirm(
  question: string,
  defaultYes = true,
): Promise<boolean> {
  if (!isInteractive()) return defaultYes;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const suffix = defaultYes ? "[Y/n]" : "[y/N]";
    const answer = (await rl.question(`${question} ${suffix} `))
      .trim()
      .toLowerCase();
    if (answer === "") return defaultYes;
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

export interface MultiselectChoice {
  value: string;
  label: string;
  /** Dimmed text shown after the label (e.g. "detected"). */
  hint?: string;
  /** Whether the item starts selected. */
  checked?: boolean;
}

/** Minimal stream shapes so the prompt can be driven by a fake in tests. */
interface KeypressInput extends NodeJS.EventEmitter {
  isTTY?: boolean;
  setRawMode?: (mode: boolean) => void;
  resume: () => void;
  pause: () => void;
}
interface WritableLike {
  write: (chunk: string) => boolean;
}

const DIM = (s: string) => `\x1b[2m${s}\x1b[22m`;
const CYAN = (s: string) => `\x1b[36m${s}\x1b[39m`;
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";

/**
 * An arrow-key + spacebar checkbox multiselect. Rendered in place; ↑/↓ (or j/k)
 * move, space toggles, `a` toggles all, enter confirms, Ctrl-C cancels.
 *
 * Streams are injectable so this is unit-testable without a real TTY; callers
 * should only reach for it when {@link isInteractive} is true.
 */
export function multiselect(
  message: string,
  choices: MultiselectChoice[],
  io: { input?: KeypressInput; output?: WritableLike } = {},
): Promise<string[]> {
  const input = (io.input ?? process.stdin) as KeypressInput;
  const output = io.output ?? process.stdout;

  return new Promise<string[]>((resolve, reject) => {
    const selected = choices.map((c) => Boolean(c.checked));
    let cursor = 0;
    let rendered = 0;

    const paint = () => {
      if (rendered > 0) {
        moveCursor(output as NodeJS.WritableStream, 0, -rendered);
        clearScreenDown(output as NodeJS.WritableStream);
      }
      const lines = [CYAN("?") + " " + message];
      choices.forEach((c, i) => {
        const pointer = i === cursor ? CYAN("❯") : " ";
        const box = selected[i] ? CYAN("◉") : "◯";
        lines.push(
          `${pointer} ${box} ${c.label}${c.hint ? "  " + DIM(c.hint) : ""}`,
        );
      });
      lines.push(DIM("↑/↓ move · space select · a toggle-all · enter confirm"));
      output.write(lines.join("\n") + "\n");
      rendered = lines.length;
    };

    const clearRendered = () => {
      if (rendered > 0) {
        moveCursor(output as NodeJS.WritableStream, 0, -rendered);
        clearScreenDown(output as NodeJS.WritableStream);
        rendered = 0;
      }
    };

    const cleanup = () => {
      input.off("keypress", onKey);
      if (input.isTTY && input.setRawMode) input.setRawMode(false);
      input.pause();
      output.write(SHOW_CURSOR);
    };

    const onKey = (_str: string | undefined, key: Key | undefined) => {
      if (!key) return;
      if (key.ctrl && key.name === "c") {
        clearRendered();
        cleanup();
        output.write("Cancelled.\n");
        reject(new Error("Selection cancelled."));
        return;
      }
      switch (key.name) {
        case "up":
        case "k":
          cursor = (cursor - 1 + choices.length) % choices.length;
          paint();
          break;
        case "down":
        case "j":
          cursor = (cursor + 1) % choices.length;
          paint();
          break;
        case "space":
          selected[cursor] = !selected[cursor];
          paint();
          break;
        case "a": {
          const allOn = selected.every(Boolean);
          selected.fill(!allOn);
          paint();
          break;
        }
        case "return":
        case "enter": {
          clearRendered();
          cleanup();
          const chosen = choices.filter((_, i) => selected[i]);
          output.write(
            `${CYAN("?")} ${message} ${DIM(chosen.map((c) => c.label).join(", ") || "none")}\n`,
          );
          resolve(chosen.map((c) => c.value));
          break;
        }
        default:
          break;
      }
    };

    emitKeypressEvents(input as NodeJS.ReadableStream);
    if (input.isTTY && input.setRawMode) input.setRawMode(true);
    input.resume();
    output.write(HIDE_CURSOR);
    input.on("keypress", onKey);
    paint();
  });
}
