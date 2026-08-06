---
name: dreambase-CHANGE-ME
description: >-
  [What this skill does in one sentence.] Use this whenever the user
  [trigger situations: mentions X, works with Y files, asks to Z — include
  phrasings that don't name the skill explicitly].
---

# [Skill Title]

[One short paragraph: what this skill accomplishes and the shape of a good result. Give the model the goal, not just steps.]

## Workflow

1. [First step — imperative voice, with the *why* when it isn't obvious.]
2. [Second step.]
3. [Validate/verify step — how does the model know it succeeded?]

## Output format

[If format matters, show the exact template or a 1–2 line input→output example. Delete this section if output is free-form.]

## Edge cases

[Known failure modes and what to do instead. Delete if none yet — add them as testing reveals them.]

<!--
Authoring checklist (delete before shipping):
- [ ] name matches directory, dreambase- prefixed
- [ ] description covers WHAT + WHEN, generous with triggers
- [ ] body <500 lines; detail pushed to references/
- [ ] repeated helper code moved to scripts/
- [ ] evals/evals.json has 2-3 realistic prompts
- [ ] scripts (if any) are zero-dependency .mjs or POSIX shell
- [ ] passes: node internal/skill-creator/scripts/validate-skill.mjs <this-dir>
-->
