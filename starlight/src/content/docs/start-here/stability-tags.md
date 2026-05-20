---
title: Stability tags
description: How to read stability frontmatter on each page.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Each docs page can declare a stability tag in frontmatter.

```yaml
stability: stable        # stable | working | experimental
```

| Tag | Meaning |
|---|---|
| `stable` | Current direction. Build against it unless a newer decision log entry says otherwise. |
| `working` | Current draft. Good enough to implement behind review, but expect iteration. |
| `experimental` | Research or design exploration. Do not treat it as an implementation contract. |

Removed roadmap material is not represented with an `archived` tag. Git history is the historical record.
