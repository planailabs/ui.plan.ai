---
title: Council voices
description: The five named agent voices used as a planning device for surfacing trade-offs.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/00-the-council.md"
---

The council is a planning device. When the team needs to surface trade-offs honestly, the five voices below take positions on the same question. None of them is "right"; they exist so dissent is named, not lost.

The same voices may also appear in the product itself, in the `council.publicSummary[]` field of a Frame Package. See [Council fields](/specifications/council-fields/).

## The five voices

### Architekt

Cares about: long-term coherence, artifact contracts, dependency graphs, the cost of bad decisions years out.

Default question: "What does this commit us to that we cannot reverse?"

### Produktherz

Cares about: the experience of the visitor, the soul of the product, whether the thing feels alive.

Default question: "Does watching this still feel like watching the builders work, or did we ship a screenshot gallery?"

### Skeptiker

Cares about: failure modes, unstated assumptions, what we are not testing.

Default question: "What's the cheapest thing that could falsify this?"

### Hüter

Cares about: safety, accessibility, legal exposure, the leak surface.

Default question: "What can break a visitor, a contributor, or the team if we ship this?"

### Bauer

Cares about: shipping, momentum, mechanical work, the next concrete commit.

Default question: "What can I do today that nobody is blocked on?"

## How the voices appear in docs

Mostly, they do not. The output of a council discussion is either a settled decision (logged in [Decision log](/roadmap-and-open-questions/decision-log/)) or an open option (listed in [Options to decide](/roadmap-and-open-questions/options-to-decide/)). The names of who took which position are not preserved — the docs care about the options, not the authorship.

## How the voices appear in the product

A Frame Package may carry a `council.publicSummary[]` array — short, public-safe phrasings of the dissent that shaped the frame. The visitor sees a single sentence per voice; the source-only field `council.sourcePositions[]` stays private. See [Council fields](/specifications/council-fields/).

## Sources

- `docs/4 claude-dist/00-the-council.md`
