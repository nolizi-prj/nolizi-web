# Superseded review round — recorded rather than discarded

**This file is not a verdict.** It is the record of a first review round whose
transcripts do not describe the change that was merged, and of a process fault
in how that round was run. It is committed because three of the corrections in
the merged text came out of it, and because a round that went wrong is part of
how the change got right.

## What went wrong, stated plainly

Three families — qwen, glm and kimi — were driven twice: once against an earlier
draft, and once against a corrected one. **The second launch reused the same
three output paths, and processes from the first launch were still alive.** They
finished later and wrote their answers into the second round's files. The result
is that each of those three files is **two writers' output in one file**, and
the kimi capture demonstrates it rather than merely suggesting it: 28 lines, a
complete review of the *corrected* text ending `VERDICT: APPROVE` on line 27,
followed by line 28 — the tail of a *different* review of the *earlier* text,
ending `VERDICT: OBJECT`. Two runs, one path.

The give-away that started the investigation is that the objecting halves all
cite a sentence — *"The app's own signing page refuses a past-due document
client-side"* — that

```console
$ grep -c "The app's own signing page refuses a past-due document" \
    content/products/pumasi-sign.md
0
```

does not appear in the merged file, does not appear in the final diff, and did
not appear in the prompt the second launch built. It **did** appear in the
earlier draft. **This is a builder's process fault, not a reviewer's error**,
and it is named that way here so that nobody later reads it as three families
hallucinating in unison. They did not; they reviewed what they were given, and
the builder's shell put two answers in one file.

**What was done about it.** Every reviewer process was killed, the output paths
were cleared, and a clean round was run for all four reachable non-builder
families with **one output path per family** and a prompt carrying only the
final diff and no narrative about earlier drafts. That round's transcripts —
`…-code-gemini.md`, `…-code-qwen.md`, `…-code-glm.md`, `…-code-kimi.md` — are
the verdicts this merge rests on. This file rests on nothing.

## What was taken from this round anyway, because it was right

The three transcripts below were read on their merits and **five findings were
acted on** rather than filed. All five are about text that survived into the
merged version, so the contamination does not touch them:

1. **qwen** — *"Q-035, window to 2026-09-08" in the front-matter limitation sets
   a deadline on Q-035.* The reading is not the one this seat takes: Q-035's own
   row states `Window closes | 2026-09-08`, so the card was reporting a
   published date rather than creating one, and glm read the same passage as
   *"state-reportage, not resolution"*. **But the objection was cited, the
   ambiguity was real, and the phrasing was changed rather than defended** — the
   card now says the window *"that entry's own row records"* closes on that
   date, in both the front matter and the body, which cannot be read as the card
   setting anything.
2. **glm and qwen** — *"Messages already deleted are gone — there is no shadow
   copy" overreaches the supplied measurements.* Correct. The card no longer
   asserts it flat: it attributes the sentence to the release note, adds what
   the deployed tree does support (the `UPDATE` overwrites in place and the
   `corrected` audit row at `durable.ts:1214` is written with no `details_json`,
   so no prior value is stored anywhere the service can read back), and says
   outright that what backups a Cloudflare account keeps is not something this
   page can measure.
3. **glm and qwen** — *the Zoom "either the holder's own grant or an operator
   server-to-server credential" disjunction is load-bearing and unmeasured.*
   Correct — it had been carried from `SUBPROCESSORS.md`. It is now read out of
   the deployed commit and cited to it: `2453adc:service/src/app.ts:3535-3545`
   for the account holder's own grant, `:3550-3557` for the server-to-server
   credential reached only when the first produces no meeting.
4. **qwen** — *"`main` has moved past it twice more" is an exact count the
   measurements do not support.* Correct. `git log 0e26917..c23c7e6` is **seven**
   commits, two of which touch `service/src/durable.ts`. The card now says that.
5. **kimi** — *"the date is stored" and "the date that pencil sends is discarded
   on arrival" sit in the same section without distinguishing creation from the
   pencil route.* Correct, and the distinction is the interesting part: at
   `0e26917` the send form's `INSERT INTO submissions` (`durable.ts:1062`) does
   write `expires_at` while the settings `PATCH` never touches it. The card now
   separates the two in as many words.

Two further glm observations were **not** taken, with reasons: that
*"published … ninety minutes apart"* was unmeasured (it was, and is now measured
to the second — 01:41:04Z and 03:04:29Z, eighty-three minutes, and the card says
eighty-three); and that *"correct in `main`"* was an unbacked completeness claim
about the whole register (fair — the wording was narrowed to naming Zoom, which
is what was measured, rather than dropped).

---

## qwen — superseded transcript, verbatim

I agree with the builder on the `updated:` date question: leaving both touched cards at `updated: 2026-09-01` is correct when the work and re-measurement occurred on 2026-09-01 UTC. Writing `2026-09-02` before that date was true would have created a false claim. The untouched `pumasi-tunnel.md` correctly remains `2026-08-31`. In substance, criterion 4 is satisfied; I would not enforce a mechanical “move” that forces a future date.

A. No. I found no sentence that claims or implies either Sign repair has shipped. The card says the opposite repeatedly: “two defects are live on `sign.pumasi.ai` as this is written, both repaired in `main` and neither deployed,” and later, “Both are merged and undeployed, and this page does not claim either has shipped.” The only deployed repair described is the older entry-path repair, which is separate and dated.

B. No. Several added claims are not traceable to the measurements supplied, with a date, including at least:
- Sign: “Two release notes were published on 2026-09-01 ninety minutes apart” — no measurement of publication times or interval.
- Sign: “The dialog then reports *Envelope settings updated.*” — no measurement of that UI string.
- Sign: “Messages already deleted are gone — there is no shadow copy.” — the measurements show a `NULL` write, but not absence of backups, replicas, logs, or any shadow copy.
- Sign: “The send wizard asks for a deadline, refuses one in the past, shows it back, and states in two places…” — no UI-copy measurement.
- Sign: “Q-028 counted the repairs already stacked in the undeployed bundle…” — no measurement of `DECISIONS.md` Q-028.
- Booking: “That call is made on either the account holder's own Zoom grant or a server-to-server credential belonging to whoever runs the deployment…” — the supplied measurement shows Zoom-creation fields, not the credential/authorization path.
- Booking: “`SUBPROCESSORS.md` names Zoom too, since `c4b1159`, and says in its own text that the served page does not.” — the measurements show ancestry, not the file’s text.
- Booking: “The served register's own *Adding one* section says account holders are told before an addition takes effect.” — no measurement of that section’s text.

C. The Booking card no longer makes the unconditional register claim. It now says the register is “correct in `main` and short by one party on the deployment you can actually read,” and it distinguishes `git show 2453adc:service/src/legal.ts` (deployed commit) from `main`. That satisfies the required separation.

D. Yes. The diff gives dates that operate as deadlines for Q-035 and Q-037: the front-matter limitation says “Q-035, window to 2026-09-08” and “Q-037, window to 2026-09-08,” and the body says a release “carries a 7-day window closing 2026-09-08 (`DECISIONS.md` Q-035).” The packet forbids setting a deadline on those entries and says to report their state only. I do not find a deployer proposed for Q-012.

E. No. The diff does not touch, weaken, or contradict the by-build mail-allowlist passage. It changes the subprocessor-register discussion and leaves the mail-guard scoping alone.

F. Yes. There are problems introduced or left unresolved:
- The sentence “The app's own signing page refuses a past-due document client-side” conflicts with the card’s own measurement that the served `ExternalSignView-CmDSqiPb.js` has no expired state and that the only occurrence of “expire” is the ten-minute verification-code copy.
- “Messages already deleted are gone — there is no shadow copy” overreaches the supplied measurements.
- “`main` has moved past it twice more” is an exact count not supported by the supplied measurements; the packet shows the two commits are ancestors, but not that they are the only movement past `0e26917`.
- The “Before you use it” cross-reference is updated consistently with the new two-defect framing, but it inherits the unsupported/contradictory claims above.

VERDICT: OBJECT — “Q-035, window to 2026-09-08” in content/products/pumasi-sign.md front-matter limitation sets a deadline on DECISIONS.md Q-035, violating the packet’s prohibition: “Do NOT … set a deadline on DECISIONS.md Q-035.”

---

## glm — superseded transcript, verbatim

Cross-family CODE review, pumasi-web, per CHARTER Part 3 requirement 3. Builder family: CLAUDE. Reviewer family: GLM. Reviewer ≠ builder, so criterion 6 is satisfiable by this review; nothing below does so, because I am withholding approval on one sentence.

**The `updated:` decision — I agree with the builder, plainly.** The field's claim is "when this card last changed." Both cards were changed today, 2026-09-01, at 03:2x UTC; the only truthful value is `2026-09-01`. Writing `2026-09-02` would publish tomorrow as a past event — exactly the class of false date this site exists to prevent. Criterion 4's substance — touched cards carry the current date, untouched cards don't — is met: both touched cards read 2026-09-01, and pumasi-tunnel.md, untouched, still reads 2026-08-31. The letter of "moves" cannot be satisfied without lying; the builder chose the truthful reading. One caveat: if this merge lands after 00:00 UTC on 2026-09-02, the field must be re-set then, or it goes stale.

**A.** No. The card forecloses the misreading repeatedly and explicitly: the limitation opens "**two defects are live on `sign.pumasi.ai` as this is written, both repaired in `main` and neither deployed**" and later says "**Both are merged and undeployed, and this page does not claim either has shipped**"; the body twice carries "**Merged, and not deployed.**" and once "**This page does not claim that repair has shipped**, and neither does its own note"; the deploy paragraph ends "**Someone deployed once; the question of who owes you the next one is still open.**"; and the tail adds "neither defect is in the `main` you would clone." The only "reached users" claim in the diff is the retained, true Issue #7 text (deploy 2026-09-01 01:02:16 UTC), which concerns neither new repair. I found no sentence a skimmer could read as either repair being live. The one sentence that misleads does so in the *opposite* direction — it credits the deployed build with a control it lacks — and is the ground of my objection in F.

**B.** Every live-host figure traces and matches: `/version` → 0.2.0/2453adc; `/subprocessors` → 200, 34 663 bytes, the five named parties and no sixth; `grep -ic zoom` → 4, all `zoom-hint`/`zoom-in`; `grep -io "zoom video"` → empty; served root → index-CnoFAC2c.js; health → 200; `ExternalSignView-CmDSqiPb.js` → 200/5 250 bytes/no expired state/voided+declined strings/single ten-minute "expire"; both PATCH bodies; `durable.ts:1209–1211` at 0e26917; no `crons`; no `scheduled`; main `durable.ts:1326`'s first line. Claims **not** traceable to any measurement in the packet: (1) "That call is made on **either** the account holder's own Zoom grant **or** a server-to-server credential belonging to whoever runs the deployment… a booking can reach Zoom on an account holder who never connected anything" — load-bearing for the whole privacy finding, unmeasured; (2) "**Messages already deleted are gone — there is no shadow copy**" and "nothing anywhere can read them back" — load-bearing, unmeasured; (3) "The app's own signing page refuses a past-due document client-side" — unmeasured *and contradicted* (see F); (4) the "*Envelope settings updated.*" toast; (5) "published on 2026-09-01 ninety minutes apart"; (6) "**Q-028** counted the repairs… these two are the third and the fourth"; (7) 2471a29's contents ("hourly cron", the `isTerminal()` join, "starts saving what the pencil sends"); (8) SUBPROCESSORS.md's "since `c4b1159`" and "says in its own text that the served page does not"; (9) "That trap is written into **Q-036** in its own row"; (10) the wizard's "refuses one in the past" and "states in two places"; (11) the served register's "*Adding one*" clause; (12) "That question is older than either of them"; (13) "correct in `main`" as a completeness claim — only Zoom's *presence* in main's legal.ts is measured, not that main adds nothing else and misses nothing; (14) the else-branch "(sub.message ?? null)" beyond the packet's truncated line 1326. Items (1)–(3) are the ones that matter; (3) is disqualifying.

**C.** No, and yes. Line 334's unconditional claim ("every third party that can see data is named in the subprocessor register") is gone, replaced by "correct in `main` and short by one party on the deployment you can actually read," and the new section measures both sides. The separation is explicit and load-bearing: "Read out of the deployed commit itself rather than out of `main`"; "`git show 2453adc:service/src/legal.ts | grep -ci zoom` returns **`0`**, so the copy now in production never carried it"; "What is missing is not the correction but the deployment." Only the minor caveat from B(13) applies.

**D.** No. Q-021's treatment is retained unchanged ("the steward's… this page states no licence until it lands"). Q-035 and Q-037 appear only as open entries with the release notes' own 7-day windows reported, and the card explicitly disclaims agency: "**This card sets no deadline on any of those entries, names no deployer, and takes no position on their defaults.**" Q-036 is reported open twice, with "This card reports that entry's state and takes no position in it." Q-012: "Nobody owns deployment" — no deployer proposed. The "can-hurt" label and the quoted "It is merged and it is **not deployed**" are reportage of the notes' own text, not a restatement of classification arguments; the one passage to double-check against the notes is the card's "ordering" paragraph, which reads as its own generalisation — confirm it is not the notes' argument wearing the card's voice.

**E.** No. The booking diff is a single hunk at lines 330–395; the by-build mail-allowlist passage at the end of the file is untouched, and nothing added addresses the mail guard — the new section concerns the register and Zoom, and the retained "Mail and calendar connections are a separate matter" keeps the boundary intact.

**F.**
1. **The objection.** "The app's own signing page refuses a past-due document client-side, so the rule was being enforced against the honest party and not the other one." Every reading fails. If the signing page is the page a recipient opens — which is how this same section defines it three sentences later ("**Measured 2026-09-01 03:25 UTC on the page a recipient opens.** The served `ExternalSignView-CmDSqiPb.js`… has no expired state at all") — the sentence is false: the builder's own grep of that chunk found no expired state, its only closed-envelope strings being the voided and declined messages, its only "expire" the ten-minute code. It also contradicts the same paragraph's "somebody holding a signing link can open a document whose deadline passed months ago and sign it" and the limitation's "a past-due envelope is still signable through an emailed link." If it means some other, in-app signing page, that page is never named and never measured. If it is a slip for the send wizard (which does refuse a past *deadline*), it names the wrong surface and the wrong object. It cannot mean `main` — the repair there is a server-side sweep and `isTerminal()` guard, and "was being enforced" is the deployed past. As published on five surfaces, it credits the deployed build with a control the builder's own measurement disproves, and it narrows the disclosed defect: a reader could conclude past-due signing is blocked except through some side door, when the card's own measurement is that the signing page itself has no expired state at all.
2. "**`main` has moved past it twice more since**, at `2471a29` and `9659e69`" — "more" is inflated: cd1fd2f already reported main past 0e26917 "including `2471a29`", so only 9659e69 is new since the last revision; and "twice" is not an exhaustive commit count either, since main reads at `c23c7e6`, itself ahead of 9659e69. The accurate formulation is the clause that already follows: "ahead of the deployment by two defects a user is meeting today." Lead with it.
3. "See *Before you use it* at the top of this page… **as of 2026-09-01 that is two live defects in the deployed worker and the licence claim, no longer the front door**" — the summary now matches the rewritten limitation exactly, but the diff touches no body section of that name; the two-defects section it does add sits mid-card, before "## Run it". If that heading renders from the limitation, the pointer is accurate and this note is moot; if it is a hand-maintained section, the pointer describes content the top of the page does not carry. Verify against the built page before merge.
4. "**Q-028** counted the repairs already stacked in the undeployed bundle at `0e26917`" — the same hash is "the deployed tree `0e26917`" everywhere else in this card; past-tense it ("the bundle that sat undeployed at `0e26917` until this morning's deploy").
5. The deployed UPDATE the card quotes writes neither `expires_at` nor the reminder fields — so the deployed pencil discards `reminders_enabled` and `reminder_interval_days` too; the card says only "the date that pencil sends is discarded on arrival." Not false, but it says less than its own measurement supports.
6. Build and tests as reported: 36 files twice identical, 62/62 twice, before-change counts identical — green, and unchanged by a content-only diff, as expected.

The objection is narrow and fixable: correct or delete the sentence in F(1), tighten F(2), resolve F(3), and either measure or remove B(1)–(2). On a resubmission carrying those, I would approve.

VERDICT: OBJECT — content/products/pumasi-sign.md, section "2 · An expiration date on the live service does nothing": the sentence "The app's own signing page refuses a past-due document client-side, so the rule was being enforced against the honest party and not the other one" is contradicted by the same section's own measurement ("The served `ExternalSignView-CmDSqiPb.js` (`200`, 5 250 bytes) has no expired state at all", builder's grep, 2026-09-01 03:25 UTC) and by the card's own "somebody holding a signing link can open a document whose deadline passed months ago and sign it".

---

## kimi — superseded transcript, verbatim

## Cross-family review — pumasi-web, two catalog cards (builder: CLAUDE)

**A. Shipped-claim check — none found.**
The Sign card's front-matter limitation now *leads* with the disclaimer: "**two defects are live on `sign.pumasi.ai` as this is written, both repaired in `main` and neither deployed**," and "…**this page does not claim either has shipped**." Each body section closes with "**Merged, and not deployed.**"; defect 1 adds "**This page does not claim that repair has shipped**, and neither does its own note." The only sentence in the card describing a repair reaching users is the *pre-existing* Issue #7 paragraph (the sign-in entry path, deployed 2026-09-01 01:02 UTC), and it is correctly scoped to that earlier, separate defect — not to either of the two at issue. A skimming reader is actively told the opposite of "shipped," at each level (limitation, section close, synthesis). A passes.

**B. Traceability — substantially yes, with four residual items named.**
Every live-host figure in the new prose matches the packet and carries its date/time: version/commit `2453adc`; `200`/34 663 bytes; the five named parties; `grep -ic zoom → 4` decomposed as 3×`zoom-hint` + 1×`zoom-in`; `grep "zoom video" → ∅` at 03:24 UTC; the unmoved fingerprint `index-CnoFAC2c.js` → `0e26917`; `durable.ts:1209–1211`'s NULL-on-absent semantic; `api/health → 200`; both chunk sizes; no `crons`, no `scheduled`. The residual items not contained in the packet excerpts: (1) the Zoom authorization fork — "either the account holder's own Zoom grant **or** a server-to-server credential belonging to whoever runs the deployment"; (2) the `SendView.vue:1332` / `EnvelopeDetailView.vue:1104` line citations; (3) "published on 2026-09-01 ninety minutes apart"; (4) "hourly cron trigger" for `2471a29`. Each is pinned to a named commit or a linked release note rather than asserted bare, none is a live-host figure inherited from the packet (criterion 1's actual prohibition), and none is contradicted by any measurement. I accept them as commit-attributed source readings consistent with the linked material; criterion 1 holds in substance.

**C. Unconditional assertion — removed; `main`/deployment separation — clean.**
The old sentence ("every third party that can see data is named in the subprocessor register") is replaced by "**correct in `main` and short by one party on the deployment you can actually read**," and the section explicitly reads the deployed tree — "Read out of the deployed commit itself rather than out of `main` — `git show 2453adc:service/src/app.ts`" — while the repair paragraph shows `c000feb` in `main` against `git show 2453adc:…legal.ts | grep -ci zoom → 0`. Criterion 3 satisfied.

**D. DECISIONS entries — state reported, nothing resolved.**
Q-021: "open as … **Q-021**, and **this page states no licence until it lands**." Q-012: "open … **This card … names no deployer**." Q-035/Q-037: linked, with the **release notes' own** 7-day veto windows (closing 2026-09-08) reported as facts of those notes; the card itself says "**This card sets no deadline on any of those entries**." Q-036: "is open … **This card reports that entry's state and takes no position**." The 2026-09-08 windows are not deadlines the card sets on the questions. D passes.

**E. Mail-allowlist by-build passage — untouched.**
The booking diff is a single hunk confined to the subprocessor register; the end-of-file passage scoping the guard by build does not appear in the diff at all. E passes.

**F. Accuracy scan — the two named stale cross-references were updated; nothing false introduced.**
"moved past it again" → "**`main` has moved past it twice more since**, at `2471a29` and `9659e69` — read here at `c23c7e6` on 2026-09-01 — each changing `service/src/durable.ts`" (ancestry of both commits at `c23c7e6` is confirmed; the narrowed file claim is accurate). "Before you use it … it is now the licence, not the front door" → "**as of 2026-09-01 that is two live defects in the deployed worker and the licence claim, no longer the front door.**" Rest of the scan: the five parties match; the four CLOSED_MESSAGES keys match the corrected measurement; "an unmoved front end is an unmoved worker" is supported by the `ASSETS`-binding measurement; "messages already deleted are gone" follows from `NULL`-on-absent semantics; STAGE.md §2.2 is used only for its measured fingerprint mapping (the internal contradiction is not reproduced); the cd1fd2f Surface B correction is not re-landed. The Q-028 cross-reference ("third and the fourth") is consistent with the surrounding narrative. F passes.

**G. Expiration subsection — the client/server split is now stated correctly.**
It now narrates the emailed link through `ExternalSignView` (landing page, code mailed, still `open`), then the shared `SignView` blocking **client-side** with the expiration message, attributes the contrary belief to the deployed source's own comment (`SignView.vue:479` at `0e26917`), and closes: "**This card does not tell you a past-due envelope is unsignable on the live service; it tells you the service is not what stops it.**" That matches the 03:35 UTC re-measurement exactly; the first draft's overstatement ("still signable through an emailed link") is gone; and it is not softened into harmlessness — the API-direct party remains unprotected and the card says so. G passes.

**The `updated:` judgment — I agree with the builder.**
Criterion 4's purpose is that a touched card's date be true and an untouched card's date unmoved. It is 2026-09-01 UTC; both touched cards already carried 2026-09-01 from work earlier today, so leaving that value is accurate, and writing 2026-09-02 would publish a false date on a site whose thesis is that a date is part of a claim. `pumasi-tunnel.md` untouched at 2026-08-31 is correct.

VERDICT: APPROVE
o listed measurement supports it, and the card's own measured paragraph two lines below reports the recipient's signing page (ExternalSignView-CmDSqiPb.js) "has no expired state at all" (grep count 0).

---

