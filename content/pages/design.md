---
title: "Design"
description: "How this site is themed: one token vocabulary, a colour-free structural layer, and interchangeable theme files — rendered live from the tokens in use."
order: 4
updated: 2026-08-29
---

Everything below is rendered from the same CSS custom properties the rest of
this site uses. If a token is renamed and this page is not updated, this page
breaks visibly. A style guide that can drift silently from its theme is worse
than none.

## Two files, one of them swappable

[`/base.css`](/base.css) is the structural layer: reset, layout, landmarks,
accessibility, print. It holds **not one colour, not one font and not one
size** — every visual decision is a token it reads.

The theme file supplies those tokens, plus the component rules built on them.
Swapping it swaps the design without touching a line of markup, which is how
this site can be shown in three quite different designs from one source of
content.

Every theme supplies the **same token vocabulary**: `--accent`, never `--clay`.
A token named for what it looks like has to be renamed when the look changes,
which is how a theme layer stops being one.

## The pictures

Every illustration is SVG generated at build time and inlined into the page.
That buys four things at once: the drawing inherits the theme's custom
properties, so one picture is correct in light **and** dark **and** in every
theme; there is no extra request at any size; it is sharp on every screen
without a `srcset`; and the compositions are seeded from each page's own
address, so every product and post has its own picture that is identical in
every build.

Each theme also supplies a corner radius and an art style, so the drawings
share a vocabulary without sharing a personality.

{{figure:plot:design-sample|A woven plot, seeded from this page's address. Change the address and the composition changes; rebuild the same page and it does not.}}

## No web fonts, in any theme

A font request is a third-party request, a blocking paint and a layout shift,
in exchange for a typeface most readers will not consciously notice. Every
theme here is built on the stacks the reader's device already has.

That is a decision, not a law. Self-hosting one display face would be a single
file and one token change — worth doing if a theme's headlines are carrying the
brand, and not worth doing otherwise.
