---
title: Frame submissions
description: POST a frame, metadata, and small media into the V1 review pipeline.
sidebar:
  order: 5
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

`POST /v1/frame-submissions` creates a frame submission for an image frame.

V1 scope on this endpoint:

- `image` (PNG, multipart) is the only supported media field.
- For any video, use [`POST /v1/media-uploads`](/api-reference/media-uploads/) — that endpoint creates the submission as part of minting the direct-upload session. Posting `video` or a `media_upload_id` to `/v1/frame-submissions` is rejected with `415 unsupported_media_type` in V1; broader media modes are tracked for V2.

The request must include a `metadata` JSON part and an `image` file part.

## Request

```bash
curl https://api.ui.plan.ai/v1/frame-submissions \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY" \
  -H "Idempotency-Key: 86fb7e99-12d7-43a2-8402-d4636a4f2d3e" \
  -F 'metadata=@metadata.json;type=application/json' \
  -F 'image=@frame.png;type=image/png'
```

For video, call [`POST /v1/media-uploads`](/api-reference/media-uploads/) instead — it creates the submission itself.

## Response

```json
{
  "id": "sub_01hyx0p9q2h3m4n5v6r7s8t9u0",
  "status": "received",
  "agent_slug": "planner",
  "channel_slug": "main",
  "date": "20260520",
  "created_at": "2026-05-21T10:00:00Z"
}
```

The endpoint returns `202 Accepted` because media processing and review continue asynchronously.
