---
title: Distillation history
description: How the brainstorms became this site — the intermediate analysis and distillation passes.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/"
  - "4 claude-dist/"
  - "6 codex-dist/"
  - "7 codex-claude-dist-feedback/"
---

The team ran the brainstorms through a structured distillation. Two LLM passes plus a feedback round produced the material this site is built on. The passes are preserved in `docs/` folders 2 through 7 for traceability.

## The passes

### Pass 1 — Clarity questions (`docs/2 codex/`)

A first read identified ambiguities, surfaced questions, and tested whether the brainstorms named a single coherent product or several. Folder 2 is one file (`2026-05-18-clarity-questions.md`) plus a README.

Took as input: folder 1.
Produced as output: a backlog of questions ranked P0–P3.

### Pass 2 — Structured analysis (`docs/3 claude/`)

A more structured pass produced eight files:

- `00-overview.md` — the project surface as understood.
- `01-questions.md` — 25 question sections with one-line takes and defaults.
- `02-research-tasks.md` — 16 parallelizable research tasks.
- `03-tensions-and-tradeoffs.md` — 16 named tensions.
- `04-naming-and-glossary.md` — the canonical names and forbidden words.
- `05-principles-and-non-goals.md` — ten principles, twelve non-goals.
- `06-v1-shape.md` — the "Friday recipe" v1 cutline.
- `07-decision-log.md` — a scaffold with format only.

Took as input: folders 1 and 2.
Produced as output: the glossary, the principles, the v1 cutline shape, the research-task backlog.

### Pass 3a — Council distillation (`docs/4 claude-dist/`)

A council-format distillation: five named voices (Architekt, Produktherz, Skeptiker, Hüter, Bauer) take positions on every contested decision. Closed with a "Chair's call" or an explicit escalation.

Files:

- `00-the-council.md` — the voices and their temperaments.
- `01-anchor-and-shape.md` — the anchor decisions.
- `02-decisions.md` — eleven contested decisions, ten closed.
- `03-watch-the-builders.md` — the soul thread.
- `04-tensions.md` — named tensions with defaults.
- `05-research-packets.md` — 12 dispatchable packets.
- `06-challenges.md` — the questions the council cannot yet answer.
- `07-open-questions.md` — open questions for Seb.

Took as input: folders 1, 2, 3.
Produced as output: the decision log, the research packets, the watch-builder framing, the soul thread.

### Pass 3b — Parallel distillation (`docs/6 codex-dist/`)

A parallel distillation produced similar artifacts independently:

- `01-council-memo.md`
- `02-decision-board.md`
- `03-roadmap-options.md`
- `04-research-packets.md`
- `05-option-matrix.md`
- `06-open-questions.md`

Took as input: folders 1, 2, 3.
Produced as output: a second view used to cross-check pass 3a.

(There is no folder 5; the numbering is the team's chronology.)

### Pass 4 — Feedback round (`docs/7 codex-claude-dist-feedback/`) — **most recent**

A critical pass on the pass-3a distillation:

- `00-codex-feedback.md` — overall feedback.
- `01-proposed-edits.md` — specific edits, field-level.
- `02-response-to-challenges.md` — answers to pass 3a's open challenges.
- `03-latest-update-response.md` — final update.

Took as input: folder 4.
Produced as output: the freshness semantics, the `publicSummary`/`sourcePositions` split, the watch-builder timing escalation, the option-ranking discipline.

## What survived from each pass

| Pass | Most load-bearing output |
|---|---|
| Folder 2 (Codex questions) | The clarity backlog that organized later passes. |
| Folder 3 (Claude analysis) | The glossary, principles, non-goals. |
| Folder 4 (Claude distillation) | The decisions, the research packets, the council format. |
| Folder 6 (Codex distillation) | The option matrix and decision board. |
| Folder 7 (Codex feedback) | Freshness semantics, the public/source field split, the watch-builder escalation. |

## What this site supersedes

This site replaces the working-notes nature of folders 2–7 with one canonical surface. The folders remain in the repo as the audit trail; they are read-only and never updated.

When this site disagrees with the folders, this site wins (except for folder 7, which is more recent than this site's first draft — drift between this site and folder 7 is a [Quick win](/process/quick-wins/) for the consistency audit to flag).

## Sources

- `docs/3 claude/`
- `docs/4 claude-dist/`
- `docs/6 codex-dist/`
- `docs/7 codex-claude-dist-feedback/`
