---
title: "The six scheduling traps that catch AI coders (and how multi-model review caught them)"
description: "Scheduling looks simple until you hit timezones, DST boundaries, and concurrency. Here are the six subtle failure modes caught during the construction of Pumasi Booking."
date: 2026-08-29
tags: [engineering, architecture, ai-agents, testing]
author: "Pumasi"
---

Ask any modern LLM to write a meeting scheduler, and it will give you a clean, plausible-looking TypeScript function in five seconds. It will define `getAvailableSlots()`, iterate over start and end hours, and return an array of ISO 8601 strings.

And in production, that function will quietly double-book your calendar, drop an hour during daylight saving time, or lock out attendees across international timezones.

When we built [`@pumasi/booking-core`](https://github.com/pumasi-ai/pumasi-booking/tree/main/core), we didn't rely on a single model's confidence. We used **heterogeneous cross-family review** (Claude, Gemini, and Grok reviewing each other's work) backed by frozen acceptance suites.

Here are the six subtle traps that were caught and fixed along the way.

---

## 1. The Spring-Forward Gap: Two Hours, Not Three

When a timezone springs forward (e.g. 02:00 skips directly to 03:00):
* A naive loop generating slots between 01:00 and 04:00 will generate three 60-minute slots: `01:00-02:00`, `02:00-03:00`, and `03:00-04:00`.
* But in local wall-clock time, **02:00 to 03:00 does not exist.** The interval between 01:00 and 04:00 is only **two absolute hours long**.

Generating a slot during the missing hour means offering a time that physically cannot occur. In `@pumasi/booking-core`, invalid local times are skipped loudly with explicit diagnostics rather than silently shifted to the next valid hour.

---

## 2. The Fall-Back Ambiguity: Both Occurrences Must Be Bookable

In autumn, wall clocks repeat an hour (e.g. 01:00 to 02:00 happens twice). 
* A 3-hour window spanning the repeated hour contains **four elapsed hours**, not three.
* Naive code often deduplicates slots based on string matching (e.g., matching `"01:00"`), which silently deletes the second valid hour from availability.

The engine represents time in unambiguous UTC instants paired with the owner's IANA timezone, ensuring both occurrences in the transition window can be booked independently.

---

## 3. Daily Booking Caps Must Count on the Owner's Local Date

If an organizer sets a limit of *"maximum 3 bookings per day"*:
* Suppose a booker in Tokyo (UTC+9) schedules a meeting with an organizer in San Francisco (UTC-7).
* In Tokyo, the meeting is on Tuesday morning. In San Francisco, it is still Monday afternoon.

Which day's cap does the meeting consume?
**It must count toward the owner's local date.** If the cap evaluates in UTC or the requester's timezone, an organizer can receive 6 meetings on a Monday because the requests straddled midnight in other parts of the world.

---

## 4. The Cancellation-Replay Trap

During early specification review, an adversary model identified three clauses that were jointly impossible to satisfy:
1. *Replaying an idempotency key returns the original booking result.*
2. *A user can cancel a booking, releasing the slot back to the public pool.*
3. *A third party can subsequently book the released interval.*

If Party B books the released slot, and Party A then resends their original booking request with their original idempotency key, what happens?
* If the server returns the original success result, it falsely claims Party A holds a slot that Party B now occupies.
* If the server rejects the replay, it violates idempotency.

The resolution: idempotency keys bind strictly to an active, non-canceled booking lifecycle. Replaying an idempotency key for a cancelled or superseded reservation returns a distinct `RESERVATION_SUPERSEDED` state, preventing ghost confirmation states.

---

## 5. Vacuous Acceptance Tests (Tests That Cannot Fail)

During review under [`lessons/L-006`](https://github.com/pumasi-ai/pumasi/blob/main/lessons/L-006-tests-that-cannot-fail.md), we discovered an acceptance test designed to check concurrency conflicts. 

The test spawned two parallel booking requests and asserted:
```typescript
if (responseA.status === 200 && responseB.status === 200) {
  assert.fail("Both bookings succeeded concurrently");
}
```
If the test environment ran sequentially (one request completed before the second began), `responseB` failed normally with a standard slot conflict, the `if` condition evaluated to `false`, and the test passed — **without ever actually asserting that the database exclusion constraint fired.**

The fix: acceptance tests must assert both the positive assertion on winner *and* the specific error code (`CONCURRENCY_CONFLICT` / `EXCLUSION_VIOLATION`) on the loser, ensuring no test can pass vacuously.

---

## 6. Double-Booking Prevention Belongs Inside the Database

Many SaaS booking engines attempt to prevent double-booking in application code:
```typescript
// DANGEROUS: Classic Check-Then-Act Race Condition
const isBusy = await db.checkOverlap(timeSlot);
if (!isBusy) {
  await db.insertBooking(timeSlot);
}
```
Under high concurrency, two simultaneous requests will both pass `checkOverlap()` before either executes `insertBooking()`.

In Pumasi Booking, concurrency guarantees are enforced **inside the database engine**:
* **PostgreSQL Build**: Enforced with a `btree_gist` temporal exclusion constraint (`EXCLUDE USING gist (organizer_id WITH =, booked_range WITH &&)`).
* **Cloudflare Workers / SQLite Build**: Enforced with atomic `BEFORE INSERT` and `BEFORE UPDATE` SQL triggers raising `ABORT`.

Application code can crash, restart, or scale across ten distributed instances; the database write lock guarantees that two overlapping bookings can never commit simultaneously.

---

## Why Multi-Model Review Matters

Every single one of these six traps was caught not by proofreading, but by having **competing LLM architectures attack each other's designs** before implementation.

When an AI writes code, it is confident even when it is wrong. Putting heterogeneous reviewers and frozen acceptance tests between the prompt and the `main` branch is how you turn generative AI into reliable open-source infrastructure.
