---
title: Media & delivery
description: Source of truth and delivery strategy for V1 images and video.
sidebar:
  order: 12
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

V1 separates originals from delivery, and uses two ingest paths depending on media size.

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

## Config

Media size, MIME type, duration, and dimension limits live in project config. The API reads config and rejects oversized submissions before processing.

## Cloudflare constraints

- Private Cloudflare Images delivery uses predefined variants, not arbitrary flexible variants.
- Supabase stores the Cloudflare image ID and variant names; the app must not infer IDs from storage paths.
- Cloudflare Stream is the source of truth for large videos once a direct upload is created.
- Delivery URLs should be short-lived or signed wherever the stream is team-only.
