# Aborted review round — recorded rather than deleted

**This file is not a verdict, and the round it names did not finish.** It is
kept because one family answered before the round was stopped, and a transcript
that existed should not vanish because it became inconvenient.

## What happened

At 2026-09-01 05:27:47 UTC this job launched gemini, glm and qwen against the
working-tree diff of `content/products/pumasi-sign.md` and
`content/products/pumasi-booking.md`. **Two minutes later the builder edited the
diff** — three changes to `pumasi-booking.md`, none of them cosmetic:

1. *"they will very likely see nothing to click"* was strengthened to *"they will
   see nothing to click"*, with a new sentence establishing that
   `bookingPage()` is defined once and serves all four public booking routes, so
   the defect is universal on that build rather than one page's.
2. A `console` block was corrected: it showed `$ date -u` producing
   `2026-09-01 05:21:07 UTC`, which is not what bare `date -u` prints. The block
   now shows the command actually run.
3. Two rows were added to the `main`-versus-deployment table and two existing
   rows corrected, including one — *"every reviewed fix described on this page is
   an ancestor of the deployed build"* — that the new content had made **false**.

**A review of a diff that has since changed does not cover the change being
merged.** That is the precise fault recorded in
`20260901-033413-code-SUPERSEDED-ROUND.md`, one round earlier and by a different
seat, where two launches shared three output paths and interleaved two writers'
answers into one file. Rather than let it happen a second time, this round was
**stopped**: every reviewer process was killed by PID and the process table was
checked empty before anything else was done.

## What was recovered, and what it is worth

- **gemini answered before the kill and returned `VERDICT: APPROVE`** on the
  pre-edit draft. Its transcript is `20260901-052747-code-gemini-ABORTED.md`.
  **It does not cover the merged text** and is not counted toward CHARTER §3
  requirement 3. It is evidence that the claims common to both drafts survived a
  non-builder family's reading, and nothing more.
- **glm and qwen had produced zero bytes** and were killed mid-run. Their files
  are absent rather than committed empty; there is no partial answer to preserve.

## What was done instead

The text was **frozen** — `npm run build` clean, `npm test` 62/62 — and the
frozen diff checksummed at **`sha256:d6332b6cdc30937f14911f355fe7a1b027e41a98e1dabf7310c5debbea895bde`**,
41 838 bytes, at 05:31:10 UTC. That checksum is quoted in the prompt every
reviewer of the real round received, so the diff they read is provably the diff
that was committed. The real round is `20260901-053121-code-*`, launched once,
one process per output path, four non-builder families.

**No file was edited between the freeze and the commit.**
