---
title: Self-hosting on any static host
description: How to deploy ui.plan.ai to Netlify, Vercel, S3 + CloudFront, GitHub Pages, Nginx, or any other static host — settings, redirects, headers, gotchas.
sidebar:
  order: 9
stability: stable
last_synced_with: "2026-05-22-perplexity-v1-setup"
---

ui.plan.ai is a fully static site. `pnpm build` emits a self-contained `dist/` directory; any host that serves static files can serve it. This page is the generic-host counterpart to [Cloudflare Pages configuration](/reference/cloudflare-pages/).

## What you're deploying

A single `dist/` tree:

- Main app at `/` (`dist/index.html`, `dist/_astro/*`, …)
- Starlight docs at `/docs/` (`dist/docs/index.html`, `dist/docs/_astro/*`, `dist/docs/pagefind/*`, `dist/docs/sitemap-index.xml`)
- Redirect rules at `dist/_redirects` (Cloudflare/Netlify format)
- `dist/robots.txt`, `dist/favicon.svg`, `dist/favicon.ico`

No SSR, no Workers, no Edge Functions, no environment variables.

## Build settings (any host)

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Output / publish directory | `dist` |
| Root directory | `/` |
| Node version | from `.node-version` (`24.15.0`) |
| Package manager | pnpm via Corepack (already pinned in `packageManager`) |
| Environment variables | none |

If the host doesn't auto-read `.node-version`, set Node `24.15.0` (or newer) explicitly. If it doesn't auto-enable Corepack, prepend the build command with `corepack enable && corepack prepare pnpm@11.1.2 --activate`.

## Trailing slashes

Both Astro configs use `trailingSlash: 'always'` + `build.format: 'directory'`. The build emits `page/index.html`, so the URL space is directory-style.

- Requests for `/foo/` must serve `/foo/index.html` (every static host does this by default).
- Requests for `/foo` (no slash) ideally 301 to `/foo/`. Cloudflare Pages, Netlify, and Vercel do this automatically; for raw Nginx, add `try_files $uri $uri/ =404;` or rewrite to add the slash.

## Redirects

`public/_redirects` (lands in `dist/_redirects` after build) holds the only required redirect:

```text
/docs    /docs/start-here/welcome/    301
/docs/   /docs/start-here/welcome/    301
```

Translation per host:

- **Cloudflare Pages / Netlify** — read `_redirects` natively. Nothing to do.
- **Vercel** — add to `vercel.json`:
  ```json
  {
    "redirects": [
      { "source": "/docs", "destination": "/docs/start-here/welcome/", "permanent": true },
      { "source": "/docs/", "destination": "/docs/start-here/welcome/", "permanent": true }
    ]
  }
  ```
- **Nginx** — in the relevant `server { }` block:
  ```nginx
  location = /docs  { return 301 /docs/start-here/welcome/; }
  location = /docs/ { return 301 /docs/start-here/welcome/; }
  ```
- **Apache / `.htaccess`**:
  ```apache
  RedirectMatch 301 ^/docs/?$ /docs/start-here/welcome/
  ```
- **CloudFront / S3** — use a CloudFront Function on viewer-request, or a redirect rule on the bucket.
- **GitHub Pages** — no native server-side redirects. The Starlight build also emits a meta-refresh HTML fallback at `dist/docs/index.html`, so the redirect still works (with a brief flash) even when `_redirects` is ignored.

## Headers

No root `public/_headers` file is committed today, so there is no portable header policy to translate for other hosts. The site renders as static HTML/CSS/JS without custom headers.

If a headers baseline is added later, Cloudflare Pages and Netlify can read `_headers` natively. Vercel, Nginx, Apache, S3/CloudFront, and other hosts need equivalent native configuration.

## Changing the production origin

If you serve from anything other than `https://ui.plan.ai`, update `site:` in **both** `astro.config.mjs` and `starlight/astro.config.mjs` and rebuild. This drives sitemap absolute URLs and Starlight's canonical `<link>` tags. Also update `public/robots.txt` (which references the sitemap URL).

## Search

The docs site uses Starlight's built-in [Pagefind](https://pagefind.app/) search. The index is generated at build time into `dist/docs/pagefind/` and is fully static — no server-side search infrastructure needed.

## Sitemap & robots

- Starlight emits `dist/docs/sitemap-index.xml` (because `base: '/docs'`).
- `dist/robots.txt` references that sitemap. Submit to Search Console at the sitemap URL after deploy.

There is no root sitemap. If the main app gains real content, add one and extend `robots.txt` with a second `Sitemap:` line.

## Troubleshooting

### `/docs/` returns 404 after deploy

`build:docs` ran but `public/docs/` wasn't included in the upload. Re-run `pnpm build` locally and confirm `dist/docs/index.html` exists. Most common cause: using `npm` or `yarn` instead of `pnpm` — workspaces only resolve under pnpm here.

### `/docs` (no slash) doesn't redirect to the welcome page

Either the host isn't honoring `_redirects` or it strips trailing slashes before applying redirects. Add the rule in the host's native format (see [Redirects](#redirects)). The Starlight meta-refresh at `dist/docs/index.html` is a fallback, not a primary mechanism.

### Internal links 404 in production but work locally

`site:` in one of the `astro.config.mjs` files doesn't match the served origin, or your host is stripping trailing slashes. Fix `site:` and ensure the host serves `page/index.html` for both `/page` and `/page/`.

### Pages load but assets 404 (CSS/JS/images)

The build output wasn't uploaded in full. Re-upload `dist/` recursively. Watch for hosts that skip underscore-prefixed paths (`_astro/` and `_redirects` start with `_` but are real files, not hidden files).

### Future headers don't apply

If a future change adds `_headers`, your host may not read it. Port the rules to the host's native config and verify with `curl -I https://your-domain/` after deploy.

### Stale assets after redeploy

`/_astro/*` and `/docs/_astro/*` are content-hashed and immutable for one year. Hard-refresh the browser; if the HTML still references old hashes, the deploy didn't pick up the new build output.

## See also

- [Cloudflare Pages configuration](/reference/cloudflare-pages/) — how `ui.plan.ai` itself is hosted, with CF-specific dashboard settings and preview-deploy mechanics.
- [File & route conventions](/reference/file-and-route-conventions/) — docs/spec/runtime path layout.
