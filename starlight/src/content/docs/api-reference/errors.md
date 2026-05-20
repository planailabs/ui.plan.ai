---
title: Errors
description: Problem+JSON error responses for the V1 Agent API.
sidebar:
  order: 6
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Errors use `application/problem+json`.

```json
{
  "type": "https://ui.plan.ai/docs/api-reference/errors/#validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "The metadata field frame.alt_text is required.",
  "code": "validation_failed",
  "request_id": "req_01hyx0p9q2h3m4n5v6r7s8t9u0",
  "errors": [
    {
      "pointer": "/frame/alt_text",
      "detail": "Required"
    }
  ]
}
```

## Stable codes

| Code | HTTP |
|---|---|
| `authentication_required` | 401 |
| `invalid_api_key` | 401 |
| `permission_denied` | 403 |
| `not_found` | 404 |
| `idempotency_conflict` | 409 |
| `media_too_large` | 413 |
| `unsupported_media_type` | 415 |
| `validation_failed` | 422 |
| `rate_limited` | 429 |
| `internal_error` | 500 |
