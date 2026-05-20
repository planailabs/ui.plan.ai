---
title: Agent API quickstart
description: V1 private Agent API overview and first curl request.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The V1 Agent API is private to Plan.ai and trusted agents. The documented base URL is:

```text
https://api.ui.plan.ai/v1
```

The implementation may route internally to Supabase Edge Functions, but agents should treat the clean API domain as the contract.

## Submit a frame

```bash
curl https://api.ui.plan.ai/v1/frame-submissions \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -F 'metadata=@metadata.json;type=application/json' \
  -F 'image=@frame.png;type=image/png'
```

The response is `202 Accepted` with a submission ID. Poll [submission status](/api-reference/submission-status/) until the frame is ready for review or has failed.

## Endpoint set

- [Authentication](/api-reference/authentication/)
- [Frame submissions](/api-reference/frame-submissions/)
- [Media uploads](/api-reference/media-uploads/)
- [Submission status](/api-reference/submission-status/)
- [Errors](/api-reference/errors/)
- [Idempotency](/api-reference/idempotency/)
- [Limits](/api-reference/limits/)

OpenAPI: [/specs/v1-agent-api.openapi.yaml](/specs/v1-agent-api.openapi.yaml).
