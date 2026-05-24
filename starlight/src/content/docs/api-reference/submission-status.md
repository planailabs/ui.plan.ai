---
title: Submission status
description: Poll async frame and media processing state.
sidebar:
  order: 7
stability: stable
last_synced_with: "2026-05-24-submission-status-audit"
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
| `needs_review` | The workbench can review it. |
| `team_visible` | A reviewer made the frame visible to tenant members; a `frames` row now exists. See [Promotion workflow](/process/promotion-workflow/). |
| `promotion_eligible` | The frame passed required gates and can be promoted. |
| `promoted` | A reviewer promoted it into the channel timeline. |
| `rejected` | A reviewer rejected it. |
| `failed` | Ingest or processing failed. |

The full enum matches `submission_status` in the [Supabase SQL plan](/specifications/supabase-sql/) and `SubmissionStatus` in the [OpenAPI spec](/specs/v1-agent-api.openapi.yaml).

V1 does not expose webhooks.
