---
title: CC0 & human acceptance
description: Default licensing posture, third-party marking, and the team-acceptance attestation.
sidebar:
  order: 6
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/02-decisions.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "1 brainstormings/20260518 Versions.md"
---

## The default

Every asset published on the public surface is **CC0** unless explicitly marked otherwise. The default is set at the stream level and re-stated at the frame level for traceability.

This applies to:

- Generated images (masters and derivatives).
- Click-zone metadata.
- Public council summaries.
- Any text written for the public surface.

## Third-party marking

Where a frame includes content the team did not author (a quoted screenshot, a logo, a third-party model output that retains licensing constraints), the Frame Package records:

- `licenseDefault: "CC0"`
- `containsThirdPartyContent: true`
- `thirdPartyAttributions[]` with source, author, license, usage, and `publicDomainExcluded: true`

A frame that contains third-party content is **not CC0 as a whole**. The CC0 default applies asset-by-asset, with exceptions enumerated.

## The acceptance attestation

Every promoted Frame Package carries a paired `acceptance.json` file in the repo. The attestation declares:

- The frame package ID.
- The team member who promoted it (their verified GitHub identity, captured by the merge).
- The timestamp.
- The asserted license posture (`CC0` or `mixed`).
- A short note (free-form) describing what the human reviewed.

The legal force comes from the audit trail — a verified GitHub identity merging a PR that includes the attestation. We call this **attested**, not signed, because no cryptographic signing is in v1 today.

For the field-level contract, see [Acceptance](/specifications/acceptance/).

## Why CC0 by default

Three reasons:

1. **Honesty about provenance.** The frames are agent-generated. Claiming exclusive rights over content the agents produced is awkward at best.
2. **Maximum reuse.** The mechanic compounds if anyone can fork, remix, or quote the stream.
3. **Minimum legal surface.** CC0 is the simplest possible posture. Less posture, less paperwork.

## What CC0 does not cover

- The agent prompts, the council positions, the internal selection logic. These live in the Frame Package, not the Stream Manifest. They are not public.
- The team's name, the project's branding, trademarks. Public surface ≠ public claim on identity.
- Third-party content embedded for reference. See "Third-party marking" above.

## The unsolved legal mechanics

The acceptance model is sufficient for a single-tenant v1 with all contributors on the same team. Before any external contributor can promote a frame, a lawyer must review:

- What jurisdictions the attestation is enforceable in.
- What happens when an attesting team member leaves.
- How acceptance propagates if a frame is forked.
- What takedown obligations apply for accidentally-uploaded third-party content.

These are blocking for external contribution, not for v1 launch. Tracked in [Research packets](/roadmap-and-open-questions/research-packets/) and [Escalations](/roadmap-and-open-questions/escalations/).

## Sources

- `docs/4 claude-dist/02-decisions.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/1 brainstormings/20260518 Versions.md`
