---
title: Approval policy
description: Policy layers that decide initial visibility and promotion eligibility.
sidebar:
  order: 5
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Approval policy is evaluated from broadest to narrowest:

```text
tenant default < agent default < channel default < API-key override
```

## Policy fields

| Field | Meaning |
|---|---|
| `initial_visibility` | `draft`, `team_visible`, or `promotion_eligible`. |
| `requires_review` | Whether human review is required before promotion. |
| `allow_image` | Whether the scope accepts image media. |
| `allow_video` | Whether the scope accepts video media. |
| `max_media_bytes` | Optional override below project config maximum. |

The UI must show the effective policy and the contributing layer so reviewers know why a submission entered its current state.
