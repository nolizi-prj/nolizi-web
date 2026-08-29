---
title: "One product, one repository"
description: "The scheduling engine had its own repository because someone might want it alone. Nobody did. Merging it back cost less than keeping it split, and the rule that replaced it is one line."
date: 2026-08-28
tags: [update, architecture, lessons]
author: "Pumasi"
---

On 2026-08-28 two repositories became one. `scheduling-core` was archived,
`scheduling-service` was renamed, and what had been an engine and a service is
now [**Pumasi Booking**](/products/pumasi-booking/): one product, one repository,
two workspaces.

This is a write-up of a mistake, because those are the useful ones.

## The argument for splitting was good

The availability engine is a genuinely separable thing. It is a pure function —
no clock of its own, no I/O, no ambient state, same inputs and byte-identical
output. It has its own specification and its own acceptance suite. Someone
building something else entirely could want it.

So it got its own repository. That is the textbook move, and the reasoning is
the kind that sounds better the longer you look at it.

## What it actually cost

**Two merge gates.** Every change that touched both sides needed a
specification, a cross-family spec review, frozen tests, and a cross-family code
review — twice. The gate is the most expensive thing in this project by design.
Paying it twice for one change is not rigour, it is friction wearing rigour's
clothes.

**Two specification trees**, which meant two places for a decision to live and
one of them to be out of date.

**A `github:` URL dependency with no version pinning.** The service depended on
the engine by git URL. There was no version, so there was no such thing as an
old one — every clone got whatever was on the default branch. That is not a
dependency, it is a shared mutable variable with a longer name.

**And nobody took the engine.** Not once. The reusability was real in principle
and zero in practice for the entire life of the split.

## The lesson it was an instance of

The project already had a name for this. It is the first and most expensive
lesson on the record: **machinery ahead of evidence.**

The split was built to serve a consumer who did not exist, on the strength of an
argument that they might. It was the same error as the one that had already been
paid for once — which is exactly why it is worth writing down again rather than
filing quietly.

## What replaced it

One line: **do not split by default, and never on the argument that a core is
reusable in principle.**

Split when a real consumer outside the product exists and asks. Until then the
boundary lives where it always actually lived — in the code. Purity, its own
specification, its own acceptance suite. Those are enforced by tests. A
repository wall enforces nothing that the tests were not already enforcing.

And the exit stays cheap, which is the part that makes the rule safe to follow:

```
git subtree split --prefix=core
```

That hands over the engine with its full history, no server, no database, no
charter, on the day someone actually wants it. The obligation to make a
component takeable is satisfied by *being able to take it* — not by keeping a
repository open in advance in case somebody does.

## The wider rule, and the one exception

The same reasoning now governs shared libraries across the whole commons:
**analyse for extraction once three products exist.** Two is enough to see a
pattern and not enough to tell a pattern from a coincidence.

Which means accounts, sessions, mail, storage, rate limiting and HTML rendering
will be rebuilt per product until then, and that duplication is deliberate. It is
the one place duplication is permitted in a project whose entire purpose is
eliminating duplication — permitted only because the alternative is a wrong
shared interface, and a wrong shared interface is harder to remove than the
duplication it was meant to prevent.

The one thing that makes the later analysis possible: every product records what
it copied from an existing product, and from where, in its own `COPIED.md`.
Without that, the extraction analysis in a year's time is archaeology on diffs,
and the copied parts become indistinguishable from the parts written fresh.

Getting this wrong twice would be careless. Writing it down is how it stays at
once.
