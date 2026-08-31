---
title: "Design"
description: "Console: the design system the whole Pumasi commons is built on. Monospace throughout, square corners, one accent in every product — with the tokens rendered live from the stylesheet in use."
order: 4
updated: 2026-08-31
---

Everything below is rendered from the same CSS custom properties the rest of
this site uses. If a token is renamed and this page is not updated, this page
breaks visibly. A style guide that can drift silently from its theme is worse
than none.

## One system, four surfaces

This is not a website stylesheet that other repositories may borrow from. It is
the design system for the commons — this site, Pumasi Sign, Pumasi Booking and
Pumasi Tunnel — and the products are surfaces of it, not neighbours of it.

Before it was written down there were four palettes, four ideas of what a
button was, and four corner radii; three of the four products had invented
their own red because the shared theme had no failure colour at all. A reader
arriving at a signing link from this site had no way to tell they were still in
the same place.

The fix is one rule and one exception. **The rule: the interaction colour is
the same everywhere.** `--accent` is green on this site, in Sign, in Booking
and in Tunnel — every button, every link, every focus ring. **The exception:
each product carries a `--signal`** — blue for Sign, clay for Booking, cyan for
Tunnel — which marks *which product you are in*, on the mark and on one edge
rule, and is never allowed near a control. Colouring by product is what made
four brands in the first place.

The full written system, including the per-product themes and what an
application surface is licensed to do differently, is
[`DESIGN_SYSTEM.md`](https://github.com/pumasi-ai/pumasi-web/blob/main/DESIGN_SYSTEM.md)
in this repository. Everything below is the part of it this page can render
live.

## The idea

**Console.** One typeface — the reader's own monospace — for headings, body and
navigation alike. Square corners. Visible borders. Console punctuation: `##`
before a section heading, brackets around a navigation item, a block caret after
the headline.

A commons whose whole argument is that it is legible to machines should look
like the artefact it is. The site is a listing, a set of records, and a merge
gate; setting it in the type those things are actually written in is the
honest choice, and it happens to be where developer-facing design has landed.

Because there is one typeface, hierarchy cannot come from switching families.
It comes from size, weight, rules and boxes — which is a constraint worth
having, because it is impossible to fake emphasis with it.

## Two files, one of them swappable

[`/base.css`](/base.css) is the structural layer: reset, layout, landmarks,
accessibility, print. It holds **not one colour, not one font and not one
size** — every visual decision is a token it reads.

[`/theme.css`](/theme.css) supplies those tokens, plus the components built on
them. Swapping it swaps the design without touching a line of markup.

Tokens are named for their **role**: `--accent`, never `--green`. A token named
for what it looks like has to be renamed when the look changes, which is how a
theme layer stops being one. Green carries interaction here; amber carries *in
progress*; those are the two states this project talks about most.

## The pictures

Every illustration is SVG generated at build time and inlined into the page.
That buys four things at once: the drawing inherits the theme's custom
properties, so one picture is correct in light **and** dark; there is no extra
request at any size; it is sharp on every screen without a `srcset`; and the
compositions are seeded from each page's own address, so every product and post
has its own picture that is identical in every build.

Nothing drawn here has a curve in it, because nothing in the theme does.

{{figure:plot:design-sample|A woven plot, seeded from this page's address. Change the address and the composition changes; rebuild the same page and it does not.}}

## The marks

Four marks, in [`/brand/`](/brand/pumasi-logo.svg), each on the same 32-unit
grid with a 2-unit stroke and no curve anywhere. Every one was checked at 16
pixels before it was checked at 96 — which is why Booking's calendar has six
cells and not thirty, and why the three product marks have deliberately
different silhouettes rather than sharing the commons' brackets. Four bracketed
glyphs would be indistinguishable in a tab strip.

Each file resolves its colours twice over: it reads the page's token when there
is one, and falls back to a literal when there is not, with its own
`prefers-color-scheme` block choosing which literal. One file is therefore
correct inlined *and* correct in an `<img>`, in light *and* in dark — including
the four architecture drawings, which are the same asset class at
[960 units wide](/brand/arch-commons.svg).

## No web fonts

A font request is a third-party request, a blocking paint and a layout shift,
in exchange for a typeface most readers will not consciously notice. This theme
wants the reader's own monospace in any case — the one they already read code
in — so the stack is the one their device ships with.

That is a decision, not a law. Self-hosting one face would be a single file and
one token change.

There is a second stack in the theme, `--font-ui`, and nothing on this site
uses it. It is for the product applications, where a forty-row table set in
monospace costs real columns. Those surfaces move `--font-body` to it and leave
`--font-display` where it is, so every heading, label and number stays in the
console face. The brand lives where the eye lands first; the density lives in
the rows.
