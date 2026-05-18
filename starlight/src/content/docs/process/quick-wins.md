---
title: Quick wins backlog
description: Small, mechanical, low-risk improvements to land alongside v1 spec work.
sidebar:
  order: 3
stability: working
last_synced_with: "folder-7"
sources:
  - "3 claude/06-v1-shape.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

Quick wins are mechanical, low-risk improvements that ride along with the spec work. Each is dependency-labeled — some are immediate, some unblock only after a research packet lands.

| # | Quick win | Dependency | Effort |
|---|---|---|---|
| 1 | Lock `frame.altText` as a required field. | `do-now` | < 1 hour. |
| 2 | Add `acceptance` block frontmatter to the Frame Package schema skeleton. | `do-now` | < 1 hour. |
| 3 | Standardize click-zone JSON key as `clickZones` (camelCase). | `do-now` | < 1 hour. |
| 4 | Add `LICENSE.md` to the new project repo (CC0). | `do-now` | < 1 hour. |
| 5 | Add `promotions/team.json` allow-list skeleton with `seb` as the first entry. | `do-now` | < 1 hour. |
| 6 | Wire the [Forbidden terms](/reference/forbidden-terms/) grep into CI for the docs folder. | `do-now` | 1–2 hours. |
| 7 | Normalize variant dimensions across all v1 frames to 1672×941 / 941×1672 / 480×270. | `do-after-Packet-1` | 1 day. |
| 8 | Extract any inline-frames array into a checked-in manifest before frame #20. | `do-after-Packet-1` | 1 day. |
| 9 | Set the overlay frame-display + crossfade timing (display 8000ms, crossfade 800ms) so frames stand still long enough to read. | `do-after-Packet-4` | < 1 hour once contract lands. |
| 10 | Add `:focus-visible` style with ≥ 3:1 contrast on every click zone. | `do-after-Packet-4` | half day. |
| 11 | Add a `sync-docs-with-code` skill at `.claude/skills/sync-docs-with-code/SKILL.md`. | `do-now` | This iteration. |
| 12 | Add `## Sources` consistency check to CI. | `do-now` | 1 hour. |

## Dependency labels

- **`do-now`** — no prerequisites. Take in the first available sprint.
- **`do-after-Packet-N`** — wait for [Research packet N](/roadmap-and-open-questions/research-packets/) to land before starting.
- **`do-with-launch`** — does not need to ship before launch; ride along with the launch PR.

## When a quick win is not a quick win

If a "quick win" item starts requiring spec changes, a council position, or more than one day, it stops being a quick win. It moves to [Options to decide](/roadmap-and-open-questions/options-to-decide/) or [Open questions](/roadmap-and-open-questions/open-questions/) instead.

## Sources

- `docs/3 claude/06-v1-shape.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
