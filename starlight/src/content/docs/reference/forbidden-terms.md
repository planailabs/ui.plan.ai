---
title: Forbidden terms
description: Words that must not appear in any live docs or code, with the canonical replacement.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/04-naming-and-glossary.md"
---

These words have overloaded meanings in the brainstorms. They must not appear in any page outside [Archive](/archive/brainstorms/). The consistency subagent fails any other page that contains them.

| Forbidden | Use instead | Why |
|---|---|---|
| `depth` | `parentId` / `zIndex` / `drillLevel` / `streamPath` | Four incompatible meanings drifted together. |
| `home stream` | `stream` | "Home" implied a user homepage; the route is just the stream. |
| `hold` (as the action) | `pin` | Drifted with `pause` and `lock`. |
| `home button` | `pin` (current frame) / `stream root` (return to start) | Ambiguous target. |
| `frame envelope` | `frame package` | The package *is* the envelope. |
| `next-frame` (as a noun) | `nextInStream` *or* `nextCandidate` | Used for two different concepts. |
| `proof` (without a qualifier) | `browser proof`, `council proof`, `license proof`, `performance proof` | A bare "proof" hides which gate is being claimed. |
| `metadata-only` (as a stand-alone state) | the typed enum from [Promotion state machine](/specifications/promotion-state-machine/) | Drifted into informal sub-states. |

## Grep-time check

```bash
grep -RIn -E '\b(depth|home stream|frame envelope|home button)\b' \
  "docs/8 final-docs" \
  --exclude-dir=archive
```

The above command must return no matches. The consistency audit runs an equivalent check on every cross-page pass.

## Sources

- `docs/3 claude/04-naming-and-glossary.md`
