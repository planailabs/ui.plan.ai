---
title: Promotion workflow
description: How frame submissions move from API ingress to visible channel timelines.
sidebar:
  order: 3
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

Promotion is a workbench workflow over Supabase rows. This page describes the **submission** lifecycle — every state a `frame_submissions` row moves through from API ingress to terminal disposition. For the frame entity's gate states after review begins, see [Promotion gate philosophy](/foundations/promotion-gate/).

## States

These match the `submission_status` enum in [Supabase SQL plan](/specifications/supabase-sql/).

| State | Meaning |
|---|---|
| `received` | The API accepted the submission record. |
| `waiting_for_upload` | A large-video submission is awaiting the direct upload to Cloudflare Stream. |
| `media_processing` | Derivatives or Stream playback are not ready yet. |
| `needs_review` | Media is ready; the frame awaits human review. |
| `team_visible` | The reviewer made the frame visible to tenant members. A `frames` row now exists at the same status. |
| `promotion_eligible` | The frame passed required gates. |
| `promoted` | The frame is in the channel timeline. |
| `rejected` | The frame remains recorded but cannot be promoted. |
| `failed` | Ingest or processing failed. |

`team_visible` and the three states beyond also exist on `frame_status` — once a submission reaches review, the canonical frame row tracks the same gate. See [Promotion gate philosophy](/foundations/promotion-gate/) for the frame-side view.

## Required review

Before promotion, the reviewer checks media, alt text, click zones, license posture, approval policy, and channel/date placement.

The system records reviewer, timestamp, prior state, next state, and reason on each transition.
