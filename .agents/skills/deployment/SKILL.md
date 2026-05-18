---
name: deployment
description: How this repo is built and served in production (Cloudflare Pages). Read before changing build output, scripts, Node/pnpm version, redirects, headers, or the `site` URL.
---

# Deployment

Cloudflare Pages, GitHub-connected. CF watches `main` and rebuilds on push.

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

## How dual-build is served

CF serves `dist/` at the domain root. `build:docs` copies Starlight output into `public/docs/` *before* the root `astro build`, so `dist/docs/*` exists and serves at `/docs/*`. No CF rewrites needed.

## Headers / redirects

CF Pages reads `_headers` and `_redirects` from the build output if present. To add either:

- For the main app → put in root `public/` (gets copied to `dist/`).
- **Never put in `public/docs/`** — owned by `build:docs`, wiped each build.

None today.

## `site:` URL

Set in both `astro.config.mjs`s as `https://ui.plan.ai`. Drives sitemap URLs and Starlight's canonical link tags. If the domain changes, update both + the README + this skill.

## Sitemap

Starlight generates `sitemap-index.xml` at `/docs/sitemap-index.xml` (because `base: '/docs'`). Submit to Search Console at that URL; or later add a root `sitemap.xml` and reference it from `robots.txt`. Neither exists yet.

## Absent by design

- No SSR / no CF Functions — fully static.
- No `wrangler.toml` — CF Pages config lives in the dashboard.
- No preview-branch deploys (toggle in dashboard if needed).
- No env-based config switching.
