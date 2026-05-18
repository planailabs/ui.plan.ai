---
title: Research packets
description: Bounded research dispatchable by Seb. Severity-tagged.
sidebar:
  order: 5
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/05-research-packets.md"
  - "6 codex-dist/04-research-packets.md"
  - "3 claude/02-research-tasks.md"
---

Each packet is bounded, time-boxed, and produces a standard short report. Severity tags tell the team what they unblock.

## Severity

- **`v1-blocker`** — v1 cannot ship until the packet's result lands.
- **`v1-accelerator`** — v1 can ship without it, but the result lets the team take a better v1 shape.
- **`v1.1-candidate`** — informs v1.1 or v2 planning; not v1-blocking.

## Boundary rules (apply to every packet)

- No publishing, no deploying, no uploads, no paid-provider API calls unless the packet explicitly authorizes one.
- No mutation of public manifests, public assets, or route bindings.
- Brainstorms are *source*, not truth — cite, do not quote as decisions.
- No schema migrations of existing files without an explicit go from Seb.

## The packets

### Packet 0 — Existing-prototype audit

**Severity:** `v1-accelerator`. Cheap, unblocks Packet 1.

**Goal.** Where state lives in the current code, where timings live, how click-zones map to frames, how `visibleOn` filters work, what would need to move to a manifest to make `UiGenerator.astro` < 500 lines.

**Time-box.** 0.5 days. Read-only.

**Output.** < 3-page report.

### Packet 1 — Frame Package contract v0

**Severity:** `v1-blocker`. Unblocks Packets 2, 3, 4, 7.

**Goal.** Required, optional, derived fields. Public/private projection rules. `council.publicSummary[]` and `council.sourcePositions[]` field shapes. `acceptance.json` sub-artifact. Rejection list for v1 fields. Migration note for the new project's first frames. A validator script.

**Time-box.** 1 day.

**Needs human.** Cut/keep decisions.

### Packet 2 — Promotion state machine v0

**Severity:** `v1-blocker`. Depends on Packet 1.

**Goal.** State diagram. Transition matrix `(state, actor, required-artifact, side-effects)`. Two example trajectories: clean promote, rollback. `acceptance.json` schema. Definition of which transitions require human acceptance.

**Time-box.** 0.5 days.

### Packet 3 — Public Stream Manifest v0

**Severity:** `v1-blocker`. Depends on Packet 1.

**Goal.** Manifest field list. Omitted-private-fields list. Asset references, click-zone shape, deep-link structure. Validation rules.

**Time-box.** 0.5 days.

### Packet 4 — Overlay contract v0

**Severity:** `v1-blocker`. Depends on Packet 1.

**Goal.** Progress/next-frame behavior (hybrid model from folder 1 May 17 -1). Pin behavior with queue-when-pinned. Timeline behavior. Click-zone states. Inspect mode. Open-detail action. Mobile/touch behavior. Reduced-motion behavior (strict disable).

**Time-box.** 1 day.

### Packet 5 — Click-zone vision pipeline benchmark

**Severity:** `v1-accelerator`. Resolves [O-005](/roadmap-and-open-questions/options-to-decide/#o-005-svg-path-glow-in-v1).

**Goal.** 20 frames hand-annotated. Compare OmniParser V2, OS-Atlas, Qwen2.5-VL, Gemini bounding boxes, Grounding DINO + SAM 2. OCR: PaddleOCR, docTR. Metrics: precision, recall, IoU, false-interactive rate, latency, cost-per-frame, laptop-runnable.

**Time-box.** 2 days. Hand-annotation pass ~2h.

### Packet 6 — SVG-path overlay experiment

**Severity:** `v1-accelerator`. Depends on Packet 5.

**Goal.** 5 representative frames + their best vision-derived masks. Build an SVG-path overlay with hover/focus/pressed glow. Test on desktop and mobile. Measure visual quality, perf cost, false-interactive rate.

**Time-box.** 1 day.

### Packet 7 — Watch-the-builders frame set

**Severity:** `v1-blocker`. Depends on Packet 1.

**Goal.** Top 2 v1 frames: full prompt, evidence requirements, click zones, acceptance fields. Top 4 v1.1 candidates: same level of detail. For each: what the visitor learns in 10 seconds, public/private field split, expected route binding.

**Time-box.** 1.5 days.

### Packet 8 — Performance & accessibility CI gates

**Severity:** `v1-blocker`. Depends on Packet 4.

**Goal.** LCP/CLS/INP measurement scripts. JS/CSS bundle gates. axe/Lighthouse a11y gate. Reduced-motion behavior test. Degradation order test. GitHub Action that fails the PR on violation.

**Time-box.** 1.5 days.

### Packet 9 — Media pipeline benchmark

**Severity:** `v1-blocker`. Resolves [O-002](/roadmap-and-open-questions/options-to-decide/#o-002-image-generator-pick) and [O-003](/roadmap-and-open-questions/options-to-decide/#o-003-upscaler-pick-if-any).

**Goal.** 6 UI-frame prompts × OpenAI Image, Imagen/Gemini, FLUX, Ideogram, Recraft. Score: text legibility, layout, style consistency, cost. Upscaler pass: 5 frames × Topaz Gigapixel, Krea, Magnific, Let's Enhance, Real-ESRGAN, Upscayl.

**Time-box.** 2.5 days total.

### Packet 10 — Rights & CC0 mechanics legal review

**Severity:** `v1.1-candidate` (required before external contributors).

**Goal.** Lawyer-reviewable one-pager on what "acceptance" must be for CC0 to stick (Germany first; EU and US defensible). Asset-level license schema. Stream-level default plus third-party exception rules. Public takedown path with SLA.

**Time-box.** 0.5 days research + lawyer turnaround.

### Packet 11 — Hosting cost benchmark

**Severity:** `v1-accelerator`. Resolves [O-004](/roadmap-and-open-questions/options-to-decide/#o-004-hosting-choice).

**Goal.** Realistic v1 load (10 streams × 50 frames × 100 visits/day × 5MB assets) and 100× load. Price on Cloudflare Pages + R2 + Images + Stream, Bunny CDN, Cloudflare-only-with-cache, R2 + Cloudinary, S3 + CloudFront. Surprises (per-transformation pricing, egress charges) called out.

**Time-box.** 0.5 days. Spreadsheet only — no accounts, no real traffic.

## Dispatch order

If Seb gives go on everything:

| Day | Packets |
|---|---|
| 1 (parallel) | 0, 5, 9, 11 |
| 2 | 1 (uses 0). 8 starts on its own track. |
| 3 | 2, 3, 4, 7 (all use 1). 6 starts (uses 5). |
| 4–5 | 10 in parallel awaiting lawyer. |

End of week: every v1-blocking result on the desk.

## Sources

- `docs/4 claude-dist/05-research-packets.md`
- `docs/6 codex-dist/04-research-packets.md`
- `docs/3 claude/02-research-tasks.md`
