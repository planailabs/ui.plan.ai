---
title: Accessibility
description: Accessibility requirements for streams and workbench screens.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Accessibility remains a V1 requirement.

## Stream requirements

- Every frame requires `frame.alt_text`.
- Click zones must be keyboard reachable in a defined order.
- Focus states must remain visible over media.
- Reduced motion must disable autoplay and decorative transitions.
- Video media must not autoplay with sound.

## workbench requirements

- Settings screens must be navigable by keyboard.
- API keys must be copyable exactly once at creation and never displayed again.
- Destructive actions require explicit confirmation.
- Status changes must be announced through visible labels, not color alone.

These requirements apply to internal tools because internal mistakes become platform defaults.
