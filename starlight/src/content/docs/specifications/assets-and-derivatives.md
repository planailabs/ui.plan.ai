---
title: Assets & derivatives
description: How master files, derivative formats, and asset paths are named.
sidebar:
  order: 9
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 -1 Ergänzung.md"
  - "1 brainstormings/20260518 Versions.md"
  - "3 claude/04-naming-and-glossary.md"
---

Every frame has one **master** (the generator output) and one or more **derivatives** (delivery variants). The contract below applies to all assets that ship publicly.

## Master

The master is the raw output of the image generator, before upscaling or delivery optimization.

```
src/pages/<route>/<timestamp>/media-and-contents-info/master.png
```

| Property | Value |
|---|---|
| Format | PNG, lossless. |
| Dimensions | Per `frame.variants` (e.g., 1672×941 desktop). |
| Color profile | sRGB. |
| Source of truth | Always kept in the repo. Never overwritten. |

If a master is regenerated (different seed, different model), the new master is committed as `master-v2.png`. The original is preserved.

## Upscaling (optional)

A master may be upscaled before derivatives are built. Upscalers under evaluation include Topaz Gigapixel, Krea, Magnific, Real-ESRGAN. The choice is a parallel research packet; in v1, masters are used directly unless an upscaled version is explicitly committed.

When upscaled, the file is `master-upscaled.png` and the Frame Package's `imagePrompt.masterPath` points to it.

## Derivatives

Derivatives are delivery variants generated from the master (or upscaled master) at build time.

```
public/assets/<stream-id>/<frame-id>/<variant>.<format>
```

Example:

```
public/assets/ui-en-v1/ui-en-v1-low-hanging-fruit-radar/desktop.avif
public/assets/ui-en-v1/ui-en-v1-low-hanging-fruit-radar/desktop.webp
public/assets/ui-en-v1/ui-en-v1-low-hanging-fruit-radar/mobile.avif
public/assets/ui-en-v1/ui-en-v1-low-hanging-fruit-radar/mobile.webp
public/assets/ui-en-v1/ui-en-v1-low-hanging-fruit-radar/thumbnail.webp
```

| Format | Use |
|---|---|
| AVIF | Primary delivery format. Best compression. |
| WebP | Fallback for clients without AVIF support. |
| PNG | Reserved for archival; not delivered publicly except as social-share fallback. |

No JPEG in v1 — quality at sizes we target is worse than AVIF/WebP and the format does not support alpha.

## Variants

A Frame Package declares the variants required in `frame.variants`. The build pipeline emits a derivative for each variant in each delivery format. Missing variants fail the build.

V1 baseline variants:

| Variant | Dimensions | Used for |
|---|---|---|
| `desktop` | 1672×941 | Default desktop render. |
| `mobile` | 941×1672 | Default mobile render. |
| `thumbnail` | 480×270 | Timeline strip, social-share previews. |

Additional variants (`tablet`, `social-og`, `retina-2x`) are optional and `future`.

## Public URLs

The Stream Manifest projects asset paths as fully-qualified public URLs. There is no signed-URL pathway in v1; all assets are CC0 and cacheable forever.

The hard rule from [Static-Interactive architecture](/foundations/static-interactive/) applies: the public CDN serves public assets only. The day private streams enter the system (`future`), signed URLs with short TTL become the path. Thumbnails and Open Graph cards count as public.

## Filename conventions

- Lowercase, kebab-case.
- `<variant>.<format>` per file.
- No spaces, no underscores, no uppercase.
- No date in filenames — the date lives in the directory path.

## Hashing and cache busting

The Stream Manifest filename includes a content hash for cache busting:

```
public/streams/ui-en-v1/manifest.<hash>.json
```

Asset filenames do **not** include a content hash. They are stable per frame; if a frame changes content, the frame's ID changes. This keeps URLs human-readable and stable.

## Sources

- `docs/1 brainstormings/20260517 -1 Ergänzung.md`
- `docs/1 brainstormings/20260518 Versions.md`
- `docs/3 claude/04-naming-and-glossary.md`
