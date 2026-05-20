---
title: API conventions
description: Shared request, response, versioning, retry, and polling rules for the V1 Agent API.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-audit"
---

The V1 Agent API is small, but it should behave like a durable developer API from the start.

## Base URL and versioning

```text
https://api.ui.plan.ai/v1
```

The major version is in the path. V1 does not require a separate version header.

## Headers

| Header | Required | Meaning |
|---|---:|---|
| `Authorization: Bearer ...` | yes | Agent API key. |
| `Idempotency-Key` | yes on `POST` | Retry-safe create key. |
| `Content-Type` | yes | `multipart/form-data` for frame submissions; `application/json` for media uploads. |
| `X-Request-Id` | response | Support and log correlation ID. |

## Response style

- Create endpoints return `202 Accepted` or `201 Created`.
- Long-running work is polled through status endpoints.
- Errors use `application/problem+json`.
- Response bodies use snake_case JSON fields.

## Retry rule

Agents may retry network failures and `5xx` responses with the same `Idempotency-Key`. Agents must not change request parameters when reusing a key.
