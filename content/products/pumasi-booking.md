---
title: "Pumasi Booking"
description: "A booking page people can send someone to pick a time on. Accounts, a public page, confirmation mail, management links. Beta; no licence file yet."
compareTo: [Calendly, "Cal.com"]
status: beta
repo: "https://github.com/pumasi-ai/pumasi-booking"
limitation: "two reviewed fixes for live defects are merged but not deployed — booking.pumasi.ai is still serving the build from 2026-08-30 16:55 UTC, so a connected owner's Zoom personal meeting room is still printed on their public booking page, and no reminder, follow-up or webhook has ever been delivered on that deployment. Separately, no lawyer has reviewed its privacy pack, and no standard contractual clauses cover its US transfer position — the legal pages it serves say so on their face."
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

## Conferencing links, reminders, and two defects that are live right now

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
| Build | [whatever `main` is when you read this](https://github.com/pumasi-ai/pumasi-booking/commits/main) — no commit is copied here, because a commit copied into prose goes stale on the next merge and this one already had, twice | last deployed **2026-08-30 16:55:37 UTC**, re-measured with `npx wrangler deployments list` on 2026-08-31 at 22:04 UTC |
| Personal meeting room on the public page | removed | **still printed — the leak is live** |
| Per-booking room, created at booking time | yes | no |
| Reminders, follow-ups and webhooks | sent when due | **never sent — not one, since the feature shipped 2026-08-28** |
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

**Further reviewed fixes have merged since, and none of them changes anything
you can use today.** This page keeps no running count of them — a tally is a
cache that goes stale on the next merge, and the one that used to sit here
already had. The standing fact is the one that does not move: every merged fix
below waits on the same open Q-012, and
[`pumasi/releases/`](https://github.com/pumasi-ai/pumasi/tree/main/releases) is
the current list rather than this paragraph.

**The OAuth callback.** It now gates on being able to open a *signed* state
value rather than on a calendar integration existing, so a deployment that has
a Zoom app and **no** calendar can finish connecting Zoom — and the unsigned
fallback state that three call sites built in that case is deleted.
[A can-hurt release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-oauth-callback.md)
under [Q-015](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md), veto
window to 2026-09-07.

**Signing in no longer requires a Google calendar.** Two sign-in doors asked
whether a *calendar* was configured and used the answer as though it were
*"can I sign someone in?"*. A deployment with a Microsoft app and no Google
Calendar offered **"Continue with Microsoft"** and then answered *"Microsoft
sign-in is not configured"* — the button and the answer disagreed, and the
answer was wrong. A company that had pointed the product at its own
per-organisation single sign-on was told *"SSO is not configured on this
deployment"* when it was. Neither operator did anything wrong, and the missing
piece was a third-party calendar they had never asked for. Both doors now ask
whether they can seal a signed ticket, which is the question they were always
really asking.

**Nothing was unguarded to get there**, which is the part worth checking rather
than assuming: each door still refuses on its own missing configuration, the
tickets are still always signed, and three of the six frozen acceptance cases
exist precisely to catch the lazy version of this fix — verified by deliberately
breaking the code and watching them go red.
[The release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-signin-without-a-calendar.md)
is a can-hurt note under
[Q-022 and Q-023](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
veto window to 2026-09-07.

**What both have in common, and it is the same two things each time.** They are
**merged and not deployed**, for the same Q-012 reason as the row above, so the
right-hand column of that table is unchanged by either. And **neither defect can
occur on `booking.pumasi.ai` at all** — that deployment has Google Calendar
configured, which is precisely the condition that hid both bugs. The people they
were broken for are self-hosters, and companies running their own copy from the
repository; for them merged genuinely is the delivery mechanism, once they pull.

**Neither of them touches the Zoom leak above, which is still live.** Nothing in
either release goes near it, and nothing has been deployed since:
`npx wrangler deployments list` still puts the last deployment of this worker at
**2026-08-30 16:55:37 UTC** — re-measured 2026-08-31 at 22:04 UTC, and it had not
moved — and `booking.pumasi.ai` answers that build today.

### The second defect: reminders, follow-ups and webhooks have never been sent on the hosted deployment

Pumasi Booking sells timed messages — a reminder the day before, a follow-up
afterwards — and webhooks that tell another system when someone books, cancels
or reschedules. **On `booking.pumasi.ai`, none of them has ever been
delivered.** Not one reminder, not one follow-up, not one webhook, since the
feature shipped on 2026-08-28.

They were not delayed, and no mail provider dropped them. **They were never
attempted.** Everything timed goes onto a queue and a timer drains it; on the
hosted build that timer threw on its first line of real work, and it died on
the line *before* the one that schedules its next wake-up — so it never woke
again either. Booking itself is untouched: a booking still confirms, and the
confirmation you get at the moment of booking goes out on the request path
rather than through the queue, so that one arrives.

**This defect is the mirror image of the OAuth-callback and sign-in fixes
above, and the asymmetry is the part worth carrying away.** Those two cannot
occur on `booking.pumasi.ai` at all, and the people they broke are
self-hosters, for whom merged really is delivery. This one is the reverse: it
can occur **only** on the hosted Cloudflare build. If you run Pumasi Booking
yourself on the Node server, you were never affected — that entry point
imported the function it calls, throughout. The hosted entry point did not, and
the tool that bundles it strips types without reading them, so a missing import
bundled cleanly and shipped. For this defect, self-hosting is what protected
you.

**The fix is merged and it is not deployed**, on the same open Q-012 as
everything else on this page, and the deployment measurement above is the whole
answer: nothing has moved, so your reminders and webhooks are still not being
sent. When someone does deploy, anything still queued for a future time is
delivered normally; nothing whose moment has already passed is sent late, which
is deliberate — a follow-up for a meeting three days ago would be noise rather
than service.

**How it was found, and what is not being claimed.** Nobody reported this. The
issue tracker holds nothing about it, and that is the shape of the failure
rather than a detail of it: a reminder that never arrives does not look like an
error to the person waiting for it. It was found by running the type-check that
nothing in the project ran automatically — the check the engine section below
describes. And the evaluation that found it **did not** exercise a workflow against the live
deployment; doing that would mean booking against a real owner's page. The
finding rests on the source, on the bundle that would ship, and on the path
that arms the timer, each checked separately and written down in
[`roadmap/BACKLOG.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/roadmap/BACKLOG.md).
[The release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-alarm-import.md)
is a can-hurt note under
[Q-029](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md), veto window
to 2026-09-07.

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

**Since 2026-08-31 you are not the only one who can run it.** Every push and
every pull request is checked in public — the run page opens without an
account — and what the machine runs is one script in the repository,
`tools/ci.sh`, so `npm ci && tools/ci.sh` is the same thing on your own
machine. **It blocks nothing**: no branch protection, no required status check,
and `GATE: PASS` still means what the charter has always said it means, that an
agent ran the gate and signed the record. What earns it a paragraph here is the
other half: **the run states what it did not check, every time it runs.** It
names `service/test/browser-live.test.ts` — excluded from that one run because
it drives the live `booking.pumasi.ai` and would go red for a third party's
reasons — and the script *fails* if that file is not in the suite, so the
exclusion cannot quietly become a lie the day someone renames a test. And the
same paragraph you are reading has since had to be corrected, which is the
better demonstration: the run used to report that **nothing** in the repository
type-checked the deployed entry point, `src/worker.ts`. Something does now, and
the run stopped saying otherwise without anyone editing that sentence into it:
it *discovers* the `service` tsconfigs at run time and reads each one, rather
than consulting a list written down on the day the gap was found, and
[`tools/ci.sh`](https://github.com/pumasi-ai/pumasi-booking/blob/main/tools/ci.sh)
says why in a comment at the spot where it would have gone wrong: *"a hardcoded
pair would have gone on saying nothing checks the worker while something did."*
**The check the run confessed was missing is the check that got built**, and the
confession retired itself. What stands in its place is narrower and worth
reading before you trust the file: `src/worker.ts` is now type-checked, and a
test executes its alarm handler — but no run there exercises its router, and
nothing in that script runs `workerd`. Switching CI on is also what found
that the root type-check had been skipping the whole `service/` workspace —
every line that touches HTTP, PostgreSQL, mail and sessions — while exiting
`0`; that is now closed, with the workspace passing as it already stood.
[The release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-advisory-ci.md)
is a can-hurt note under
[Q-026](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md), veto window
to 2026-09-07. **It shipped nothing to a user**, so the right-hand column of the
table above is untouched by it.

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
