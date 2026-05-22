# ui.plan.ai

Public site and documentation for `ui.plan.ai` — the next evolutionary step of the [plan.ai/ui](https://plan.ai/ui/) proof of concept, moving from a static archive into a Supabase-backed platform for agent-generated UI streams.

This repo is the static frontend: a marketing/home surface and the Starlight docs that explain the V1 platform. It does not include the Supabase project, the Agent API, or the workbench runtime — those are tracked under the V1 plan in the docs.

The build output is a plain static `dist/` directory. **No Supabase, Cloudflare, or other backend credentials are required** to clone, run, build, preview, or self-host this site — anywhere that can serve static files works.

## Prerequisites

- **Node ≥ `24.15.0`** (pinned in `.node-version`; Cloudflare Pages reads the same file).
- **pnpm `11.1.2`**, pinned via `packageManager` in the root `package.json`. The simplest way to get the right version is Corepack:
  ```sh
  corepack enable
  corepack prepare pnpm@11.1.2 --activate
  ```
  `npm` and `yarn` are not supported and will silently break the docs build.
- Git.

## Quick start

```sh
git clone https://github.com/101design/ui.plan.ai.git
cd ui.plan.ai
pnpm install        # one install at the root sets up both projects
pnpm dev            # main app on :4321, docs on :4322/docs/
```

Open `http://localhost:4321/` for the main app and `http://localhost:4322/docs/` for the docs (the docs route under the main app at `:4321/docs/` is whatever was last built — use `:4322/docs/` for live editing).

## Local development

```sh
pnpm dev            # both projects, concurrently
pnpm dev:app        # main app only
pnpm dev:docs       # Starlight docs only
pnpm check          # astro check on both projects (pre-merge gate)
pnpm build          # ordered: docs → main; produces dist/
pnpm preview        # serves the merged dist/
```

Add dependencies with `pnpm add <pkg>` (main app) or `pnpm --filter starlight-docs add <pkg>` (Starlight). Always run `pnpm install` from the repo root.

## Deploying

`pnpm build` produces a self-contained `dist/` that any static host can serve. The main app lives at `/`, the docs at `/docs/`. There is no SSR and no server-side runtime.

### Any static host (Netlify, Vercel, S3 + CloudFront, GitHub Pages, Nginx, etc.)

1. Build locally (or in your host's CI):
   ```sh
   pnpm install
   pnpm build
   ```
2. Upload the contents of `dist/` to the host's web root. Configure:
   - **Publish/output directory:** `dist`
   - **Build command** (if the host builds for you): `pnpm build`
   - **Node version:** read from `.node-version` (`24.15.0`)
   - **Package manager:** pnpm via Corepack (set `packageManager` in `package.json`, which is already there)
3. Ensure the host honors **directory-style URLs with trailing slashes**: requests for `/foo/` must serve `/foo/index.html`. Most static hosts do this by default. The build emits `page/index.html` files, so `trailingSlash: 'always'` is already wired in both Astro configs.
4. Add the equivalent of `public/_redirects` to your host so `/docs` and `/docs/` 301 to `/docs/start-here/welcome/`. Cloudflare and Netlify read `_redirects` natively; for Nginx/Apache/CDN setups, translate the two rules in [`public/_redirects`](./public/_redirects). The Starlight build also emits a meta-refresh HTML fallback at `/docs/index.html`, so the redirect still works if your host can't serve `_redirects`.
5. (Optional) Apply the security and caching headers in [`public/_headers`](./public/_headers). Cloudflare and Netlify read it natively; other hosts need an equivalent in their own header/CDN config.
6. If you serve from a different origin, change `site:` in both `astro.config.mjs` and `starlight/astro.config.mjs` (drives sitemap absolute URLs and Starlight's canonical links), then rebuild.

### Cloudflare Pages (production)

This is how `ui.plan.ai` itself is hosted. Connect the GitHub repo and set:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Preview branch | `preview` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | from `.node-version` (auto-detected) |
| Environment variables | none |

pnpm itself is installed by Cloudflare Pages via Corepack from `packageManager` in the root `package.json`. `_headers` and `_redirects` are read directly from `dist/`. Full reference (headers detail, sitemap, preview-deploy mechanics, troubleshooting): [`/docs/reference/cloudflare-pages/`](https://ui.plan.ai/docs/reference/cloudflare-pages/).

### Branch policy

- **`main` is protected.** Never push to it directly. Changes ship via feature branch → PR → **rebase merge** to `main`.
- **`preview`** is a disposable scratch branch wired to the Cloudflare Pages preview URL. Force-push your feature branch into it to deploy a preview: `git push origin <branch>:preview --force`. Never merge `preview` into `main`.
- Branch names: `<type>/<slug>` matching Conventional Commit types (`feat/`, `fix/`, `docs/`, …). Each commit is Conventional Commits + a `package.json` version bump (rebase merge preserves every commit on `main`).

### Pre-merge check

There is no GitHub Actions CI on this repo. The pre-merge gate is local:

```sh
pnpm check && pnpm build
```

Cloudflare Pages rebuilds *after* merge to `main` (production) or push to `preview` (preview URL) — that's the only build pipeline.

## Troubleshooting

- **`pnpm: command not found`** — enable Corepack: `corepack enable && corepack prepare pnpm@11.1.2 --activate`. `npm` and `yarn` are not supported and will silently break the docs build.
- **`Unsupported engine` during install** — your Node is older than `24.15.0`. Install/switch via nvm, fnm, asdf, or your OS package manager; the pin lives in `.node-version`.
- **`/docs/` 404s after deploy** — `build:docs` ran but `public/docs/` wasn't included in `dist/`. Re-run `pnpm build` locally and confirm `dist/docs/index.html` exists. Most common cause: using `npm`/`yarn` instead of `pnpm`.
- **`/docs/` doesn't redirect to the welcome page** — your host isn't serving `_redirects`. Either configure the redirect in the host's native format, or rely on the meta-refresh fallback Starlight emits at `dist/docs/index.html`.
- **Pages render but internal links 404** — `site:` in one of the `astro.config.mjs` files doesn't match the served origin, or your host strips trailing slashes. Fix `site:` and ensure the host preserves directory URLs.
- **Stale assets after redeploy** — `/_astro/*` and `/docs/_astro/*` are content-hashed and immutable for one year. Hard-refresh; if the HTML still points at old hashes, the deploy didn't pick up the new build.

## Detailed docs

The Starlight docs site is the canonical reference. Operational entry points:

- [Cloudflare Pages configuration](starlight/src/content/docs/reference/cloudflare-pages.md) — project settings, Node version, build pipeline, headers, redirects, preview deploys, troubleshooting. Live: [`/docs/reference/cloudflare-pages/`](https://ui.plan.ai/docs/reference/cloudflare-pages/).
- [Self-hosting on any static host](starlight/src/content/docs/reference/static-hosting.md) — generic-host deploy recipe: settings, redirect/header translations for Netlify, Vercel, Nginx, Apache, CloudFront, GitHub Pages. Live: [`/docs/reference/static-hosting/`](https://ui.plan.ai/docs/reference/static-hosting/).
- [Supabase setup](starlight/src/content/docs/reference/supabase-setup.md) — project setup, env vars, auth and data assumptions, storage layout, realtime, edge functions, setup checklist. Live: [`/docs/reference/supabase-setup/`](https://ui.plan.ai/docs/reference/supabase-setup/).
- [Welcome](starlight/src/content/docs/start-here/welcome.md) — product direction and how the docs are organized.
- [Platform architecture](starlight/src/content/docs/foundations/platform-architecture.md) — the Supabase / Cloudflare / Astro split.
- [Supabase SQL plan](starlight/src/content/docs/specifications/supabase-sql.md) — tables, enums, RLS, indexes for V1.
- [Auth & sessions](starlight/src/content/docs/v1-plan/auth-and-sessions.md) — browser auth and session rules.
- [API reference](starlight/src/content/docs/api-reference/index.md) — Agent API surface.
- [V1 plan](starlight/src/content/docs/v1-plan/scope.md) — what ships first.

## For coding agents

Read [`AGENTS.md`](./AGENTS.md) first — it's the agent-optimized entry point (toolchain, layout table, hard rules). Then load the skill that matches your task from [`.agents/skills/`](.agents/skills/):

| When you're about to… | Read |
|---|---|
| Start a branch, open a PR, push to `preview` | [`branch-pr-workflow`](.agents/skills/branch-pr-workflow/SKILL.md) |
| Run, troubleshoot, or change deps | [`dev-build`](.agents/skills/dev-build/SKILL.md) |
| Commit (mandatory version bump) | [`git-commit`](.agents/skills/git-commit/SKILL.md) |
| Touch routing, build pipeline, or layout | [`docs-architecture`](.agents/skills/docs-architecture/SKILL.md) |
| Change build output, Node/pnpm version, headers, redirects | [`deployment`](.agents/skills/deployment/SKILL.md) |
| Move/rename anything `AGENTS.md` references | [`skills-maintenance`](.agents/skills/skills-maintenance/SKILL.md) |

V1 doesn't use named "council" voices — it uses concrete agent **producer roles** carried as metadata on submissions and events: *frame producer*, *review assistant*, *media processor*, and (V2) *generation service*. See [Agent roles](./starlight/src/content/docs/reference/agent-roles.md).

---

## Repo layout

Two Astro projects in one pnpm workspace:

- **Main app** (`/`) — served at `ui.plan.ai/`
- **Starlight docs** (`starlight/`) — served at `ui.plan.ai/docs/`

The main app's `astro build` sweeps the docs build into a single merged `dist/`.
