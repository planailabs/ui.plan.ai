---
title: Options to decide
description: Open choices. Each entry lists the real alternatives, attribution-free.
sidebar:
  order: 3
stability: working
last_synced_with: "folder-7"
sources:
  - "3 claude/03-tensions-and-tradeoffs.md"
  - "4 claude-dist/04-tensions.md"
  - "6 codex-dist/05-option-matrix.md"
---

These are the open choices the team has to make. Each entry lists the real alternatives — no "who proposed what." When an entry is decided, it moves to the [Decision log](/roadmap-and-open-questions/decision-log/).

## O-001 — Watch-builder frame launch timing

The two mandatory watch-builder frames (next-frame selector and promotion-readiness board) are decided as v1 floor. The open question is *when* they ship.

:::tip[Options]
- **A. At v1 launch.** The soul thread is non-negotiable from day one. The launch story is "watch the builders," so the watch-builder frames cannot be a v1.1 add.
- **B. At v1.1 (2–4 weeks after launch).** Ship a quieter v1 first. Let the overlay and timing fixes prove out, then layer in the watch-builder frames once the schema is locked.
- **C. Conditional.** Ship at v1 if Packet 1 (Frame Package contract) lands by a named date; otherwise v1.1.
:::

Escalated to Seb. See [Escalations](/roadmap-and-open-questions/escalations/).

## O-002 — Image generator pick

The brainstorms list 5+ candidates. V1 needs one primary and one fallback.

:::tip[Options]
- **A.** OpenAI Image primary; Imagen fallback.
- **B.** Imagen primary; FLUX fallback.
- **C.** Recraft primary; OpenAI Image fallback.
:::

Resolved by [Research packet 9](/roadmap-and-open-questions/research-packets/#packet-9-media-pipeline-benchmark). Picks the winner on legibility, layout consistency, and cost.

## O-003 — Upscaler pick (if any)

Whether to upscale masters before deriving delivery formats.

:::tip[Options]
- **A.** No upscaling in v1. Masters are used directly.
- **B.** Topaz Gigapixel API in the build pipeline.
- **C.** Krea Enhancer in the build pipeline.
- **D.** Real-ESRGAN (open-source, local).
:::

Resolved by [Research packet 9](/roadmap-and-open-questions/research-packets/#packet-9-media-pipeline-benchmark).

## O-004 — Hosting choice

The brainstorms assumed Cloudflare-for-everything; folder-1 warned to verify costs.

:::tip[Options]
- **A.** Cloudflare Pages + R2 + Images + Stream.
- **B.** GitHub Pages + Bunny CDN.
- **C.** Cloudflare-only with cache.
- **D.** R2 + Cloudinary.
- **E.** S3 + CloudFront.
:::

Resolved by [Research packet 11](/roadmap-and-open-questions/research-packets/#packet-11-hosting-cost-benchmark) plus a human call on the winner.

## O-005 — SVG-path glow in v1?

Whether the glowing-contour click-zone treatment ships at v1 or v1.1.

:::tip[Options]
- **A.** Ship in v1 — Packet 5 (vision benchmark) and Packet 6 (SVG overlay experiment) both land in time, mask quality is high enough.
- **B.** Ship in v1.1 — the experiment is real, but ships after v1 launch.
- **C.** Drop entirely — the experiment shows the visual quality is not worth the perf cost.
:::

Resolved by [Research packets 5 and 6](/roadmap-and-open-questions/research-packets/) together. The decision is binary: either v1 has SVG glow or it does not.

## O-006 — First dynamic capability

V1 explicitly defers a backend until the first dynamic capability that static files cannot serve emerges.

:::tip[Options]
- **A.** Multi-tenant user streams.
- **B.** A real "agent thinking now" indicator.
- **C.** A search index large enough to require server-side ranking.
- **D.** Continue static — no dynamic capability earns its place in v2.
:::

Intentionally deferred. Will be revisited in v2 scoping; the answer probably depends on what the v1 audience asks for first.

## O-007 — Reduced-motion in-app toggle

Whether to add an in-app override for `prefers-reduced-motion`.

:::tip[Options]
- **A.** OS setting only (current decision). No in-app toggle in v1.
- **B.** Add a toggle in v1.1. Persisted to localStorage (after consent).
- **C.** Add a toggle in v1, session-only.
:::

V1.1 candidate. Not blocking v1 launch.

## O-008 — Council voice expansion

Whether to add a sixth voice to the council.

:::tip[Options]
- **A.** Keep five voices (Architekt, Produktherz, Skeptiker, Hüter, Bauer).
- **B.** Add a voice named **Ökonom** focused on cost, billing, and unit economics.
- **C.** Add a voice named **Erzähler** focused on the narrative arc across frames.
:::

Not blocking v1. Tracked for v2 planning. Decision-log entry required to add a voice.

## How to add an option

A new entry in this list requires:

1. A real choice between alternatives — not a binary do/do-not.
2. At least two named options.
3. A reference to the research packet that would resolve it, or "human call required."

If a question does not yet have options, it lives in [Open questions](/roadmap-and-open-questions/open-questions/) until it does.

## Sources

- `docs/3 claude/03-tensions-and-tradeoffs.md`
- `docs/4 claude-dist/04-tensions.md`
- `docs/6 codex-dist/05-option-matrix.md`
