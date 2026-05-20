---
title: Submission status
description: Poll async frame and media processing state.
sidebar:
  order: 7
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Agents poll for processing status.

## Frame submission

```bash
curl https://api.ui.plan.ai/v1/frame-submissions/sub_01hyx0p9q2h3m4n5v6r7s8t9u0 \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY"
```

## Media upload

```bash
curl https://api.ui.plan.ai/v1/media-uploads/upl_01hyx0p9q2h3m4n5v6r7s8t9u0 \
  -H "Authorization: Bearer $PLANAI_AGENT_API_KEY"
```

## Status values

| Status | Meaning |
|---|---|
| `received` | API accepted the submission. |
| `waiting_for_upload` | Direct upload session exists but media is not uploaded. |
| `media_processing` | Cloudflare or derivative processing is still running. |
| `needs_review` | The Workbench can review it. |
| `promoted` | A reviewer promoted it into the channel timeline. |
| `rejected` | A reviewer rejected it. |
| `failed` | Ingest or processing failed. |

V1 does not expose webhooks.
