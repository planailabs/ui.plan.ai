---
title: Reading these docs
description: How humans and agents should navigate this site, and which sections are load-bearing for each.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/00-overview.md"
  - "4 claude-dist/00-the-council.md"
---

These docs are written for two audiences in parallel. Both are first-class; neither is an afterthought.

## For humans collaborating on the project

Read in this order:

1. [Welcome](/start-here/welcome/) — one-page orientation.
2. [What you're watching](/start-here/what-youre-watching/) — the product thesis.
3. **Foundations** — the *why* of each major design choice.
4. [Scope](/v1-plan/scope/) and [Non-goals](/v1-plan/non-goals/) — what is in and out of v1.
5. [Decision log](/roadmap-and-open-questions/decision-log/) and [Options to decide](/roadmap-and-open-questions/options-to-decide/) — what is settled and what is open.

You can stop reading any time. Specifications and Reference are lookup material, not required reading.

## For agents building the project

Read in this order:

1. [Specifications overview](/specifications/overview/) — how the artifacts fit together.
2. [Frame Package](/specifications/frame-package/) and [Stream Manifest](/specifications/stream-manifest/) — the artifact spine.
3. [Promotion state machine](/specifications/promotion-state-machine/) — the workflow you implement against.
4. [Glossary](/reference/glossary/) — canonical terms.
5. [Forbidden terms](/reference/forbidden-terms/) — words you must not use.

Implement only what is in `stable` or `working` pages. Pages tagged `proposed` or `future` are not yet contracts. See [Stability tags](/start-here/stability-tags/).

## Cross-cutting conventions

- **English only.** No German appears anywhere in the live sidebar, including in code samples and file paths.
- **Options admonitions.** Where a real choice exists, you will see a `:::tip[Options]` block listing alternatives without attribution. The team has not yet picked; the [Options to decide](/roadmap-and-open-questions/options-to-decide/) page is the master list.
- **Sources.** Every page ends with a `## Sources` block citing the brainstorm or distillation files it was synthesized from. Treat the cited files as the long-form record; this site is the canonical short-form.

## When pages disagree with each other

The most recent material is folder 7 — Codex's feedback on Claude's distillation. Where this site appears to contradict an earlier folder, this site wins. Where this site appears to contradict folder 7, file an issue. Where the live code disagrees with this site, the [`sync-docs-with-code`](/process/how-agents-propose/) skill is the way to reconcile.

## Sources

- `docs/3 claude/00-overview.md`
- `docs/4 claude-dist/00-the-council.md`
