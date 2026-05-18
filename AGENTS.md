# Agent guide

This file is the entry point for AI coding agents (Claude Code, Cursor, Codex, etc.) working in this repo.

## Project shape

Two Astro projects in one pnpm workspace, sharing a domain but not a build:

- **Main app** — repo root, served at `ui.plan.ai/`, dev port `:4321`
- **Starlight docs** — `starlight/` subdir, served at `ui.plan.ai/docs/`, dev port `:4322`

Docs are built first into `starlight/dist/`, copied to `public/docs/`, then the main app's build sweeps that into `dist/docs/` — final artifact is a single merged `dist/`.

## Common commands

```bash
pnpm install      # one install at root sets up both workspace packages
pnpm dev          # runs main app + docs concurrently
pnpm build        # docs → main, ordered; produces merged dist/
pnpm preview      # serves merged dist/
```

For working on a single side:

```bash
pnpm dev:app      # main app only (:4321)
pnpm dev:docs     # Starlight only (:4322/docs/)
pnpm build:app    # main app only
pnpm build:docs   # Starlight build + copy into public/docs
```

## Detailed skills

Deeper guidance lives in `.agents/skills/`. Read the relevant `SKILL.md` before doing non-trivial work in that area:

- [`.agents/skills/docs-architecture/SKILL.md`](.agents/skills/docs-architecture/SKILL.md) — full file layout, build pipeline, gotchas (base-prefix on user links, outDir image-cache bug, pnpm workspace plumbing), and how to add content to either project.

## Conventions

- Adding docs content → drop `.md`/`.mdx` in `starlight/src/content/docs/`. Directory structure becomes the URL path (relative to `/docs/`).
- Adding main-app pages → drop `.astro`/`.md`/`.mdx` in `src/pages/`.
- **Never write to `public/docs/` by hand** — it's owned by `build:docs` and `rm -rf`'d on every build. It's gitignored.
- User-written links in MDX (e.g. `link: /guides/example/`) do **not** get auto-prefixed with `/docs`. Either use Starlight's slug-based linking or include `/docs/` explicitly.
