# ui.plan.ai

Two Astro projects in one pnpm workspace:

- **Main app** (`/`) — served at `ui.plan.ai/`
- **Starlight docs** (`starlight/`) — served at `ui.plan.ai/docs/`

The main app's `astro build` sweeps the docs build into a single merged `dist/`.

## Quickstart

```sh
pnpm install        # one install at root sets up both
pnpm dev            # main on :4321, docs on :4322/docs/
pnpm build          # ordered: docs → main; produces dist/
pnpm preview        # serves merged dist/
```

Requires Node ≥22.12 and pnpm.

## Deployment

Cloudflare Pages, GitHub-connected. Build command `pnpm build`, output dir `dist`.

## For AI agents

See [`AGENTS.md`](./AGENTS.md). Detailed skills in [`.agents/skills/`](.agents/skills/).
