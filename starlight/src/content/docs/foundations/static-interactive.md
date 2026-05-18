---
title: Static-Interactive architecture
description: The v1 architecture — generation-time work is rich and online; runtime is static, cacheable, and offline.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/02-decisions.md"
  - "4 claude-dist/06-challenges.md"
  - "1 brainstormings/20260518 Versions.md"
---

## The split

`ui.plan.ai` is structured around one architectural decision: a hard split between **generation time** and **runtime**.

| Generation time (offline) | Runtime (public) |
|---|---|
| Calls providers (image models, vision pipelines, OCR). | Makes zero external calls. |
| Runs the council, scores candidates, drafts Frame Packages. | Serves the Stream Manifest plus assets. |
| Produces Frame Packages and Acceptance attestations. | Cacheable end-to-end on a CDN. |
| Can take minutes per frame. | Targets LCP < 1.5s on 3G. |

The public runtime never depends on a provider being up, an agent being responsive, or a database being reachable.

## Why this matters

Three reasons, in order of importance:

1. **Safety.** No public surface can leak private data via a hot provider call, because there are no provider calls at runtime.
2. **Performance.** Static, cacheable HTML/CSS/JS plus pre-projected JSON beats any dynamic backend on the budget v1 enforces (LCP < 1.5s on 3G, < 50kB JS).
3. **Reliability.** A provider outage, a council deadlock, or a quota cap stalls the *next frame*; it never breaks what is already public.

## What "static-interactive" rules out

- No serverless functions hit at runtime.
- No client-side calls to model providers.
- No database reads from the public page.
- No webhooks that wake the public surface.
- No live agent activity rendered into the public stream.

Anything in that list is by definition a v2+ capability and needs an explicit decision to enter the runtime.

## What "static-interactive" allows

- Click-zone overlays, animated pulses, crossfades.
- A pinnable timeline, an inspectable overlay, council summaries.
- Pre-projected per-frame JSON consumed by the client.
- Adaptive levels (0–3) selected based on device capability.

Everything in this list is implementable as static assets plus client-side JS reading static JSON.

## The first dynamic capability trigger

When the first capability that genuinely cannot be served by static files emerges (multi-tenant user streams, a true live agent indicator, a search index large enough to require a backend), the static-interactive guarantee will need a named exception. We are not designing for it now. The deferred decision is tracked in [Options to decide](/roadmap-and-open-questions/options-to-decide/).

## What this implies for the team

- Every feature request gets the "does this break if a provider goes down?" test.
- Every Frame Package field is reviewed for public/private leak: public fields go in the Stream Manifest; private fields stay in the Frame Package.
- Every PR adds entries to the build pipeline, not the runtime.

## Sources

- `docs/4 claude-dist/02-decisions.md`
- `docs/4 claude-dist/06-challenges.md`
- `docs/1 brainstormings/20260518 Versions.md`
