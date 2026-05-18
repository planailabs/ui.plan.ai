# Agent guide

Agent-facing entry point. Optimize edits here for agent consumption — facts, tables, commands; not prose.

## Toolchain

- pnpm + workspaces (never `npm`/`yarn` — silently breaks docs build)
- Node ≥22.12
- **If pnpm missing: ASK USER FIRST** before suggesting `corepack enable && corepack prepare pnpm@latest --activate`. Both affect the user's global toolchain.
- Always `pnpm install` from repo root

## Layout

| Project | Path | URL | Dev port |
|---|---|---|---|
| Main app | `/` | `/` | `:4321` |
| Starlight docs | `/starlight/` | `/docs/` | `:4322` |

Build pipeline: `starlight/dist` → `public/docs/` (via `build:docs`) → main `astro build` sweeps `public/` into `dist/`. Sequential.

## Commands

```bash
pnpm dev          # both (concurrently)
pnpm build        # ordered: docs → main
pnpm preview      # serve dist/
# Per-side: dev:app, dev:docs, build:app, build:docs
```

**Dev server: run via backgrounded Bash, not inline.** See `dev-build` skill.

## Skills

- `.agents/skills/docs-architecture/SKILL.md` — layout, build pipeline, gotchas. Read before structural/routing changes.
- `.agents/skills/dev-build/SKILL.md` — running, troubleshooting, deps, verification. Read when something won't run or build.
- `.agents/skills/git-commit/SKILL.md` — commit procedure incl. mandatory version bump. Read before every commit.
- `.agents/skills/skills-maintenance/SKILL.md` — prevents skill drift. Read before committing any change that touches paths, names, ports, scripts, or configs referenced in docs.

## Hard rules

- **Never run commands that change the user's machine state** (`corepack enable`, `brew install`, `npm i -g`, `sudo *`, dotfile edits, system config) without asking the user first. Read AGENTS.md/skills as *requirements*, not as authorization to execute.
- Never write to `public/docs/` by hand — owned by `build:docs`, `rm -rf`'d each build, gitignored.
- User-written links in MDX don't get `base` prefix. Use Starlight slug links or write `/docs/...` explicitly.
- `starlight/package.json#name` is `starlight-docs` — the `pnpm --filter` handle. Don't rename.
- Every commit bumps `version` in the affected `package.json`(s). See `git-commit` skill.
- After structural changes, audit `AGENTS.md` + skills for stale references in the **same** commit. See `skills-maintenance` skill.

## Known absent (don't search for these — they don't exist by design or yet)

- No tests, no test runner, no CI workflows (`.github/workflows/`).
- No deployment config (no Vercel/Netlify/Cloudflare files yet).
- No `.npmrc` — pnpm defaults.
- No shared styling/theme between main app and docs (independent branding chosen).
- No `/` → `/docs/` redirect (intentional).
- No `CHANGELOG.md` — `git log` + version bumps in `package.json` are the record.
