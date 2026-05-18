# Agent guide

Agent-facing entry point. Optimize edits here for agent consumption — facts, tables, commands; not prose.

## Toolchain

- pnpm + workspaces (never `npm`/`yarn` — silently breaks docs build)
- Node ≥22.12
- Bootstrap if missing: `corepack enable && corepack prepare pnpm@latest --activate`
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

## Hard rules

- Never write to `public/docs/` by hand — owned by `build:docs`, `rm -rf`'d each build, gitignored.
- User-written links in MDX don't get `base` prefix. Use Starlight slug links or write `/docs/...` explicitly.
- `starlight/package.json#name` is `starlight-docs` — the `pnpm --filter` handle. Don't rename.
