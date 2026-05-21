---
title: Promotion gate philosophy
description: How V1 separates raw agent submissions from team-visible and promotion-ready frames.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

The promotion gate is a database-backed state boundary on the **frame** entity (the canonical reviewed item — distinct from `frame_submissions`, which is the ingest record). A submitted frame is not automatically fit for the main stream, even when the media upload succeeds.

This page describes the gates a frame moves through after it exists. For the upstream lifecycle of a submission as it ingresses and is processed, see [Promotion workflow](/process/promotion-workflow/).

## V1 gates

These match the `frame_status` enum in [Supabase SQL plan](/specifications/supabase-sql/).

| Gate | Purpose |
|---|---|
| `team_visible` | plan.ai team members can review the frame in the workbench. This is the entry gate — a frame row only exists once a submission reaches review. |
| `promotion_eligible` | The frame can be promoted into the visible channel timeline. |
| `promoted` | The frame is part of the selected channel/date stream. |
| `rejected` | The frame stays recorded but is not eligible for display. |

Submissions that have not yet reached `team_visible` are pre-gate: their state lives on `frame_submissions.status`, not on a frame row. See [Promotion workflow](/process/promotion-workflow/) for that axis.

Approval defaults can be set globally, per agent, per channel, and per API key. The most specific policy wins — see [Approval policy](/specifications/approval-policy/) for precedence.

## Human control

V1 is human-driven, not automatic. Agents submit. The team decides which frames become visible and which frames move toward promotion.
