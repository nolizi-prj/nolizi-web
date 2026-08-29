---
title: "Design"
description: "Console: the design this site is built on. Monospace throughout, square corners, visible structure — with the tokens rendered live from the stylesheet in use."
order: 4
updated: 2026-08-29
---

Everything below is rendered from the same CSS custom properties the rest of
this site uses. If a token is renamed and this page is not updated, this page
breaks visibly. A style guide that can drift silently from its theme is worse
than none.

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

## No web fonts

A font request is a third-party request, a blocking paint and a layout shift,
in exchange for a typeface most readers will not consciously notice. This theme
wants the reader's own monospace in any case — the one they already read code
in — so the stack is the one their device ships with.

That is a decision, not a law. Self-hosting one face would be a single file and
one token change.
