---
title: "Why we show the seams: building in the open before the product is stable"
description: "Pumasi Booking is in seed stage and not yet stable. Here is why we publish the open debts, list the limitations at the top of the page, and invite testing on the pure engine first."
date: 2026-08-29
tags: [engineering, philosophy, transparency, governance]
author: "Pumasi"
---

Most software projects wait until they feel polished before opening their doors. They scrub their issue trackers, draft aspirational marketing copy, and quietly paper over edge cases. When something breaks, it is treated as a surprise.

We are taking the opposite approach with **Pumasi Booking**.

The product is in **seed stage**, under active construction, and not yet stable. If you deploy it expecting a mature, five-year-old enterprise SaaS replacement today, you will find edges that are still being sanded down. 

Instead of hiding those seams, we put them at the very top of the page. Here is why.

---

## 1. The limitation comes before the feature list

Every product page in the Pumasi catalog follows a strict rule: **the first thing you read is what the software cannot do yet.**

For Pumasi Booking, the top of the page does not boast about AI-native workflows or frictionless booking. It states plainly:

> *Limitation: no lawyer has reviewed its privacy pack, and no standard contractual clauses cover its US transfer position — the legal pages it serves say so on their face.*

If you are evaluating software for your organization, your first question is not *"what is the happy path?"* — it is *"will this break my compliance, drop a customer meeting, or corrupt data under concurrency?"* An honest project answers that question before you spend twenty minutes setting it up.

---

## 2. A debt register is better than a marketing promise

In [`governance/DEBT.md`](https://github.com/pumasi-ai/pumasi/blob/main/governance/DEBT.md), we track every single operational and architectural rule we are running below right now:

* **D-105**: The lawful basis is written in `service/src/legal.ts`, but an international transfer mechanism and a formal review by legal counsel remain open.
* **D-108**: Telemetry egress is currently disabled in code (`PUMASI_REPORTING` is read into config and read by nothing), meaning our multi-environment verification matrix is currently one machine wide.
* **D-104**: Multi-model reviewer availability fluctuates, and we report the exact live count rather than asserting that three families are always active.

A project that runs below its own rules quietly is worse than one with no rules at all, because it sells a guarantee it is not providing. Publishing debt is how we keep ourselves honest while the software matures.

---

## 3. The core engine is pure, testable, and separable

While the full service layer (HTTP, auth, sessions, SQLite/PostgreSQL connectors) is being hardened, the computational core underneath it — [`@pumasi/booking-core`](https://github.com/pumasi-ai/pumasi-booking/tree/main/core) — is already rock solid.

Availability calculation and slot allocation is implemented as a **pure mathematical function**:
* **No clock**: Time is an explicit parameter, not an ambient system call.
* **No I/O**: No network requests or database queries happen inside slot computation.
* **No mutable state**: Same inputs yield byte-identical outputs across any runtime.

Because of this boundary, you don't have to trust our full web stack to use the engine. You can extract the engine alone with full Git history in one command:

```bash
git subtree split --prefix=core -b engine-only
```

You get a pure TypeScript availability calculator with frozen acceptance tests covering spring-forward DST transitions, cross-timezone boundaries, and buffer interactions — free to embed into your own backend.

---

## 4. How to help during the seed phase

If you want to try Pumasi Booking today:
1. **Run the pure test suite**: Clone the repo and run `npm test`. Check whether the acceptance cases in `core/spec/acceptance/cases.json` hold for your timezone and locale.
2. **Test local self-hosting**: Spin up `docker compose up` and test connecting your Google or Microsoft calendar in testing mode.
3. **File structural bugs**: If you find an edge case where a timezone transition or booking buffer produces an invalid slot, file an issue. In our process, a bug report isn't a support ticket — it becomes a permanent, numbered acceptance case in our test matrix.

We are building a commons meant to last decades. Starting with radical honesty about what is not yet finished is the only foundation that makes "built once, well, to serve everyone forever" credible.
