---
title: Media & delivery
description: Source of truth and delivery strategy for V1 images and video.
sidebar:
  order: 12
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
verify_against:
  - https://supabase.com/docs/guides/storage/security/access-control
  - https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/
  - https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/
  - https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
---

V1 separates originals from delivery, and uses two ingest paths depending on media size. Upstream contracts move; verify config against [Upstream docs](/reference/upstream-docs/) before changing anything here.

## Ingest paths

- **Small media (PNG frames, small video)** — multipart `POST /v1/frame-submissions` with metadata + media bytes in one call.
- **Large video** — JSON `POST /v1/media-uploads` first to create an upload session; the agent then uploads directly to Cloudflare Stream and the submission is finalized when processing completes.

The full request and response shapes live in [Media ingest](/specifications/media-ingest/) and the corresponding [api-reference pages](/api-reference/media-uploads/).

## Source of truth

| Media | Original source of truth | Delivery |
|---|---|---|
| PNG frames | Supabase private bucket | Cloudflare Images signed/private variants. |
| Small accepted media | Supabase private bucket when config permits | Cloudflare Images or Stream, depending on type. |
| Large video | Cloudflare Stream primary | Cloudflare Stream signed playback. |

The Supabase bucket path for PNG originals is:

```text
{tenant_id}/{agent_slug}/{channel_slug}/{yyyymmdd}/{frame_submission_id}/original.{ext}
```

## Supabase Storage rules

- Bucket `frame-originals` is **private**. No browser ever holds a signed URL to an original.
- Storage RLS policies on `storage.objects` constrain `bucket_id = 'frame-originals'` AND object path prefix matches a tenant the caller is a member of.
- Edge Functions request signed URLs with `expiresIn ≤ 300` seconds when they need to fetch an original to derive a Cloudflare asset.
- Uploads use `x-upsert: false`; a resubmit creates a new `frame_submission_id` and a fresh path.

## Cloudflare Images

- All images are uploaded with `requireSignedURLs: true`.
- V1 ships these named variants: `thumb-256`, `card-768`, `frame-1920`, `og-1200x630`. Variants are declared in [project config](/reference/config/), not inferred from request shape.
- Browser delivery URLs are minted server-side per request (Edge Function) with an `exp` claim ≤ 1 hour.
- Supabase stores the Cloudflare image ID and variant names; the app must not infer IDs from storage paths.
- If a variant fetch 404s, the UI falls back to the next-larger variant — never to the raw original.

Upstream: [serve private images](https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/).

## Cloudflare Stream

- `POST /v1/media-uploads` calls Stream's Direct Creator Uploads API with `requireSignedURLs: true`, a configured `maxDurationSeconds`, `allowedOrigins` matching the env's domains, and a webhook target on `api.ui.plan.ai`.
- The agent uploads directly to the returned one-shot URL; Stream is the source of truth once that URL is consumed.
- Playback uses Stream signed JWT tokens minted by an Edge Function with `exp ≤ 1h`. The HLS manifest URL never embeds a raw video UID without a signature.
- The Stream `ready` webhook is verified against `CF_STREAM_WEBHOOK_SECRET`, then updates `frame_media.status` and emits `frame.media.status_changed` (see [Realtime operations](/v1-plan/realtime-operations/)).

Upstream: [direct creator uploads](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/), [securing your stream](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/), [webhooks](https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/).

## Config

Media size, MIME type, duration, and dimension limits live in [project config](/reference/config/). The API reads config and rejects oversized submissions before processing.
