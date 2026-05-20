---
title: Project config
description: Limits and defaults that should live in config instead of hardcoded code.
sidebar:
  order: 6
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 media and API limits should come from project config.

## Config categories

- API base URL.
- Allowed image MIME types.
- Allowed video MIME types.
- Multipart byte limits.
- Metadata JSON byte limits.
- Click zone count limit.
- Cloudflare Images variants.
- Cloudflare Stream upload expiration.
- Supabase bucket names.
- Default approval policy.

The docs should be updated when config names are finalized in code.
