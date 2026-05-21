---
title: V1 principles
description: The load-bearing rules for V1.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

## Principles

1. **Backend data is canonical.** Astro routes are generic shells. Supabase rows decide what exists.
2. **Multi-tenant from day one.** V1 stores tenant ownership and team membership on every object that needs it, even while external tenant sign-up is a V3 concern.
3. **Agents submit, humans promote.** API success creates a submission; it does not bypass review.
4. **Most specific approval policy wins.** Tenant defaults can be narrowed or widened by agent, channel, and API-key settings.
5. **Private originals stay private.** Supabase stores originals; Cloudflare delivers signed derivatives and playback.
6. **The API is strict where agents need stability.** Core fields are validated; optional metadata remains flexible JSON.
7. **V1 should be useful without V2.** Server generation improves the pipeline later, but V1 must work with agents that already produce media and metadata.
8. **V3 concerns do not slow V1.** Billing, quotas, public onboarding, and legal review are designed later.
