---
title: "Pumasi Booking"
description: "A booking page people can send someone to pick a time on. Accounts, a public page, confirmation mail, management links. Beta; no licence file yet."
compareTo: [Calendly, "Cal.com"]
status: beta
repo: "https://github.com/pumasi-ai/pumasi-booking"
limitation: "**the public booking page on `booking.pumasi.ai` shows no times to book, and a stranger meets that before anything else on this card.** Measured first-hand 2026-09-01: `GET https://booking.pumasi.ai/yunyoungmok/abc` answered `200`, 45 407 bytes, at **05:21:07 UTC**, carrying **24** slots in its own `#slots-data` — and the `render()` in those very bytes builds a button for each one and appends none. `times` is cleared (`times.textContent=''`) and queried (`times.querySelectorAll`) and never appended to; the five `appendChild` calls on that page all belong to other elements. Driven in headless Chrome at **05:21:26 UTC** in `America/Chicago`: day cells `1` and `2` render as available, the heading reads *Tuesday, September 1*, `#times.children.length` is **0**, and **nothing is thrown** — zero `pageerror`, zero console errors. So a day the calendar offers is a day with an empty list under it, silently, and a booking page that cannot show a time cannot take a booking. It was [filed from the live product](https://github.com/pumasi-ai/pumasi-booking/issues/32) at 2026-09-01 00:36:56 UTC, repaired at [`d7bd490`](https://github.com/pumasi-ai/pumasi-booking/commit/d7bd490), and **not deployed**: `/version` answered `{"version":"0.2.0","commit":"2453adc"}` at 05:20:31 UTC and the repair is not in that build. That is `pumasi/DECISIONS.md` **Q-038**, whose own row records a window closing 2026-09-08. Separately, nobody has yet measured a reminder, follow-up or webhook actually being delivered on booking.pumasi.ai. The repaired timer deployed 2026-09-01 00:40:44 UTC, so the code is on the worker — but delivery is unverified, and an organisation that has booked nothing since then may have no alarm armed at all. When a queue does drain, work overdue since 2026-08-28 is sent late rather than skipped. The repository is still ahead of the deployment and nothing carries one to the other. **And the subprocessor register that host serves is short by one party.** Re-measured by this card 2026-09-01 05:20:31 UTC: `/version` answers `2453adc`, `/subprocessors` (`200`, 34 663 bytes) names five parties and no sixth, and that build sends **Zoom** the booker's name and email address on any booking for an event type whose location is Zoom (`service/src/app.ts:3524` and `:3528` at `2453adc`). `main` names *Zoom Video Communications, Inc.* since `c000feb`; the deployment does not, and nothing carries the correction across — `pumasi/DECISIONS.md` **Q-012** and **Q-036**, both open, and neither this page's to answer. Beware the obvious check: `grep -ic zoom` on that page returns **4**, and all four are page presentation — three the `pf-shot-zoom-hint` class (two stylesheet rules and one `class=` on a screenshot caption) and one `style="cursor:zoom-in;"` on a preview image; `grep -io "zoom video"` is the test, and at 05:20:31 UTC it returned nothing. Separately, no lawyer has reviewed its privacy pack, and no standard contractual clauses cover its US transfer position — the legal pages it serves say so on their face."
order: 1
updated: 2026-09-01
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

## The hosted booking page shows no times, and the repair is merged and not deployed

**If you are about to send someone to a booking page on `booking.pumasi.ai`,
read this first: they will see nothing to click.** A day the calendar renders
as available opens to a heading naming that day and an empty space where the
times go. This is not one page's bad luck — `bookingPage()` in
`service/src/pages.ts` is the single renderer behind every public booking page
that build serves, and the defect is in it. Nothing errors, nothing warns, and neither the person
booking nor the person who published the link is told why. A booking page that
cannot show a time cannot take a booking, so on the other side of that page
nothing happens at all — no meeting, no confirmation, no reminder.

**Measured by this card against the live host on 2026-09-01, not against
source.** Two independent measurements, because the second is what a person
actually experiences and the first is what anyone can check without a browser:

```console
$ date -u +"%Y-%m-%d %H:%M:%S UTC"
2026-09-01 05:21:07 UTC

$ curl -s -o /tmp/bp.html -w "%{http_code} %{size_download}\n" \
    https://booking.pumasi.ai/yunyoungmok/abc
200 45407

$ grep -o 'times\.[a-zA-Z]*' /tmp/bp.html | sort | uniq -c
      1 times.querySelectorAll
      1 times.textContent
```

Twenty-four slots arrive in the page's own `#slots-data`, correct and
complete. The `render()` shipped in the same bytes walks them, builds a
`<button class="slot">` for each, wires its click handler — and then lets it
fall out of scope. `times` is only ever *cleared* and *queried*. It is never
appended to. The five `appendChild` calls elsewhere on the page belong to other
elements entirely.

**Driven in a real browser, because a defect in what a string *does* is not
visible in the string.** Headless Chrome, timezone `America/Chicago`, against
the live host at **2026-09-01 05:21:26 UTC**:

| | |
|---|---|
| HTTP status | `200` |
| slots in `#slots-data` | **24** |
| day cells marked available | `1`, `2` |
| `#picked-day` | *Tuesday, September 1* |
| **`#times.children.length`** | **0** |
| `#times.innerHTML` | *(empty string)* |
| page errors + console errors | **0** |

The last row is the reason this ran for four weeks. **Nothing goes wrong in any
sense a computer can detect** — the page does exactly what it was told, and what
it was told was incomplete. The report that surfaced it says *0 error(s)
captured*, and that was accurate.

**Re-driven half an hour later, by a second seat, before this page was
published.** At **2026-09-01 05:49:38 UTC** the same browser run against the same
live host returned the same page — `200`, 45 407 bytes, **24** slots, day cells
`1` and `2` — and this time *both* available days were clicked rather than one:
`#times.children.length` is **0** under *Tuesday, September 1* **and** **0**
under *Wednesday, September 2*, with **0** errors captured. `/version` still
answered `2453adc` at 05:48:45 UTC. Nothing above is carried on an earlier
seat's word.

**One deleted line, in a commit about something else.** `50f911f` removed
`times.appendChild(b)` from the `byDay[pickedDay].forEach` loop in
`service/src/pages.ts` while inserting a `localStorage` block that remembers a
booker's name and email between visits — a change with no business touching the
calendar. Read out of the deployed commit rather than out of `main`:
`git show 2453adc:service/src/pages.ts` puts the `forEach` at `:974` and closes it
at `:985` with the button built, wired, and never placed. `:985` is the line the
repair puts it back on.

**The repair is merged and it is not deployed.**
[`d7bd490`](https://github.com/pumasi-ai/pumasi-booking/commit/d7bd490) adds the
line back with a comment saying why it must not be removed again, and adds
`service/test/booking-slots.test.ts`, which serves that tree's own page over
loopback and drives it in a browser — **2 of 6 before the fix and 6 of 6
after**, where 331 existing service assertions read the page as a string and all
passed on both sides. **This page does not claim that repair has shipped.**
`curl https://booking.pumasi.ai/version` answered
`{"version":"0.2.0","commit":"2453adc"}` at **05:20:31 UTC** on 2026-09-01, and
the repair is not in that build — which is why the two measurements above, taken
a minute later, still show an empty list.

**Why it is still here.** Nobody owns deployment. That is
[`DECISIONS.md` **Q-012**](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
open, and explicitly **outside** CHARTER Part 0's proceed-on-default rule, so
unlike nearly everything else in this project an agent may not proceed on it.
The release note is
[*A booking page day that shows times, shows times*](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-09-01-pumasi-booking-a-day-that-shows-times-shows-times.md),
and its own second paragraph reads *It is merged and it is **not deployed***.
The entry is **Q-038**, whose own row records a window closing **2026-09-08** —
that is the entry's date, reported here and not set here. **This card sets no
deadline, names no deployer, and takes no position on any default.**

**What the repair cannot do, named rather than smoothed over.** Bookings that
did not happen in the four weeks this was live are not recoverable, and nobody
knows how many there were. The release note says so rather than letting *fixed*
imply otherwise, and so does this card.

**The local route above is unaffected.** `npm run build` from a fresh clone of
`main` gives you a booking page that shows its times. The defect is in the
deployment, not in the repository you would clone.

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

## Conferencing links, reminders, and two defects that were live until 00:40 UTC

Until 2026-09-01, pressing "Connect with Zoom" on the deployment pasted your
Zoom **personal meeting room** — the one permanent room an account has — onto
your public booking page, where anyone who opened that page could read it and
walk in. They did not have to book, prove an email address, or be invited. The
same paste also suppressed the per-booking room the card beside the button
promised.

**That is no longer the build you get, and this page stops saying it is on the
day it stopped being true.** `booking.pumasi.ai` was deployed three times
between **2026-09-01 00:38:41 and 00:40:44 UTC** — the deployment before them
was 2026-08-30 16:55:37 UTC — and the commit that removes the paste is an
ancestor of what the worker now serves. Both halves are checkable without
credentials to this account: `curl https://booking.pumasi.ai/version` names the
build, and `git merge-base --is-ancestor` answers whether a given fix is in it.
Re-measured 2026-09-01 01:47 UTC.

**The repository and the deployment are still two different things, and this
page still says which is which** — the gap shrank on 2026-09-01 00:40 UTC and
has since widened again by eight commits, two of which a user is meeting today:

| | `main`, the repository | `booking.pumasi.ai`, what you can use today |
|---|---|---|
| Build | [whatever `main` is when you read this](https://github.com/pumasi-ai/pumasi-booking/commits/main) — no commit is copied here, because a commit copied into prose goes stale on the next merge and this one already had, twice | last deployed **2026-09-01 00:40:44 UTC**, re-measured with `npx wrangler deployments list` on 2026-09-01 at 01:47 UTC; `/version` names the build it is serving |
| **Times on a public booking page** | shown | **not shown — the list is empty on every available day.** `d7bd490` is not an ancestor of `2453adc`; measured on the host 2026-09-01 05:21, first section on this page |
| Personal meeting room on the public page | removed | **removed** — the fix is an ancestor of the deployed build |
| Per-booking room, created at booking time | yes | yes |
| Reminders, follow-ups and webhooks | drained by a timer, with a test that executes the deployed entry point's alarm handler | **the repaired timer is deployed; no delivery has been measured** — read the section below before you rely on it |
| Subprocessor register at `/subprocessors` | `service/src/legal.ts` names *Zoom Video Communications, Inc.* since `c000feb` | **names five parties and not Zoom, and the build sends Zoom the booker's name and email** — measured 2026-09-01 05:20:31, section *Where it stands legally* |
| Reviewed and gate-passed | each fix named on this page carries at least one approving review from a family other than its builder's, and `GATE: PASS` | **the two live defects above are reviewed, gate-passed, merged, and not in this build.** Review is not delivery, and no count is given here because the check is the citation: `git merge-base --is-ancestor <fix> 2453adc` |
| Merged after that deploy, and not in it | **eight commits** at 05:49 UTC on 2026-09-01 — `git rev-list --count 2453adc..origin/main` against a freshly fetched remote. It read **seven** half an hour earlier, at 05:21; run the command rather than trusting the number, because that repository has a writer in it today — including the empty-times repair (`d7bd490`), the subprocessor-register repair (`c000feb`), and a button on the event settings page that opens your own public booking page | none of them |

**Do not read that last row as nearly-shipped.** The commit was authored
**seven seconds** after the deployment that would have carried it — deploy at
00:40:44 UTC, commit at 00:40:51 UTC. Seven seconds and a deploy is exactly as
undeployed as thirty-one hours and a deploy, which is the whole reason this
table has two columns and why it keeps them now that it has only one row to
put in the gap.

**The deploy that closed the two defects did not travel the charter's flow
either, and that is the part that has not changed.** All three deployments are
attributed to the operator account with `Source: Unknown (deployment)` in
`npx wrangler deployments list`, and no release note records them. The flow ends
at a published release note, and no role owns deployment. It is open as
[`DECISIONS.md` Q-012](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
and the deploy still sits at the top of
[`BACKLOG.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/roadmap/BACKLOG.md)
as item 1, marked operator action rather than a build. **Someone deployed; the
question of who owes you the next one is still open**, and the row above is what
waiting looks like while it is.

What changed in `main` is written up in full — including what was deliberately
*not* changed, and what could still hurt someone — in
[the release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-zoom-connect.md)
(a can-hurt release under the charter; the charter's seven-day veto window
runs to 2026-09-07, which the steward has yet to confirm —
[Q-011](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)). That note
is written in the present tense and describes the branch. It now happens to
describe the page you can open as well — **which is a coincidence of dates and
not a property of release notes.** Read one as a claim about the repository and
check the deployment separately; that is the habit this table exists to enforce,
and today's agreement between the two columns is not a promise about the next
note you read.

If you have connected Zoom to the hosted deployment, pressing **Disconnect**
removes the stored link.

**Further reviewed fixes merged after that note, and the 00:40 UTC deploy
carried every one of them.** This page still keeps no running count — a tally is
a cache that goes stale on the next merge, and the one that used to sit here
already had. The standing facts are the ones that do not move:
[`pumasi/releases/`](https://github.com/pumasi-ai/pumasi/tree/main/releases) is
the current list rather than this paragraph, and `git merge-base --is-ancestor`
against the commit `/version` reports is how you tell whether any one of them
has reached you.

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

**What both have in common, and only one of the two things has changed.** They
are now **deployed** — each is an ancestor of the build `/version` reports — so
the right-hand column of that table no longer separates them from the left. What
has not changed is the half that mattered more: **neither defect could occur on
`booking.pumasi.ai` at all**, because that deployment has Google Calendar
configured, which is precisely the condition that hid both bugs. The people they
were broken for are self-hosters, and companies running their own copy from the
repository; for them merged genuinely is the delivery mechanism, once they pull,
and the deploy above changed nothing for them either way.

**Neither of them touches the Zoom leak above, which a different commit closed.**
Nothing in either release goes near it. What ended that leak was the deploy, and
the ancestry check in the table is the evidence for it rather than either of
these two notes.

### The second defect: reminders, follow-ups and webhooks were never sent for three days, and the repair is now deployed

Pumasi Booking sells timed messages — a reminder the day before, a follow-up
afterwards — and webhooks that tell another system when someone books, cancels
or reschedules. **On `booking.pumasi.ai`, between the feature shipping on
2026-08-28 and the deploy at 2026-09-01 00:40 UTC, not one of them was
delivered.** Not one reminder, not one follow-up, not one webhook, for three
days.

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

**The fix is deployed, and that is a smaller claim than it sounds.** The commit
that adds the missing import is an ancestor of the build `/version` reports, so
the code that drains the queue is on the hosted worker. **Nobody has measured a
reminder actually arriving since.** This page will not tell you your reminders
are working on the strength of a deployment: those are two different facts and
only the first has been checked. Checking the second means booking against a
real owner's page — the same line the evaluation described below declined to
cross, for the same reason.

**What the source says recovery depends on, so you can reason about your own
queue instead of waiting for a reassurance.** Each organisation is one Durable
Object holding one alarm. The repaired handler drains what is due and then arms
the next alarm from the earliest job still pending — the line the old crash died
just before reaching. Enqueuing work arms it too, by the same rule. So the
deploy replaced the code; **it did not by itself put an alarm back on a clock
that has had none since 2026-08-28.** If nothing has been booked, cancelled or
rescheduled in your organisation since the deploy, then nothing on this page
establishes that your queue has moved. Do one of those things and it does.

**And when a queue does drain, overdue work is sent — not skipped.** This page
said the opposite until today, inheriting it from
[the release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-booking-alarm-import.md),
which states that *"Reminders whose moment has passed are not sent late; a
follow-up for a meeting three days ago would be noise, not service."* The code
does not do that. The drain selects every pending job whose run time is at
or before now — twenty to a pass, oldest first — sends it and marks it done
([`service/src/automation.ts`](https://github.com/pumasi-ai/pumasi-booking/blob/main/service/src/automation.ts),
`processDueJobs`); nothing purges a stale job, and cancelling a booking removes
only its *future* ones. The product does refuse late work in exactly one place,
and it is a different place: at **booking** time, a before-or-after reminder
whose moment has already gone is never queued at all. That guard is real and it
is in the same file, fifty lines above the drain — but it decides what enters
the queue, never what leaves it, so it cannot do anything about a job that was
queued on time and then sat there for three days. **So expect backdated reminders and webhooks on the first drain
after the deploy, and read them as the cost of a three-day outage rather than as
a second defect.** Correcting the release note is not this page's to do. Saying
the true thing here is.

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
2026-08-30. Mail and calendar connections are a separate matter, and the register
that names the third parties who can see data **names Zoom in `main` and is
short by that party on the deployment you can actually read** — the next section
measures both.

### The subprocessor register is right in the repository and wrong on the host

**Re-measured by this card against the live host on 2026-09-01 at 05:20:31 UTC,
not against source, and taken at this seat's own clock rather than carried from
an earlier one.** `curl https://booking.pumasi.ai/version` answers
`{"version":"0.2.0","commit":"2453adc"}`, and `GET /subprocessors` on that host
answers `200`, 34 663 bytes, naming **five** parties and no sixth: *Cloudflare,
Inc.*, *Google LLC (Gmail API)*, *Google LLC (Google Calendar)*, *Microsoft
Corporation (Microsoft Graph)* and *date.nager.at*.

**The build serving that page sends a sixth party the booker's name and email
address.** Read out of the deployed commit itself rather than out of `main` —
`git show 2453adc:service/src/app.ts` — a booking on an event type whose
`location_kind` is `zoom` mints a Zoom meeting with these two fields:

```js
// service/src/app.ts at 2453adc — the commit booking.pumasi.ai reports serving
topic:  `${schedule.title} — ${name}`,                      // :3524 — the booker's name
agenda: `Booked by ${name} <${email}> via Pumasi Booking`,  // :3528 — name and address
```

That call is made on **either** of two credentials, and the difference matters
enough to have been read out of the same commit rather than taken on trust.
Step 2 (`app.ts:3533-3545`) uses the account holder's **own** stored Zoom grant.
Step 3 (`app.ts:3549-3557`) runs *only when step 2 produced no meeting* and uses
`config.zoomAccountId` / `zoomClientId` / `zoomClientSecret` — a
**server-to-server credential belonging to whoever runs the deployment**, on the
*operator's* authorisation. So a booking can reach Zoom for an account holder
who never connected anything. Nothing is sent for an event type with any other
location: the whole block is inside
`if (schedule.location_kind === 'zoom' && !meetUrl)`.

**The repair is merged and not deployed.** `pumasi-booking`
[`c000feb`](https://github.com/pumasi-ai/pumasi-booking/commit/c000feb) makes
`service/src/legal.ts` name **Zoom Video Communications, Inc.** under the served
register's *In use now* heading, with the two fields it receives spelled out;
`git show 2453adc:service/src/legal.ts | grep -ci zoom` returns **`0`**, so the
copy now in production never carried it.
[`SUBPROCESSORS.md`](https://github.com/pumasi-ai/pumasi-booking/blob/main/SUBPROCESSORS.md)
names Zoom too, since `c4b1159`, and says so about itself in its own text —
*"the register a customer is actually pointed at omits a provider that this file
names, and this file is ahead of the published one rather than a record of
it."* What is missing is not the correction but the deployment: that is
[`DECISIONS.md` **Q-012**](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
*who deploys a merged fix, and by when*, open — the same entry this site names
on the [Pumasi Sign](/products/pumasi-sign/) card, where four merged repairs are
stacked behind it — **Q-028** counted the first two, and **Q-035** and **Q-037**
each call themselves the third and the fourth in their own rows.

**Check this yourself with the right command, because the obvious one lies.**
`curl -s https://booking.pumasi.ai/subprocessors | grep -ic zoom` returns **4**,
and not one of the four is a disclosure. Enumerated rather than summarised:
`.pf-shot-wrap:hover .pf-shot-zoom-hint` and `.pf-shot-zoom-hint` are rules in
the page's inline stylesheet, `<span class="pf-shot-zoom-hint">` is that class
on a screenshot caption, and the fourth is `style="cursor:zoom-in;"` on a
preview image. Four hits, four pieces of presentation.
`grep -io "zoom video"` is the check, and on 2026-09-01 at **05:20:31 UTC** it
returned nothing. That trap is written into **Q-036** in its own row because a reading of
it nearly went the other way.

**What is owed to account holders is not this page's to answer.** The served
register's own *Adding one* section — present on the page fetched at 05:20:31 UTC,
in those words — says account holders are *told before an addition takes
effect*. Whether that clause was owed for a provider that reached
production undisclosed — and whether publishing the corrected register discharges
it or a retrospective notice is also due — is open as
[`DECISIONS.md` **Q-036**](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)
and is the steward's. This card reports that entry's state and takes no position
in it.

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
