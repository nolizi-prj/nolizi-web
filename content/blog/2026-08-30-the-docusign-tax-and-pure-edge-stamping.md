---
title: "Why does sending a 500KB PDF cost $45 a month? The DocuSign tax and pure-edge stamping"
description: "DocuSign's own page prices Business Pro at $45/user/mo and meters 100 envelopes/user/yr. How pure TypeScript stamping and Cloudflare Durable Objects make contract execution an unmetered commodity."
date: 2026-08-30
tags: [engineering, architecture, pricing, e-signature, cloudflare]
author: "Pumasi"
---

Sending an agreement and collecting a signed PDF is computationally trivial: place vector ink or typed text at designated coordinates, compute a cryptographic digest, and store the resulting 500KB file.

Yet incumbents have turned this basic computer science primitive into one of the most aggressive tollbooths in enterprise software.

---

## 1. The Incumbent Business Model: Artificial Scarcity

DocuSign does not sell compute or storage. It sells **artificial envelope scarcity**.

```
                ┌─────────────────────────────────────────────────────────┐
                │        THE $7,200/YEAR DOCUSIGN TOLLBOOTH               │
                │   20 Employees · Standard plan · annual billing         │
                │   Figures read from DocuSign's own page, 2026-08-31     │
                └───────────────────────────┬─────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│ Per-Seat Tax          │       │ Envelope Metering     │       │ Above Business Pro    │
│ $30 – $45 / user / mo │       │ 100 envelopes / user  │       │ "Enhanced Plans"      │
│ Standard · Bus. Pro   │       │ / year, both plans    │       │ price not published — │
│ ($7,200–$10,800 / yr) │       │ Personal: 5 / month   │       │ "contact sales"       │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```

### What Businesses Actually Pay

Let us look at published pricing vs. the real invoices small-to-medium businesses face:

| Provider | Published Tier (Per User) | Monthly Allowance | Gated Features | Annual Cost (20 Users) |
| :--- | :--- | :--- | :--- | :--- |
| **DocuSign** ([Pricing](https://ecom.docusign.com/plans-and-pricing/esignature), read 2026-08-31) | **$30 – $45** / user / mo (Standard, Business Pro; annual billing) | **100 envelopes / user / yr**, as shown on both plans | Reusable templates, signer attachments, SSO gated to Enterprise | **$7,200 – $10,800** / yr |
| **Pumasi Sign** ([pumasi.ai](https://pumasi.ai/products/pumasi-sign/)) | **$0.00 (Unmetered)** | **Unlimited Envelopes** | **All features included · Custom Branding.** Licence: the repository carries no `LICENSE` file yet — see the product page | **$0.00 / yr** |

**On the sourcing of that table, because it has been corrected twice.** The
DocuSign row was re-read from the vendor's own pricing page on **2026-08-31**
and matches `pumasi-sign`
[`roadmap/MARKET.md` §1](https://github.com/pumasi-ai/pumasi-sign/blob/main/roadmap/MARKET.md);
it previously read "$25 – $40", which was wrong at both ends.

**This table used to carry an Adobe Sign row and a PandaDoc row. They have been
removed rather than restated.** They held this post's original figures, which
nobody here had read from either vendor. Neither vendor appears in any product
repository's `MARKET.md`, so there was no owned source to check them against,
and on **2026-08-31** both vendors' own pricing pages refused to serve us a
price: `adobe.com/sign/pricing.html` returned no response body over repeated
requests, and `pandadoc.com/pricing/` answered `HTTP 429` behind a JavaScript
bot challenge. An unread number is not a weaker citation than a read one; it is
not a citation. The two annual columns derived from those rows are gone with
them, because arithmetic on an unverified figure reads as more precise than its
input, not less.

The measured reason to distrust the dropped rows is the row beside them: the
DocuSign figures of exactly that provenance were wrong at **both** ends when
someone finally opened the page. Prices move, and the date is part of the
claim.

When a growing business hires 5 new team members on the Standard plan, their
e-signature bill increases by $150 per month — even if those employees send one
offer letter a quarter.

---

## 2. Why Incumbents Claim It Must Be Expensive

Incumbents justify these fees with two claims:
1. *"Legal compliance is complex and requires specialized proprietary infrastructure."*
2. *"Document rendering and PDF manipulation require heavy server compute."*

Both claims are historically outdated.

### The Legal Reality: ESIGN and eIDAS
Under the US **Electronic Signatures in Global and National Commerce Act** ([15 U.S.C. § 7001](https://www.law.cornell.edu/uscode/text/15/7001)) and the European Union's **eIDAS Regulation** ([Regulation (EU) No 910/2014](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.257.01.0073.01.ENG)), an electronic signature is legally binding if four requirements are satisfied:

1. **Intent to Sign**: Demonstrable physical or digital action affirming agreement.
2. **Consent to Electronic Records**: Notice and affirmative acceptance to do business electronically.
3. **Association of Signature with Record**: The signature data must be deterministically stamped and tethered to the exact document bytes.
4. **Tamper-Evident Retention**: An audit certificate recording timestamps, IP addresses, user agents, and cryptographic digests proving the document was not altered post-execution.

None of these requirements require a $45/user/month per-seat subscription. They require standard cryptography (`SHA-256`) and deterministic coordinate geometry.

---

## 3. The Technical Breakthrough: Pure Edge PDF Stamping

Legacy e-signature architectures run heavy virtual machines executing Python or headless LibreOffice instances to flatten and rasterize PDFs. This creates massive operational overhead and cold starts.

In **Pumasi Sign**, document stamping is implemented as a **pure TypeScript / WebAssembly engine** running entirely inside Cloudflare V8 worker isolates:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PUMASI SIGN: PURE EDGE ARCHITECTURE                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ Client Browser ]                                                                   │
│          │                                                                             │
│          ▼                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │ Cloudflare Edge Worker (sign.pumasi.ai)                                      │     │
│   │                                                                              │     │
│   │   1. Normalized Coordinate Geometry:                                         │     │
│   │      (x_page, y_page) = (x_rel · PageWidth_pt, (1 - y_rel) · PageHeight_pt)  │     │
│   │                                                                              │     │
│   │   2. In-Memory Vector Stamping (pdf-lib / V8 Isolate):                       │     │
│   │      • Embeds high-res PNG / SVG vector ink directly                         │     │
│   │      • Appends Cryptographic Signature Certificate Page                      │     │
│   │                                                                              │     │
│   │   3. SHA-256 Cryptographic Audit Proof:                                      │     │
│   │      • Hash_original = SHA256(Raw_Upload_Bytes)                              │     │
│   │      • Hash_completed = SHA256(Stamped_Output_Bytes)                         │     │
│   │                                                                              │     │
│   │   4. Transactional SQLite Storage (Durable Objects):                         │     │
│   │      • Envelope state, multi-signer tokens, audit logs, binary PDF blobs     │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
│          │                                                                             │
│          ▼                                                                             │
│   [ Tamper-Evident Executed PDF with Audit Trail (Instant Download) ]                  │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### The Math: Normalized Coordinates Across Dynamic Viewports
Different devices render PDF pages at different scale factors. Mobile phones, Retina displays, and 4K monitors have distinct CSS pixel densities.

Pumasi Sign avoids coordinate drift by computing all field placements in **normalized unit intervals** `[0.0, 1.0]` relative to the page's intrinsic PDF points (`72 points per inch`):

$$\text{PDF}_x = x_{\text{norm}} \times \text{PageWidth}_{\text{points}}$$

$$\text{PDF}_y = (1.0 - y_{\text{norm}} - h_{\text{norm}}) \times \text{PageHeight}_{\text{points}}$$

Because the coordinate translation is a pure mathematical projection, the resulting stamped vector signature aligns with sub-millimeter precision regardless of whether the document was signed on an iPhone or an ultrawide desktop.

---

## 4. Architectural Comparison: Legacy SaaS vs. Cloudflare Edge

| Architectural Layer | Legacy Incumbent Stack | Pumasi Sign Edge Stack |
| :--- | :--- | :--- |
| **Runtime Environment** | Dedicated Kubernetes clusters with Node/Python/LibreOffice | Cloudflare V8 Worker Isolates (<5ms cold start) |
| **PDF Manipulation** | Forked background C++ processes & rasterizers | In-isolate TypeScript vector stamping (`pdf-lib`) |
| **State & Storage** | AWS RDS PostgreSQL + S3 Buckets (high egress cost) | Embedded SQLite in Cloudflare Durable Objects + Cloudflare R2 |
| **Multi-Tenancy** | Complex organization schemas with gated features | Instant workspace provisioning with customizable branding |
| **Operational Cost** | High fixed monthly server & database infrastructure | Fractional token & edge invocation cost ($0 at scale) |

---

## 5. Software as an Unmetered Commons

When the infrastructure cost of executing an agreement drops to near zero, the business model must change.

Pumasi Sign has no envelope meters, no per-seat paywalls, and no gated
features. It is **not yet licensed**: as of **2026-08-31** the repository
carries no `LICENSE` file on its default branch — checked with
`gh api repos/pumasi-ai/pumasi-sign/contents/LICENSE`, which returns `404`, and
neither its `package.json` nor its README declares one. Read the source and run
it, but until that file lands nobody here has granted you a licence to it:
- Run it locally or self-host on your own Cloudflare account: `git clone https://github.com/pumasi-ai/pumasi-sign && npx wrangler deploy`.
- Use the public commons deployment at [**https://sign.pumasi.ai**](https://sign.pumasi.ai) with your own custom branding.

Contracts and agreements should record trust between counterparties—not pay a tax to a software tollbooth.
