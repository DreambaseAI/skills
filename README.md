# Dreambase Skills

Agent skills for Dreambase, following [Anthropic's agent skill format](https://code.claude.com/docs/en/skills). Every skill in this repo is prefixed with `dreambase-`.

## Skills

| Skill | What it does |
|---|---|
| [`dreambase-echarts`](skills/dreambase-echarts/) | Author Apache ECharts option JSON for the Dreambase renderer — includes an offline option-schema lookup CLI and a structural config validator |
| [`dreambase-visualization-design`](skills/dreambase-visualization-design/) | Design, critique, and improve charts, dashboards, and infographics using evidence-based visualization, perceptual, accessibility, and integrity principles |
| [`dreambase-skill-creator`](skills/dreambase-skill-creator/) | Meta-skill for contributors: the standards, template, validator, and eval loop for building skills in this repo |

### dreambase-echarts

```bash
npx skills add DreambaseAI/skills --skill dreambase-echarts
```

### dreambase-visualization-design

```bash
npx skills add DreambaseAI/skills --skill dreambase-visualization-design
```

The two pair intentionally: `dreambase-visualization-design` decides *what* to build and why; `dreambase-echarts` builds and validates the config.

## Repository structure

```
skills/
├── dreambase-skill-creator/   # Meta-skill: how to build skills for this repo
│   ├── SKILL.md
│   ├── references/            # Full spec + eval-loop docs
│   ├── scripts/               # validate-skill.mjs linter
│   └── assets/skill-template/ # Starter template for new skills
└── dreambase-<name>/          # One directory per skill
    ├── SKILL.md               # Required: frontmatter + instructions
    ├── scripts/               # Optional: executable helpers
    ├── references/            # Optional: docs loaded on demand
    ├── assets/                # Optional: templates, files used in output
    └── evals/evals.json       # Test prompts + assertions (committed)
```

## Using these skills

Copy a skill directory into your Claude Code skills folder:

```bash
# Per-user (available in every project)
cp -r skills/dreambase-<name> ~/.claude/skills/

# Per-project
cp -r skills/dreambase-<name> <your-project>/.claude/skills/
```

Or install with the [skills CLI](https://github.com/vercel-labs/skills):

```bash
# Interactive — pick from the repo's skills
npx skills add DreambaseAI/skills

# See what's available without installing
npx skills add DreambaseAI/skills --list

# Install specific skills by name (see per-skill commands in the catalog above;
# repeat --skill to install several at once)
npx skills add DreambaseAI/skills --skill <name> --skill <name>

# Or point at one skill's directory directly
npx skills add https://github.com/DreambaseAI/skills/tree/main/skills/dreambase-echarts

# Everything, no prompts
npx skills add DreambaseAI/skills --all
```

When working inside this repo, all skills are auto-discovered via the `.claude/skills` symlink, so you can test them in place.

## Creating a new skill

1. Open this repo in Claude Code and say what skill you want to build — the `dreambase-skill-creator` skill will guide the process (draft → test → evaluate → iterate).
2. Or start manually: copy `skills/dreambase-skill-creator/assets/skill-template/` to `skills/dreambase-<name>/` and edit.

Before committing, validate:

```bash
node skills/dreambase-skill-creator/scripts/validate-skill.mjs skills/dreambase-<name>
# or validate everything:
node skills/dreambase-skill-creator/scripts/validate-skill.mjs --all
```

## Conventions

- **Naming**: directory name = frontmatter `name` = `dreambase-<kebab-case>`.
- **SKILL.md** stays under ~500 lines; push detail into `references/`.
- **Descriptions** state what the skill does *and* when to trigger it (be generous with trigger phrases — models under-trigger).
- **Eval prompts** live in `evals/evals.json` and are committed; run outputs (`*-workspace/` directories) are gitignored.
- **Scripts** are Node-first: zero-dependency `.mjs` (Node built-ins only) or POSIX shell. We're a Node/Next.js shop and Node is guaranteed everywhere our skills run.

See `skills/dreambase-skill-creator/` for the full standards.
