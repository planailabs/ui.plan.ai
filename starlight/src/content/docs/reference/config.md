---
title: Project config
description: Limits and defaults that should live in config instead of hardcoded code.
sidebar:
  order: 6
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 media and API limits should come from project config.

Start from `config/project.config.json.example` when implementation begins, then create environment-specific config from real Supabase and Cloudflare account values. Implementation may load the config differently per environment, but the values must stay config-driven rather than hardcoded in endpoint handlers.

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

Schema: [/specs/schemas/project-config.v1.schema.json](/specs/schemas/project-config.v1.schema.json).

Setup path: [V1 setup checklist](/process/v1-setup/).
