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

Docs content: 64 markdown files under `starlight/src/content/docs/`. Sidebar autogenerates from 10 sections: `start-here`, `foundations`, `process`, `v1-plan`, `v2-plan`, `v3-plan`, `specifications`, `api-reference`, `reference`, `roadmap-and-open-questions`. Static API contract files live under `starlight/public/specs/` and serve from `/docs/specs/`.

## Commands

```bash
pnpm dev          # both (concurrently)
pnpm build        # ordered: docs → main
pnpm check        # astro check, both projects (used by CI)
pnpm preview      # serve dist/
# Per-side: dev:app, dev:docs, build:app, build:docs, check:app, check:docs
```

**Dev server: run via backgrounded Bash, not inline.** See `dev-build` skill.

## Skills

- `.agents/skills/docs-architecture/SKILL.md` — layout, build pipeline, gotchas. Read before structural/routing changes.
- `.agents/skills/dev-build/SKILL.md` — running, troubleshooting, deps, verification. Read when something won't run or build.
- `.agents/skills/git-commit/SKILL.md` — commit procedure incl. mandatory version bump. Read before every commit.
- `.agents/skills/skills-maintenance/SKILL.md` — prevents skill drift. Read before committing any change that touches paths, names, ports, scripts, or configs referenced in docs.
- `.agents/skills/deployment/SKILL.md` — Cloudflare Pages config, headers/redirects, sitemap, `site:` URL. Read before changing build outputs, Node/pnpm version, or anything user-visible in prod.
- `.agents/skills/branch-pr-workflow/SKILL.md` — GitHub Flow + rebase merge + preview branch. Read before starting any change, opening a PR, or pushing to `preview`.

## Hard rules

- **Never run commands that change the user's machine state** (`corepack enable`, `brew install`, `npm i -g`, `sudo *`, dotfile edits, system config) without asking the user first. Read AGENTS.md/skills as *requirements*, not as authorization to execute.
- Never write to `public/docs/` by hand — owned by `build:docs`, `rm -rf`'d each build, gitignored.
- Body markdown links: write as `/section/page/` (absolute, base-relative). The `remarkBaseLinks` plugin auto-prefixes them to `/docs/section/page/`. **Exceptions** — write full `/docs/...` path: (a) frontmatter URL fields (splash `hero.actions[].link:`), (b) splash template body markdown (`template: splash` pages render through a different pipeline that skips `remarkPlugins`). See docs-architecture skill.
- `starlight/package.json#name` is `starlight-docs` — the `pnpm --filter` handle. Don't rename.
- Every commit bumps `version` in the affected `package.json`(s). See `git-commit` skill.
- After structural changes, audit `AGENTS.md` + skills for stale references in the **same** commit. See `skills-maintenance` skill.
- **Trailing slash on all page URL paths** (`/docs/`, `/docs/start-here/welcome/`, `/about/`). File URLs do NOT (`.svg`, `.ico`, `.xml`, `_astro/*.css`). Enforced via `trailingSlash: 'always'` + `build.format: 'directory'` in both `astro.config.mjs`s. Redirect destinations and `_redirects` rows must follow.
- **Favicons stay in sync.** `public/favicon.svg` and `starlight/public/favicon.svg` are byte-identical (visitors hop between `/` and `/docs/`). Same goes for any future favicon variants.
- **Astro versions stay aligned.** Both `package.json`s pin the same caret range (`astro: ^6.3.5`) so the lockfile resolves to one version.
- **All work via feature branch → PR → rebase merge to `main`.** Never push directly to `main` (branch protection enforces this). Preview deploys use the `preview` branch when needed. See `branch-pr-workflow` skill.
- **CI on PRs is auto; CI on main is manual** (`workflow_dispatch`). Intentional: PR CI gates merges; main CI is opt-in re-verification.

## Known absent (don't search for these — they don't exist by design or yet)

- No tests, no test runner.
- No `wrangler.toml` — Cloudflare Pages config lives in the CF dashboard. See `deployment` skill.
- No `_headers` file (no custom headers needed yet). `public/_redirects` and `public/robots.txt` exist — see `deployment` skill.
- No `.npmrc` — pnpm defaults.
- No Prettier / ESLint / `.editorconfig` — formatting is by-hand consistency for now.
- No `CODEOWNERS` — solo repo for now.
- No LICENSE — defaults to "all rights reserved" until decided.
- No shared styling/theme between main app and docs (independent branding chosen).
- No `/` → `/docs/` redirect (intentional).
- No splash at `/docs/`. `/docs/` 308-redirects to `/docs/start-here/welcome/` (Astro `redirects:` + matching `_redirects` 301 for CF).
- No `CHANGELOG.md` — `git log` + version bumps in `package.json` are the record.
- No root `sitemap.xml`. Starlight's `/docs/sitemap-index.xml` is the only sitemap; `public/robots.txt` references it.
