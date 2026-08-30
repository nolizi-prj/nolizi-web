---
title: "Pumasi Sign"
description: "An unmetered, legally-binding B2B e-signature and document execution platform. Deterministic PDF stamping, SHA-256 tamper-evident audit certificates, and public multi-tenant signing. Apache-2.0."
compareTo: [DocuSign, SignWell]
status: seed
repo: "https://github.com/pumasi-ai/pumasi-sign"
limitation: "cryptographic audit certificates verify document integrity, signer identity, and UTC timestamps under the ESIGN Act and eIDAS, but Qualified Electronic Signatures (QES) requiring national hardware smartcards are not yet included."
order: 2
updated: 2026-08-30
---

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

## Cloudflare Edge Native

Pumasi Sign is built to run at the edge with zero dedicated container overhead:
- **Pure JavaScript / WebAssembly PDF Engine**: PDF parsing and stamping execute inside Cloudflare V8 isolates with zero C++ or heavy OS binary dependencies.
- **Transactional SQLite Storage**: Envelopes, signers, templates, and document blobs are stored in transactional Cloudflare Durable Objects.
- **Custom Domain Deployment**: Deployed globally at `sign.pumasi.ai`.
