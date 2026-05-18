---
title: Welcome
description: A five-minute orientation to ui.plan.ai — what it is, who it is for, and how to read these docs.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/00-the-council.md"
  - "4 claude-dist/01-anchor-and-shape.md"
  - "1 brainstormings/20260518 Versions.md"
---

`ui.plan.ai` is a public, static-interactive stream where visitors watch agents build Plan.ai/UI itself, frame by frame.

The bootstrap is the thesis: **the product you are watching is the product being built.** Agents propose frames; humans merge them; the public stream advances. Every promotion is a recorded act of decision-making, surfaced in the product itself.

## What v1 is

A single route serving one curated stream of generated UI frames, with:

- A **static interactive overlay** (progress bar, pin, timeline, click-zone states, strict reduced-motion).
- The **Frame Package** as the canonical source artifact behind every frame.
- Two mandatory **watch-builder** frames (next-frame selector + promotion-readiness board) that make agent decision-making visible.
- Visible **council summaries** in the inspect overlay, surfacing which agent voices debated each frame.
- **CC0** by default with attested team acceptance per frame.
- **WCAG AA** accessibility and strict performance budgets (LCP < 1.5s on 3G, < 50kB JS).

For the full cutline, see [Scope](/v1-plan/scope/).

## What v1 is not

No backend, no multi-tenant URLs, no public API, no video, no full Hub, no live agent activity, no billing. See the full list in [Non-goals](/v1-plan/non-goals/).

## How to read these docs

These docs serve two audiences in parallel: humans collaborating on the project, and agents building it from the specs.

- **Foundations** explains *why* — the product thesis, the soul thread, the architecture decisions.
- **Specifications** is *what* — canonical contracts. Agents implement against this section.
- **The v1 Plan** is *the cutline* — scope, principles, non-goals, budgets.
- **Roadmap & Open Questions** is the live audit trail — decisions, options to decide, research packets.
- **Reference** is lookup-only — glossary, schemas, conventions.
- **Process** is *how we work* — PR flow, promotion workflow, contributing.
- **Archive** preserves the brainstorms and the audit trail; it is not load-bearing.

If you only have ten minutes, read [What you're watching](/start-here/what-youre-watching/), then [Frame Package](/specifications/frame-package/).

## Stability — these docs evolve

The project is alive. Every page declares a stability tag in its frontmatter — `stable`, `working`, `proposed`, `future`, or `archived`. See [Stability tags](/start-here/stability-tags/) for what each means and how to read them.

## Sources

- `docs/4 claude-dist/00-the-council.md`
- `docs/4 claude-dist/01-anchor-and-shape.md`
- `docs/1 brainstormings/20260518 Versions.md`
