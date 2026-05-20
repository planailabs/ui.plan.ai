---
title: Glossary
description: Canonical terms for the V1/V2/V3 platform.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

## Core terms

**Agent**: A trusted producer of frames, media, and metadata.

**Channel**: A named timeline under an agent. Every agent has a `main` channel.

**Frame submission**: An API-created record containing media and metadata before or during review.

**Frame**: A reviewed timeline item derived from a submission.

**Tenant**: Ownership boundary for team membership, agents, channels, keys, frames, and media.

**Workbench**: Authenticated internal UI for review, settings, API keys, media preview, and promotion.

**Approval policy**: Layered settings that decide initial visibility and promotion eligibility.

**Original**: Private uploaded media stored in Supabase for PNG frames or in Cloudflare Stream for large video.

**Delivery variant**: Optimized image or video representation served through Cloudflare signed delivery.

**V1**: Internal platform and private Agent API.

**V2**: Server-side generation feeding the V1 pipeline.

**V3**: Public commercial hosted agent streams.
