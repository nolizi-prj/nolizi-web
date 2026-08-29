# Pumasi Web

**The Pumasi website. Static HTML for people, Markdown and JSON for agents, from
one source of content.**

Part of [Pumasi](https://github.com/pumasi-ai/pumasi), a commons of software
built by agents and governed by people. Apache-2.0, inbound equals outbound.

## The one idea

Every page is written once, as Markdown, and rendered **twice** in the same
build: as an HTML page for a person, and as a Markdown twin for a machine. They
come from the same `Doc` in memory, so they cannot drift apart.

```
content/pages/about.md   →   site/about/index.html   (a person reads this)
                         →   site/about.md           (an agent fetches this)
```

The HTML declares the twin in its own `<head>`, so nothing has to know the
convention to find it:

```html
<link rel="alternate" type="text/markdown" href="https://pumasi.ai/about.md">
```

That single decision is most of what makes this site legible to models, and it
costs one extra file per page.

## Run it

    npm install
    npm run build      # → site/
    npm run serve      # → http://localhost:8080
    npm run dev        # both

    npm preview        # all three themes side by side

    npm test           # 53 tests, no network, no browser

Node 22+. One runtime dependency — `marked`, for Markdown — because
hand-rolling a Markdown parser would be the exact error the commons rejects
elsewhere.

## What it emits

| Output | For |
|---|---|
| `index.html` and one per page | People. No JavaScript, no third-party requests, no cookies. |
| `*.md` beside every page | Agents. The same content without the layout. |
| `llms.txt` | A model: every page, one line each, small enough to keep in a prompt. |
| `llms-full.txt` | A model that would rather read the whole site once than fetch nine times. |
| `index.json` | A program: URLs, dates, descriptions, word counts, section anchors. |
| `sitemap.xml` | Search engines. Canonical HTML URLs only — never the Markdown twins. |
| `feed.xml` | Atom, with the full text of each post in the entry. |
| `robots.txt` | The crawl policy, with the major AI crawlers **named and allowed**. |
| `base.css`, `themes/*.css` | The structural layer, and the interchangeable design themes. |
| `favicon.svg` | Self-contained, with its own dark-mode rule. |

## Layout

    content/
      site.json          site-wide config; everything in it reaches the output
      pages/             prose pages; index.md is the home page
      products/          one file per product
      blog/              YYYY-MM-DD-slug.md — the date prefix is not in the URL
    assets/
      base.css           structure only: no colour, font or size of its own
      themes/            one file per design theme: tokens plus components
    src/
      build.ts           the one pass that produces both renderings
      content.ts         loading and validating content
      frontmatter.ts     a strict, tiny YAML subset that never guesses
      markdown.ts        Markdown → HTML, headings, plain text
      themes.ts          the theme registry
      render/            layout, page templates, the SVG art system, shortcodes
      seo/               <head> metadata and JSON-LD
      emit/              sitemap, robots, feed, llms.txt, index.json, twins
    test/                46 contract tests

## The build is strict on purpose

It stops, naming the file, on: a missing or over-long `description`; a post
without a date, or whose filename date disagrees with its front matter; an
unknown figure shortcode; front matter outside the documented subset; and **any
internal link that points at something the build did not emit.**

A site that ships a broken link is a site whose author finds out from a search
engine six months later. Every one of those checks exists because the failure it
prevents is silent.

## Writing a page

```markdown
---
title: "How it works"
description: "One sentence. It becomes the meta description, the card subtitle, the feed summary and the llms.txt line."
order: 2
updated: 2026-08-29
---

## A heading

Body text. Standard GitHub-flavoured Markdown.

{{figure:merge-gate|An optional caption.}}
```

`{{figure:...}}` asks the art system for a picture. Content never contains SVG,
so re-theming redraws every illustration on the site at once. The figures are
`merge-gate`, `plot`, and `cover`.

Product front matter adds `compareTo`, `status`, `repo` and `limitation`; the
limitation is rendered **above** the features, on purpose.

## The design themes

The site is themed in two layers:

- **`assets/base.css`** — structure, layout, landmarks, accessibility, print.
  It holds **no colour, no font and no size of its own**; every visual decision
  is a token it reads.
- **`assets/themes/<id>.css`** — the tokens, plus the components built on them.

Swapping the theme file swaps the design without touching a line of markup.
Three are in the repository:

| Theme | Direction | Drawn from |
|---|---|---|
| **`signal`** | High-contrast and engineered. Near-black on white, one blue that only ever means "interactive", headlines at −0.045em, and a great deal of space. | Vercel · Linear · Stripe |
| **`console`** | Monospace everywhere. Square corners, visible borders, console punctuation. The site looks like the machine-readable artefact it is. | Bun · Raycast · Resend |
| **`press`** | Editorial and structural. Type at hero scale, numbered sections under thick rules, one signal red. | 2026 brutalist-editorial · Swiss print |

Compare them side by side, same content and markup in all three:

    npm run preview     # → :8081 :8082 :8083, with a switcher bar

Build a specific one:

    PUMASI_THEME=console npm run build

Two rules for anyone extending a theme. **Never write a literal colour outside
a theme file** — `base.css` contains none, and a test enforces it. And every
theme supplies the **same token vocabulary**: `--accent`, never `--clay`. A
token named for what it looks like has to be renamed when the look changes,
which is how a theme layer stops being one.

**No web fonts, in any theme.** A font request is a third-party request, a
blocking paint and a layout shift, in exchange for a typeface most readers will
not consciously notice. That is a decision, not a law: self-hosting one display
face would be a single file and one token change.

Illustrations are SVG generated at build time and inlined, so one drawing is
correct in light and dark **and in every theme**, costs no request at any size,
and is seeded from the page's own address. Each theme supplies a corner radius
and an art style, so the drawings share a vocabulary without sharing a
personality.

The tokens in use are documented and rendered live at `/design/`.

## Deploying

The output is a directory of static files. It needs a web server and nothing
else — no runtime, no database, no build step at the edge.

    npm run build && rsync -a site/ your-host:/var/www/pumasi/

A GitHub Actions workflow that publishes to GitHub Pages is in
[`.github/workflows/`](.github/workflows/). It is one convenience among several,
not a dependency: nothing in this repository knows about a particular host, which
is the same commitment every Pumasi product makes.

Configure the server for extensionless URLs (`/about/` → `about/index.html`) and
serve `.md` as `text/markdown`. `npm run serve` resolves paths the same way, so
what works locally works there.

## What it does not do yet

**No Open Graph images.** Social cards fall back to text. Generating them would
mean rasterising SVG at build time, which means a binary image dependency and a
build whose output depends on which fonts the build machine has installed. That
is a worse trade than a missing preview image, until someone shows otherwise.

**No search.** With twelve pages, `llms.txt` and `index.json` are the search
index, and a reader has Ctrl+F.
