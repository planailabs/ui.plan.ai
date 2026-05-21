---
title: Decision notes
description: How private agent reasoning is summarized without turning raw logs into public surface area.
sidebar:
  order: 6
stability: working
last_synced_with: "2026-05-21-content-audit"
---

Agents may submit decision notes as part of frame metadata. These notes help the team understand why a frame exists, but raw agent logs are not a V1 display requirement.

## V1 rule

- Store concise summaries in `metadata.decision_notes`.
- Keep raw logs outside the frame submission unless a later spec defines a safe storage shape.
- Do not make council-style debate fields required for V1 submissions.

V2 can generate richer summaries on the server. V3 can decide which parts of those summaries are safe for public hosted streams.
