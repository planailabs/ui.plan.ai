---
title: Council fields
description: The public/private split for council content on a Frame Package.
sidebar:
  order: 8
stability: stable
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "4 claude-dist/00-the-council.md"
---

A Frame Package's `council` block carries two arrays. One is designed to be public. The other is internal-only. Treat them as separate authoring tasks, not as redaction levels of the same data.

## Shape

```json
"council": {
  "question": "Which next-frame candidate maximizes the soul thread without slipping the v1 schedule?",
  "publicSummary": [
    { "voice": "Produktherz", "line": "Pick the candidate that shows the council disagreeing, not the slick output." },
    { "voice": "Architekt",   "line": "Pick the candidate whose schema is already locked." }
  ],
  "sourcePositions": [
    { "voice": "Produktherz", "line": "Long-form note, may quote internal docs, may reference team-only context.", "atRun": "run_1779228000.main" }
  ],
  "decision": "Selected: cadence-console. Reasoning: schema locked + soul thread carried.",
  "decisionLogEntry": "decision-2026-05-18-001"
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `question` | string | required | The question the council was answering. Public-safe. |
| `publicSummary` | array of `{voice, line}` | required | **Public.** Short, public-designed sentences per voice. Projected to the Stream Manifest. |
| `sourcePositions` | array of `{voice, line, atRun?}` | required | **Private.** The raw working notes. Never projected. |
| `decision` | string | optional | The decision reached, in plain prose. Public. |
| `decisionLogEntry` | string | optional | Link to the [Decision log](/roadmap-and-open-questions/decision-log/) entry. Public. |

The `voice` field uses one of the canonical names from [Council voices](/reference/council-voices/).

## Designed-public, not redacted

`publicSummary` is **authored to be public** at the time the council runs. The team does not later strip a long note down to a sentence — that produces awkward, brittle public copy. The team writes a one-sentence public form *at the same time* as the source position.

This avoids two failure modes:

- **Leaks.** Long internal notes may reference third parties, costs, or unflattering self-assessment. Redacting later is fragile.
- **Voice quality.** A thoughtful one-liner reads differently from a transcript line. Authoring the public form directly produces better copy.

## What lands in the Stream Manifest

Only `publicSummary[]`, `question`, `decision`, and `decisionLogEntry` are projected. `sourcePositions[]` and any other internal field stay in the Frame Package.

A consistency check on every PR verifies that no `sourcePositions` content leaks into the Stream Manifest via copy-paste.

## Voices in v1

The five canonical voices are: Architekt, Produktherz, Skeptiker, Hüter, Bauer. See [Council voices](/reference/council-voices/) for the temperament of each. Adding a new voice requires a [Decision log](/roadmap-and-open-questions/decision-log/) entry.

In v1, the council may be populated by:

- Deterministic checks labeled with the voice (e.g., a performance budget check writes a `Hüter` line).
- Cheap LLM passes that adopt a voice for the duration of the question.

Multi-LLM debate is a v2 question.

## Council content on non-watch-builder frames

Every Frame Package has a `council` block, not just watch-builder frames. For most frames, the block records the council's reasoning behind the frame's existence, even though the visible output is just the frame itself. The inspect overlay surfaces this content.

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/4 claude-dist/00-the-council.md`
