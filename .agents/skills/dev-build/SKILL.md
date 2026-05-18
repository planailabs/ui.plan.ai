---
name: dev-build
description: How to run, debug, and verify dev/build in this repo. Read when starting a dev server, hitting build errors, adding deps, or troubleshooting.
---

# Dev / build ops

For architecture (file layout, build flow), see `docs-architecture`.

## Starting the dev server — preferred way

Use the harness `Bash` tool with `run_in_background: true`. Not a subagent: a subagent's backgrounded shell is reaped when the agent exits.

```
1. Check: lsof -nP -i:4321 -i:4322 -sTCP:LISTEN
2. If any listener belongs to a prior pnpm dev, kill it (kill <pid>) before starting.
3. Run `pnpm dev` with Bash run_in_background: true.
4. Use Monitor / BashOutput on the returned shell id to confirm both servers came up
   (look for "ready in" / port lines from app and docs).
5. Kill on request via KillShell on the same shell id.
```

Never start a second `pnpm dev` without killing the first. Always port-check first.

## Commands

```bash
pnpm dev          # both, concurrently (app :4321, docs :4322)
pnpm dev:app      # main only
pnpm dev:docs     # Starlight only
pnpm build        # ordered: docs → main
pnpm build:docs   # docs only (rebuild + re-copy into public/docs)
pnpm build:app    # main only
pnpm check        # astro check on both (CI runs this before build)
pnpm check:app    # main only
pnpm check:docs   # Starlight only
pnpm preview      # serve dist/
```

Edit docs at `:4322/docs/` (HMR). `:4321/docs/` is whatever was last built — stale by default.

## Adding deps

```bash
pnpm add <pkg>                              # main app
pnpm --filter starlight-docs add <pkg>      # Starlight
```

Always `pnpm install` from repo root.

## Local pre-push

Before pushing a branch (especially before opening a PR), run:

```bash
pnpm check && pnpm build
```

Both run on CI; failing locally avoids burning CI minutes and the slow round-trip. See `branch-pr-workflow` skill for the rest of the flow.

## Verify a build

```
dist/
├── index.html, favicon.*
└── docs/{index.html (splash), start-here/, foundations/, process/, v1-plan/, specifications/, reference/, api-reference/, roadmap-and-open-questions/, archive/, _astro/, pagefind/, sitemap-*.xml}
```

Base-prefix sanity check:
```bash
grep -c 'href="/docs/' dist/docs/index.html   # > 0 = ok
```

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Port 4321/4322 in use | `lsof -i :<port>` → `kill <pid>`. Or let Astro pick next (it logs it). |
| `:4321/docs/` stale or 404 | By design. Use `:4322/docs/` for HMR or rerun `pnpm build:docs`. |
| `npm install` was run | Delete `node_modules/` + `package-lock.json`, `pnpm install`. |
| Build error `ENOENT .astro/_astro/*.webp` | Someone set `outDir` outside project. Don't — see docs-architecture. |
| `sharp` postinstall fails | `pnpm-workspace.yaml` must keep `allowBuilds: { sharp: true }`. |
| `pnpm --filter starlight-docs` → "no projects matched" | Check `starlight/package.json#name === "starlight-docs"` and workspace entry. |
| Built page has bare `/foo/` links → 404 | User-written link missing `base`. Use slug or `/docs/...`. |

## Documented, not applied

- Parallel build (~0.5s saved today): refactor so main and docs build into separate dirs, final `cp -R starlight/dist/* dist/docs/`. Apply only when build pain justifies the complexity.
- Cross-platform `build:docs`: swap `rm -rf`/`cp -R` for `cpy-cli` or a Node script if Windows contributor joins.
