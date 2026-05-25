---
title: Cloudflare Pages configuration
description: How ui.plan.ai is built and served on Cloudflare Pages — settings, Node version, build commands, headers, redirects, preview deploys, and troubleshooting.
sidebar:
  order: 7
stability: stable
last_synced_with: "2026-05-22-perplexity-v1-setup"
---

ui.plan.ai is a fully static site served by Cloudflare Pages. The CF project is connected to GitHub and rebuilds on every push to a deployment branch.

Cloudflare Pages is the production host for the public site at `ui.plan.ai`, but nothing in this repo depends on it — `pnpm build` emits a portable `dist/` that any static host can serve. For self-hosting elsewhere (Netlify, Vercel, S3 + CloudFront, GitHub Pages, Nginx, …), see [Self-hosting on any static host](/reference/static-hosting/).

## Project settings

These live in the Cloudflare dashboard, not in the repo. There is no `wrangler.toml`.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Preview branch | `preview` (only this branch is configured for preview deploys) |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Framework preset | None (custom build) |
| Node version | from `.node-version` (auto-detected) |
| Environment variables | none |
| Build comments on PRs | enabled |

`pnpm` itself comes from `packageManager` in the root `package.json` via Corepack. Cloudflare Pages honors that field, so the version pin is `pnpm@11.1.2` and lives in code, not in the dashboard.

## Node version

The repo pins Node `24.15.0` in `.node-version`. CF Pages reads this file automatically. Bumping Node means editing `.node-version`, not a dashboard setting.

The current pin (`24.15.0`) was chosen to satisfy `pnpm@11.1.2`'s engine requirement. Older pins (≤22.12) fail the install with `Unsupported engine` on CF Pages.

## Build pipeline

`pnpm build` runs two Astro builds in order:

1. `pnpm --filter starlight-docs build` → emits `starlight/dist/`.
2. `rm -rf public/docs && cp -R starlight/dist public/docs` → stages the docs into the main app's `public/docs/`.
3. `astro build` (root) → sweeps `public/` (including the staged `public/docs/`) into `dist/`.

The result: a single `dist/` tree, with the main app at `/` and Starlight docs at `/docs/*`. CF Pages serves `dist/` directly. No CF rewrites or Workers are involved.

## Headers

`public/_headers` is the source of truth for response headers. The root `astro build` copies it into `dist/_headers`; CF Pages reads it from build output.

Current baseline:

- Global `/*` — `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a deny-all `Permissions-Policy` for sensors and payments, and `Cross-Origin-Opener-Policy: same-origin`.
- Long-lived caches on content-hashed paths — `/_astro/*`, `/docs/_astro/*`, `/docs/pagefind/*` get `public, max-age=31536000, immutable`.
- Favicons — 1-day cache with `must-revalidate` (not content-hashed, may swap).

**No CSP yet.** Starlight inlines styles and scripts, so adding one needs deliberate per-directive tuning before it ships.

Editing rule: change `public/_headers` directly. **Never** put it in `public/docs/` — that directory is owned by `build:docs` and wiped on every build.

## Redirects

`public/_redirects` is the source of truth for server-side redirects. Only one rule today:

```text
/docs    /docs/start-here/welcome/    301
/docs/   /docs/start-here/welcome/    301
```

A second layer exists in `starlight/astro.config.mjs` (`redirects: { '/': '/docs/start-here/welcome/' }`). That emits a meta-refresh HTML page so `astro preview` and any build path that bypasses `_redirects` still redirects. The two layers must stay in sync.

For the `/docs/` redirect to fire, `starlight/src/content/docs/` must have **no** `index.md` — Astro's file-based routes take precedence over `redirects:` config.

## `site:` URL

Both `astro.config.mjs` files set `site: 'https://ui.plan.ai'`. This drives sitemap absolute URLs and Starlight's canonical link tags. If the production domain changes, update both configs, the README, and the deployment skill in the same commit.

## Sitemap & robots

- Starlight emits `sitemap-index.xml` at `/docs/sitemap-index.xml` (because `base: '/docs'`).
- `public/robots.txt` allows all and references that sitemap. Submit to Google Search Console at the sitemap URL.
- There is no root sitemap. If the main app gains real content, add one and extend `robots.txt` with a second `Sitemap:` line.

## Trailing slashes

Both Astro configs use `trailingSlash: 'always'` + `build.format: 'directory'`. The build emits `page/index.html` files; Astro generates URLs with a trailing slash.

CF Pages serves `page/index.html` for both `/page` and `/page/` by default. If you want a 301 from no-slash to slash for cross-domain links, set CF dashboard → **Custom Pages settings → Trailing slash → Always add**. Not currently set.

All redirect destinations and `_redirects` rows must end with a slash for page paths. File paths (`.svg`, `.ico`, `.xml`, `_astro/*.css`) must not.

## Preview deploys

Only the `preview` branch deploys to a CF preview URL. Other feature branches do **not** trigger CF builds, by design — feature branch pushes don't burn CF deploy minutes.

To preview-deploy a feature branch: push it (force is allowed; `preview` is disposable) into `preview`, e.g. `git push origin my-branch:preview --force`. CF rebuilds and the preview URL updates within ~1–2 minutes. See the `branch-pr-workflow` skill for the full procedure.

If you need preview deploys on other branches (rare), enable them in **CF dashboard → Pages project → Settings → Builds & deployments → Preview deployments**.

## Pre-merge gate

There is no GitHub Actions CI on this repo. The pre-merge gate is local:

```sh
pnpm check && pnpm build
```

CF Pages itself rebuilds on every push to `main` and `preview`, so a successful local build plus a green CF build on merge is the deploy signal. Watch the **Deployments** tab on the CF project page after merging.

## Troubleshooting

### Build fails with `Unsupported engine` on CF Pages

The Node version in `.node-version` is older than `pnpm`'s required engine. Bump the pin. The current floor is Node `24.15.0` for `pnpm@11.1.2`.

### `pnpm: command not found` on CF Pages

`packageManager` in the root `package.json` was removed or malformed. CF Pages uses Corepack to install pnpm from that field; restore it (`"packageManager": "pnpm@11.1.2"`).

### Docs are missing at `/docs/` after deploy

`build:docs` failed silently or `public/docs/` was never staged. Repro locally with `pnpm build` and check that `dist/docs/index.html` exists. The most common cause is using `npm` or `yarn` instead of `pnpm` — workspaces only resolve under pnpm here.

### Header or redirect changes didn't take effect

`_headers` and `_redirects` must live in **root** `public/`, not `public/docs/`. The `build:docs` step wipes `public/docs/` every build. Verify the file lands in `dist/_headers` (or `dist/_redirects`) after build.

### Stale assets after deploy

`/_astro/*` and `/docs/_astro/*` are content-hashed and immutable for one year. Hard refresh in the browser, or check that the new HTML references new hashed filenames. If the HTML still points at old hashes, the build output is stale — re-run the deploy.

### `astro preview` redirects locally but CF Pages doesn't

`astro preview` honors Starlight's `redirects:` config (meta-refresh HTML). CF Pages reads `_redirects` for server-side 301s. If only the local preview redirects, check that `dist/_redirects` exists and contains the rule — that's what CF actually serves.

### CF Pages build succeeds but the site 404s

Verify **Build output directory** in the CF dashboard is `dist`, not `public` or `starlight/dist`. The merged build output lives in `dist/`.

## Absent by design

- No CF Workers, no SSR, no CF Functions — fully static.
- No `wrangler.toml` — CF Pages config lives in the dashboard.
- No env-based config switching.
- No GitHub Actions build — CF Pages covers it. See [`Branch & PR workflow`](/process/promotion-workflow/) for the merge gate.
