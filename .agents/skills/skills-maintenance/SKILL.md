---
name: skills-maintenance
description: Keep AGENTS.md and skills in sync with code. Read before committing any change that touches paths, scripts, ports, names, configs, or workflows referenced in agent docs.
---

# Prevent skill drift

A stale skill is worse than a missing one — the agent treats it as truth.

## Pre-commit audit

```bash
git diff --name-only HEAD
```

For each changed file, check whether docs reference it:

| Changed | Audit |
|---|---|
| `package.json` scripts | `AGENTS.md` commands table, `dev-build` commands |
| `starlight/package.json#name` | `docs-architecture` (pnpm filter handle), `dev-build` (filter examples), `AGENTS.md` hard rules |
| Any `version` in `package.json` | (handled by `git-commit` rule — no skill change) |
| `starlight/astro.config.mjs#server.port` | `AGENTS.md` layout table, `dev-build`, `docs-architecture` key-config |
| `starlight/astro.config.mjs#base` | `docs-architecture` key-config + gotchas, `AGENTS.md` layout URL |
| `outDir` / build settings | `docs-architecture` key-config |
| `pnpm-workspace.yaml#packages` | `docs-architecture` key-config, `AGENTS.md` toolchain |
| Top-level dir add/move/remove | `docs-architecture` Layout tree |
| `.gitignore` rules for `public/docs`/`dist` | `docs-architecture` Layout, `dev-build` Verify |
| Root `package.json` scripts (`dev`, `build:docs`, …) | `AGENTS.md`, `dev-build` |
| `site:` in either `astro.config.mjs` | `deployment` skill, `README.md` |
| `trailingSlash` / `build.format` in either `astro.config.mjs` | `AGENTS.md` hard rule, `deployment` skill |
| `.node-version` / `packageManager` field | `deployment` skill, CI workflow |
| `.github/workflows/*` | Mention in `AGENTS.md` if behavior visible to agents |
| `_headers` / `_redirects` (new) | `deployment` skill |
| `public/robots.txt` | `deployment` skill; sitemap URL inside must match `site:` |
| `public/favicon.svg` ↔ `starlight/public/favicon.svg` | Keep byte-identical (AGENTS.md hard rule) |
| `src/pages/404.astro` (or its removal) | `AGENTS.md` Known-absent section |
| `tsconfig.json` excludes | If a new top-level dir is added, ensure `astro check` doesn't traverse generated content (`public/docs`, `dist`, `starlight`) |
| Astro version range in either `package.json` | Bump both so they resolve to the same version (AGENTS.md hard rule) |
| New convention or non-obvious pattern | Add to relevant skill or create a new one |
| Any file in `.agents/skills/*` | Cross-refs in other skills + `AGENTS.md` pointers |

## Quick stale-value sweep

After updates, run:

```bash
grep -nE '4321|4322|starlight-docs|"/docs"|base:|outDir' AGENTS.md .agents/skills/**/SKILL.md
```

Eyeball: every match should still reflect reality.

## When to create / split / delete

Create a new skill when a top-level concern emerges (deployment, testing, CI, schema migration) **and** it has rules/commands/gotchas not derivable from reading code.

Split when a skill grows past ~80 lines and has two clear concerns.

Delete when its subject is gone — don't leave it "for history".

Don't create when:
- It's a single fact (→ `AGENTS.md` hard rules).
- It's obvious from `git log`, `package.json`, or a config file.

## Hard rule

Audit + update skills **in the same commit** as the structural change. Deferring drift = next agent acts on stale truth.
