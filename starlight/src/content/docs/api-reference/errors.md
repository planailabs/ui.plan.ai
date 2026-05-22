---
title: Errors
description: Problem+JSON error responses for the V1 Agent API.
sidebar:
  order: 8
stability: stable
last_synced_with: "2026-05-22-v1-openapi-fleshout"
---

Errors use `application/problem+json`.

```json
{
  "type": "https://ui.plan.ai/docs/api-reference/errors/#validation_failed",
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
| [`authentication_required`](#authentication_required) | 401 |
| [`invalid_api_key`](#invalid_api_key) | 401 |
| [`permission_denied`](#permission_denied) | 403 |
| [`not_found`](#not_found) | 404 |
| [`idempotency_conflict`](#idempotency_conflict) | 409 |
| [`media_too_large`](#media_too_large) | 413 |
| [`unsupported_media_type`](#unsupported_media_type) | 415 |
| [`validation_failed`](#validation_failed) | 422 |
| [`rate_limited`](#rate_limited) | 429 |
| [`internal_error`](#internal_error) | 500 |

Each code is also the URL fragment used in the `type:` field of the Problem response.

Every response includes an `X-Request-Id` header. Include it when debugging a failed agent run.

## authentication_required

`401`. The request did not include an `Authorization` header, or the header was malformed. Send `Authorization: Bearer $PLANAI_AGENT_API_KEY` and retry.

## invalid_api_key

`401`. The key was present but is revoked, unknown, or otherwise not currently valid. Regenerate the key from the workbench — refreshing or retrying will not recover a revoked key.

## permission_denied

`403`. The key is valid but lacks permission for the target tenant, agent, channel, or media capability. Check the key's scope in the workbench. Do not retry the same operation with the same key.

## not_found

`404`. The resource does not exist, OR exists but is not visible to this key's scope. V1 intentionally does not differentiate the two cases — that's the non-leak rule for tenant existence. Verify the ID and that the key is scoped to the right tenant/agent/channel.

## idempotency_conflict

`409`. The same `Idempotency-Key` was reused with different request parameters. Either send the original parameters (to get the original result) or use a new key. See [Idempotency](/api-reference/idempotency/).

## media_too_large

`413`. Media bytes exceeded the project's configured limit. For images, reduce the file. For large video, create a direct-upload session with [`POST /media-uploads`](/api-reference/media-uploads/) instead of attaching `video` to the frame submission.

## unsupported_media_type

`415`. The uploaded media's MIME type is not in the project's allow list, or the request `Content-Type` does not match what the endpoint expects (`multipart/form-data` for frame submissions, `application/json` for media uploads). The allow list is configured per project — see [Limits](/api-reference/limits/).

## validation_failed

`422`. The request failed schema validation, OR a required header is missing (most commonly `Idempotency-Key` on a `POST`). The `errors` array on the Problem response points at offending fields — each entry has a `pointer` (JSON Pointer into the request body) and a `detail` string.

## rate_limited

`429`. The request exceeded the per-key rate limit. Wait for the duration in the `Retry-After` response header (integer seconds, or an HTTP-date — RFC 9110 §10.2.3), then retry with the same `Idempotency-Key`.

## internal_error

`500`. Unexpected server-side failure. Safe to retry with the same `Idempotency-Key`. If the failure persists, include the `X-Request-Id` from the response when reporting.
