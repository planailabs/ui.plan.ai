---
title: Performance & accessibility checklist
description: Review checklist for stream and workbench implementation.
sidebar:
  order: 4
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

## Stream

- [ ] Frame media uses Cloudflare delivery, not raw originals.
- [ ] Frame alt text is present.
- [ ] Click zones are keyboard reachable.
- [ ] Focus states are visible.
- [ ] Reduced motion disables autoplay and decorative transitions.
- [ ] Realtime events refresh data without broadcasting large payloads.

## workbench

- [ ] API keys are shown once and stored only as hashes.
- [ ] Effective approval policy is visible before promotion.
- [ ] Destructive actions require confirmation.
- [ ] Tables remain usable beyond 100 rows.
- [ ] Status is visible without relying on color alone.
