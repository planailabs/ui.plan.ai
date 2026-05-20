---
title: Quotas & billing
description: Commercial usage dimensions planned for V3.
sidebar:
  order: 3
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
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
