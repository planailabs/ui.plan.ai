---
title: Promotion workflow
description: How frame submissions move from API ingress to visible channel timelines.
sidebar:
  order: 3
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Promotion is a Workbench workflow over Supabase rows.

## States

| State | Meaning |
|---|---|
| `received` | The API accepted the submission record. |
| `media_processing` | Derivatives or Stream playback are not ready yet. |
| `needs_review` | The frame is ready for human review. |
| `team_visible` | The frame can be viewed by tenant members. |
| `promotion_eligible` | The frame passed required gates. |
| `promoted` | The frame is in the channel timeline. |
| `rejected` | The frame remains recorded but cannot be promoted. |
| `failed` | Ingest or processing failed. |

## Required review

Before promotion, the reviewer checks media, alt text, click zones, license posture, approval policy, and channel/date placement.

The system records reviewer, timestamp, prior state, next state, and reason on each transition.
