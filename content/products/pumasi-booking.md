---
title: "Pumasi Booking"
description: "A booking page people can send someone to pick a time on. Accounts, a public page, confirmation mail, management links. Apache-2.0."
compareTo: [Calendly, "Cal.com"]
status: seed
repo: "https://github.com/pumasi-ai/pumasi-booking"
limitation: "it cannot see your real calendar yet, so it will offer a time you are already busy and confirm a booking on top of it."
order: 1
updated: 2026-08-29
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

## What it does not do yet

**It cannot see your real calendar.** The service knows only about bookings made
inside it, so it will offer a time you are already busy and confirm a booking on
top of it. Double-booking against your own calendar is the *expected* behaviour
today, not a bug to report.

Calendar connection is the next item: Google first, reading busy times first,
write-back as a separate optional grant later. Google and Microsoft are named as
subprocessors before any token is held, and the connection token is treated as
the most protected datum in the system.

**There is no settled lawful basis for the personal data it holds.** The service
caps itself at five accounts and two hundred bookings and refuses to raise those
ceilings until a legal person — not an agent — decides the basis on which
bookers' names and email addresses are held, approves the privacy notice, and
answers for deletion reach.

That cap is enforced in code. It is the one queue entry with no route around a
public launch, and it stays open in public until it is answered.

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

Both category leaders have open bugs in the last two of those today. Thirty-six
acceptance cases and twelve unit tests hold them, and those tests were frozen
before the implementation was written.

```
npm test        # 128: 36 engine acceptance, 12 engine unit, 80 service
```

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
for. [The write-up is here](/blog/one-product-one-repository/).

The day someone wants the engine alone, `git subtree split --prefix=core` hands
it over with its history intact.

## Deploying it

Anywhere that runs a container or Node 22.

```
docker compose up          # service + PostgreSQL, locally
docker build -t pumasi .   # then run it wherever
```

Set `PORT`, and `DATABASE_URL` for anything that must outlive the process.
`PGSSL=require` if your provider needs TLS. Mail is **SMTP, not a provider
SDK** — every provider speaks it, so the choice is a URL and switching costs
nothing.

Nothing in the code knows about a particular host. That is not an accident and
it is not going to change: no special protocol is required to participate, and
self-hosting stays first-class forever.
