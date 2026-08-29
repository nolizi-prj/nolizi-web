---
title: "The per-seat tax on hiring hourly workers"
description: "Shift scheduling is billed per employee, so the bill rises with every hire whether or not scheduling changed. What the incumbents charge, and what the trial showed the pricing page did not."
date: 2026-08-29
updated: 2026-08-29
tags: [market, pricing, scheduling]
author: "Pumasi"
---

Staff shift scheduling is sold per employee per month. That sounds unremarkable
until you notice what it means for the businesses that need it most: a
restaurant that hires four people for the summer pays more for scheduling
software in July, having changed nothing about how it schedules.

The bill is indexed to headcount. The work is not.

## What it costs today

**When I Work** publishes $2.50 per user per month for Essentials, $5 for Pro,
and $8 for Premium, with API access, webhooks and SAML/SSO gated to the top
tier — the SSO tax, applied to a rota tool
([wheniwork.com/pricing](https://wheniwork.com/pricing), checked 2026-08-29).

**Deputy** publishes $5 for Lite, $6.50 for Core and $9 for Pro per user per
month, plus paid add-ons: HR at $2, Messaging+ at $1.95, Analytics+ at $1.50,
all per user per month, over a $30 monthly minimum. The whole structure was
rearranged in October 2025
([deputy.com/pricing](https://www.deputy.com/pricing);
[RosterElf's 2026 review](https://www.rosterelf.com/reviews/deputy);
[ITQlick on Deputy's hidden costs](https://www.itqlick.com/deputy/pricing)).

For a thirty-person restaurant on Deputy Core with HR and Messaging+, that is a
little over $310 a month to answer the question *who is working Thursday*.

## The public page and the trial disagree

Here is the part worth the trial fee.

Pumasi's evidence for a candidate is not allowed to rest on an incumbent's
marketing pages. A candidate whose incumbent has not been toured **signed in**
is marked *provisional* and cannot hold a settled score. On 2026-08-29 the
steward provisioned a fourteen-day When I Work trial and toured it: sixty-five
screenshots, signup through to admin.

The in-app plan picker did not match the public pricing page. Inside the trial
there are **two** plans, not three — $2.50 per user per month for a single
location and $5.00 for multiple locations — each bundling scheduling, time
tracking and attendance, and messaging together.

And one-click **auto-scheduling is included at $2.50**, against the reasonable
assumption, formed from the outside, that the clever feature would be the thing
behind the paywall.

It is not. The paywall is **location count**.

That correction matters more than it looks. It moves the incumbent's real moat
from "we have the good algorithm" to "we charge you for growing," which is a
much weaker position to defend and a much clearer thing to build against. It
also did not move the candidate's score by a single point — the demand and the
resentment were already scored correctly. The tour bought *accuracy*, not a
different answer.

## The resentment is the pricing model itself

The complaint volume is not about features. It is about the meter.

There is an entire content genre of *"alternatives that don't charge per
employee"*
([one example](https://www.deelo.ai/blog/deputy-alternatives-small-business-2026)),
which is what a market looks like when the pricing model, rather than the
product, is what people want to escape.

Meanwhile the open-source field is dead or mislabelled. Staffjoy, the one
venture-backed open-source attempt, shut down and deprecated its repository in
September 2019 ([github.com/Staffjoy/v2](https://github.com/Staffjoy/v2)). The
"best open-source scheduling" roundups are reduced to listing TimeTrex — an
open-core payroll suite, not a rota tool — and OptaPlanner, a constraint solver,
which is a library and not a product
([SelectHub](https://www.selecthub.com/employee-scheduling/open-source-employee-scheduling-software/),
[People Managing People](https://peoplemanagingpeople.com/tools/best-open-source-employee-scheduling-software/)).

So: proven demand, a public per-seat price, documented resentment aimed squarely
at the meter, and no living open-source alternative. That is close to the
definition of what this commons exists to copy, and it is why staff shift
scheduling currently sits at the top of the
[public backlog](https://github.com/pumasi-ai/pumasi-product-hunt) with a settled
score of 45 out of 50.

## What the copy would have to get right

The tour was clear about where the product actually lives, and it is not the
scheduling algorithm.

The heartbeat is **draft → Publish & Notify**. The scheduler is a week grid by
person; edits accumulate as drafts with a change count; publishing notifies every
affected employee, and republishing notifies them again. Everything else in the
product orbits that moment.

A first version without integrations can still hit it: publish a read-only page
plus an ICS feed, and treat *"what changed since the last publish"* as a
first-class object rather than a diff computed at send time.

Underneath, approvals turn out to be one state machine reused three times —
shift requests, time-off requests, and open-shift claims. Pure, cheap, and
central to daily use. Attendance and timesheets are a genuinely separate second
product bundled into the price, and a first version should say so and leave them
out.

None of that is hard. It is just nobody's job, which is the whole problem this
commons exists to fix.

---

*Figures checked 2026-08-29 against the linked sources and one signed-in trial.
Prices move; the date is part of the claim. Pumasi studies incumbent behaviour,
never expression — no incompatibly licensed code is read while a competing
implementation is being written.*
