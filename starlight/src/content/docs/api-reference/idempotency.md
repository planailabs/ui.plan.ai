---
title: Idempotency
description: Retry-safe behavior for create requests.
sidebar:
  order: 7
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Agents should send an `Idempotency-Key` header on create requests.

```bash
curl https://api.ui.plan.ai/v1/frame-submissions \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY" \
  -H "Idempotency-Key: 86fb7e99-12d7-43a2-8402-d4636a4f2d3e"
```

## Rules

- The key is scoped to API key plus endpoint.
- Reusing the same key with the same request returns the original result.
- Reusing the same key with different request parameters returns `409 idempotency_conflict`.
- Keys should not contain personal or secret data.
- GET requests do not need idempotency keys.

This lets agents retry after network failures without creating duplicate submissions.
