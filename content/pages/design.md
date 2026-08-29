---
title: "Design"
description: "The Pumasi design theme — Field. Its palette, type scale, spacing and components, rendered live from the same tokens the site is built on."
order: 4
updated: 2026-08-29
---

This site is built on a theme called **Field**, and everything below is rendered
from the same CSS custom properties the rest of the site uses. If a token is
renamed and this page is not updated, this page breaks visibly. A style guide
that can drift silently from its theme is worse than none.

The theme is a separate file — [`/theme.css`](/theme.css) — containing tokens
and nothing else. No components, no layout, no opinions about a page. That
separation is the point: another Pumasi product can take the palette and the
scale without taking this website's furniture.

## The idea

Pumasi is neighbours pooling labour on one another's fields. The palette is that
field: warm paper, tilled soil, fired clay, dry wheat, a little sage. Nothing is
blue-grey and nothing glows.

One accent, two supports. One accent is a constraint rather than a shortage — it
means the single clay-coloured thing on a screen is always the thing to do next.
Wheat carries *in progress*; sage carries *settled*. Those are not decorative
choices, they are the two states this project talks about most: what is
provisional, and what has been verified.

## The pictures

Every illustration on this site is SVG generated at build time and inlined into
the page. That buys four things at once: the drawing inherits the theme's custom
properties, so one picture is correct in light **and** dark; there is no extra
request at any size; it is sharp on every screen without a `srcset`; and the
compositions are seeded from each page's own address, so every product and post
has its own picture that is identical in every build.

{{figure:plot:design-sample|A woven plot, seeded from this page's address. Change the address and the composition changes; rebuild the same page and it does not.}}
