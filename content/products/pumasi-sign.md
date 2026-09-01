---
title: "Pumasi Sign"
description: "An unmetered, legally-binding B2B e-signature platform. Deterministic PDF stamping, SHA-256 tamper-evident audit certificates, public multi-tenant signing. Alpha; no licence file yet."
compareTo: [DocuSign, SignWell]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-sign"
limitation: "**this product's own front page went live on 2026-09-01 and it tells a stranger, three times, that the code is under Apache-2.0 — and the repository grants no licence at all.** Measured on the served landing chunk `/assets/LandingView-C5khdw3s.js` (`200`, 10 046 bytes, fetched 2026-09-01 02:40 UTC): `Apache-2.0` appears in the hero strip, in the stage banner, and in a comparison-table row headed *License & Source Code* whose neighbouring columns both read *Proprietary Closed Source* — a row that invites a reader to choose this product **because** of terms that do not exist. Against that, `gh api repos/pumasi-ai/pumasi-sign/contents/LICENSE` returns **404** (checked 2026-09-01), and a public repository with no licence grants no rights at all: you may read the code, and you have no permission to run, modify or redistribute it. Which way that resolves is the steward's, open as `pumasi/DECISIONS.md` **Q-021**, and **this page states no licence until it lands** — it reports the deployed page's claim rather than repeating it. **The entry-path defect this card warned about for two days is gone.** [Issue #7](https://github.com/pumasi-ai/pumasi-sign/issues/7) — *sign in again* handed the user a page of raw JSON — was **closed 2026-09-01T00:59:12Z**, and the repair reached users in the deploy at **2026-09-01 01:02:16 UTC**; verified on the live host rather than on the tracker, the button now builds `/login?next=%2F`, which answers `200 text/html`. And the audit certificates verify document integrity, signer identity and UTC timestamps under the ESIGN Act and eIDAS, but Qualified Electronic Signatures (QES) requiring national hardware smartcards are not included."
order: 2
updated: 2026-09-01
---

## Where this actually is

`alpha` — and this page still has to tell you where that number comes from,
because a maturity claim with no source is exactly what this site exists not to
publish.

It comes from the product's own register:
[`roadmap/STAGE.md`](https://github.com/pumasi-ai/pumasi-sign/blob/main/roadmap/STAGE.md),
first published 2026-08-31 at
[`6e02cc4`](https://github.com/pumasi-ai/pumasi-sign/commit/6e02cc4), which
records `alpha` **set on measured evidence** — not on aspiration, and not on a
chip. Read here at
[`3edd06f`](https://github.com/pumasi-ai/pumasi-sign/commit/3edd06f) — its
ladder, with the status that file's own exit-gate section gives each rung:

| Stage | Criteria | Status |
| :--- | :--- | :--- |
| **0 · Candidate** | Steward selection | **COMPLETE** — built and deployed |
| **1 · Alpha** | Pure-core suite passes 100%; **both** public landing surfaces live | **NOT MET** — both surfaces are live as of 2026-09-01; the gate is held on whether Surface B is *honestly calibrated*, and one of its claims is untrue |
| **2 · Beta** | Real end-to-end users complete workflows without engineer intervention | PENDING |
| **3 · Launched** | Production hardening, cross-model regression, 7-day veto window | PENDING |

Read that row 1 carefully, because it is the unusual part: **the stage is
`alpha`, `alpha`'s own exit gate is NOT MET, and on 2026-09-01 the reason
changed completely while the two words stayed the same.** Surface A is this
page. Surface B — the product's own root landing page at `sign.pumasi.ai` — is
**live**, deployed at **2026-09-01 01:02:16 UTC**. Issue
[#8](https://github.com/pumasi-ai/pumasi-sign/issues/8), which tracked its
absence, was closed three minutes before that at **2026-09-01T00:59:11Z** — the
tracker moved first and the deploy is what made it true. Through five
evaluations the unmet half of this gate was *Surface B is not live*. It is now
**Surface B is live and one of its claims is untrue** — the licence claim, set
out below. On the gate's literal words the
row now reads met; the register declines to record it as met, because Stage 1
asks that second surface for honest calibration and a surface is not honestly
calibrated while one of its claims is a licence grant a stranger may act on.
**What flips this row is a steward answering Q-021, not a build** — and not
this page.

**One disclosure about the register itself, because you can open it and would
otherwise conclude this card is the stale one.** At `3edd06f`, `STAGE.md`'s own
gate *table* still carries its pre-deploy wording — Surface B *"has never been
deployed"* — while that same file's exit-gate section, its §2.2 and its §5 all
record the deployment, date it to the second, and quote the live route table.
This card follows the parts that show the measurement. The row is that file's
to correct, not this one's.

**An earlier version of this page said `seed`, and said in bold that
`pumasi-sign` had no `roadmap/STAGE.md`.** Both were true on the day it was
written and neither is true now. That repository carries `STAGE.md`, `VALUE.md`
and `MARKET.md` as of 2026-08-31, and this card is re-sourced from the first of
them — which is what `STAGE.md` §5 asks for by name.

**Two disagreements you will meet, named rather than smoothed over.**

- **The commons index still says `seed`, and disagrees with itself about what
  to call the field.**
  [`pumasi/catalog.json`](https://github.com/pumasi-ai/pumasi/blob/main/catalog.json)
  records this product at `"status": "seed"` in both its arrays — one rung
  below what its own register now says, and `seed` is not a rung on the
  product-manager role file's ladder at all. Re-read for this card at `pumasi`
  @ `2ab3a4f` on 2026-09-01 and unchanged, down to a top-level `updated` of
  `2026-08-29` — three days stale, across the tick in which this product
  deployed its front page. The file is not merely stale but **internally
  inconsistent**:
  `products[]` keys both products on `"status"`, while in `items[]`
  `pumasi-sign` uses `"status"` and `pumasi-booking` uses `"maturity"` —
  adjacent entries, same concept, two key names, both reading `seed`. That is
  why two readers can report different things about this file and neither be
  wrong. It has not been corrected because **no role file owns it** — open as
  `pumasi/DECISIONS.md` **Q-019**, whose named default is a role-file amendment
  nobody has made — and this page may not edit it. Whoever inherits it inherits
  a schema question as well as a content one.
- **The `BETA` chip this card and the register argued about for two days is
  settled, and the deploy is what settled it.** The chip was real — `v-chip …
  BETA` at `frontend/src/views/LandingView.vue:34` as of
  [`d797c81`](https://github.com/pumasi-ai/pumasi-sign/commit/d797c81) — and it
  was replaced by a badge derived from
  [`frontend/src/stage.ts`](https://github.com/pumasi-ai/pumasi-sign/blob/main/frontend/src/stage.ts),
  under a comment naming `roadmap/STAGE.md` as the register — the same file
  this card reads. **That is the version that went live.** Read out of the
  served landing chunk on 2026-09-01 at 02:40 UTC, the constant and the badge
  it generates are there in one expression:

  ```js
  var g=`alpha`,_=g.charAt(0).toUpperCase()+g.slice(1),v=`${g.toUpperCase()} — ACTIVE DEVELOPMENT`
  ```

  `grep -c BETA` on that chunk returns **`0`**. So the badge a stranger reads
  is `ALPHA — ACTIVE DEVELOPMENT`, generated from the rung the register sets,
  and **no user has ever seen a `BETA` badge on this product** — the argument
  was about a page nobody could yet open.

**This page spent two days arguing about that chip. The argument was worth
more than the answer, because of the vocabulary it forced into existence.**

`STAGE.md` §5 keeps a four-state ledger for every claim this project makes.
A claim can be **wrong in source and in production**; **right in both**;
**fixed in source and still wrong in production** — the state that makes a
repository read as finished while a user keeps meeting the old behaviour, and
the direct, named cost of
[`pumasi/DECISIONS.md`](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)
**Q-012**, *who deploys a merged fix, and by when*, still open with its default
unclaimed; or **merged and never shipped** — present on `main` and absent from
every deployment there has ever been. That fourth state was added because of
this product's landing page, and this card's own bundle readings are cited in
that file as the measurement that forced the row.

**On 2026-09-01 the page shipped, and the ledger moved in one motion.** Until
that morning every sentence in `LandingView.vue` sat in the fourth state:
unshipped, and therefore harmless. The 01:02:16 UTC deploy took all of them
public at once — `service/wrangler.jsonc` serves `frontend/dist` as a single
`ASSETS` directory, so there is no shipping one claim and holding another. The
page had carried **three** claims the repository could not back. Two were
repaired before it went out: the `BETA` chip, which shipped reading `ALPHA`,
and an uncited competitor-pricing block, which shipped cited and dated, linking
both vendors' own pages. **The third shipped unrepaired, and it is the
licence claim** — which moved from *merged and never shipped* straight to
*wrong in source and in production*, the worst square on the board.

That difference is the whole reason this site keeps the vocabulary. **An
unshipped false claim is a bug report. The same claim, deployed, is something a
stranger can act on** — and the deployed one here is a grant of rights, in a
table row whose neighbouring columns say *Proprietary Closed Source*, on a
repository that grants none. The two could not be separated at deploy time,
which is what **Q-028** was raised to record; it did not get answered so much
as overtaken, resolving itself by shipping.

**The one thing the deploy made unambiguously better is worth naming**, because
everything else it did was move a claim from private to public: the repository
can no longer disagree with the register about the rung. The badge is generated
from `STAGE.md`, and a frozen case in that repository fails the build if the
two drift apart. The stage word on the live page is right today by construction
rather than by luck — which is the only kind of right that survives the next
deploy nobody announces.

Where a file disagrees with `STAGE.md`, this page follows `STAGE.md` — not
because it is higher or lower, but because it is the one that shows its
evidence and names its falsifiers. Where `STAGE.md` disagrees with *itself*, as
its gate table does today, this page follows the half that shows the
measurement, and says which half that was.

## Run it

```bash
git clone https://github.com/pumasi-ai/pumasi-sign
cd pumasi-sign
cd service && npm install && npm test
npx wrangler dev
```

It starts a local Cloudflare Worker with SQLite Durable Objects and pure-core PDF stamping. Open the local port in your browser to create templates, place fields, and collect signatures.

## What it solves

E-signature is bought once and then paid for forever, by the seat, with the
envelope ceiling written where nobody reads it. What the incumbents actually
charge, read from their own pricing pages on **2026-08-31** and recorded with
their sources in `pumasi-sign`
[`roadmap/MARKET.md` §1](https://github.com/pumasi-ai/pumasi-sign/blob/main/roadmap/MARKET.md):

| Plan | Price as shown | Limit as shown |
| :--- | :--- | :--- |
| [DocuSign](https://ecom.docusign.com/plans-and-pricing/esignature) Personal | $11/month (annual, billed monthly; $132/yr) | 5 envelopes per month |
| DocuSign Standard | $30/user/month (annual; $360/yr per user) | 100 envelopes/user/year |
| DocuSign Business Pro | $45/user/month (annual; $540/yr per user) | 100 envelopes/user/year |
| [SignWell](https://www.signwell.com/pricing/) Free | $0 | 3 documents/month, 1 sender |
| SignWell Light | $12/sender/month, or $10 billed annually | Unlimited documents |
| SignWell Business | $36/month for 3 senders, or $30 billed annually; extra senders $15/mo | Unlimited documents |

Prices move, and the date is part of the claim: if you find different numbers on
those two pages, they are newer than these. What the pages establish is narrow
and worth stating exactly — both vendors meter **senders**, and DocuSign's two
mainstream business plans state **100 envelopes per user per year** at $30 and
$45 per user per month. Neither page offers a self-hosted or source-available
option. Nothing here should be restated as "DocuSign costs X" without the plan
name attached.

**An earlier version of this page asserted that these platforms "charge $25 to
$65 per user monthly", with no citation.** Against the pages above on this
date, that range is wrong at both ends. This project has published and then
retracted an uncited competitor number once already (`pumasi-booking`
`0d1674d`); the table replaces the sentence rather than repairing it.

Pumasi Sign provides:
- **Deterministic Coordinate Stamping**: Places signatures, initials, dates, names, text fields, and checkmarks at normalized coordinates directly onto PDF pages.
- **Tamper-Evident Audit Certificates**: Every executed document automatically appends a cryptographic certificate logging the original and completed SHA-256 hashes, signer IP addresses, user agents, and ISO timestamps.
- **Public Zero-Login Recipient Flow**: External counterparties sign securely via tokenized links with optional 6-digit email verification codes without creating an account.
- **Office 365 Cloud Document Conversion**: Native conversion for Word, PowerPoint, and Excel files via cloud rendering APIs.
- **Multi-Tenant Design Customization**: Organizations can customize their logo, company title, and primary brand colors across all recipient-facing signing portals.

**There is no meter behind any of that**, and for a plain reason rather than a
generous one: the deployed service contains no quota, plan, billing or
subscription code at all
([`VALUE.md` §1](https://github.com/pumasi-ai/pumasi-sign/blob/main/roadmap/VALUE.md)).
There is nothing to lift when you run it yourself — see the next section for
what that sentence is currently missing.

## About the licence, and what this page will not say

This card's summary line used to end **"Apache-2.0."** That is not a claim this
page can make today. `pumasi-sign` is a **public** repository with **no
`LICENSE` file**:

```bash
gh api repos/pumasi-ai/pumasi-sign/contents/LICENSE   # 404 Not Found
gh api repos/pumasi-ai/pumasi-tunnel/contents/LICENSE # 200 — 10 273 bytes
```

A public repository with no licence grants no rights at all: you may read the
code, and you have no permission to run, modify or redistribute it. A sibling
product carries the file — `pumasi-tunnel`, Apache License 2.0, as does this
website's own repository — so this reads as an omission rather than a position
taken.

**What changed on 2026-09-01 is not the licence. It is who is being told.**
Until that morning this was an internal question about an undeployed page.
At **01:02:16 UTC** the product's own landing page went live carrying
`Apache-2.0` in three separate claims — the hero strip, the stage banner, and a
comparison-table row headed *License & Source Code* whose neighbouring columns
read *Proprietary Closed Source*. That row's entire purpose is to invite a
reader to choose this product **because** its terms differ from the
incumbents', and the terms it names do not exist. Q-021's own framing — *not
yet public, which is the whole reason this is a question and not an incident* —
is overtaken by that deploy. **This card reports the claim; it does not repeat
it**, and one surface saying something untrue is a mistake that two surfaces
would make a pattern.

**A note for anyone checking this themselves, because the obvious command was
lying until recently and this page said so.** Through 2026-08-31,
`gh repo view --json licenseInfo` returned `null` for *every* repository in
this organisation, including `pumasi-tunnel` and `pumasi-web`, which
demonstrably do carry an Apache-2.0 `LICENSE` — so a `null` there was not
evidence of absence, it was no evidence at all. **Re-checked on 2026-09-01,
that is no longer true**: GitHub's detection has caught up and now reports
`{"key":"apache-2.0"}` for both of those repositories, and `null` for
`pumasi-sign`.

The conclusion is unchanged and the reasoning is worth keeping anyway. That
`null` is the evidence cited in `pumasi-sign`'s own `STAGE.md` §2.3 and in
Q-021, and on the day it was cited it would have read identically for a
correctly licensed repository — a test that cannot fail is not a check.
It happens to be corroborated now, which is luck rather than method. **The
question the file answers is still the one to ask**: `gh api
repos/pumasi-ai/pumasi-sign/contents/LICENSE` → `404`, above, re-run for this
card on 2026-09-01.

**Which of those it is, is not this page's call.** It is open as
[`pumasi/DECISIONS.md`](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)
**Q-021**, whose named default is to add the Apache-2.0 file and honour the
claim, and whose named alternative is to remove the claim instead. That entry
records that the project's usual proceed-on-the-default rule is deliberately
**not** taken here, because publishing a licence is an outward grant that third
parties may then rely on — the one kind of file edit that is not really
reversible.

So this page takes the move that prejudges neither answer: it stops stating a
licence as a fact, and states the situation instead. When Q-021 lands, this
section becomes one sentence.

## Inside the Product

The screenshots below are of the deployed application at
[**sign.pumasi.ai**](https://sign.pumasi.ai), which answers `GET /api/health`
with `200 {"status":"ok","service":"pumasi-sign", …}`.

**You can go and try it.** An earlier version of this page told you not to,
citing a report that sign-up and sign-in were both broken. That report —
[#9](https://github.com/pumasi-ai/pumasi-sign/issues/9) — was **closed `not
planned` on 2026-08-31 16:04 UTC**, and closed on evidence rather than on an
inability to reproduce: the worker that serves this host cannot emit a `403`
anywhere in `service/src/`, its `establishSession`
(`service/src/durable.ts:655`) has no domain gate and creates an account for
any verified email address, and the reporter's exact wording occurs once in the
whole fleet — in a different product.

**The defect this page carried at the top for two days is closed, and it is
worth a line rather than a silent deletion.**
[#7](https://github.com/pumasi-ai/pumasi-sign/issues/7), `priority: high`: a
person who signed out saw one button, *Sign in again*, and pressing it handed
them `{"error":"Endpoint not found"}` rendered raw as a document. It was
**closed 2026-09-01T00:59:12Z**, and — the part that matters, because closing
an issue serves nobody by itself — the repair **reached users** in the deploy
at **2026-09-01 01:02:16 UTC** — three minutes after the tracker said so, not
before. Alongside it,
[#8](https://github.com/pumasi-ai/pumasi-sign/issues/8), the app root having no
product page in production, was **closed 2026-09-01T00:59:11Z** and made true
by the same deploy.

**Verified on the live host rather than on the tracker**, 2026-09-01 02:40 UTC:

```console
$ curl -s https://sign.pumasi.ai/ | grep -o '/assets/index-[^"]*\.js'
/assets/index-CnoFAC2c.js

$ curl -s -o /dev/null -w '%{http_code} %{content_type}\n' \
    'https://sign.pumasi.ai/login?next=%2F'
200 text/html
```

The served `SignedOutView-C2J9s3yp.js` builds that button's target by calling
the main bundle's exported helper with `/`, and the helper is
``function ml(e){return`/login?next=`+encodeURIComponent(e)}``. Decisively, the
helper that built the broken URL is **gone from the shipped JavaScript**:
`grep -c '/api/auth/login?next=' index-CnoFAC2c.js` returns **`0`**.

**One thing not to over-read, because the obvious check still looks alarming.**
`GET /api/auth/login?next=%2F` on that host **still answers `404`** — and that
is now correct behaviour rather than a defect. Nothing targets it any more. A
route that never existed on the worker returning `404` is a server doing its
job; the defect was a button pointing at it, and the button no longer does.

**What has not changed is the thing underneath both issues: nobody owns
deployment.** That is **Q-012**, open, exactly as on the sibling
[Pumasi Booking](/products/pumasi-booking/) card. This deploy was not announced
in any queue and matches no release note; it had to be identified from the
artefact, which `STAGE.md` §2.2 does by chunk fingerprint, landing on
[`0e26917`](https://github.com/pumasi-ai/pumasi-sign/commit/0e26917) — built
from a working tree five seconds *before* that commit's own timestamp. **And
`main` has already moved past it again**, including
[`2471a29`](https://github.com/pumasi-ai/pumasi-sign/commit/2471a29), which
changes `service/src/worker.ts`, `service/src/durable.ts` and
`service/wrangler.jsonc`. So the repository is ahead of the deployment once
more, and nothing carries one to the other. **Someone deployed; the question of
who owes you the next one is still open.**

The sign-in repair is written up in
[a release note](https://github.com/pumasi-ai/pumasi/blob/main/releases/2026-08-31-pumasi-sign-sign-in-again.md)
whose own first line reads *"It is merged and it is **not deployed**"* — a
can-hurt release under
[`DECISIONS.md` **Q-027**](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
veto window to 2026-09-07, which the steward has yet to confirm. That note is
written in the present tense and describes the branch on the day it was
published; the deployment has since overtaken it. **Read a release note as a
claim about the repository and check the deployment separately** — and note
what the window now means: seven days to veto a change users already have.

What is queued next is a question for
[`roadmap/BACKLOG.md`](https://github.com/pumasi-ai/pumasi-sign/blob/main/roadmap/BACKLOG.md),
and **this page quotes no rank from it.** That file was reordered three times on
2026-08-31 alone; a rank in prose is the same kind of cache as a test count, and
the one this page used to publish was spent before you read it. Read the file.
See *Before you use it* at the top of this page for what is still worth knowing
before you rely on this — it is now the licence, not the front door. The local
`wrangler dev` route above is unaffected by any of it.

### 1. Document Dashboard & Action Queue
Manage incoming signature requests, active contracts, and completed envelopes in one centralized view:

![Pumasi Sign Dashboard](/screenshots/sign-dashboard.png)

### 2. Multi-Signer Send & Preparation Wizard
Upload agreements, assign signers, configure signing orders, and place drag-and-drop fields:

![Pumasi Sign Send Wizard](/screenshots/sign-send.png)

### 3. Front-End Design & Branding Customizer
Customize organization logos, brand accent colors, and recipient welcome banners with live real-time preview:

![Pumasi Sign Branding Customizer](/screenshots/sign-branding.png)

### 4. Frictionless Recipient Verification
External signers receive secure tokenized links with 6-digit email verification codes—no account creation required:

![Pumasi Sign Verification Code](/screenshots/sign-otp.png)

## Cloudflare Edge Native

Pumasi Sign is built to run at the edge with zero dedicated container overhead:
- **Pure JavaScript / WebAssembly PDF Engine**: PDF parsing and stamping execute inside Cloudflare V8 isolates with zero C++ or heavy OS binary dependencies.
- **Transactional SQLite Storage**: Envelopes, signers, templates, and document blobs are stored in transactional Cloudflare Durable Objects.
- **Custom Domain Deployment**: Deployed globally at `sign.pumasi.ai`, which answered `200` on `/api/health` when this card was written (2026-09-01 02:40 UTC). Since **2026-09-01 01:02:16 UTC** that host also serves the product's own landing page at `/` ([#8](https://github.com/pumasi-ai/pumasi-sign/issues/8), closed), so this catalog card is no longer the only public surface this product has. The live bundle is still behind `main`, and `alpha`'s exit gate above still reads **NOT MET** — for what that landing page says, no longer for its absence.

**One thing this section cannot tell you yet, and says so rather than
implying otherwise.** `sign.pumasi.ai` is served by the Cloudflare Worker in
`service/`, not by the FastAPI application in `backend/` — verified by the
shape of its own error bodies, and open as `pumasi/DECISIONS.md` **Q-018**
(*which implementation is Pumasi Sign?*). **This page previously added that CI does not gate
`service/`. That is no longer true, and the correction is not a softening.**
Since [`ef851d6`](https://github.com/pumasi-ai/pumasi-sign/commit/ef851d6) —
committed as *"a job for the tree users actually meet"* —
`.github/workflows/ci.yaml` runs a fourth job that builds the worker and runs
its suite, with a step that asserts the suite **actually ran** rather than
trusting exit `0`. **What that job runs changed in kind this week, not in
degree.** Until [`3d01198`](https://github.com/pumasi-ai/pumasi-sign/commit/3d01198)
— *"the deployed tree's front door, recorded"* — every case under
`service/src/test/` exercised one pure function, the PDF stamper, and nothing
that answers a request. That commit is the first in this repository's history
to **construct the Durable Object that serves `sign.pumasi.ai` and drive it
through its own `fetch()`**: schema initialisation, `establishSession`, the
session cookie's shape, single-use codes, and the `404` an unknown route is
given. The cross-family review that approved it
([`reviews/20260831-160155-code-gemini.md`](https://github.com/pumasi-ai/pumasi-sign/blob/main/reviews/20260831-160155-code-gemini.md),
`VERDICT: APPROVE`) ran the suite rather than reading it.

**No test count is quoted here.** `cd service && npm test` prints the current
totals; a number copied into prose is a cache with no way to invalidate it —
the rule the [Pumasi Booking](/products/pumasi-booking/) card states about its
own suite, and this page carried the stale number that proves it. **And none
of this is an upgrade announcement.** The coverage reached the worker's front
door while issue #7 was live *at* that front door in production; the new cases
characterise what the deployed tree does, they do not repair it.

So "CI is green" is now a broader claim than it was and still not a statement
about what you would meet at that domain — and run
[33420378497](https://github.com/pumasi-ai/pumasi-sign/actions/runs/33420378497)
shows exactly how. At `ef851d6` it is green on **all four** jobs — `backend`,
`frontend`, `service`, `e2e` — while the *Sign in again* button on this
product's own signed-out page was returning `404` in production, measured from
this card at 18:49 UTC that same day and not repaired for users until the
deploy at **2026-09-01 01:02:16 UTC**. **Four green jobs sat above a live
entry-path defect for the better part of a day**, and that is the argument
rather than the anecdote. The `e2e` job is the one to sit with: it is green
**because** `frontend/playwright.config.ts` drives `backend/` — locally a
`uvicorn` process, in CI a container built from the root `Dockerfile`, and both
are `backend/`, the one tree in which `GET /api/auth/login` exists. Its
Playwright specs exercise a sign-in path that works, on a server no user
reaches, and would keep passing however long the defect stayed live
(`STAGE.md` §2.1).
