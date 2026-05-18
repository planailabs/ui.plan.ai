---
title: Contributing
description: How a team member (or agent) makes a change to the docs or the project.
sidebar:
  order: 4
stability: stable
last_synced_with: "folder-7"
---

## Two kinds of contribution

1. **Docs change** — to this section. Always welcome. PR against `docs/8 final-docs/`.
2. **Project change** — to the new project's repo. Follows [How agents propose changes](/process/how-agents-propose/) and [PR & promotion workflow](/process/promotion-workflow/).

This page is about the first kind.

## Docs PR checklist

- [ ] The change targets a file in `docs/8 final-docs/`.
- [ ] Folders 1–7 in `docs/` are untouched.
- [ ] Every edited or new page has frontmatter: `title`, `description`, `sidebar.order`, `stability`, `last_synced_with`, `sources`.
- [ ] Every edited or new page ends with a `## Sources` block.
- [ ] No forbidden term (see [Forbidden terms](/reference/forbidden-terms/)) appears outside `archive/`.
- [ ] No German text appears outside `archive/`.
- [ ] All internal cross-links resolve.
- [ ] The new content uses canonical [Glossary](/reference/glossary/) terms.
- [ ] If a `:::tip[Options]` admonition is added, a matching entry exists in [Options to decide](/roadmap-and-open-questions/options-to-decide/).

## Demoting a `stable` page

If new code or a folder-7+ update contradicts a `stable` page, do not silently rewrite it:

1. Change `stability: stable` to `stability: working` in the frontmatter.
2. Add an `Open:` note at the top of the page describing the drift.
3. File or update the relevant entry in [Options to decide](/roadmap-and-open-questions/options-to-decide/).
4. Push the change as its own PR; do not bundle with unrelated edits.

## Adding a new page

A new page needs:

- A clear place in the sidebar (existing section preferred).
- Frontmatter with all required fields.
- At least one source citation in `sources` and at the bottom.
- A reason: which decision or research it supports.

A new top-level sidebar group requires a [Decision log](/roadmap-and-open-questions/decision-log/) entry. Top-level structure is not edited casually.

## Archive moves

A page that no longer reflects the project's direction is moved (not deleted) to `archive/superseded.md`. The move records:

- The old page's title and slug.
- One sentence on what it was.
- One sentence on what superseded it (with a link).

## When in doubt

Ask. Open a draft PR with a question in the description. The team prefers an early draft to a polished PR that misunderstood the intent.

## Sources

- This page is a procedural derivative of the conventions throughout the other pages; no single source file applies.
