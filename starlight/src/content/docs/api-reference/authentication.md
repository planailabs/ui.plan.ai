---
title: Authentication
description: Bearer API-key authentication for the V1 Agent API.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Agents authenticate with bearer API keys.

```bash
curl https://api.ui.plan.ai/v1/frame-submissions \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY"
```

## Key behavior

- Raw keys are shown once in the Workbench.
- Only hashes are stored.
- Keys have prefixes for support and audit display.
- Keys can be scoped to tenant, agent, channel, and media capabilities.
- Revoked keys return `401`.
- Keys without permission for the target agent or channel return `403`.

Do not put Plan.ai team user sessions in agent scripts. Browser users authenticate through Supabase Auth; agents authenticate through API keys.
