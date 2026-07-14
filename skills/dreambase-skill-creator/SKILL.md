---
name: dreambase-skill-creator
description: Create, improve, and evaluate Dreambase agent skills in the DreambaseAI/skills repo. Use this whenever the user wants to build a new skill, edit or optimize an existing skill, add a skill to this repo, run skill evals, or asks about skill conventions, naming, structure, or the SKILL.md format. Trigger even if they just say "add a skill for X" or "make Claude able to do X" without mentioning skills explicitly.
---

# Dreambase Skill Creator

This repo holds agent skills for Dreambase. This meta-skill encodes the standards every skill here follows and the workflow for building one. The goal: skills that work across thousands of varied prompts, not just the examples they were tested on.

## Repo conventions (non-negotiable)

- Every skill lives at `skills/dreambase-<kebab-case-name>/`.
- The directory name and the frontmatter `name` field are identical, and both carry the `dreambase-` prefix.
- `SKILL.md` is required. `scripts/`, `references/`, `assets/`, and `evals/` are optional.
- Eval prompts (`evals/evals.json`) are committed with the skill. Run outputs (`*-workspace/` directories) are gitignored — never commit them.
- Bundled scripts are Node-first: zero-dependency `.mjs` using only Node built-ins (`node:fs`, `node:path`, `fetch`), or POSIX shell for glue. Dreambase is a Node/Next.js shop, so Node is the runtime we can rely on everywhere these skills run — avoid Python and avoid anything needing an `npm install` at skill runtime.
- Before finishing any skill work, run the validator:
  ```bash
  node skills/dreambase-skill-creator/scripts/validate-skill.mjs skills/dreambase-<name>
  ```

## Anatomy of a skill

```
dreambase-<name>/
├── SKILL.md          # Required: YAML frontmatter + markdown instructions
├── scripts/          # Executable code for deterministic/repetitive steps
├── references/       # Docs loaded into context only when needed
├── assets/           # Templates, fonts, files used in outputs
└── evals/evals.json  # Test prompts + assertions
```

Skills load in three levels (progressive disclosure):

1. **Metadata** (name + description) — always in context. ~100 words max.
2. **SKILL.md body** — loaded when the skill triggers. Keep under ~500 lines.
3. **Bundled resources** — loaded (or executed) only when needed. Unlimited size.

Put in SKILL.md only what every invocation needs. Push per-domain detail, long tables, and API references into `references/` with clear pointers on when to read each file. Scripts can run without ever entering context — prefer a bundled script over instructions the model would re-derive every time.

A fresh skill doesn't need all the directories. Start with just SKILL.md and add resources when testing shows they're needed.

## Writing the description

The description is the *only* thing Claude sees when deciding whether to use the skill, so it does two jobs: what the skill does, and when to use it. Models under-trigger skills, so be generous — list concrete trigger phrases, file types, and situations, including ones where the user doesn't name the skill. Keep it under ~1024 characters.

Weak: `Generates Dreambase reports.`

Strong: `Generate Dreambase analytics reports from campaign data. Use whenever the user mentions reports, campaign performance, exports, or wants to summarize Dreambase data — even if they don't say "report".`

All "when to use" information belongs in the description, not the body — the body isn't loaded until after the triggering decision is made.

## Writing the body

- Use the imperative form ("Run the validator", not "You should run the validator").
- Explain *why* behind each instruction instead of stacking ALL-CAPS MUSTs. Models generalize from reasoning; rigid rules invite brittle, literal compliance. If you find yourself writing ALWAYS/NEVER in caps, reframe with the reason.
- Keep it general. If an instruction only makes sense for the test examples you iterated on, it's overfit — find the underlying principle.
- Define exact output formats with templates when format matters; show 1–2 input→output examples for anything pattern-based.
- If every test run of the skill writes a similar helper script, bundle that script in `scripts/` instead.

Read `references/skill-spec.md` for the full frontmatter spec, domain-organization patterns, and formatting details.

## The build loop

Follow this cycle when creating or improving a skill (full mechanics in `references/eval-loop.md` — read it before running evals):

1. **Interview** — nail down what the skill does, when it triggers, expected outputs, and edge cases before writing anything.
2. **Draft** — copy `assets/skill-template/` to `skills/dreambase-<name>/` and fill it in.
3. **Test** — write 2–3 realistic prompts into `evals/evals.json`, confirm them with the user, then run each prompt twice via parallel subagents: once with the skill, once baseline (without it, or with the old version when improving).
4. **Evaluate** — draft objective assertions while runs execute, grade outputs, and put results in front of the user for qualitative feedback.
5. **Iterate** — generalize from feedback (don't patch in example-specific rules), trim instructions that aren't pulling weight, rerun. Stop when feedback comes back clean.
6. **Optimize triggering** — once the body is stable, test the description against ~20 realistic should-trigger/should-not-trigger queries and refine it.
7. **Validate & ship** — run `scripts/validate-skill.mjs`, then commit the skill with its `evals/`.

## Dreambase-specific context

<!-- TODO: As Dreambase skills accumulate shared context (API endpoints, brand
     voice, product terminology, auth patterns), record it here or in a shared
     references/ file so every new skill inherits it. -->
