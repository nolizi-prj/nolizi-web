---
title: "Products"
description: "What the Pumasi commons has actually built, what each product replaces, and — stated first — what each one cannot do yet."
slug: products
order: 10
updated: 2026-08-31
---

Everything the commons has built is below, and nothing it has not. There are no
coming-soon cards and no roadmap entries on this page: a product gets a card
when there is something you can run, and each card states what it cannot do yet
before it states what it does.

**The licence differs by product, and this page will not average them.** A
licence is an outward grant a stranger may rely on, so it is quoted from the
repository that would have to honour it rather than asserted for the set.
`pumasi-tunnel` carries an Apache-2.0 `LICENSE` file. `pumasi-booking` and
`pumasi-sign` carry **none** on their default branch — `gh api
repos/pumasi-ai/<repo>/contents/LICENSE` returns `404` for both, checked
2026-08-31 — so a self-hoster has no grant of rights from them yet. That gap is
open as
[`DECISIONS.md` Q-021](https://github.com/pumasi-ai/pumasi/blob/main/DECISIONS.md),
whose named default is to add the file; until it lands, each card states its own
and this page states none for them.

What a product needs to run is on its own card, and they are not one stack:
`pumasi-tunnel` is a Go module, the others are Node. None of them needs an
account with anyone. Self-hosting is first-class permanently: nothing in the
code knows about a particular host.

What comes next is decided in the open —
[the backlog is public](https://github.com/pumasi-ai/pumasi-product-hunt),
ranked by a scored rubric, and the reasoning stays on the record.
