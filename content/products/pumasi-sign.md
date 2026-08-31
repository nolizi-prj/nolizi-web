---
title: "Pumasi Sign"
description: "An unmetered, legally-binding B2B e-signature and document execution platform. Deterministic PDF stamping, SHA-256 tamper-evident audit certificates, and public multi-tenant signing. Apache-2.0."
compareTo: [DocuSign, SignWell]
status: seed
repo: "https://github.com/pumasi-ai/pumasi-sign"
limitation: "**sign-up and sign-in on `sign.pumasi.ai` are reported broken, and the report is open** — a Microsoft identity is answered `403 No account for that identity here`, and creating an account returns the same ([issue #9](https://github.com/pumasi-ai/pumasi-sign/issues/9), filed 2026-08-31 14:47 UTC, still open when this page was written). Until it closes, read the screenshots below rather than expecting to get in. Separately: the audit certificates verify document integrity, signer identity and UTC timestamps under the ESIGN Act and eIDAS, but Qualified Electronic Signatures (QES) requiring national hardware smartcards are not included."
order: 2
updated: 2026-08-31
---

## Where this actually is

`seed` — and this page has to tell you where that number comes from, because it
does not come from where the other two products' numbers do. **`pumasi-sign`
has no `roadmap/STAGE.md`.** The repository carries a `roadmap/BACKLOG.md` and
nothing that states a stage. The `seed` above is therefore taken from the
commons index,
[`catalog.json`](https://github.com/pumasi-ai/pumasi/blob/main/catalog.json),
which lists this product at `"status": "seed"` — the lowest rung on the ladder,
and the only maturity claim any file in the commons grounds.

Worth knowing, because you will see it: the product's own landing page at
`sign.pumasi.ai` displays a **`BETA`** chip
([`frontend/src/views/LandingView.vue:34`](https://github.com/pumasi-ai/pumasi-sign/blob/main/frontend/src/views/LandingView.vue)).
No file in that repository grounds `beta`, so this page does not repeat it.
Where the two disagree, the lower one is the one to trust.

## Run it

```bash
git clone https://github.com/pumasi-ai/pumasi-sign
cd pumasi-sign
cd service && npm install && npm test
npx wrangler dev
```

It starts a local Cloudflare Worker with SQLite Durable Objects and pure-core PDF stamping. Open the local port in your browser to create templates, place fields, and collect signatures.

## What it solves

Most B2B e-signature platforms meter usage heavily, charge $25 to $65 per user monthly, and gate essential compliance features behind enterprise tiers. 

Pumasi Sign provides:
- **Deterministic Coordinate Stamping**: Places signatures, initials, dates, names, text fields, and checkmarks at normalized coordinates directly onto PDF pages.
- **Tamper-Evident Audit Certificates**: Every executed document automatically appends a cryptographic certificate logging the original and completed SHA-256 hashes, signer IP addresses, user agents, and ISO timestamps.
- **Public Zero-Login Recipient Flow**: External counterparties sign securely via tokenized links with optional 6-digit email verification codes without creating an account.
- **Office 365 Cloud Document Conversion**: Native conversion for Word, PowerPoint, and Excel files via cloud rendering APIs.
- **Multi-Tenant Design Customization**: Organizations can customize their logo, company title, and primary brand colors across all recipient-facing signing portals.

## Inside the Product

The screenshots below are of the deployed application at
[**sign.pumasi.ai**](https://sign.pumasi.ai). **They are not an invitation to go
and sign in**: the front door is reported broken and that report is open (see
*Not yet*, above, and [issue #9](https://github.com/pumasi-ai/pumasi-sign/issues/9)). The local
`wrangler dev` route above is the one that works today.

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
- **Custom Domain Deployment**: Deployed globally at `sign.pumasi.ai`, which answers `200` — but with sign-in reported failing and unresolved, it is deployed rather than usable.
