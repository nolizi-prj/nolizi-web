# The Pumasi Design System

**Scope: the whole commons.** `pumasi.ai`, Pumasi Sign, Pumasi Booking, Pumasi
Tunnel, and anything added after them. Not a website stylesheet that other
repositories may borrow from — one system, with a website and three
applications as its surfaces.

**Status: v1, 2026-08-31.** Established by the Graphics Designer seat under a
steward mandate. `assets/theme.css` is the executable form of this document;
where the two disagree, the stylesheet is what ships and this file is the bug.
`test/theme.test.ts` holds the token contract, so a token cannot quietly leave.

---

## 1. The problem this was written to fix

Four surfaces, four palettes, four ideas of what a button is:

| Surface | Accent | Corner | Elevation | Body face |
|---|---|---|---|---|
| `pumasi-web` | green `#197a3d` | square | none | monospace |
| `pumasi-sign` frontend | blue `#1a56db` | 10px | two shadows | system sans |
| `pumasi-booking` service pages | blue `#1a56db` | 8–14px | shadows | system sans |
| `pumasi-tunnel` relay dashboard | teal `#1f6f5c` | 8px | none | system sans |

Nothing here is badly made. The problem is that they are four brands, and a
reader who arrives at a signing link from the commons site has no way to know
they are in the same place. Worse, none of the four had a failure colour in
common, so each invented its own red.

**The fix is not "make everything look like the website."** It is one
vocabulary, one palette, one badge, one button hierarchy — and a documented,
narrow licence for an application surface to be denser than a document.

---

## 2. The principles, in the order they win arguments

1. **The interaction colour is the same everywhere.** `--accent` is green on
   `pumasi.ai`, in Sign, in Booking and in Tunnel. Every button, every link,
   every focus ring, in every product. If a reader learns "green is the thing
   I press" once, they never learn it again.
2. **A product is identified by `--signal`, and a signal never colours a
   control.** Signals mark *which product this is* — the icon, one edge rule,
   the live path in a diagram — and nothing else. Colouring by product is what
   produced the four brands in the table above.
3. **Tokens are named for their role.** `--accent`, never `--green`. A token
   named for what it looks like has to be renamed when the look changes, which
   is how a theme layer stops being one.
4. **Square corners, visible 1px borders, exposed structure.** Nothing floats
   on a document surface; everything sits in a cell.
5. **Hierarchy comes from size, weight, rule and box — not from switching
   typefaces.** This is a constraint worth having: emphasis cannot be faked
   with it.
6. **No web font request.** A font file is a third-party request, a blocking
   paint and a layout shift in exchange for a face most readers will not
   consciously notice. Both stacks are the reader's own. This is a decision,
   not a law: self-hosting one face is a single `@font-face` and no token
   change.
7. **Honesty is a visual property.** A `[SEED]` badge is amber and a
   `[LAUNCHED]` badge is filled, because the visual weight of a claim should
   match how much of it is actually built.

---

## 3. Typography

### Two stacks, and when each one is allowed

| Token | Stack | Where |
|---|---|---|
| `--font-mono` | `ui-monospace`, SF Mono, **JetBrains Mono**, **Geist Mono**, Menlo, Consolas | Everything on `pumasi.ai`. Headings, labels, numbers, code and terminals everywhere. |
| `--font-ui` | **Inter**, **Geist Sans**, `ui-sans-serif`, `system-ui`, Segoe UI, Roboto | Body and table text on **application** surfaces only, via `/brand/product-theme.css`. |

Both are system stacks — JetBrains Mono, Geist and Inter are named first so a
developer who already has one installed gets it, and nobody downloads anything.

`--font-display` stays monospace on **every** surface, including applications.
Headings, field labels, badges and numerals keep the console voice; only
running body text and dense table cells become proportional. The brand lives
where the eye lands first; the density lives in the rows.

### The scale

Monospace has a large x-height and a wide advance, which reads as "big" on the
page even when it is small in points. An earlier version of this scale trimmed
every step for that reason. It was a mistake: it looked balanced in a
screenshot and was tiring to read. Body text is 15–16px, the same as a
proportional face would use, and the small end stops at 12px, because 11px
metadata is decoration rather than information.

| Token | Value | Use |
|---|---|---|
| `--text-xs` | 12px | Badges, captions, table headers, `--tracking-caps` labels |
| `--text-sm` | 14px | Secondary prose, buttons, table cells, card body |
| `--text-base` | 15→16px | Body text |
| `--text-md` | 16→17px | Lede, hero supporting text |
| `--text-lg` | 18→20px | `h3`, card titles |
| `--text-xl` | 22→26px | `h2` |
| `--text-2xl` | 28→36px | Page `h1` |
| `--text-3xl` | 32→48px | Hero `h1` only, once per site |

Every step above `--text-sm` is a `clamp()`: the scale is fluid between a
phone and a desktop and never needs a breakpoint.

**Leading:** `--leading-tight` 1.25 (headings) · `--leading-snug` 1.4 (UI rows,
terminals) · `--leading-body` 1.75 (prose).
**Weight:** `--weight-body` 400 · `--weight-medium` 600 (buttons, labels) ·
`--weight-strong` 700 (headings, badges, `strong`).
**Measure:** `--measure` 56ch for prose, `--measure-wide` 72ch for tables and
technical text. Nothing is set wider.

---

## 4. Colour

### The canvas

A near-neutral warm ramp, not pure white and not pure black. `--paper` is
`#fcfcfb` rather than `#ffffff` because a full-white page next to a white
browser chrome loses its edge; `--paper` is `#0b0d0c` in dark rather than
`#000000` because black clips on OLED and takes the borders with it.

| Role | Light | Dark |
|---|---|---|
| `--paper` / `--paper-raised` / `--paper-sunken` | `#fcfcfb` / `#ffffff` / `#f2f2ef` | `#0b0d0c` / `#121513` / `#070908` |
| `--line` / `--line-strong` | `#dfdfd9` / `#b9b9b0` | `#232725` / `#39403c` |
| `--ink-faint` / `--ink-muted` / `--ink` / `--ink-strong` | `#8d8d84` / `#5f5f58` / `#1c1c1a` / `#0a0a09` | `#626b66` / `#94a09a` / `#d6ded9` / `#f2f7f4` |

### The four semantic colours

| Role | Light | Dark | On `--paper`, light / dark | Means |
|---|---|---|---|---|
| `--accent` | `#197a3d` | `#55d37c` | 5.26 / 10.21 | Interaction. Press this. |
| `--ok` | `#197a3d` | `#55d37c` | 5.26 / 10.21 | Verified. A gate passed, a claim checked. |
| `--warn` | `#9a5b00` | `#e0a955` | 5.29 / 9.26 | In progress. Provisional, will change. |
| `--danger` | `#b42318` | `#f97066` | 6.40 / 7.00 | Failed, or destroys something. |

`--danger` is new in v1. Its absence is exactly why three products each
invented a red.

Each carries `-soft` (a tinted ground) and `-line` (a border) so a callout,
badge or toast is three tokens rather than three hand-mixed values.

### The product signals

One hue each, held inside a narrow contrast band — 5.75–6.70 on light paper,
8.99–10.58 on dark — so the three read as siblings rather than as three brands.
The band, not the hue, is what makes them a family. It is stated to the same
two places as the table below, because a band published as "9.0–10.6" over a
table reading 8.99 is the remembered-not-computed mistake again, one paragraph
after apologising for it.

| Product | Signal | Light | Dark | Ratio light / dark | Why that hue |
|---|---|---|---|---|---|
| Pumasi Sign | blue | `#2350c8` | `#8ab0ff` | 6.70 / 9.04 | Document, record, authority. The colour a contract is signed in. |
| Pumasi Booking | clay | `#a1442a` | `#ee9c7c` | 6.06 / 8.99 | Warm, human, unhurried. Every scheduling incumbent is blue; this one is not. |
| Pumasi Tunnel | cyan | `#0e6f77` | `#4fd0dd` | 5.75 / 10.58 | Wire, stream, routing. |

A surface declares its product once, on `<body>`, and everything downstream
reads `--signal` and never names a product:

```html
<body data-product="sign">   <!-- sign · booking · tunnel -->
```

**The one collision to know about.** Booking's clay sits about 24° from
`--warn`'s amber. They are never adjacent by design — a signal identifies and
`--warn` states a condition, so they do not appear in the same component — but
if you ever find yourself putting a clay identity chip beside an amber status
chip, use the status chip alone.

### Contrast standard

**AA is the floor and it is not negotiable.** Body text ≥ 4.5:1 against its own
ground; large text and non-text boundaries ≥ 3:1.

Every ratio in the tables above is **measured** — WCAG relative luminance
against `--paper` in the matching scheme — not estimated. An earlier draft of
this file carried three ratios that were off by a tenth or two because they were
remembered rather than computed; they are computed now, and a change to any
colour has to recompute them. Rounded to two places, so a value that drifts is
visible.

`--ink-faint` (3.26 light, 3.54 dark) is the one token below 4.5:1. It is
licensed for non-essential metadata only — a timestamp, a caption prefix — and
never for a sentence a reader has to read. It clears 3:1, so it is legitimate
for a non-text boundary.

Saturated grounds are measured too: `[LAUNCHED]` is 5.39 light and 10.21 dark,
and `.button-danger` on hover is 6.40 light and 7.00 dark.

**And it is a test, not a promise.** `test/contrast.test.ts` recomputes each
listed pair from the stylesheets on every run, and resolves an inverted surface
the way a browser does — the surface's own declarations first, the page's
underneath, with the ground read out of the `background` declaration rather
than assumed. It exists because the honour system failed twice in one
afternoon: three published ratios were off by a tenth or two because they were
remembered rather than computed, and `.terminal` inverted its ground while its
ink kept values that had only ever been measured against paper, putting Sign's
`$` prompt at 2.88:1.

Then it failed a third time, in the guard itself. The first version of that
file seeded the terminal's token map from the light scheme and read the ground
from a token name it assumed — so it caught a colour *dropped* from the ramp
and stayed green when the original defect, a ground moved *out from under* an
untouched ramp, was pasted back in. It now fails on both, and both are checked
in before a change to the ramp is believed. The lesson is not about terminals:
**a guard written from the fix rather than from the failure tests the fix.**

The list of pairs is hand-written, and that is this file's own limit: a pair
nobody adds is a pair nobody checks. Adding a colour to a surface means adding
its pair.

**One honest wrinkle.** `--ok` and `--accent` are the same green. "Verified"
and "press this" therefore share a colour, which does soften principle 1's
claim that green means the thing to press. It is deliberate — this project has
one positive colour and inventing a second would be a colour with no meaning of
its own — but the two are never adjacent, and where a surface needs to
distinguish them it is by shape: `[LAUNCHED]` is *filled*, a button is
*pressable*, and a callout is a *box*.

Both schemes are real schemes. `@media (prefers-color-scheme: dark)` restates
the entire ramp, including the signals; it is not an inversion, and the theme
test fails if a colour is missing from it.

---

## 5. The stage badge

One component, five rungs, and it is the same object in every repository. On
`pumasi.ai` it is generated from a product's `status:` frontmatter; in a
product application it is written by hand against the product's own
`roadmap/STAGE.md`. **The brackets are generated by CSS, never typed** — a
badge whose brackets live in the content can be written without them.

```html
<span class="badge badge-alpha">alpha</span>   <!-- renders: [ALPHA] -->
```

| Class | Renders | Weight | The claim |
|---|---|---|---|
| `.badge-planned` | `[PLANNED]` | grey outline | Nothing exists yet |
| `.badge-seed` | `[SEED]` | amber outline | It exists and it will change under you |
| `.badge-alpha` | `[ALPHA]` | amber outline | You run it yourself |
| `.badge-beta` | `[BETA]` | green outline | It is hosted and it holds |
| `.badge-launched` | `[LAUNCHED]` | **green filled** | The mandatory-review bar applies |

The ladder gets louder as the claim gets stronger, and that is the point: the
visual weight is the honesty. `[LAUNCHED]` is the only filled badge in the
system, so it cannot be reached by accident.

`.badge` on its own is the seed rung, so a status the renderer has never heard
of degrades to *provisional* rather than to *stable*. `.badge-stable` is the
name `[BETA]`'s rung had before the ladder was written down; it still works and
nothing new should use it.

---

## 6. Geometry, borders and elevation

### Square, always

`--radius`, `--radius-sm`, `--radius-lg` and `--radius-pill` are all `0`, on
every surface including the applications. This is the single most visible piece
of the unification: it is what makes a Sign dialog and a `pumasi.ai` card
recognisably the same object. A product that needs to dissent overrides one
token, and should say why in a comment.

### Borders

| Token | Value | Use |
|---|---|---|
| `--border` | 1px solid `--line` | Internal division: a table rule, a card's own art |
| `--border-strong` | 1px solid `--line-strong` | The edge of a *thing*: card, factbox, callout |
| `--control-line` | 1px solid `--line-control` | The edge of a *control*: input, select, slot, quiet button |
| `--border-accent` | 1px solid `--accent` | Active, selected, focused |
| `--rule` | 1px dashed `--line-strong` | A soft separation inside one thought |
| `--edge` | `3px` | The width of a left-edge marker — callout, toast, seal |

`--edge` was `3px` written out in four places, which is how four things drift
apart.

**A card's edge and a control's edge are not the same object**, and WCAG does
not treat them the same. `--line-strong` is 1.92:1 on paper — fine for the
structural rule around a card, which nobody has to *find*, and not fine as the
entire visible boundary of a text input or a bookable slot, which is how a
person knows there is something there to operate. WCAG 1.4.11 asks 3:1 for
that. `--line-control` is 3.35:1 on paper and 3.71:1 on dark, and it is the
only thing that should ever draw the edge of something a person types in,
presses or chooses.

### Elevation, in four steps that mean the same thing on both surfaces

The commons spends **none** of its elevation budget on blur. A thing that is
higher on `pumasi.ai` is higher because its border is heavier and its ground is
lighter — that is what `--elev-N-border` and `--elev-N-ground` are for, and
`--elev-N` itself is `none`.

`/brand/product-theme.css` re-expresses the **same four steps** as real
shadows, because a dropdown opening over a table has to look like it is
floating or it reads as part of the row beneath it. No new token, no second
scale, and no markup change: `.card` is one component whose elevation resolves
differently per surface.

| Step | Document surface | Application surface | For |
|---|---|---|---|
| `--elev-0` | flat | flat | Page ground |
| `--elev-1` | hairline border | `0 1px 2px` | A panel resting on the page |
| `--elev-2` | strong border | `0 1px 2px, 0 2px 6px` | A card, a menu |
| `--elev-3` | strong border | `0 2px 4px, 0 12px 28px` | A modal — one at a time |

In dark, application elevation drops back to borders for steps 1 and 2: a
shadow does not read on a dark ground, because the ink is already darker than
any shade. Only the modal keeps a blur.

---

## 7. Buttons

Four ranks. **A screen is allowed exactly one primary.** Every rank keeps the
`>` prompt caret, so a quiet button still reads as the same kind of object as a
loud one.

| Class | Look | Use |
|---|---|---|
| `.button` | Accent fill, accent border | The one thing this screen is for |
| `.button .button-quiet` | Transparent, strong border | The alternative — not a lesser copy |
| `.button .button-ghost` | Transparent, no border | Reachable and must not compete: cancel, back |
| `.button .button-danger` | Transparent, danger border, `!` caret | Destructive |

`.button-danger` is **outlined, never filled**. A delete button that is the
loudest object on the screen gets pressed by accident; it fills on hover, once
the pointer is already on it.

Sizes: `.button-sm` (`--text-xs`) and `.button-lg` (`--text-base`) change
padding and size only — never rank. Disabled state is `--paper-sunken` on
`--ink-faint` with `cursor: not-allowed`, and is driven by `:disabled` or
`aria-disabled="true"` so it is announced as well as seen.

---

## 8. Product themes

All three inherit sections 3–7 in full. What follows is the entire licence each
one has to differ.

### Pumasi Sign — clean, authoritative, legal-grade

- **Signal** blue `#2350c8`. On the mark, on the seal's left edge, on the live
  path in `arch-sign.svg`. Never on a button.
- **The seal is the product.** `.seal` prints the SHA-256 digest at **full
  length**, in `--font-mono`, wrapping with `overflow-wrap: anywhere`. It is
  never truncated with an ellipsis: a hash you cannot read in full is a hash
  you cannot check. That single rule is what "tamper-evident" looks like.
- **Numerals are tabular** everywhere a date, a page number or a field
  coordinate appears, so a column of them aligns.
- **Density is low.** A signing surface shows one document and one decision.
  Use `--space-lg` between blocks where an admin table would use `--space-sm`.
- **Restraint over elegance.** DocuSign's signing page is competent and busy —
  a coloured banner, a floating action pill, a progress rail, an upsell. The
  advantage here is that there is nothing to sell, so the page can be the
  document, one action, and the seal.

### Pumasi Booking — calm, human, frictionless

- **Signal** clay `#a1442a`. Deliberately not blue: Calendly, Cal.com, Zcal and
  every incumbent are blue, and the warm tone is the first thing that says this
  is not one of them.
- **The grid never reflows.** `.slot` is one fixed size whether a time is free
  or taken, and taken slots stay in place and lose their border. A grid that
  reflows as availability loads is a grid the reader has to re-scan, and that is
  the single most common defect in this category.
- **Tabular numerals, and a timezone stated once**, near the grid, never in a
  footnote. Getting the timezone wrong is the failure mode of the whole product.
- **One decision per screen.** Pick a day, then pick a time, then confirm. The
  public booking page carries exactly one primary button, and it names what will
  happen: *Confirm Wed, 2 Sep at 2:00 PM*, not *Submit*.
- **Calm means quiet, not empty.** `--paper` ground, `--elev-1` at most, one
  saturated element on screen — the chosen slot.

### Pumasi Tunnel — high-contrast, modern developer terminal

- **Signal** cyan `#0e6f77`. On the mux glyph, on the `$` prompt, on the live
  dot.
- **Dark is the primary scheme.** Design and screenshot Tunnel dark first; light
  is a real second scheme and is checked, not assumed.
- **`.terminal` is always dark, in both schemes** — inverted against the page in
  light, flush with it in dark. A terminal rendered as a light box on a dark
  page is the one thing a developer's eye refuses to accept as a terminal.
- **And it is a scoped scheme, not a background swap.** `.terminal` restates
  the whole dark ramp — ground, ink, `--ok`, `--warn`, `--danger`, all three
  signals — so every token used inside a terminal is one that was measured
  against a dark ground. An earlier version set only the background and left
  the ink alone; `.ok` landed at 3.67:1 and Sign's `$` prompt at 2.88:1. If you
  ever invert a surface, invert its whole ramp or none of it.
- **Monospace body text is correct here**, and a Tunnel surface may keep
  `--font-body: var(--font-mono)` rather than taking `--font-ui`. Hostnames,
  ports and request paths are read character by character.
- **A live thing gets one dot and one word, never a spinner** (`.live`).
  Throughput and latency are `font-variant-numeric: tabular-nums` so a changing
  number does not jitter its own column.
- **Say what is not built.** `arch-tunnel.svg` carries an amber strip stating
  that there is no hosted relay, because the diagram would otherwise imply one.

---

## 9. The assets

In `assets/brand/`, published at `https://pumasi.ai/brand/`.

| File | What |
|---|---|
| `pumasi-logo.svg` | Mark + wordmark lockup, 144×40 |
| `pumasi-icon.svg` | The commons mark, 32×32 |
| `pumasi-sign-icon.svg` | A sealed page |
| `pumasi-booking-icon.svg` | A month with one slot taken |
| `pumasi-tunnel-icon.svg` | Many streams, one connection |
| `arch-commons.svg` | How a change reaches `main` |
| `arch-sign.svg` · `arch-booking.svg` · `arch-tunnel.svg` | One product architecture each, 960×312 |
| `product-theme.css` | The application layer of section 6 |

### The rules the marks are built on

- **32×32 grid, 3-unit margin, 2-unit primary stroke, integer or `.5`
  coordinates.** No curves — nothing in this system has one.
- **Silhouette first.** Every mark was checked at 16px before it was checked at
  96px. That is why Booking's calendar has six cells and not thirty.
- **The bracket belongs to the commons alone.** Product marks share the grid,
  the stroke weight and the one-signal rule, and have distinct silhouettes on
  purpose — four bracketed glyphs would be indistinguishable in a tab strip.
- **One saturated element per mark**, and it is the signal.
- **A diagonal is drawn heavier than the horizontal it meets.** It covers more
  distance per pixel of stroke, so a matched weight renders thinner; Tunnel's
  mux strokes are 2.6 against the bars' flat 3.

### Where the marks are actually used

Each product card on `/products/` carries its own mark on a strip of that
product's `--signal-soft`, with a `--signal` rule along the top edge. That
replaced a seeded 150px mosaic which was the loudest object on the card, said
nothing, and was near-identical across all three — so the two things the page
exists to convey, the product's name and how much of it is actually built, sat
below the noise and quieter than it.

The card uses the published file rather than a copy generated in the renderer.
A second drawing of the same glyph is a second drawing to keep in step.

### How they theme themselves

Every asset resolves its colours twice over:

```css
.pm-sign { --pm-ink: var(--ink-strong, #0a0a09); }
@media (prefers-color-scheme: dark) {
  .pm-sign { --pm-ink: var(--ink-strong, #f2f7f4); }
}
```

Inlined into a Pumasi page, `--ink-strong` exists and the page's own token wins
in both schemes. Loaded through `<img>` or a favicon slot, where custom
properties do not reach, no page token exists and the media query picks the
right literal — an SVG in an `<img>` gets its own rendering context and honours
`prefers-color-scheme`. One file is correct in light and dark, inline and
linked. **Do not remove a fallback, and never name a custom property inside an
SVG comment** — a `--` in an XML comment is not well-formed, and an SVG served
as `image/svg+xml` is parsed by the XML parser, which will refuse the file.

### The lockup

Clear space is 8 units on every side, a quarter of the mark's height. Minimum
lockup width is 72 units; below that use `pumasi-icon.svg` alone. The wordmark
is real type, not outlines, with `textLength` + `lengthAdjust="spacing"`
pinning the width to 94 units — so the geometry is identical on every machine
while the glyphs stay undistorted. `"spacing"`, never `"spacingAndGlyphs"`,
which stretches them.

---

## 10. Adopting this in a product repository

```html
<link rel="stylesheet" href="https://pumasi.ai/theme.css">
<link rel="stylesheet" href="https://pumasi.ai/base.css">
<link rel="stylesheet" href="https://pumasi.ai/brand/product-theme.css">
<body data-product="sign">
```

Order matters: theme, then base, then the product layer.

A repository migrating off its own stylesheet, in the order that keeps the app
usable at every step:

1. Delete the local palette. Map `--bg`→`--paper`, `--surface`→`--paper-raised`,
   `--fg`→`--ink-strong`, `--muted`→`--ink-muted`, `--line`→`--line`,
   `--accent`→`--accent`, `--danger`→`--danger`, `--ok`→`--ok`.
2. Set `--radius: 0`. This is the largest single visual change; do it on its own.
3. Replace the local badge with the stage ladder from section 5.
4. Replace the local buttons with the four ranks from section 7, and delete any
   fifth.
5. Adopt `.field` / `.input` and delete the local form styles. Control
   boundaries move to `--control-line`.
6. Set `data-product` and replace the local product colour with `--signal`,
   removing it from every control on the way.

### The checklist a change has to pass

- [ ] No hex colour outside `theme.css`. Any new colour is a token or it is a bug.
- [ ] Both schemes checked. Not inverted — checked.
- [ ] Body text ≥ 4.5:1 on **its own** ground — not on the page's, if the
      surface inverts. Measured, by `test/contrast.test.ts`.
- [ ] Any control a person types in, presses or chooses has a `--control-line`
      boundary, not a `--border-strong` one.
- [ ] Exactly one primary button on the screen.
- [ ] The stage badge matches the product's own `roadmap/STAGE.md`, and does not
      run ahead of it.
- [ ] Focus is visible on every interactive element, and the focus ring is an
      `outline` so it does not move the layout.
- [ ] Any new SVG: well-formed XML, no `--` in a comment, colours as
      `var(--token, #literal)`, checked at 16px if it is a mark.
- [ ] `npm test` passes — the token contract is a test, not a convention.

---

## 11. What this system deliberately does not have

Written down so it does not get re-litigated every quarter.

- **A web font.** See principle 6. It is a one-line change when it is worth it.
- **A gradient, a glow, or a curve.** The competitive set leans on all three.
  This system's differentiator is that it looks like the artefact it is.
- **A fifth button rank, or a second primary.** If a screen appears to need
  two primaries, it is two screens.
- **A spinner.** A live thing gets a dot and a word.
- **An icon set.** Three product marks and a commons mark. Interface icons are
  a dependency and a drift surface; a word is usually shorter than the argument
  about which icon means it.
