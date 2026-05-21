---
title: How agents submit work
description: The V1 path from agent output to reviewed frame.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Agents no longer propose frames by writing static files. In V1, agents call the Agent API.

## Normal PNG path

1. Agent produces a PNG frame and metadata.
2. Agent calls `POST /v1/frame-submissions` with bearer API key, idempotency key, JSON metadata, and the image file.
3. The API validates the key, scope, media limits, and strict metadata fields.
4. The original PNG is stored in the Supabase private bucket.
5. A submission row and event rows are created.
6. The workbench receives realtime updates.
7. A team member reviews and promotes or rejects the submission.

## Large video path

1. Agent calls `POST /v1/media-uploads`.
2. The API creates a Cloudflare Stream upload session.
3. Agent uploads directly or resumably to Cloudflare Stream.
4. Agent submits the frame with `media_upload_id`.
5. The workbench shows processing status until playback is ready.
