---
title: "Pumasi Sign"
description: "An unmetered, legally-binding B2B e-signature platform. Deterministic PDF stamping, SHA-256 tamper-evident audit certificates, public multi-tenant signing. Alpha; no licence file yet."
compareTo: [DocuSign, SignWell]
status: alpha
repo: "https://github.com/pumasi-ai/pumasi-sign"
limitation: "**one `priority: high` defect is open on the entry path** — [issue #7](https://github.com/pumasi-ai/pumasi-sign/issues/7): pressing *sign in again* returns an error. Reported 2026-08-31 01:14 UTC, still open, and not yet reproduced against the Cloudflare Worker that actually serves `sign.pumasi.ai`. The earlier report that sign-up and sign-in were broken outright ([#9](https://github.com/pumasi-ai/pumasi-sign/issues/9)) was **closed `not planned` on 2026-08-31 16:04 UTC**, on evidence that the `403` in it came from a different product — so the front door is not known to be shut, and #7 is the one to know about. Separately, this repository is public and carries **no `LICENSE` file** on its default branch (`gh api repos/pumasi-ai/pumasi-sign/contents/LICENSE` → **404**, checked 2026-08-31), so a self-hoster has no grant of rights yet; that is open as `pumasi/DECISIONS.md` Q-021 and this page states no licence until it lands. And the audit certificates verify document integrity, signer identity and UTC timestamps under the ESIGN Act and eIDAS, but Qualified Electronic Signatures (QES) requiring national hardware smartcards are not included."
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

- **The commons index still says `seed`.**
  [`pumasi/catalog.json`](https://github.com/pumasi-ai/pumasi/blob/main/catalog.json)
  records this product at `"status": "seed"`, one rung below what its own
  register now says. It has not been corrected because **no role file owns that
  file** — that is open as `pumasi/DECISIONS.md` **Q-019**, and this page may
  not edit it.
- **The product's own landing page ships a `BETA` chip**
  (`frontend/src/views/LandingView.vue:34`, still present on `main` at
  `d797c81`). Nothing in that repository grounds `beta`; `STAGE.md` §5 names
  the chip as the coder's to fix, as `BACKLOG.md` item 1.

Where a file disagrees with `STAGE.md`, this page follows `STAGE.md` — not
because it is higher or lower, but because it is the one that shows its
evidence and names its falsifiers.

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
`priority: high`, an error on *sign in again*, standing unexplained now that
its provisional link to #9 is gone (`STAGE.md` §2.2). See *Before you use it*
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
(*which implementation is Pumasi Sign?*). CI gates `backend/` and the frontend
e2e suite; it does **not** gate `service/`, the tree that serves users, whose
suite is two tests wide and passing. So "CI is green" is true of this product
and is not a statement about the code you would meet at that domain
(`STAGE.md` §2.1).
