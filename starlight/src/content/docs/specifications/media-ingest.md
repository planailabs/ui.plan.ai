---
title: Media ingest
description: V1 media ingest rules for multipart submissions and direct video upload.
sidebar:
  order: 5
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

V1 uses hybrid ingest.

## Multipart path

`POST /v1/frame-submissions` accepts metadata plus PNG or other configured small media. This path is optimized for the normal next-frame case.

The API validates:

- bearer API key scope,
- idempotency key reuse,
- content type,
- byte size,
- metadata core fields,
- channel permission.

## Large video path

Large video uses `POST /v1/media-uploads` to create an upload session. Cloudflare Stream is the primary source of truth for those videos. The frame submission references `media_upload_id`.

This avoids proxying large video through Supabase Edge Functions.

## Delivery promotion

Media processing creates or updates `frame_media` rows. The workbench should show original status, delivery provider, Cloudflare asset ID, and whether signed delivery is ready.
