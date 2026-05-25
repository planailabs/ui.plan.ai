---
title: Limits
description: V1 API and media limits that must come from project config.
sidebar:
  order: 10
stability: working
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

V1 limits are not hardcoded in endpoint handlers. They come from project config and should be visible in the workbench.

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

## Rate-limit response

Per-API-key buckets are enforced inside the Edge Function (see [Approval & API keys](/v1-plan/approval-and-api-keys/#rate-limiting)). Over-limit responses use the canonical [error envelope](/api-reference/errors/) with top-level `code: "rate_limited"` and an HTTP `Retry-After` header expressed in whole seconds.

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/problem+json
Retry-After: 12
X-Request-Id: req_01hyx0p9q2h3m4n5v6r7s8t9u0
```

```json
{
  "type": "https://ui.plan.ai/docs/api-reference/errors/#rate-limited",
  "title": "Rate limited",
  "status": 429,
  "detail": "Per-API-key bucket exhausted on POST /v1/frame-submissions. Retry after 12 seconds.",
  "code": "rate_limited",
  "request_id": "req_01hyx0p9q2h3m4n5v6r7s8t9u0",
  "limit": { "scope": "api_key", "bucket": "frame_submissions", "limit": 10, "window_seconds": 60 }
}
```

Clients should honor `Retry-After` and apply additional jitter (≥ 250ms) before retrying.
