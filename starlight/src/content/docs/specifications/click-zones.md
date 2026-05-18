---
title: Click zones & overlays
description: The contract for interactive regions on a frame and how the overlay renders them.
sidebar:
  order: 6
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 0 UI.md"
  - "1 brainstormings/20260517 1 Handoff.md"
  - "3 claude/03-tensions-and-tradeoffs.md"
  - "4 claude-dist/02-decisions.md"
---

A click zone is a non-visual interactive region on a frame. In v1 it is **agent-authored** as a rectangle or rounded rectangle, with visible hover/focus/pressed states. Vision pipelines (OmniParser, SAM 2, OpenCV) are QA-only in v1; they verify, they do not author.

In JSON, the field name is `clickZones`. In CSS, the class is `click-zone`. In prose, "click zone."

## The contract

```json
"clickZones": [
  {
    "id": "cz-001",
    "shape": "roundedRect",
    "bboxNorm": [0.12, 0.34, 0.41, 0.49],
    "cornerRadiusNorm": 0.01,
    "role": "button",
    "label": "Generate next idea",
    "action": "advance",
    "states": ["hover", "focus", "pressed"],
    "confidence": 0.97,
    "source": "agent-authored",
    "tabIndex": 1
  }
]
```

| Field | Type | Status | Description |
|---|---|---|---|
| `id` | string | required | Stable per frame. Pattern: `cz-<index>`. |
| `shape` | string | required | `"rect"` or `"roundedRect"` in v1. Polygons are `future`. |
| `bboxNorm` | `[x, y, w, h]` floats 0–1 | required | Normalized bounding box. |
| `cornerRadiusNorm` | float | optional | Required when `shape` is `"roundedRect"`. |
| `role` | string | required | One of: `button`, `card`, `link`, `tab`, `nav`, `input`, `share`, `connect`. |
| `label` | string | required | Public-safe label; surfaces as `aria-label`. |
| `action` | string | required | What activation does: `advance`, `inspect`, `pin`, `share`, `open-link`. |
| `states` | array | required | Subset of `["hover", "focus", "pressed", "active", "disabled", "loading", "selected"]`. v1 requires `hover`, `focus`, `pressed` for every zone. |
| `confidence` | float | optional | Authoring confidence; informs QA priority. |
| `source` | string | required | `"agent-authored"` (v1) or `"vision-derived"` (v2+). |
| `tabIndex` | integer | required | Reading order for keyboard traversal. Starts at 1. |

## Hit-target rules

- Minimum hit target is 44×44 CSS pixels (WCAG 2.5.5). The hitbox may be larger than the visible stroke.
- Mobile pressed state must fire on `pointerdown`, not `click`.
- Click zones must be keyboard-reachable. `tabIndex` order is the contract.
- `focus-visible` must produce a contrast ratio ≥ 3:1 against the underlying frame at the focus location.

## Rendering

The overlay renders click zones as SVG paths (not HTML `div`s, not Canvas). SVG scales responsively, animates cheaply, and respects accessibility tree semantics out of the box.

CSS class is `click-zone`; per-state classes are `click-zone--hover`, `click-zone--focus`, `click-zone--pressed`. Animation is CSS-only at adaptive Level 1; light animation at Level 2; reserved for future at Level 3 (SVG-path glow research packet).

## Reduced-motion

When `prefers-reduced-motion` is set, click-zone state changes do not animate. No pulse, no glow loop, no transition. The states are still visible (a static border change), just not animated.

## SVG-path glow (parallel research)

The brainstorms invested heavily in glowing button contours that follow the real button outline (OmniParser → SAM 2 → OpenCV → SVG path). This is a parallel research packet, not v1 surface. If the experiment lands before v1 launch, it promotes to v1; otherwise it ships in v1.1.

See [Research packets](/roadmap-and-open-questions/research-packets/) packet 6.

## Validation

CI runs three checks on every Frame Package's `clickZones`:

1. **Schema** — fields and types match the contract above.
2. **IoU vs. expected** — when a vision-derived shadow exists for the frame, the agent-authored zone must have IoU ≥ 0.8 with the closest vision-derived rectangle. Mismatches log a warning, not an error.
3. **OCR label match** — the OCR text under the zone must contain the `label` substring at ≥ 0.7 fuzzy match. Mismatches flag the frame for human review.

## Sources

- `docs/1 brainstormings/20260517 0 UI.md`
- `docs/1 brainstormings/20260517 1 Handoff.md`
- `docs/3 claude/03-tensions-and-tradeoffs.md`
- `docs/4 claude-dist/02-decisions.md`
