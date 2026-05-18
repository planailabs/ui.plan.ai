---
title: Decision log
description: What is settled. One line per decision; expand for reasoning.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/07-decision-log.md"
  - "4 claude-dist/02-decisions.md"
  - "6 codex-dist/02-decision-board.md"
---

Settled decisions. Each entry records: what was decided, the day it was decided, the related spec pages, and what would reopen it.

## Decisions

### D-2026-05-18-001 — Frame Package is the v1 canonical artifact

Decided. Every other artifact — Manifests, route bindings, social cards, click-zone JSON — derives from the Frame Package. Public/private projection rules apply.

Related: [Frame Package](/specifications/frame-package/), [Stream Manifest](/specifications/stream-manifest/).

Revisit when: a second artifact type emerges that genuinely is not derivable from the package.

### D-2026-05-18-002 — Agents commit, humans promote

Decided. No fully autonomous public-route changes in v1. PR merge by a verified team identity, plus an `acceptance.json`, is the promotion event.

Related: [Promotion gate philosophy](/foundations/promotion-gate/), [Acceptance](/specifications/acceptance/).

Revisit when: enough automated QA exists to safely auto-approve a defined sub-class of frames.

### D-2026-05-18-003 — Stream opens directly; first frame is a 10-second primer

Decided. `ui.plan.ai` opens into the current stream. The first frame in every stream is a "what is this" primer written by the council.

Related: [What you're watching](/start-here/what-youre-watching/), [Watch-builder frames](/specifications/watch-builder-frames/).

Revisit when: the primer is tested with three first-time visitors and at least two read it wrong.

### D-2026-05-18-004 — V1 cutline is static-interactive with six interactions

Decided. The overlay must ship all of: progress bar, pin, hover/focus/pressed click-zone states, inspect mode, share-link, timeline scrub. Cutting any of these = cutting from v1, not deferring.

Related: [Scope](/v1-plan/scope/), [First six interactions](/v1-plan/first-six-interactions/).

Revisit when: any of those six fails a 30-second usability test with a first-time visitor.

### D-2026-05-18-005 — Harvest from `/uiai`, defer structural merge

Decided. v1 takes specific patterns from the `/uiai` prototype (timeline drawer, inspect mode, `_README.md` routing rule, reduced-motion implementation, video-activation as a v2 hook). Structural merge is v2.

Related: [Scope](/v1-plan/scope/). Treat the `/uiai` and `/ui` prototypes as abandoned in favor of the new project; this decision applies as pattern guidance, not as code migration.

Revisit when: a third prototype direction tempts the team to start `ui.plan.ai-v3/`.

### D-2026-05-18-006 — Click zones are agent-authored rectangles in v1

Decided. Rect and rounded-rect, agent-authored, with visible hover/focus/pressed states. Vision pipelines (OmniParser / SAM 2 / OpenCV) are QA-only in v1. SVG-path glow is a parallel research packet that may promote to v1 if it lands in time.

Related: [Click zones & overlays](/specifications/click-zones/), [Research packets](/roadmap-and-open-questions/research-packets/) packets 5 and 6.

Revisit when: the experiment is binary done — v1 has SVG glow or it does not.

### D-2026-05-18-007 — No Supabase in v1

Decided. No backend, no database, no public API in v1. A thin "agent thinking now" channel, if it ships, ships as a static-cacheable JSON file updated at commit time.

Related: [Static-Interactive architecture](/foundations/static-interactive/).

Revisit when: a real dynamic capability emerges that genuinely cannot be served by a static file.

### D-2026-05-18-008 — Two agents in v1: Generation and QA/Promotion

Decided. The council is a logged ruleset (with deterministic checks or cheap single-pass LLM voice runs) populating the Frame Package's `council` field. Real multi-LLM debate is a v2 question.

Related: [The council mechanic](/foundations/council-mechanic/), [Council fields](/specifications/council-fields/).

Revisit when: the inspect overlay ships and a visitor can read the council artifact without internal-doc knowledge.

### D-2026-05-18-009 — CC0 default with attested team acceptance

Decided. Asset-level license fields. Stream-level default is CC0. Third-party content marked at the region level; mixed-license frames are non-CC0 as a whole. Acceptance is a JSON file committed by a verified GitHub identity in the team.

Related: [CC0 & human acceptance](/foundations/cc0-and-acceptance/), [Acceptance](/specifications/acceptance/).

Revisit when: the first non-team person submits a frame.

### D-2026-05-18-010 — V1 performance and accessibility budgets are fail-closed CI gates

Decided. WCAG AA. LCP < 1.5s on 3G. CLS = 0. INP < 200ms. Shell JS < 50kB gz, CSS < 20kB gz. Reduced-motion is strict (off, not reduced). Alt text required in the Frame Package schema. CI gates fail closed.

Related: [Performance budgets](/v1-plan/performance-budgets/), [Accessibility](/v1-plan/accessibility/), [Reduced-motion](/v1-plan/reduced-motion/).

Revisit when: a real user reports a janky session despite hitting the budget.

## Pending decisions

See [Options to decide](/roadmap-and-open-questions/options-to-decide/) for what is currently being chosen between, and [Escalations](/roadmap-and-open-questions/escalations/) for calls the team cannot close.

## Format

Future decision-log entries follow the shape:

```md
### D-YYYY-MM-DD-NNN — Short title

Decided. One-paragraph description.

Related: [related spec page A](/specifications/overview/), [related spec page B](/specifications/overview/).

Revisit when: <trigger>.
```

The ID encodes the date the entry was committed plus a serial.

## Sources

- `docs/3 claude/07-decision-log.md`
- `docs/4 claude-dist/02-decisions.md`
- `docs/6 codex-dist/02-decision-board.md`
