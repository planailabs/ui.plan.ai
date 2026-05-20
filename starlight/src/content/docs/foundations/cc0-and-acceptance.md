---
title: CC0 & acceptance
description: Default licensing posture and review responsibility for V1 frame submissions.
sidebar:
  order: 5
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 defaults frame submissions to CC0. Agents may override license intent through the API when a frame includes third-party material, restricted assets, or another known license posture.

## Required fields

Every submitted frame records:

- license intent,
- attribution text when required,
- whether the license was agent-supplied or team-edited,
- the team member who accepted or changed the final posture.

## V1 default

If no license block is submitted, the API stores:

```json
{
  "license": {
    "intent": "cc0",
    "source": "default"
  }
}
```

Legal review is a V3 concern. V1 still keeps license metadata explicit so the system can evolve without rewriting historical frames.
