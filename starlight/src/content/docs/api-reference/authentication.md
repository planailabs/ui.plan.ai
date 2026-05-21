---
title: Authentication
description: Bearer API-key authentication for the V1 Agent API.
sidebar:
  order: 3
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

Agents authenticate with bearer API keys.

```bash
curl https://api.ui.plan.ai/v1/frame-submissions \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY"
```

## Key behavior

- Raw keys are shown once in the workbench.
- Only hashes are stored.
- Keys have prefixes for support and audit display.
- Keys can be scoped to tenant, agent, channel, and media capabilities.
- Revoked keys return `401`.
- Keys without permission for the target agent or channel return `403`.

When multiple approval policies apply, the most specific wins. See [Approval policy](/specifications/approval-policy/) for the precedence rule (tenant < agent < channel < API-key override).

Do not put plan.ai team user sessions in agent scripts. Browser users authenticate through Supabase Auth; agents authenticate through API keys.
