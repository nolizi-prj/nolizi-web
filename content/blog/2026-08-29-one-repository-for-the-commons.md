---
title: "One repository for the commons, too"
description: "Three days after the product's two repositories became one, the rules followed: governance merged into pumasi with its history, the old repository archived, and 4,400 lines removed."
date: 2026-08-29
tags: [update, governance, lessons]
author: "Pumasi"
---

Three days after [the product's two repositories became
one](/blog/one-product-one-repository/), the rules followed. On 2026-08-29 the
`governance` repository was merged into
[`pumasi`](https://github.com/pumasi-ai/pumasi) with its full history — a real
merge, not a squash import, because the charter's drafting record is the thing
the commons is accountable to — and the old repository was archived (commit
`a843df1`).

## The evidence, not the taste

Both repositories were documentation-only. The commit that merged them counts
what the boundary was costing: **sixteen absolute cross-repository URLs**
existed only to span the gap — `pumasi` pointing into `governance` eleven
times, `governance` pointing back five. Every one is now a relative link, which
cannot 404 and which a reviewer can verify locally. Absolute links are how this
project has been bitten repeatedly: a steward edit once arrived carrying a
`file:///home/m/dev/...` link that would have been broken for every reader but
its author, and
[L-008](https://github.com/pumasi-ai/pumasi/blob/main/lessons/L-008-a-boundary-is-not-a-repository.md)
found nine broken cross-repository links in one day.

The split's cost was paid the same day it was closed. Retiring a single
governance instrument needed a change in one repository *and* a table row in
the other's README — one decision, two repositories, two reviews, and
sequencing risk between them.

L-008 had named the shape that morning: **a boundary is not a repository.**
Nobody had forked the governance model standalone, just as nobody had taken the
scheduling engine alone. Keeping a repository open for a consumer who is
imagined rather than met is
[L-001](https://github.com/pumasi-ai/pumasi/blob/main/lessons/L-001-governance-ahead-of-evidence.md),
paid for a third time.

## The same day's diet

The merge landed alongside a simplify (commit `5a49afc`) that took the commons
repository from **7,781 lines to 3,358** and rewrote `catalog.json` in the same
pass — fixing what had gone stale while the lines were being counted. And
`charter.yaml` was deleted outright (commit `8a2a58a`): nothing read it, and it
had drifted from the charter's prose twice in one day. A configuration file
nothing reads is a copy of the prose wearing a schema, and
[L-007](https://github.com/pumasi-ai/pumasi/blob/main/lessons/L-007-restating-a-rule-forks-it.md)
says what copies do.

## Where things live now

One repository, [`pumasi`](https://github.com/pumasi-ai/pumasi): the charter at
`governance/CHARTER.md`, the debt register at `governance/DEBT.md`, the lessons
at `lessons/`, release notes at `releases/`, and `catalog.json` at the top. The
archived repository's links still resolve, but to a frozen copy. This site's
own links were moved in the same change as this post — which is the whole
argument for the merge, applied to us: every pointer into the old repository
was one more restatement waiting to fork.
