---
name: deployment
description: How this repo is built and served in production (Cloudflare Pages). Read before changing build output, scripts, Node/pnpm version, redirects, headers, or the `site` URL.
---

# Deployment

Cloudflare Pages, GitHub-connected.

- **Production**: CF deploys `main` to `ui.plan.ai`.
- **Preview**: CF deploys the `preview` branch to a preview URL. Use only when you need to visually/manually verify a change before opening the PR — push your feature branch into `preview` (force-allowed; it's disposable). See `branch-pr-workflow` skill.
- Other branches are *not* configured for preview deploys (set in CF dashboard) so feature branches don't burn deploy minutes.

## CF Pages dashboard settings (not in repo)

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | from `.node-version` (auto) |
| Env vars | none |

`pnpm` version comes from `packageManager` in root `package.json` via Corepack (CF Pages honors it).

Future V1 backend credentials are not needed for the static shell. Public browser env placeholders live in `env.example`; server-only Supabase and Cloudflare secrets belong in Supabase Edge Function secrets or deployment dashboards.

## How dual-build is served

CF serves `dist/` at the domain root. `build:docs` copies Starlight output into `public/docs/` *before* the root `astro build`, so `dist/docs/*` exists and serves at `/docs/*`. No CF rewrites needed.

## Headers / redirects

CF Pages reads `_headers` and `_redirects` from build output if present. Source lives in root `public/` (copied to `dist/` by main `astro build`). **Never put in `public/docs/`** — owned by `build:docs`, wiped each build.

Current: `/docs` and `/docs/` 301 → `/docs/start-here/welcome/`. Implemented in two layers:
- `public/_redirects`: CF Pages server-side 301 (no flash in prod).
- Starlight `redirects: { '/': '/docs/start-here/welcome/' }`: meta-refresh HTML for `astro preview` and as a fallback.

There is no `index.md` in `starlight/src/content/docs/` — Astro file-based routes take precedence over `redirects:` config, so the file's absence is required for the redirect to fire. No `_headers` today.

## Trailing slashes

Both Astro configs set `trailingSlash: 'always'` + `build.format: 'directory'`. The build emits `page/index.html` files and Astro generates URLs with a trailing slash. CF Pages defaults to serving `page/index.html` for both `/page` and `/page/`; if cross-domain links arrive without slashes and you want a 301 instead of silent serve, set CF dashboard → Trailing slash → "Always add". Not currently set.

## `site:` URL

Set in both `astro.config.mjs`s as `https://ui.plan.ai`. Drives sitemap URLs and Starlight's canonical link tags. If the domain changes, update both + the README + this skill.

## Sitemap & robots

- The root Astro app emits `/sitemap.xml` for home, stream index, and pre-rendered public stream fixture routes.
- Starlight generates `sitemap-index.xml` at `/docs/sitemap-index.xml` (because `base: '/docs'`).
- `public/robots.txt` allows all and references both the root sitemap and docs sitemap. Submit both sitemap URLs to Search Console.

## Absent by design

- No SSR / no CF Functions — fully static.
- Dynamic V1 product data is expected to come from browser Supabase clients plus Supabase Edge Functions behind `api.ui.plan.ai`.
- No `wrangler.toml` — CF Pages config lives in the dashboard.
- No preview-branch deploys (toggle in dashboard if needed).
- No env-based config switching.
