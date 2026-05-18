---
title: Roadmap overview
description: How the team works through decisions, options, and research packets toward v1 and beyond.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/05-research-packets.md"
  - "3 claude/02-research-tasks.md"
  - "4 claude-dist/02-decisions.md"
---

This section is the live audit trail. It is the only part of the docs that changes weekly while v1 is in build.

## Five surfaces

| Page | What it holds |
|---|---|
| [Decision log](/roadmap-and-open-questions/decision-log/) | What is settled. One line per decision; full body with reasoning when contested. |
| [Options to decide](/roadmap-and-open-questions/options-to-decide/) | Open choices. Each entry lists the real alternatives, attribution-free. |
| [Open questions](/roadmap-and-open-questions/open-questions/) | Known unknowns that do not yet have options. |
| [Research packets](/roadmap-and-open-questions/research-packets/) | Bounded research dispatchable by Seb. Severity-tagged. |
| [Escalations](/roadmap-and-open-questions/escalations/) | Calls the team cannot close. Sit with Seb. |
| [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/) | Promising-but-deferred ideas, with a target version. |

## How a question moves

```text
Open question  ────►  Options to decide  ────►  Decision log
                       (when alternatives                (when one option wins
                        become real)                      via attestation in PR)

      ▲                          │
      │                          │
      │                          ▼
      └─────────  Research packets  ─────────────►  results inform option choice
                  (dispatchable lab work)
```

Anything in the queue that is currently blocking another v1 surface is **escalated** to Seb's queue.

## V1 launch path (today's best read)

The path is research-gated. The team can move on most of it in parallel.

1. **Packet 0** — Existing-prototype audit. Cheap, fast, unblocks Packet 1.
2. **Packet 1** — Frame Package contract. Unblocks Packets 2, 3, 4, 7.
3. **Packets 2, 3, 4** — Promotion state machine, Stream Manifest, Overlay contract. These three together describe the v1 system.
4. **Packet 7** — The two mandatory watch-builder frames.
5. **Packet 8** — Performance & accessibility CI gates.
6. **Packets 5, 6** — Vision pipeline benchmark and SVG-path overlay experiment. Determine whether SVG-path glow promotes to v1 or to v1.1.
7. **Packet 9** — Media pipeline benchmark. Determines image generator pick.
8. **Packet 11** — Hosting cost benchmark. Determines hosting choice.
9. **Packet 10** — Rights & CC0 legal review. Required before any external contributor; not v1-blocking.

A clean dispatch puts every v1-blocking result on the desk within one week. See [Research packets](/roadmap-and-open-questions/research-packets/) for the full list with severity tags.

## Decisions that are not roadmap material

If a question is closed (settled), it goes in the [Decision log](/roadmap-and-open-questions/decision-log/) and the related spec page is updated. The roadmap is for *in-flight* work; settled decisions live in the spec.

## Sources

- `docs/4 claude-dist/05-research-packets.md`
- `docs/3 claude/02-research-tasks.md`
- `docs/4 claude-dist/02-decisions.md`
