---
title: Open questions
description: Known unknowns that do not yet have concrete options to decide between.
sidebar:
  order: 4
stability: working
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/07-open-questions.md"
  - "6 codex-dist/06-open-questions.md"
  - "2 codex/2026-05-18-clarity-questions.md"
---

Things the team knows it does not know — but the alternatives are not concrete enough to list as options yet. When alternatives emerge, the entry moves to [Options to decide](/roadmap-and-open-questions/options-to-decide/).

## Q-001 — Does watching agents work feel like watching anything?

The C1a test. Three first-time visitors on the current prototype. Does it feel like watching the builders, or like an AI screenshot gallery? Until this is answered, every other v1 decision is downstream.

Cheap to test, expensive to delay. Cost: ~1 day, 3 testers.

## Q-002 — Does the launch sequence land the story?

The C1b test. Walk three strangers through the first six interactions in order, with light prompting. Each interaction rated 1–3 on "felt like watching the builders." The result either confirms or refutes [First six interactions](/v1-plan/first-six-interactions/).

## Q-003 — Legal mechanics of attested acceptance

What "attested acceptance" means for CC0 to stick under EU law. What jurisdictions enforce it. What propagation rules apply when a frame is forked. What takedown obligations apply.

Needs a lawyer's read. Not v1-blocking; blocking before any external contributor. Tracked as [Research packet 10](/roadmap-and-open-questions/research-packets/#packet-10-rights-cc0-mechanics-legal-review).

## Q-004 — Exit criteria for autonomy stage 1 → 2

V1 is stage 1 of the autonomy ladder (humans approve every promotion). The criteria that let stage 2 (agents auto-promote a defined sub-class) open up are not yet drafted.

Likely components: a quality threshold, a leak-surface audit, a council vote, a rollback drill. Not v1-blocking; relevant for v1.1 planning.

## Q-005 — What does the soul thread require at scale?

V1 is single-tenant. If the product grows, the soul thread mechanic needs a brand-neutral form so that "watching the builders" works for any team, not only Plan.ai/UI. The mechanics of that generalization are not drafted.

Tracked as a v2 concern.

## Q-006 — Where does the live-feel JSON live?

If the v1.1 "agent thinking now" channel ships as a static JSON file, where does it live? In the public/ directory? In a separate repo? Behind a CDN with no auth? The mechanics are still being shaped.

## Q-007 — Migration path for the 46 existing packages

The brainstorms reference 46 existing Frame Package files from the abandoned prototype. The new project starts fresh. Some packages contain ideas worth porting; the curation rule is undefined.

Likely answer: cherry-pick by hand during early v1 frame authoring, no automated migration. Not blocking; surfaces as a quick-win once the new project's spec is written.

## Q-008 — How does freshness apply to non-watch-builder frames?

[Freshness semantics](/specifications/freshness-semantics/) is clear for watch-builder frames. For evergreen content frames, the `freshness` block is optional — but should it be? An evergreen frame with no freshness declaration may mislead a visitor who assumes everything on the site is "agents working now."

Likely answer: every frame declares a `freshness` block, with a long `staleAfter` for evergreen content. Tracked as a small spec clarification.

## How to add an open question

An entry on this page should:

- Name a known unknown the team cannot answer today.
- Describe what would need to happen for it to become an option.
- Not duplicate anything already in [Options to decide](/roadmap-and-open-questions/options-to-decide/).

When alternatives become concrete, move the entry there.

## Sources

- `docs/4 claude-dist/07-open-questions.md`
- `docs/6 codex-dist/06-open-questions.md`
- `docs/2 codex/2026-05-18-clarity-questions.md`
