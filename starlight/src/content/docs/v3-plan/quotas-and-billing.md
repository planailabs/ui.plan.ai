---
title: Quotas & billing
description: Commercial usage dimensions planned for V3.
sidebar:
  order: 3
stability: working
last_synced_with: "2026-05-21-content-audit"
---

V3 introduces monetization. V1 does not.

## Primary quota units

- frame submissions,
- original storage,
- image delivery,
- video storage,
- video delivery,
- API request volume.

Generation quotas can layer on top after V2 exists.

## Billing boundary

Billing must not be bolted onto untracked media usage. V1 and V2 should record enough submission, storage, and delivery metadata that V3 can price the product without reconstructing history.

`frame_events` is the contemporaneous log V1 keeps for this purpose — see [Data model](/v1-plan/data-model/). The exact event payload shape needed for V3 billing accounting is an [open question](/roadmap-and-open-questions/open-questions/) to settle before V3 implementation begins.
