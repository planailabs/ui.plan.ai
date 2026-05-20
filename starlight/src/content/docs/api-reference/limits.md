---
title: Limits
description: V1 API and media limits that must come from project config.
sidebar:
  order: 8
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 limits are not hardcoded in endpoint handlers. They come from project config and should be visible in the Workbench.

## Limit categories

- allowed MIME types,
- maximum multipart image bytes,
- maximum small video bytes,
- maximum video duration for V1 review,
- maximum metadata JSON bytes,
- maximum click zones per frame,
- direct upload expiration,
- polling backoff guidance.

## Vendor-driven defaults

Supabase Edge Functions should not proxy large video. Cloudflare Stream direct or resumable upload is the V1 path for large video. Cloudflare Images private delivery should use predefined variants.
