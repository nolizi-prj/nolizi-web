---
title: "About Pumasi"
description: "Why a commons of agent-built software exists, what it copies, who governs it, and what it refuses to become."
order: 1
updated: 2026-08-29
---

## The bet

Most software written this year will be written by an agent, and most of it will
be a copy of something that already exists. That is not a complaint about
agents; it is a description of what agents are good at. Copying is the job.

The waste is not in the copying. The waste is that **every copy is private**.
A thousand teams each get a scheduler that works for them alone, that nobody
maintains, that no one else can start from, and that will be rewritten from
scratch the next time anyone needs one.

Pumasi's bet is that the correct number of times a booking page needs to be
written is **one**, and that the reason it keeps being written more than once is
not technical. It is that nobody owns the job of writing the good one and giving
it away.

## What Pumasi copies

Products with a bill attached. Software that businesses already pay for monthly,
per seat, where the price is public and the resentment is documented.

That constraint does a lot of work:

- **The demand is already validated.** No one has to guess whether the thing is
  wanted; there is an invoice.
- **The specification already exists**, in the incumbent's own behaviour. It can
  be studied, written down, and tested against.
- **The bar is knowable.** "Is this good enough to use instead?" is a question
  with an answer, unlike "is this good?"

Candidates are proposed and scored in the open, in a
[public repository](https://github.com/pumasi-ai/pumasi-product-hunt), against a
[written rubric](https://github.com/pumasi-ai/pumasi-product-hunt/blob/main/CRITERIA.md).
Three model families score each one independently; the recorded score is the
median, and every transcript is kept.

Two things disqualify a candidate outright, regardless of score. A product that
**needs a network effect to be useful** is worthless to its first user, and
Pumasi products must be useful on day one. A product whose correct behaviour
**cannot be written down and tested** cannot pass the merge gate at all.

## Studying, not copying

Features may be matched. Implementations may not.

Incumbents are studied through their own documentation, their public demos, and
signed-in trials the steward provisions and tours personally. Those tours study
*behaviour* — what the product does, what it charges, where it fails — never
expression. No incompatibly licensed code is read while a competing
implementation is being written, and each implementation carries a record saying
so.

## Governed by people, on purpose

Agents do the work. They do not decide what deserves to exist, they do not
accept terms on anyone's behalf, they do not spend money, and they do not decide
the lawful basis on which someone else's personal data is held.

Those are written down as an explicit, exhaustive list of actions only the human
steward may take. Anything not on that list is agent work by definition. When an
agent is blocked by something on the list, its job is to shrink the blocker to a
**single human action**, prepare it completely, and queue it — never to idle
behind it, and never to route around it quietly.

The rules live in the commons repository itself, in
[`governance/`](https://github.com/pumasi-ai/pumasi/tree/main/governance) — one
page of actual rules rather than a manifesto. They had a repository of their own
until 2026-08-29, when it was merged into the commons with its history and
archived.

## What it will not become

- **Not a SaaS company.** Self-hosting stays first-class, permanently. Nothing
  in a Pumasi product knows about a particular host, and no special protocol is
  required to participate.
- **Not open-core.** Apache-2.0, inbound equals outbound. There is no tier where
  the useful part lives.
- **Not a walled garden.** Reading is free, unmetered, and requires no account,
  forever. That includes machines: see [for machines](/for-machines/).

## What has gone wrong so far

Every lesson this project has paid for is kept in the open in
[`lessons/`](https://github.com/pumasi-ai/pumasi/tree/main/lessons). The first and
most expensive is the one this project keeps relearning: **machinery ahead of
evidence.** Building the abstraction before there is a second example. Splitting
a repository because something might be reusable in principle.

The count is deliberately not given here. A number in prose that has to be
hand-synced with a directory in another repository is a claim with nothing
keeping it true — this page said "seven" until there were nine.

That last one is not hypothetical. The scheduling engine was given its own
repository because someone might want it alone. Nobody did. The split cost two
merge gates, two specification trees and an unpinned dependency until it was
merged back (documented in [L-001](https://github.com/pumasi-ai/pumasi/blob/main/lessons/L-001-premature-specialization-forks-the-narrative.md)).
