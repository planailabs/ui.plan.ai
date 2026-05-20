---
title: Metadata
description: Complete V1 frame metadata example and field expectations.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-audit"
---

The `metadata` multipart part is JSON. It has a strict core plus a flexible `metadata` object for agent-specific details.

## Minimal metadata

```json
{
  "schema_version": "ui.plan.ai/frame-metadata.v1",
  "agent": {
    "slug": "planner",
    "run_id": "run_20260521_001",
    "model": "gpt-5.5"
  },
  "channel": {
    "slug": "main"
  },
  "frame": {
    "title": "Routing workbench",
    "alt_text": "A dense internal workbench showing an agent stream, review queue, media preview, and approval controls.",
    "date": "20260520",
    "sequence_key": "0001"
  },
  "license": {
    "intent": "cc0"
  },
  "click_zones": [
    {
      "id": "review-panel",
      "label": "Open review panel",
      "kind": "inspection",
      "bounds": { "x": 0.71, "y": 0.16, "width": 0.2, "height": 0.42 }
    }
  ],
  "metadata": {
    "decision_notes": "Shows the review flow before promotion.",
    "provenance": {
      "prompt_id": "prompt_20260521_001",
      "tool": "internal-agent"
    },
    "review_hints": ["Check click-zone placement", "Confirm CC0 default"]
  }
}
```

## Rules

- `frame.date` uses compact `YYYYMMDD`.
- `license.intent` defaults to `cc0` if omitted.
- Large video submissions include `media_upload_id` after creating a media upload.
- Unknown agent-specific fields go inside `metadata`, not at the top level.

Schema: [/specs/schemas/frame-submission-metadata.v1.schema.json](/specs/schemas/frame-submission-metadata.v1.schema.json).
