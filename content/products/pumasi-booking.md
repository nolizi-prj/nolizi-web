---
title: "Pumasi Booking"
description: "A booking page people can send someone to pick a time on. Accounts, a public page, confirmation mail, management links. Apache-2.0."
compareTo: [Calendly, "Cal.com"]
status: beta
repo: "https://github.com/pumasi-ai/pumasi-booking"
limitation: "a reviewed fix for a live defect is merged but not deployed — booking.pumasi.ai is still serving the build from 2026-08-30 16:55 UTC, so a connected owner's Zoom personal meeting room is still printed on their public booking page. Separately, no lawyer has reviewed its privacy pack, and no standard contractual clauses cover its US transfer position — the legal pages it serves say so on their face."
order: 1
updated: 2026-08-31
---

## Run it

```
git clone https://github.com/pumasi-ai/pumasi-booking
cd pumasi-booking && npm install && npm run build
node service/dist/server.js
```

It prints a sign-up link on first start. Follow it and you have an account, a
booking page, and availability you can edit. Share the link and someone can book
a time.

No database, no container, no configuration. It runs a real PostgreSQL
in-process, so the constraints are genuinely enforced — but nothing survives a
restart until you give it a `DATABASE_URL`.

The invite appears **only while there are no accounts**. Once anyone has signed
up it stops, even if asked for explicitly: an invite that keeps appearing is a
back door. After that they are minted deliberately, from the CLI.

## It can see your real calendar, once you connect one

Google and Microsoft 365 connections are read for busy times **before any slot
is offered**, and read again at the moment of booking, so a commitment that
appeared while someone was choosing still blocks the slot. It **fails closed**:
while a connected calendar cannot be reached, the page refuses to offer times
rather than risk booking over you. Cancellations and reschedules follow to the
connected calendar.

**Without provider credentials configured, nothing is connected.** The service
then knows only about bookings made inside it, and will offer a time you are
already busy. This page said "it cannot see your real calendar yet" until the
connection shipped; the sentence follows the software, not the plan.

**On the hosted deployment this holds in full only for test users.** The Google
OAuth application has not been submitted for verification, so on
booking.pumasi.ai only nominated test accounts can connect a Google calendar —
a stranger cannot yet
([`GOOGLE-SETUP.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/service/spec/0003/GOOGLE-SETUP.md);
the limit is stated in the product's own
[`VALUE.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/roadmap/VALUE.md)
under claim C1). Self-host with your own credentials and the gate does not
apply to you. This is one of the reasons the product is not `launched`.

## Conferencing links, and a defect that is live right now

If you press "Connect with Zoom" on the deployment today, your Zoom **personal
meeting room** — the one permanent room an account has — is pasted onto your
public booking page, where anyone who opens that page can read it and walk in.
They do not have to book, prove an email address, or be invited. The same paste
also suppressed the per-booking room the card beside the button promised.

**The fix is merged, reviewed and gate-passed — and it is not deployed: the
build serving `booking.pumasi.ai` today is the one without it.** The repository
and the deployment are two different things here, and this page says which is
which rather than letting the repository take credit for the product:

| | `main`, the repository | `booking.pumasi.ai`, what you can use today |
|---|---|---|
| Build | `4f6ddf0`, 2026-08-31 14:25 UTC | last deployed **2026-08-30 16:55:37 UTC** |
| Personal meeting room on the public page | removed | **still printed — the leak is live** |
| Per-booking room, created at booking time | yes | no |
| Reviewed and gate-passed | Gemini spec + code review, `GATE: PASS` | n/a — this build predates the fix |

Nothing carried the reviewed build to the worker, and that gap is structural
rather than an oversight: the charter's flow ends at a published release note,
and no role owns deployment. It is open as
[`DECISIONS.md` Q-012](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
and the deploy sits at the top of
[`BACKLOG.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/roadmap/BACKLOG.md)
as item 1, marked operator action rather than a build.

What changed in `main` is written up in full — including what was deliberately
*not* changed, and what could still hurt someone — in
[the release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-zoom-connect.md)
(a can-hurt release under the charter; the charter's seven-day veto window
runs to 2026-09-07, which the steward has yet to confirm —
[Q-011](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)). That note
is written in the present tense and describes the branch. **Until the deploy
happens, read every sentence in it as true of the repository and not of the
page you can open.**

If you have connected Zoom to the hosted deployment, pressing **Disconnect**
removes the stored link now, without waiting for the deploy.

**A second reviewed fix has merged since, and it changes nothing you can use
today.** `main` moved from `16c3fd4` to
[`4f6ddf0`](https://github.com/pumasi-ai/pumasi-booking/commit/4f6ddf0) on
2026-08-31: the OAuth callback now gates on being able to open a *signed* state
value rather than on a calendar integration existing, so a deployment that has
a Zoom app and **no** calendar can finish connecting Zoom — and the unsigned
fallback state that three call sites built in that case is deleted. It is
written up as
[a can-hurt release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-oauth-callback.md)
under
[Q-015](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md), veto window
to 2026-09-07.

Two things about it belong on this page and nothing else does. **It is merged
and not deployed**, for the same Q-012 reason as the row above, so the
right-hand column of that table is unchanged by it. And **the defect it closes
cannot occur on `booking.pumasi.ai` at all** — that deployment has a calendar
integration configured, which is precisely the condition that hid the bug. The
people it was broken for are self-hosters running their own copy from the
repository, and for them merged genuinely is the delivery mechanism, once they
pull. `wrangler deployments list` still puts the last deployment of this worker
at 2026-08-30 16:55:37 UTC.

## Inside the Product

See the actual booking experience running live at [**booking.pumasi.ai**](https://booking.pumasi.ai):

### Public Availability & Timezone Selector
Clean, responsive booking interface with automatic timezone conversion and calendar conflict avoidance:

![Pumasi Booking Interface](/screenshots/booking-public.png)

## Public sign-up, where an operator turns it on

`PUBLIC_SIGNUP` is off by default and fails closed — a value that does not parse
is treated as absent. Where it is on, **sign-up never hands out a session on an
unproven address**: creating an account mails a single-use link, and the session
begins only when that link is used. An invite, or Google's verified email, is
proof; a typed string is not. Sign-up answers identically whether an address is
taken or free, so it cannot be used to find out who has an account, and it is
rate-limited.

Opening the hosted deployment at booking.pumasi.ai to public sign-up was a
**can-hurt release** under the commons charter — the people exposed are bookers,
who never chose this project. The published record is
[the release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-29-pumasi-booking-public-signup.md),
including what shipped first, what is still unknown, and what would reverse it.

## Where it stands legally

The service serves its own legal pages — `/privacy`, `/terms`, `/dpa` and a
subprocessor register — from the software, at version 1.0, effective
2026-08-29. **Read those rather than this summary**: they are what is actually
in force, and a description that drifts from the notice the software serves is
worse than no description.

**The lawful basis is written and in force.** For account holders it is
performance of the contract, plus a legitimate interest in operating and
securing the service. For bookers it is the account holder's legitimate
interest, with this service acting as their **processor** — the organiser
decides what to ask, and the service holds it on their instructions.

The operator is **ATX APPLE LLC**, a Texas limited liability company in the
United States. Governing law is Texas. The contact is `admin@pumasi.ai`.

**It has not been reviewed by a lawyer.** The pages say so on their face rather
than imply a review that has not happened, and that disclosure stays on every
release note for as long as it is true.

**The international transfer position is genuinely unresolved.** The service is
operated from the United States and personal data is processed there. **No
standard contractual clauses are in place** — the documents state that plainly
instead of naming a safeguard that does not exist. If your own obligations
require one, write to `admin@pumasi.ai` before relying on this service for that
data.

Those two — the transfer mechanism and the review by counsel — are what remains
of [`DEBT.md` D-105](https://github.com/pumasi-ai/pumasi/blob/main/governance/DEBT.md),
which is open, and was narrowed from blocking to degrading on 2026-08-29.

**It can now report about itself — and on the deployment it still sends
nothing.** The mechanism shipped 2026-08-30
([release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-30-pumasi-booking-reporting-path.md)):
a daily operating report about the software, never about the people who use it,
and a conformance report an operator may choose to publish, signed, and never
sent automatically. One switch turns all of it off — `PUMASI_REPORTING=false` —
the software behaves identically afterwards, every start says out loud whether
reporting is on and names that switch, and one command prints byte-for-byte what
would be sent before anything goes.

Two things that sentence must not be read to cover. **On the Cloudflare Workers
build — the one serving booking.pumasi.ai — the mechanism is not wired in and
nothing is sent at all**; the live privacy page says so per path. And **there is
nothing to receive reports yet**: the documented intake is not live, so a send
today fails, is logged, and is dropped. Nothing is retained anywhere. The
retention promise is published (twelve months for operating reports, deletion on
request to `admin@pumasi.ai`, reaching backups within 30 days), which closed half
of [`DEBT.md` D-107](https://github.com/pumasi-ai/pumasi/blob/main/governance/DEBT.md);
that entry stays open until the intake exists with its deletion path implemented
and tested. D-108, which recorded the absence of any mechanism, closed
2026-08-30. Mail and calendar connections are a separate matter, and every third
party that can see data is named in the subprocessor register.

### The ceilings are defaults, not a refusal

A fresh deployment starts at five owner accounts and two hundred retained
bookings, with public sign-up off. Those are **deployment defaults an operator
may raise** — `MAX_OWNER_ACCOUNTS`, `MAX_BOOKINGS`, `PUBLIC_SIGNUP` — set low so
that a deployment nobody is watching does not quietly grow. They are enforced in
code, and they are not a cap the service refuses to lift.

## The engine is the interesting part

Availability computation and booking is a **pure function**: no clock of its own,
no I/O, no ambient state. Same inputs, byte-identical output. It lives in the
`core/` workspace and can be taken alone.

It is deliberately hard where scheduling software is usually wrong:

- A window spanning the spring-forward gap yields **two absolute hours, not
  three**.
- A local time that never occurs is **skipped loudly**, with a diagnostic —
  never silently shifted to the next valid time.
- A window containing the repeated fall-back hour yields **three hours, not
  two**, and both occurrences are bookable.
- A daily cap counts on the **owner's** local date. Not UTC's. Not the
  requester's.

These are the cases calendar arithmetic is easiest to get wrong, which is why
they are specified rather than left to the implementation. A language-neutral
acceptance suite holds them, frozen when the specification was approved and
untouchable by the agent that implemented against it.

```
npm test
```

No test count is quoted here. The suite is
[`core/spec/acceptance/cases.json`](https://github.com/pumasi-ai/pumasi-booking/blob/main/core/spec/acceptance/cases.json)
and `npm test` prints the current totals; a number copied into prose is a cache
with no way to invalidate it. This page carried one that was out by more than
half before anyone noticed.

## How it is laid out

Two workspaces, one product, one repository.

| | Holds |
|---|---|
| `core/` | The availability engine. Pure: no clock, no I/O, no ambient state. |
| `service/` | Everything that touches the world: HTTP, PostgreSQL, mail, sessions. |

The engine is a workspace rather than its own repository on purpose. It has a
real boundary — purity, its own specification, its own acceptance suite — and
that boundary is enforced by the code and its tests, not by a repository wall.
It *was* a separate repository once; that cost two merge gates, two specification
trees and an unpinned dependency in exchange for a reusability nobody had asked
for (documented in [L-001](https://github.com/pumasi-ai/pumasi/blob/main/lessons/L-001-premature-specialization-forks-the-narrative.md)).

The day someone wants the engine alone, `git subtree split --prefix=core` hands
it over with its history intact.

## Deploying it

Two builds, and **neither one is the real one.** Self-hosting is first-class
permanently — a hosted deployment is a convenience, never a capability the
self-hosted build lacks. A project that documented only one of these would be
quietly making the other the copy.

**Self-hosted** — Node 22 or a container, with PostgreSQL:

```
docker compose up          # service + PostgreSQL, locally
docker build -t pumasi .   # then run it wherever
```

Set `PORT`, and `DATABASE_URL` for anything that must outlive the process.
`PGSSL=require` if your provider needs TLS.

**Cloudflare Workers** — one SQLite-backed Durable Object per tenant
organisation, each holding a single company's entire world: the same schema and
the same request handling as the single-tenant service, with one writer.

### The guarantee holds on both

No-double-booking is enforced **inside the database**, never in application
code: a `btree_gist` exclusion constraint on PostgreSQL, and `BEFORE INSERT` and
`BEFORE UPDATE` triggers raising `ABORT` on SQLite. Different mechanism, same
*kind* of mechanism — the check happens within the write, so two concurrent
bookings cannot both win. Neither dialect gets the weaker deal.

### Mail differs by build, and it is worth knowing which you have

The **self-hosted** build sends over SMTP — every provider speaks it, so the
choice is a URL and switching costs nothing — and it refuses at runtime to send
through a host that is not in the subprocessor register.

The **Workers** build sends through the Gmail API instead. There, what
constrains the transport is which one the build constructs: a code change,
visible in review, rather than a runtime guard. That is a **weaker control**,
and it is worth naming as weaker rather than describing both paths in language
that only the first one earns.

Beyond those two builds, nothing in the code knows about a particular host, and
no special protocol is required to participate.
