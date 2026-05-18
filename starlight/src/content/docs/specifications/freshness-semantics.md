---
title: Freshness semantics
description: How any "agents working now" surface declares its recency and stale state.
sidebar:
  order: 10
stability: stable
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

Any surface that implies "agents are working" carries time stress. The product can promise liveness honestly only if the runtime can declare how fresh each piece of content is. Freshness semantics is the contract.

## Three timestamps and a threshold

Every Stream Manifest carries a top-level `freshness` block:

```json
"freshness": {
  "sourceEventAt": "2026-05-18T11:42:00Z",
  "publishedAt": "2026-05-18T12:00:00Z",
  "staleAfter": "P7D",
  "visibleStaleState": "muted"
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `sourceEventAt` | ISO 8601 | required | When the underlying event happened (e.g., the council decision the frame depicts). |
| `publishedAt` | ISO 8601 | required | When this Manifest was published. |
| `staleAfter` | ISO 8601 duration | required | The window after `sourceEventAt` within which the content is considered fresh. |
| `visibleStaleState` | string | required | What the visitor sees if `now > sourceEventAt + staleAfter`. One of `muted`, `banner`, `hidden`. |

The runtime computes `isStale = now - sourceEventAt > staleAfter` and renders the configured state.

## Per-frame override

A frame entry may override the top-level freshness:

```json
"freshness": {
  "sourceEventAt": "2026-05-15T09:00:00Z",
  "staleAfter": "P3D"
}
```

Per-frame freshness wins for that frame. The top-level block applies to frames that do not declare their own.

## Visible stale states

### `muted`

The frame still renders, but the overlay shows a "Last updated [N] days ago" pill. The visitor knows it is past its freshness window. No promise of liveness.

### `banner`

The frame renders with a banner at the top: "This view of the agent council is stale. The latest decisions may not be reflected here." Stronger signal than `muted`.

### `hidden`

The frame is replaced by a placeholder card: "This watch-builder frame is paused while the team catches up." Use for surfaces where stale content would actively mislead.

## What requires freshness declarations

| Surface | Needs `freshness`? |
|---|---|
| Watch-builder frames | Yes — always. |
| Regular content frames | Optional. Most are evergreen. |
| Council inspect overlay | Yes — derived from the underlying Frame Package's freshness. |
| Promotion-readiness board | Yes — and `staleAfter` should be short (e.g., `P1D`). |

## Why this exists

The product's soul thread implies recency. A "promotion-readiness board" that shows yesterday's blockers without a stale indicator is dishonest. Freshness semantics is the way the static-interactive architecture stays honest about its non-liveness: the runtime cannot regenerate stale frames, but it can declare them stale and adjust its visible promise accordingly.

## Build-time computation

`publishedAt` is set at build time. `sourceEventAt` is authored on the Frame Package and copied through. `staleAfter` is authored on the Frame Package as a duration the team commits to.

If a build runs but no Frame Package has changed for a stream, `publishedAt` still updates. This is a no-op republish; it does not refresh `sourceEventAt`.

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
