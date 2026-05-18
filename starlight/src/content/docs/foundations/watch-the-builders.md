---
title: Watch The Builders
description: The soul thread — making agent decision-making visible inside the product itself.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/03-watch-the-builders.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "7 codex-claude-dist-feedback/02-response-to-challenges.md"
---

## Why the soul thread exists

Most AI-generated UI products optimize for the artifact. `ui.plan.ai` optimizes for the *visible reasoning behind the artifact*. The soul thread is the running thesis that visitors should see agents making choices, not just outputs.

If a visitor finishes their session unable to point at a specific moment of agent decision-making, the soul thread has failed for that session.

## The minimum viable soul (v1)

Four pieces. Any fewer and v1 is a screenshot gallery.

1. **Primer frame** — a ten-second "what you are watching" frame that opens the stream.
2. **Next-frame selector** — a watch-builder frame showing the candidates the council considered, who proposed each, and which is queued next.
3. **Promotion-readiness board** — a watch-builder frame showing what is blocking the next merge to public (acceptance pending, license check pending, council unresolved, performance check pending).
4. **Static-interactive overlay** — progress bar, pin, timeline strip, visible click-zone states. The visitor controls the pace.

See [Watch-builder frames](/specifications/watch-builder-frames/) for the contracts that govern frames 2 and 3.

## Watch-builder frames beyond the floor

Four additional watch-builder frames have been identified as `future` candidates:

- A council discussion frame (a short transcript-style view of the dissent on one decision).
- A research-packet status frame (which packets are in flight, which closed).
- A blockers-and-bets frame (escalations, open options).
- A retro frame (what shipped this week, what slipped).

None of these are committed for v1. They appear in the [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/) list.

:::tip[Options]
Open: when do the two mandatory watch-builder frames ship?

- **A.** At v1 launch — the soul thread is non-negotiable from day one.
- **B.** At v1.1 (2–4 weeks after launch) — ship a quieter v1 first, then layer in the watch-builder frames once the static-interactive surface is proven.

Tracked in [Escalations](/roadmap-and-open-questions/escalations/) as the decision for Seb.
:::

## Freshness semantics

Any surface that claims "agents are working on this" carries time stress. To avoid drift between the product's implied liveness and the actual recency of the work, every watch-builder frame must declare:

- The source event time (when the underlying decision happened).
- The published time (when this frame was bound to public).
- A stale threshold (when this frame should be flagged as stale).
- A visible stale state (what the visitor sees if the threshold has passed).

See [Freshness semantics](/specifications/freshness-semantics/).

## Public summaries, not raw logs

Watch-builder frames publish *summaries*, not raw council transcripts or agent logs. Internal source positions live in the Frame Package's `council.sourcePositions[]` field and never appear in the Stream Manifest. See [Council fields](/specifications/council-fields/).

## How the soul shows up in interactions

The first six interactions of a v1 session should produce at least one moment of visible agent decision-making. The interaction inventory is sorted into must / should / could tiers in [First six interactions](/v1-plan/first-six-interactions/).

## Sources

- `docs/4 claude-dist/03-watch-the-builders.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/7 codex-claude-dist-feedback/02-response-to-challenges.md`
