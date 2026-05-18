---
title: Superseded ideas
description: Ideas dropped between folder 1 and folder 7, with the reason each was set down.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/04-naming-and-glossary.md"
  - "4 claude-dist/02-decisions.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

Ideas that appeared in earlier folders and were deliberately dropped. They are listed here so contributors do not re-propose them as new without understanding why they were set down.

Listed in alphabetical order.

## "Depth" as a field

Used with four incompatible meanings (hierarchy / z-index / interaction-drill / timeline-nesting). Banned as a [forbidden term](/reference/forbidden-terms/). Replaced by `parentId`, `zIndex`, `drillLevel`, `streamPath` depending on what was meant.

## Frame Envelope (the name)

The brainstorms used both "frame envelope" and "content envelope" for the canonical artifact. The artifact is now called [Frame Package](/specifications/frame-package/). "Envelope" survives only as a protocol concept name in some `future` material.

## Full Hub (in v1)

The brainstorms imagined a rich side-panel Hub with categories, social distribution, agent decision visibility. V1 ships only the minimal overlay. The full Hub is in [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/).

## "Hold" as the verb for pin

Drifted with `pause` and `lock`. Canonical verb is [`pin`](/reference/glossary/).

## "Home stream"

Implied a user homepage. The route is just the stream. Replaced by `stream`.

## Livestream-to-YouTube in v1

Server-based streaming via headless Playwright + FFmpeg. Promising; not v1. Moved to v2 candidates.

## Multi-LLM council debate in v1

Expensive, slow, can produce confidently wrong output. V1 council is a logged ruleset or cheap single-pass LLM voices. Real multi-LLM debate is a v2 decision.

## Multi-tenant URLs in v1

`/u/{username}/` routes with per-user streams. Requires authentication, tenancy model, and the matrix `{public, unlisted, private, team} × {CC0, non-CC0}`. V2.

## n8n in v1

Workflow orchestration. May not scale; adds complexity. V1 uses bare scripts plus GitHub Actions.

## Public council transcripts

The brainstorms imagined publishing raw council notes. V1 publishes only `publicSummary[]` — short, designed-public sentences. The raw `sourcePositions[]` stays private. See [Council fields](/specifications/council-fields/).

## "Raw logs" as a public surface

Folder-4 imagined raw agent logs as a public artifact. Folder 7 superseded this: public surfaces show summaries, not raw logs. The summary form is the contract.

## "Signed" acceptance

The brainstorms and earlier distillations called the acceptance JSON "signed." No cryptographic signing exists in v1. The honest term is **attested** — a verified GitHub identity committing the file. See [Acceptance](/specifications/acceptance/).

## Supabase in v1

A hosted Postgres backend with RLS. Earns its place only when the first dynamic capability that static files cannot serve emerges. Until then, all data is static JSON in the repo.

## ThinkPad as production agent node

Charming idea (the team's actual hardware), but production should not depend on a residential IP and consumer hardware. ThinkPad is dev-only. Production runs on GitHub Actions plus APIs.

## "Two version dimensions" expanded to five

The brainstorms proposed `appVersion`, `runtimeVersion`, `streamRevision`, `schemaVersion`, `variant`. V1 uses only the first and the fourth. See [Principles](/v1-plan/principles/) — principle 3.

## Video / animated frames in v1

Image-to-video pipelines, FFmpeg post-processing, seamless loops. V1 is stills only. Video is v2 / Adaptive Level 3.

## Why preserved here

Contributors propose deferred ideas as new from time to time. This page is the answer: "Yes, that was considered; here is why it is not in v1." A re-proposal needs to address the reason listed, not just the merit.

To promote a superseded idea, file a [Decision log](/roadmap-and-open-questions/decision-log/) entry naming the original reason and the new evidence that overrides it.

## Sources

- `docs/3 claude/04-naming-and-glossary.md`
- `docs/4 claude-dist/02-decisions.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
