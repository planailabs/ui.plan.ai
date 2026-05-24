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

## V1 application scaffold (local mode)

This repo now includes a runnable **V1 scaffold** in the main app that is prepared for later Supabase + Cloudflare integration:

- `/workbench/` — internal workspace surface (tenant, channels, frames, API key view)
- `/public/` — public stream preview surface
- `/api/v1/frames` — local API contract endpoint (GET/POST)
- `src/lib/v1.ts` — domain types + in-memory provider seed data

### Why this helps now

- Product and UX flow can be built/validated immediately.
- API and domain contracts are centralized and ready for provider swaps.
- Later integration can replace local providers without rewriting page flows.

### Planned integration seams

- Auth provider: local → Supabase auth/session
- Persistence provider: in-memory/local → Supabase tables + policies
- Media provider: local metadata only → Cloudflare Images/Stream signed delivery
- Event provider: local append-only flow → Supabase Realtime/event transport

## Deployment

Cloudflare Pages, GitHub-connected. Build command `pnpm build`, output dir `dist`.

## For AI agents

See [`AGENTS.md`](./AGENTS.md). Detailed skills in [`.agents/skills/`](.agents/skills/).


## V1 handoff

For Supabase/Cloudflare integration details and swap steps, see `docs-v1-handoff.md`.
