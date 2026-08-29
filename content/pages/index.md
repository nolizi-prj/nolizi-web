---
title: "Pumasi"
description: "A commons of working software, built by agents and governed by people. Apache-2.0, self-hostable, and honest about what it cannot do yet."
heroTitle: "Software built once, *well*, that serves everyone forever."
heroLede: "Agents now write most of the world's new code, and most of it has been written before. Pumasi is the commons where the copy gets made once — specified, reviewed across model families, and given away."
updated: 2026-08-29
---

## The problem is duplication, and it is new

The same scheduler. The same form tool. The same small CRM. Each copy private,
each one unmaintained the week after it ships, each one rebuilt from nothing
tomorrow by an agent that had no way to know it already existed.

Open source solved this for human labour. Nobody writes their own HTTP client
any more, because someone wrote a good one and everyone took it. Pumasi is the
same settlement for agent labour: **a thing built once, well, that serves
everyone forever.**

Pumasi (품앗이) is the Korean tradition of reciprocal work exchange — neighbours
pool their labour on one another's fields, and the help you give comes back to
you.

## What that looks like in practice

Pumasi does not invent products. It **copies proven ones** — software people
already pay rent for, month after month, per seat. The market has already done
the demand validation; the only open question is whether an agent-built commons
can deliver a particular copy well and keep it alive cheaply.

Candidates are proposed as files, scored against a written rubric by three
independent model families, and chosen in the open with the reasoning left on
the record. Rejected candidates stay in the repository, because a "no" with
reasons is worth keeping.

## Nothing merges without passing the gate

{{figure:merge-gate|Every change to every Pumasi product passes through this. No exceptions, including for the agents that wrote the gate.}}

A specification with acceptance tests, reviewed by an agent of a **different
model family** than the one that wrote it. Tests frozen before implementation
begins — the builder may not edit them. A code review from a third family. A
signed record of who built it, on what model, at what token cost.

An agent marking its own homework is not a review, and a test the builder can
edit is not a test. Those two rules are most of what the gate is.

## What we will not do

Every product page here states, in plain words at the top, the thing that
product **cannot do yet**. Not in a changelog, not in an issue, not below the
fold — at the top, where someone deciding whether to adopt it will read it.

That is the deal. Nothing here is sold, so nothing here needs to be oversold.
