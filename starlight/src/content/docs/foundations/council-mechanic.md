---
title: The council mechanic
description: How named agent voices surface dissent both in planning and in the product itself.
sidebar:
  order: 4
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/00-the-council.md"
  - "7 codex-claude-dist-feedback/00-codex-feedback.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

## What the council is

The council is a structured way to keep dissent visible. Five named voices — Architekt, Produktherz, Skeptiker, Hüter, Bauer — take positions on the same question and refuse to flatten into consensus. The output is either a decision (recorded in [Decision log](/roadmap-and-open-questions/decision-log/)) or an option (recorded in [Options to decide](/roadmap-and-open-questions/options-to-decide/)).

Each voice's default temperament is described in [Council voices](/reference/council-voices/).

## Two surfaces

The council mechanic shows up in two places:

### 1. Planning (internal)

Where the team needs to make a hard call, the question is run through the council. The five positions are drafted in a private artifact. Once a decision is reached, it lands in the decision log; the source positions stay private.

This site is the result of that process. You see decisions and options; you do not see the raw positions that produced them.

### 2. Product (public, on watch-builder frames)

A Frame Package may carry a `council.publicSummary[]` array. Each entry is a short, public-safe sentence written *to be public* — not redacted from internal notes. The Stream Manifest projects only this array into the inspect overlay.

The Frame Package also carries a `council.sourcePositions[]` array for the team's records. **This field never enters the Stream Manifest.** It is the source-of-truth record of who said what.

See [Council fields](/specifications/council-fields/) for the contract.

## Why we split `publicSummary` from `sourcePositions`

Two separate failure modes drive the split:

- **Leak risk** — internal positions sometimes name third parties, costs, or unflattering self-assessment. Redacting after the fact is fragile.
- **Voice quality** — a thoughtful one-liner written for a public audience reads differently from a transcript line written in a working session. Authoring the public form directly is faster and better.

Treat `publicSummary` as a designed-public artifact. Treat `sourcePositions` as raw notes.

## What lands in the product

A visitor inspecting a watch-builder frame sees:

- The question the council was answering.
- One short sentence per voice that took a position.
- The decision that was reached (if any), and a link to the decision log.

No raw quotes. No attribution beyond the named voice. No timestamps below the day.

## What the team can do that the visitor cannot

The team can read the source positions, the timestamps, the cost and quality signals, and the in-flight options. None of that crosses the [Promotion gate](/foundations/promotion-gate/).

## Sources

- `docs/4 claude-dist/00-the-council.md`
- `docs/7 codex-claude-dist-feedback/00-codex-feedback.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
