---
title: Stability tags
description: What the five stability tags mean and how to read them on each page.
sidebar:
  order: 4
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/07-decision-log.md"
  - "4 claude-dist/02-decisions.md"
---

Every page declares its stability in frontmatter. The tag tells you how much weight to put on the content.

```yaml
stability: stable          # stable | working | proposed | future | archived
last_synced_with: "folder-7"
```

## The five levels

### `stable`

The content is agreed across the most recent distillation passes. Build against it. If a `stable` page disagrees with code or with new thinking, the page is demoted to `working` and an entry is added to [Options to decide](/roadmap-and-open-questions/options-to-decide/) or [Decision log](/roadmap-and-open-questions/decision-log/) — never silently rewritten.

### `working`

The content is drafted but the team is still iterating. Implementers should expect changes before any commitment. If you cite a `working` page in code, leave a comment with the page slug so a future sync can find it.

### `proposed`

A single voice's idea, not yet ratified. May or may not survive. Useful for exploring; not yet a contract.

### `future`

A v1.1 or v2+ idea explicitly out of scope for v1. Listed so the team remembers it and so contributors do not propose it again as new.

### `archived`

Superseded content kept for traceability. Lives only under [Archive](/archive/brainstorms/). Forbidden terms may appear here; the [glossary check](/reference/forbidden-terms/) skips this section.

## How the tag changes

A `stable` page becomes `working` when:

- Code lands that contradicts it.
- A folder-7 (or newer) update introduces a real option to decide.
- A subagent consistency audit reports drift the team has not resolved.

A `working` page returns to `stable` when:

- The contradiction is resolved with a decision recorded in [Decision log](/roadmap-and-open-questions/decision-log/).
- The page is rewritten and a consistency audit passes.

A `proposed` page becomes `working` (or `archived`) only by a decision-log entry.

## What you will not find

There is no `deprecated` tag. Anything no longer current moves to `archived` and gets a one-line "why superseded" note. There is no `experimental` tag either; we use `proposed` for unratified ideas.

## Sources

- `docs/3 claude/07-decision-log.md`
- `docs/4 claude-dist/02-decisions.md`
