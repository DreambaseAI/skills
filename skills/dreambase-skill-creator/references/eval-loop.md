# Skill Eval Loop

How to test, benchmark, and iterate on a skill in this repo. Read this before running any skill evals.

## Contents

1. [Layout](#layout)
2. [evals.json schema](#evalsjson-schema)
3. [Running a test iteration](#running-a-test-iteration)
4. [Writing assertions](#writing-assertions)
5. [Grading](#grading)
6. [Iterating on feedback](#iterating-on-feedback)
7. [Description/trigger optimization](#descriptiontrigger-optimization)

## Layout

Committed with the skill:

```
skills/dreambase-<name>/evals/evals.json   # prompts + assertions
```

Generated during runs (gitignored via `*-workspace/`):

```
skills/dreambase-<name>-workspace/
├── skill-snapshot/            # copy of the skill before edits (when improving)
└── iteration-1/
    ├── eval-<id>-<slug>/
    │   ├── eval_metadata.json
    │   ├── with_skill/outputs/ + timing.json + grading.json
    │   └── without_skill/outputs/ + ...   # or old_skill/ when improving
    ├── benchmark.json
    └── benchmark.md
```

The workspace sits *next to* the skill directory, never inside it — nothing generated during testing ships with the skill.

## evals.json schema

```json
{
  "skill_name": "dreambase-example",
  "evals": [
    {
      "id": 1,
      "prompt": "Realistic user prompt, written the way a real user types",
      "expected_output": "Plain-language description of a good result",
      "files": ["fixtures/input.csv"],
      "assertions": [
        "Output CSV has a profit_margin column",
        "All rows from the input are preserved"
      ]
    }
  ]
}
```

- 2–3 evals to start; expand once the skill stabilizes.
- Prompts must be realistic — concrete details, file names, a little backstory, even typos. "Format this data" teaches you nothing.
- `files` are fixture inputs, committed under `evals/fixtures/` if small; regenerate or document how to fetch if large.
- Confirm prompts with the user before running — bad evals produce confident garbage.

## Running a test iteration

**Spawn all runs in one turn** — for each eval, two parallel subagents (they finish together; sequencing wastes wall-clock and lets conditions drift):

1. **with_skill** — subagent gets: the skill path, the eval prompt, input files, and an output directory (`.../eval-<id>/with_skill/outputs/`). Tell it exactly which artifacts to save.
2. **baseline** — same prompt, same output contract, but:
   - *New skill*: no skill at all → `without_skill/outputs/`.
   - *Improving a skill*: snapshot first (`cp -r skills/dreambase-<name> <workspace>/skill-snapshot/`), point the baseline at the snapshot → `old_skill/outputs/`.

Write `eval_metadata.json` in each eval directory (`eval_id`, descriptive `eval_name`, `prompt`, `assertions` — empty array is fine at spawn time).

**While runs execute**, draft assertions (below) — don't idle.

**As each run completes**, capture its timing from the task notification into `timing.json` (`total_tokens`, `duration_ms`) immediately; that data isn't persisted anywhere else.

## Writing assertions

Good assertions are objectively checkable and named so a human scanning results understands each one instantly:

- ✅ "Report contains all four required sections in order"
- ✅ "Script exits 0 on the sample input"
- ❌ "Output is high quality" (subjective — leave to human review)
- ❌ "Check 3" (opaque)

Prefer a small script over eyeballing when an assertion is mechanically checkable (file exists, column present, schema valid) — scripts are reusable across iterations and don't drift. Skills with inherently subjective output (tone, design) get few or no assertions; human review carries the weight there.

## Grading

For each run, evaluate every assertion against the outputs and write `grading.json`:

```json
{
  "expectations": [
    {
      "text": "Output CSV has a profit_margin column",
      "passed": true,
      "evidence": "Column present at index 5 with numeric values in all 42 rows"
    }
  ]
}
```

Use exactly the field names `text`, `passed`, `evidence` — downstream tooling depends on them. Aggregate pass rates, tokens, and time across configurations into `benchmark.json`/`benchmark.md`, then put results in front of the user for qualitative review. Watch for:

- assertions that pass in *every* configuration (non-discriminating — they test nothing);
- high-variance evals (flaky prompt or genuinely unstable skill behavior);
- the skill winning on quality but costing far more tokens/time (sometimes fine, worth noting).

## Iterating on feedback

The skill will run across thousands of varied prompts; you iterate on three. So:

- **Generalize.** If feedback says "the chart is missing axis labels," the fix is a principle about charts always carrying labeled axes — not a rule about this chart.
- **Cut dead weight.** Read the *transcripts*, not just outputs. Instructions that send the model down unproductive detours get removed, not patched around.
- **Explain why.** Convert frustrated feedback into transmitted understanding. Rigid ALWAYS/NEVER additions are a yellow flag — reframe with reasoning.
- **Bundle repeated work.** If every run wrote a similar helper script, move it into `scripts/` and reference it.

Then rerun everything into `iteration-<N+1>/` (fresh baselines included) and compare. Stop when feedback comes back clean or improvements plateau.

## Description/trigger optimization

Do this last, once the body is stable — a great skill that never triggers is worthless, and one that triggers everywhere is noise.

1. Build ~20 realistic queries, half should-trigger, half should-not:
   ```json
   [
     {"query": "hey can you pull last week's campaign numbers into a summary for my standup", "should_trigger": true},
     {"query": "summarize this PDF my accountant sent me", "should_trigger": false}
   ]
   ```
   The valuable negatives are *near-misses* — adjacent domains, shared keywords, cases where another skill should win. Obviously-irrelevant negatives test nothing. Realistic positives include casual phrasing, typos, and requests that never name the skill. Note that trivial one-step queries rarely trigger any skill regardless of description — make queries substantive.
2. Have the user review the query set.
3. Test triggering (multiple runs per query — triggering is stochastic), revise the description toward what failed, re-test. Hold out a few queries from revision decisions to avoid overfitting the description.
4. Show before/after description and scores; update the frontmatter.

If working inside Claude Code with the built-in `skill-creator` skill available, its `scripts/run_loop.py` automates this step — prefer it over hand-rolling.
