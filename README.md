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

Requires Node ≥24.15 (pinned to `24.15.0` in `.node-version`) and pnpm.

The main app boots with a mock backend by default — no Supabase or Cloudflare credentials needed to develop. See [`SETUP.md`](./SETUP.md) for the full production wiring.

## Deployment

Cloudflare Pages, GitHub-connected. Build command `pnpm build`, output dir `dist`. Env vars (Supabase + Cloudflare) live in the CF Pages dashboard — see [`SETUP.md`](./SETUP.md) and [`.env.example`](./.env.example).

## For AI agents

See [`AGENTS.md`](./AGENTS.md). Detailed skills in [`.agents/skills/`](.agents/skills/).
