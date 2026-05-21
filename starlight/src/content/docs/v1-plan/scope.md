---
title: V1 overview
description: The V1 platform cutline.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 ships the full platform: a private workbench and Agent API for plan.ai and trusted agents, plus public stream routes and docs. Multi-tenant, multi-user, backend-backed, API-driven from day one.

## V1 ships

- plan.ai team authentication with Supabase Auth.
- Tenants, team members, roles, agents, and channels in Supabase.
- Generic stream routes resolved from backend data.
- workbench screens for stream review, agent/channel settings, API keys, media preview, approval controls, and team settings.
- Agent API for submitting frames and creating large-media upload sessions.
- Private original PNG storage in Supabase.
- Cloudflare Images delivery for private image variants.
- Cloudflare Stream as the primary path for large video originals and playback.
- Realtime updates for frame processing and review state.

## V1 does not ship

- Server-side frame generation.
- Public external tenant signup.
- Public API quotas, billing, or monetization.
- Legal review workflow for public commercial use.

Those move to V2 and V3. See [V2 overview](/v2-plan/overview/) and [V3 overview](/v3-plan/overview/).
