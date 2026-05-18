---
name: dev-build
description: Operational reference for the dev and build workflows in this dual-Astro repo (main app + Starlight docs). Use when a dev server won't start, ports collide, builds produce wrong output, when adding dependencies to the right side, or when investigating why something isn't behaving as expected.
---

# Dev and build operations

For *what the architecture is*, see [`docs-architecture/SKILL.md`](../docs-architecture/SKILL.md). This skill is about *running* and *debugging* it.

## Toolchain prerequisites

- **pnpm** (workspaces). Don't substitute `npm` or `yarn` — `pnpm-workspace.yaml` won't be honored and the docs build will silently break.
- **Node ≥22.12** (`package.json#engines`).
- If pnpm isn't installed: `corepack enable && corepack prepare pnpm@latest --activate`.

## Running

```bash
pnpm dev          # both: main on :4321, docs on :4322/docs/, via concurrently
pnpm dev:app      # main only
pnpm dev:docs     # docs only

pnpm build        # ordered: docs → public/docs → main → dist/
pnpm build:docs   # docs only (rebuilds + re-copies into public/docs)
pnpm build:app    # main only
pnpm preview      # serves merged dist/ via astro preview
```

Inside `pnpm dev`, output is prefixed `[app]` (blue) and `[docs]` (magenta). One Ctrl+C kills both child processes (`concurrently` handles signal forwarding).

**Edit docs at `:4322/docs/`, not `:4321/docs/`.** The latter serves whatever was last built into `public/docs/` — no HMR, possibly stale, possibly missing.

## Adding dependencies

Pick the right project. Wrong choice means `node_modules` bloat or a missing import at the wrong layer.

```bash
# To main app (root package.json)
pnpm add <pkg>

# To Starlight (starlight/package.json)
pnpm --filter starlight-docs add <pkg>
# or:
cd starlight && pnpm add <pkg>
```

`pnpm install` always from repo root — running it inside `starlight/` makes pnpm walk up to the workspace root anyway, but with confusing log output.

## Verifying a successful build

After `pnpm build`, expect this shape:

```
dist/
├── index.html              # main app
├── favicon.{ico,svg}
└── docs/                   # Starlight content
    ├── index.html
    ├── guides/example/index.html
    ├── reference/example/index.html
    ├── _astro/             # optimized assets
    └── pagefind/           # search index
```

Quick sanity check that the `/docs` base prefix is wired correctly:

```bash
grep -c 'href="/docs/' dist/docs/index.html   # should be > 0
```

If that returns 0, the `base: '/docs'` config in `starlight/astro.config.mjs` is missing or wrong — internal links will 404 in production.

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `Port 4321 (or 4322) is in use` | Astro auto-picks the next free port and logs it. To free the original: `lsof -i :4321` then `kill <pid>`. |
| `:4321/docs/` shows nothing or is stale | Working as designed — main dev server serves built docs from `public/docs/`. Use `:4322/docs/` for HMR, or run `pnpm build:docs` to refresh. |
| `npm install` was run by mistake | Delete `node_modules/` and `package-lock.json`, run `pnpm install`. Lockfile mismatch causes subtle resolution bugs. |
| Build error: `ENOENT ... .astro/_astro/<file>.webp` | Someone set `outDir` outside the project root. Don't — keep default `dist/` and copy via `build:docs`. (See `docs-architecture` skill for context.) |
| `sharp` install / postinstall fails | `pnpm-workspace.yaml` must keep `allowBuilds: { sharp: true }`. pnpm blocks postinstall scripts by default for security. |
| `pnpm --filter starlight-docs ...` errors with "no projects matched" | Check `starlight/package.json#name` is still `"starlight-docs"` and `pnpm-workspace.yaml` still lists `starlight` under `packages:`. |
| Built docs page has bare `/foo/` links that 404 | User-written links in MDX/frontmatter don't get the `base` prefix. Either use Starlight's slug-based linking or write `/docs/foo/`. |

## Future optimizations (not currently applied — document, don't preempt)

- **Parallel build.** Today `build:docs` blocks `build:app` because main consumes `public/docs/`. Refactor: build both in parallel into their own `dist/`s, then a final `cp -R starlight/dist/* dist/docs/` stitches them. Saves ~0.5s today — apply only if/when build time becomes painful.
- **Cross-platform build:docs.** `rm -rf` and `cp -R` are Unix-only. Swap to `cpy-cli` or a Node script if a Windows contributor joins.
