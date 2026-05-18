---
title: File & route conventions
description: Repository paths and public URL patterns for v1.
sidebar:
  order: 5
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260518 Versions.md"
  - "1 brainstormings/20260517 2 Agents.md"
---

## Repository layout

```
docs/
  8 final-docs/                  ← these docs
  1 brainstormings/ … 7 …        ← source-of-truth audit trail (read-only)
.claude/skills/                  ← Claude project skills (e.g. sync-docs-with-code)
src/
  pages/
    ui/
      <date>/                    ← one directory per date-stream
        <timestamp>/             ← one directory per frame proposal
          media-and-contents-info/
            next-frame.package.json
            master.png
            evidence/            ← browser proofs, clickzone reports, license review
public/
  streams/
    <stream-id>/
      manifest.<hash>.json
  assets/
    <stream-id>/
      <frame-id>/
        desktop.avif
        desktop.webp
        mobile.avif
        mobile.webp
        thumbnail.webp
promotions/
  team.json                       ← allow-list of acceptedBy logins
  <frame-id>/
    acceptance.json
```

## Filename rules

- All filenames lowercase, kebab-case.
- No spaces, underscores, or uppercase letters.
- No date in filenames — the date lives in the directory path.
- Extensions match content: `.json`, `.png`, `.avif`, `.webp`, `.md`.
- Master image is always `master.png`. Upscaled master is `master-upscaled.png`.
- Variant images follow `<variant>.<format>` (e.g., `desktop.avif`).

## Public URL patterns

| Pattern | Use |
|---|---|
| `https://ui.plan.ai/` | Default landing → today's stream. |
| `https://ui.plan.ai/ui/{date}/` | A specific stream by date. |
| `https://ui.plan.ai/ui/{date}/{frame-slug}/` | Deep link to a specific frame. |
| `https://ui.plan.ai/streams/{stream-id}/manifest.<hash>.json` | Public Stream Manifest. |
| `https://ui.plan.ai/assets/{stream-id}/{frame-id}/<variant>.<format>` | Public asset. |

The `/u/{username}/` namespace is reserved for v2. Do not use in v1.

## Frame ID pattern

```
<stream-id>-<slug>
```

Examples:

- `ui-en-v1-low-hanging-fruit-radar`
- `ui-de-v1-cadence-console`

Slug rules:

- Lowercase, kebab-case.
- 3–8 words, ≤ 60 characters total.
- No date prefixes; the stream-id and the directory path already carry temporal context.
- A renamed frame requires a new ID; ID is not editable after first promotion.

## Run channel pattern

```
run_<unix-seconds>.<channel>
```

Examples:

- `run_1779228000.main`
- `run_1779228000.research`
- `run_1779228000.image_generation`

Channels distinguish different work streams within the same agent run. They are internal — never projected to the Stream Manifest.

## Decision log ID pattern

```
D-YYYY-MM-DD-NNN
```

`NNN` is a zero-padded serial within the day. Example: `D-2026-05-18-001`.

## Schema version path

When `schemaVersion` changes, paths must change too:

```
public/streams/ui-en-v1/manifest.v1.<hash>.json
public/streams/ui-en-v1/manifest.v2.<hash>.json
```

Clients request the highest version they can parse; there is no in-band negotiation.

## Locale convention

- `en` — default. Frame titles, alt text, click-zone labels in English.
- `de` — German variant of the same stream. Same frames, translated content.

Locales are properties of the stream, not the frame. A stream is either `en` or `de`; mixed-locale streams are not in v1.

## Sources

- `docs/1 brainstormings/20260518 Versions.md`
- `docs/1 brainstormings/20260517 2 Agents.md`
