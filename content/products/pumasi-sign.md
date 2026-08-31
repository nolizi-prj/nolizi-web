---
title: "Pumasi Sign"
description: "An unmetered, legally-binding B2B e-signature platform. Deterministic PDF stamping, SHA-256 tamper-evident audit certificates, public multi-tenant signing. Alpha; no licence file yet."
compareTo: [DocuSign, SignWell]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-sign"
limitation: "**one `priority: high` defect is open on the entry path** — [issue #7](https://github.com/pumasi-ai/pumasi-sign/issues/7): pressing *sign in again* returns an error. Reported 2026-08-31 01:14 UTC, still open, and **reproduced against the Cloudflare Worker that actually serves `sign.pumasi.ai`** on 2026-08-31 at 18:49 UTC: `curl -s -i 'https://sign.pumasi.ai/api/auth/login?next=%2F'` returns `HTTP/2 404` and `{"error":"Endpoint not found"}`. A signed-out user who presses *Sign in again* is handed that error JSON raw. The cause is that the button is a full-page navigation to a route only `backend/` defines — `@router.get("/login")` under prefix `/api/auth` at `backend/app/routers/auth.py:82` — while the worker defines no `GET` there at all, only `POST /api/auth/login/request` (`service/src/durable.ts:775`) and `POST /api/auth/login/verify` (`:798`). This is live for real users and not merely true of `main`: the deployed chunk `/assets/SignedOutView-Cw4c846h.js` builds the button's `href` from the `loginRedirectUrl` helper exported by the shipped `/assets/index-j38Qwibz.js`, which returns exactly that 404 path. The earlier report that sign-up and sign-in were broken outright ([#9](https://github.com/pumasi-ai/pumasi-sign/issues/9)) was **closed `not planned` on 2026-08-31 16:04 UTC**, on evidence that the `403` in it came from a different product — so the front door is not known to be shut, and #7 is the one to know about. Separately, this repository is public and carries **no `LICENSE` file** on its default branch (`gh api repos/pumasi-ai/pumasi-sign/contents/LICENSE` → **404**, checked 2026-08-31), so a self-hoster has no grant of rights yet; that is open as `pumasi/DECISIONS.md` Q-021 and this page states no licence until it lands. And the audit certificates verify document integrity, signer identity and UTC timestamps under the ESIGN Act and eIDAS, but Qualified Electronic Signatures (QES) requiring national hardware smartcards are not included."
order: 2
updated: 2026-08-31
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
chip. Its gate table, verbatim:

| Stage | Criteria | Status |
| :--- | :--- | :--- |
| **0 · Candidate** | Steward selection | **COMPLETE** — built and deployed |
| **1 · Alpha** | Pure-core suite passes 100%; **both** public landing surfaces live | **IN PROGRESS** — Surface A live, Surface B undeployed |
| **2 · Beta** | Real end-to-end users complete workflows without engineer intervention | PENDING |
| **3 · Launched** | Production hardening, cross-model regression, 7-day veto window | PENDING |

Read that row 1 carefully, because it is the unusual part: **the stage is
`alpha` and `alpha`'s own exit gate is NOT MET.** Surface A is this page.
Surface B — the product's own root landing page at `sign.pumasi.ai` — is merged
on `main` and not deployed: the live bundle `/assets/index-j38Qwibz.js` was
fetched at 839 941 bytes containing **zero occurrences of `landing`**
(`STAGE.md` §2.2, issue
[#8](https://github.com/pumasi-ai/pumasi-sign/issues/8)). The remaining work
there is a deploy, not a build.

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
  product-manager role file's ladder at all. Read directly at `pumasi` @
  `a76aa3c`, the file is not merely stale but **internally inconsistent**:
  `products[]` keys both products on `"status"`, while in `items[]`
  `pumasi-sign` uses `"status"` and `pumasi-booking` uses `"maturity"` —
  adjacent entries, same concept, two key names, both reading `seed`. That is
  why two readers can report different things about this file and neither be
  wrong. It has not been corrected because **no role file owns it** — open as
  `pumasi/DECISIONS.md` **Q-019**, whose named default is a role-file amendment
  nobody has made — and this page may not edit it. Whoever inherits it inherits
  a schema question as well as a content one.
- **The register says a `BETA` chip is live in production. It is not, and
  neither is the page it was on.** The chip was real — `v-chip … BETA` at
  `frontend/src/views/LandingView.vue:34` as of
  [`d797c81`](https://github.com/pumasi-ai/pumasi-sign/commit/d797c81) — and
  it is gone from source: at `main` @
  [`2bd3ba7`](https://github.com/pumasi-ai/pumasi-sign/commit/2bd3ba7), eleven
  commits later, `grep -c BETA frontend/src/views/LandingView.vue` returns
  **`0`**. That view now derives its badge from
  [`frontend/src/stage.ts`](https://github.com/pumasi-ai/pumasi-sign/blob/main/frontend/src/stage.ts),
  which exports `STAGE = "alpha"` (`:25`) and `STAGE_BADGE = "ALPHA — ACTIVE
  DEVELOPMENT"` (`:35`), under a comment at `:11` naming `roadmap/STAGE.md` as
  the register — the same file this card reads.

**An earlier version of this page repeated that chip as current. It was wrong,
and correcting it turned up something better than the correction.**

`STAGE.md` §5 introduces a distinction this site should have had a name for
long ago: a claim can be **wrong in source and in production**, **right in
both**, or **fixed in source and still wrong in production**. That third state
is what makes a repository read as finished while a user meets the old
behaviour, and it is the direct, named cost of
[`pumasi/DECISIONS.md`](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md)
**Q-012** — *who deploys a merged fix, and by when* — which is open, with its
default (the coder deploys as the last step of the job that merged) unclaimed.

**§5 files the `BETA` chip under that third state. This page measured
production and cannot confirm it.** Read live on **2026-08-31 at 18:49 UTC**,
`https://sign.pumasi.ai/` serves `/assets/index-j38Qwibz.js` — `HTTP 200`,
**839 941 bytes**, **zero occurrences of `landing`**, zero of `BETA`, and zero
of `ALPHA` (every `alpha` in it is library noise: `globalAlpha`, `alphaSlider`,
the CSS keyword `lower-alpha`). Its route table maps `/` to **`dashboard`**,
and among the fourteen lazy-loaded view chunks it does ship there is no
`LandingView` at all. So the chip is not showing users a stale stage; **nothing in `LandingView.vue` has
ever reached a user**, because Surface B has never deployed. The chip was
removed from a page production has never had.

The distinction matters more than the pedantry suggests. A fix that is merged
and undeployed is a real defect with a known remedy — ship it. A file that has
never deployed at all is not one deploy behind on one chip; **every claim in
it** is unshipped, including the `Apache-2.0` line at `LandingView.vue:43`,
`:80` and `:210` that the repository still cannot support. Filing this under
"fixed in source, live in production" makes the remedy sound like a deploy of a
correction, when it is the first deploy of the page.

Where a file disagrees with `STAGE.md`, this page follows `STAGE.md` — not
because it is higher or lower, but because it is the one that shows its
evidence and names its falsifiers. That cuts both ways, and it did here: §5
publishes the bundle measurement that this page then used to correct §5's own
row. A register that hands you the tool to check it is doing its job.

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

**A note for anyone checking this themselves, because the obvious command
lies.** `gh repo view --json licenseInfo` returns `null` for *every* repository
in this organisation, including `pumasi-tunnel` and `pumasi-web`, which
demonstrably do carry an Apache-2.0 `LICENSE`. GitHub's licence detection is
not populating here, so a `null` there is not evidence of absence — it is no
evidence at all. The check that actually distinguishes the two cases is asking
the default branch for the file, above. This matters beyond this page: the
`null` is the evidence cited in `pumasi-sign`'s own `STAGE.md` §2.3 and in
Q-021, where the *conclusion* is right and independently confirmed by the 404,
but the *test* would have read the same for a correctly licensed repository.

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

**What is still open is narrower, and is the thing to know before you rely on
this**: [#7](https://github.com/pumasi-ai/pumasi-sign/issues/7),
`priority: high`, an error on *sign in again* — no longer standing unexplained.
It has been reproduced against the live worker and diagnosed: the button
navigates to `/api/auth/login`, a route only `backend/` defines, and the worker
answers `404` (`STAGE.md` §2.2). It is **item 1** of
[`roadmap/BACKLOG.md`](https://github.com/pumasi-ai/pumasi-sign/blob/main/roadmap/BACKLOG.md)
as that file stands at `2bd3ba7` — reordered twice on 2026-08-31, which is why
this page cites the file rather than trusting a rank to hold. See *Before you use it*
at the top of this page. The local `wrangler dev` route above is unaffected by
either report.

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
- **Custom Domain Deployment**: Deployed globally at `sign.pumasi.ai`, which answers `200` on `/api/health`. The live bundle is several commits behind `main` and does not yet carry the product's own landing page ([#8](https://github.com/pumasi-ai/pumasi-sign/issues/8)) — which is why `alpha`'s exit gate above reads **NOT MET**, and why this catalog card is the only public surface this product currently has.

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
trusting exit `0`. What that job runs is still exactly **two tests**:
`service/src/test/stamping.test.ts` and `e2e-workflow.test.ts`, one case each.

So "CI is green" is now a broader claim than it was and still not a statement
about what you would meet at that domain — and run
[33420378497](https://github.com/pumasi-ai/pumasi-sign/actions/runs/33420378497)
shows exactly how. At `ef851d6` it is green on **all four** jobs — `backend`,
`frontend`, `service`, `e2e` — while the *Sign in again* button on this
product's own signed-out page returned `404` in production, measured above at
18:49 UTC the same day. The `e2e` job is the one to sit with: it is green
**because** `frontend/playwright.config.ts` drives `backend/` — locally a
`uvicorn` process, in CI a container built from the root `Dockerfile`, and both
are `backend/`, the one tree in which `GET /api/auth/login` exists. Six
Playwright specs exercise a sign-in path that works, on a server no user
reaches, and would keep passing however long the defect stayed live
(`STAGE.md` §2.1).
