# Agent Skill Specification

The full format reference for skills in this repo. Read this when authoring or reviewing a SKILL.md.

## Contents

1. [Frontmatter fields](#frontmatter-fields)
2. [Progressive disclosure in depth](#progressive-disclosure-in-depth)
3. [Bundled resources](#bundled-resources)
4. [Domain organization](#domain-organization)
5. [Writing patterns](#writing-patterns)
6. [Anti-patterns](#anti-patterns)

## Frontmatter fields

```yaml
---
name: dreambase-example
description: What it does + when to use it. The primary triggering mechanism.
---
```

| Field | Required | Rules |
|-------|----------|-------|
| `name` | yes | Kebab-case, `dreambase-` prefix, identical to the directory name. Max 64 chars. |
| `description` | yes | ≤1024 chars. Contains both *what* and *when*. No line breaks needed; a single flowing sentence-or-three works best. |
| `compatibility` | no | Only when the skill needs specific tools or dependencies (e.g., "Requires Bash, Python 3.10+"). Rarely needed. |

Everything else — output formats, workflow steps, examples — goes in the body, never the frontmatter.

## Progressive disclosure in depth

Skills are cheap when idle and rich when active because of three loading levels:

| Level | What | When in context | Budget |
|-------|------|-----------------|--------|
| 1 | `name` + `description` | Always (every conversation) | ~100 words |
| 2 | SKILL.md body | When the skill triggers | <500 lines |
| 3 | `references/`, `scripts/`, `assets/` | Only when the model reads/runs them | Unlimited |

Design implications:

- Every word in the description is paid for in *every* conversation. Make each one earn its place.
- The body is paid for on every trigger. If a section only matters for one sub-use-case, move it to `references/` and leave a one-line pointer: "For X, read `references/x.md`."
- Reference files over ~300 lines get a table of contents at the top so the model can jump instead of reading linearly.
- Scripts execute without being read — a 1,000-line bundled script costs zero context if the skill just says to run it.

## Bundled resources

**`scripts/`** — executable code for steps that are deterministic, repetitive, or error-prone when improvised. If test runs show the model writing the same helper script each time, that script belongs here. Include a usage line in SKILL.md (`node scripts/foo.mjs <input>`), and make scripts fail loudly with actionable error messages — the model will read stderr and self-correct.

Dreambase scripts are Node-first: zero-dependency `.mjs` files using only Node built-ins, or POSIX shell for simple glue. A script that needs `npm install` before it runs will break in fresh environments — if a dependency is truly unavoidable, vendor it or document it in `compatibility`.

**`references/`** — documentation loaded on demand: API references, format specs, per-domain guides, long examples. Name files by topic so the pointer in SKILL.md is self-explanatory.

**`assets/`** — files used in *outputs* rather than read for understanding: document templates, boilerplate directory trees, fonts, images.

**`evals/`** — this repo's convention (not part of Anthropic's core spec): committed test prompts and assertions in `evals.json`. See `eval-loop.md`.

## Domain organization

When one skill covers multiple variants (providers, frameworks, output formats), keep the shared workflow in SKILL.md and split variant detail into one reference file each:

```
dreambase-deploy/
├── SKILL.md            # workflow + how to choose the variant
└── references/
    ├── vercel.md
    ├── cloudflare.md
    └── aws.md
```

The model reads only the file for the variant in play. This keeps level 2 small no matter how many variants accumulate.

If variants share almost nothing, consider separate skills instead — a description that tries to cover unrelated jobs triggers poorly for all of them.

## Writing patterns

**Imperative voice.** "Run the validator before committing" — not "you should" or "the model will".

**Explain why.** Compare:

> NEVER use pandas.

> Avoid pandas here: the input files exceed memory on typical runners, so stream with the csv module instead.

The second survives contact with novel situations; the first gets ignored or misapplied the moment the context shifts.

**Exact output formats.** When format matters, show the literal template:

```markdown
## Report structure
Use this exact template:
# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Input→output examples.** For anything pattern-based (naming, message formats, transforms), one or two concrete examples beat paragraphs of description:

```markdown
**Example:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

**Pointers with conditions.** Every reference file mention says *when* to read it: "Before running evals, read `references/eval-loop.md`" — not a bare file list.

## Anti-patterns

- **Kitchen-sink SKILL.md** — a 900-line body that should be 150 lines plus three reference files.
- **"When to use" in the body** — triggering is decided from the description alone; guidance buried in the body can't influence it.
- **Overfit instructions** — rules that encode the quirks of the three examples you tested on ("if the file is named Q4_final.xlsx…"). Find the general principle.
- **ALL-CAPS rule stacking** — a wall of MUST/NEVER with no reasoning. If a rule matters, its reason fits in the same sentence.
- **Surprising behavior** — a skill's effects should match what its description promises. No hidden side effects, no network calls or file writes the user wouldn't expect from the description.
- **Duplicated context** — repeating what's already in every skill (repo conventions, shared Dreambase context) instead of pointing at the shared source.
