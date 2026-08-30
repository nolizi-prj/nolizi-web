---
title: "Public sign-up, with the debts showing"
description: "Pumasi Booking's public sign-up went through the can-hurt gate: a published release note, a veto window, and two debts recorded rather than papered over — D-108 and D-110."
date: 2026-08-29
tags: [update, governance, release]
author: "Pumasi"
---

On 2026-08-29 the commons published the first note in its `releases/`
directory:
[opening booking.pumasi.ai to public sign-up](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-29-pumasi-booking-public-signup.md).
Until then an invite was required, and every account belonged to someone the
steward knew.

The release is classed **can-hurt** under the charter, and the note is precise
about who: bookers — people who type a name, an email address and a meeting
time into someone else's booking page, and who never chose this project. Open
sign-up means strangers will run those pages, so the people trusting them will
be strangers too. The steward approved the release the same day, before the
veto window's end
([`DECISIONS.md` Q-005](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)),
and the product's own homepage stopped saying invite-only
(`pumasi-booking` commit `5630e07`).

## What shipped before it

From the note, all of it in the released code:

- **Sign-up proves the address.** Creating an account no longer hands out a
  session; a single-use link is mailed, and the session starts only when that
  link is used. Without this, anyone could have held a live session as
  `support@somecompany.com` and taken real bookings under that name.
- **Sign-up cannot be used to find out who has an account.** Taken and free
  addresses get the same page.
- **Sign-up is rate-limited** — five per IP per hour, counted globally.
- **The privacy pack is live**: operator, governing law, what is collected, the
  lawful basis, how to delete, and who else sees data, on pages anyone can read
  without an account.

## What it shipped without, on the record

Two entries in the
[debt register](https://github.com/pumasi-ai/pumasi/blob/main/governance/DEBT.md)
were written instead of the facts being handled quietly.

**D-108.** The charter requires a working reporting path and opt-out before an
in-scope item releases. `PUMASI_REPORTING` is read into configuration and then
read by nothing — the charter's own named failure mode, not a near miss. The
steward decided to release anyway, with building it first offered and declined;
the entry records the reasoning, the cost (nothing will say whether the
service works anywhere but where it was built), and the trigger that ends the
exception: any release after this one.

**D-110.** A can-hurt release needs two approving reviews from model families
other than the builder's. It got one — Gemini — plus an explicit steward waiver
of the second, because Grok's review of the final range died on an exhausted
account balance, and topping up is money, which only the steward can spend. The
register states the uncomfortable part in full view: the families that approved
are the ones that missed both real defects found during review, and the family
whose review was waived is the one that found them — twice, both fixed with
tests that fail without the fix. The waiver clears when any second non-builder
family approves the released range.

## Why publish this at all

The debt register's own preamble says it: a commons that quietly runs below its
own rules is worse than one with no rules, because it claims a guarantee it is
not providing. The release note ends by naming what would **reverse** the
release rather than amend it — a booker's details reaching anyone they should
not, sign-up used to enumerate or impersonate, or counsel saying the transfer
position is not tenable. That is the deal this project keeps making: the
software opens up, and the record of what is still owed opens up with it.
