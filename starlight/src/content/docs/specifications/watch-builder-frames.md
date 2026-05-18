---
title: Watch-builder frames
description: The special frame subtype that surfaces agent decision-making.
sidebar:
  order: 7
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/03-watch-the-builders.md"
  - "7 codex-claude-dist-feedback/02-response-to-challenges.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

A watch-builder frame is a Frame Package whose subject is the agents' own work. It carries the [soul thread](/foundations/watch-the-builders/) into the visible stream.

In v1, two watch-builder frames are mandatory:

1. **Next-frame selector** — which candidates the council considered, who proposed each, and which is queued next.
2. **Promotion-readiness board** — what is blocking the next merge to public (council unresolved, license pending, performance failing, etc.).

The launch timing for these two frames is open. See [Escalations](/roadmap-and-open-questions/escalations/).

## Frame Package extensions

A watch-builder frame uses the standard [Frame Package](/specifications/frame-package/) shape, plus a `watchBuilder` block:

```json
"watchBuilder": {
  "subtype": "next-frame-selector",
  "subjectAgentRunId": "run_1779228000.main",
  "sourceEventAt": "2026-05-18T11:42:00Z",
  "candidates": [
    {
      "frameId": "ui-en-v1-cadence-console",
      "proposedBy": "generationAgent",
      "councilNote": "High soul, medium evidence, low scope risk.",
      "selected": true
    }
  ],
  "blockers": [],
  "decisionLogEntry": "decision-2026-05-18-001"
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `subtype` | string | required | `"next-frame-selector"`, `"promotion-readiness-board"`, or one of the `future` subtypes. |
| `subjectAgentRunId` | string | required | The agent run whose work this frame is about. |
| `sourceEventAt` | string (ISO 8601) | required | When the underlying decision happened. Used for [Freshness](/specifications/freshness-semantics/). |
| `candidates` | array | required for `next-frame-selector` | Each candidate's frameId, proposer, council note, selection. |
| `blockers` | array | required for `promotion-readiness-board` | Each blocker's category, frameId (if any), human-readable description. |
| `decisionLogEntry` | string | optional | Link to the [Decision log](/roadmap-and-open-questions/decision-log/) entry, if a decision was reached. |

## Subtypes

### `next-frame-selector` (v1 mandatory)

Shows the candidates the council considered for the next public frame, with the council's short note per candidate and the selected one.

The visible output is:

- A list of 2–5 candidate frames, each with title and a one-sentence council note.
- The selected candidate, marked.
- The decision-log entry that recorded the selection.

### `promotion-readiness-board` (v1 mandatory)

Shows what is blocking the next promotion to public.

The visible output is a checklist:

- ✅ Council positions complete
- ✅ License reviewed
- ⏳ Acceptance pending (awaiting `seb`)
- ❌ Performance budget exceeded (LCP 1.8s on 3G, budget 1.5s)

A frame with zero blockers is the next one to be merged.

### Future subtypes

- `council-discussion` — a transcript-style view of dissent on one decision.
- `research-packet-status` — packets in flight, packets closed.
- `blockers-and-bets` — escalations and open options visualized.
- `retro` — what shipped this week, what slipped.

None of these are v1. Listed in [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/).

## Freshness behavior

A watch-builder frame must declare `sourceEventAt`, `publishedAt`, and a stale threshold via the Stream Manifest's `freshness` block. The overlay surfaces a visible "stale" state if the threshold has passed. See [Freshness semantics](/specifications/freshness-semantics/).

A `next-frame-selector` whose selected candidate has already been bound is not stale — it is closed. The overlay marks it `closed`, not `stale`.

## Public summaries only

Watch-builder frames publish summaries, never raw council transcripts or raw agent logs. The `council.publicSummary[]` projection from [Council fields](/specifications/council-fields/) applies. `council.sourcePositions[]` stays private.

## Sources

- `docs/4 claude-dist/03-watch-the-builders.md`
- `docs/7 codex-claude-dist-feedback/02-response-to-challenges.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
