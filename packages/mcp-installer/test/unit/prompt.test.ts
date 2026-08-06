import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";
import { multiselect, type MultiselectChoice } from "../../src/prompt";

// `multiselect` is a generic widget; these fixtures deliberately do not track
// the client registry so the widget's tests survive registry changes.
const CHOICES: MultiselectChoice[] = [
  { value: "alpha", label: "Alpha", checked: true },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" },
];

/** A fake TTY input we can drive by emitting synthetic keypress events. */
function fakeIo() {
  const input = new PassThrough() as PassThrough & {
    isTTY?: boolean;
    setRawMode?: (m: boolean) => void;
  };
  input.isTTY = true;
  input.setRawMode = () => {};
  const output = { write: () => true };
  const press = (name: string, mods: { ctrl?: boolean } = {}) =>
    input.emit("keypress", "", { name, ctrl: mods.ctrl ?? false });
  return { input, output, press };
}

describe("multiselect", () => {
  it("navigates with arrows, toggles with space, resolves selected values on enter", async () => {
    const { input, output, press } = fakeIo();
    const result = multiselect("Pick", CHOICES, { input, output });

    // Start on item 0 (pre-checked). Uncheck it, move down twice, check item 2.
    press("space"); // toggle alpha OFF
    press("down"); // -> beta
    press("down"); // -> gamma
    press("space"); // toggle gamma ON
    press("return");

    expect(await result).toEqual(["gamma"]);
  });

  it("keeps the pre-checked defaults when the user just presses enter", async () => {
    const { input, output, press } = fakeIo();
    const result = multiselect("Pick", CHOICES, { input, output });
    press("return");
    expect(await result).toEqual(["alpha"]);
  });

  it("toggles all with `a`", async () => {
    const { input, output, press } = fakeIo();
    const result = multiselect("Pick", CHOICES, { input, output });
    press("a"); // not all selected -> select all
    press("return");
    expect(await result).toEqual(["alpha", "beta", "gamma"]);
  });

  it("rejects on Ctrl-C", async () => {
    const { input, output, press } = fakeIo();
    const result = multiselect("Pick", CHOICES, { input, output });
    press("c", { ctrl: true });
    await expect(result).rejects.toThrow(/cancelled/i);
  });
});
