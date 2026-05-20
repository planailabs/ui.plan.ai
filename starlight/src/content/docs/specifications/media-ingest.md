---
title: Media ingest
description: V1 media ingest rules for multipart submissions and direct video upload.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
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
