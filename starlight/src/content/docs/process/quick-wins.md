---
title: Implementation priorities
description: The order that reduces rework while building V1.
sidebar:
  order: 4
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Build V1 in vertical slices instead of milestone placeholders.

## Priority order

1. Supabase project config, auth, tenants, team roles, and RLS.
2. Agent/channel creation from the workbench.
3. Hashed API keys with scope and policy override.
4. `POST /v1/frame-submissions` for PNG plus metadata.
5. Frame review screen with media, metadata, click zones, and state transition.
6. Cloudflare Images delivery for private image variants.
7. `POST /v1/media-uploads` for large video and Cloudflare Stream status.
8. Realtime event updates.
9. V2 generation service.
10. V3 public onboarding, quotas, billing, and docs.

The goal is to prove the platform end-to-end before opening it commercially.
