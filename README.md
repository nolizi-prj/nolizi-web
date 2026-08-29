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

    npm test           # 46 tests, no network, no browser

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
| `theme.css`, `styles.css` | The design theme, and the components built on it. |
| `favicon.svg` | Self-contained, with its own dark-mode rule. |

## Layout

    content/
      site.json          site-wide config; everything in it reaches the output
      pages/             prose pages; index.md is the home page
      products/          one file per product
      blog/              YYYY-MM-DD-slug.md — the date prefix is not in the URL
    assets/
      theme.css          the design theme: tokens only, no components
      styles.css         the component layer, built entirely on those tokens
    src/
      build.ts           the one pass that produces both renderings
      content.ts         loading and validating content
      frontmatter.ts     a strict, tiny YAML subset that never guesses
      markdown.ts        Markdown → HTML, headings, plain text
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

## The design theme

`assets/theme.css` is the theme — **Field** — and it is tokens only: colour,
type, space, line, motion. No components, no layout. Another Pumasi product can
link or copy it and inherit the look without inheriting this website's
furniture.

It is documented, and rendered live, at [`/design/`](https://pumasi.ai/design/).

Two rules for anyone extending it. **Never write a literal colour outside
`theme.css`** — add a token instead; `styles.css` contains none. And **no web
fonts**: a font request is a third-party request, a blocking paint and a layout
shift, in exchange for a typeface nobody notices.

Illustrations are SVG generated at build time and inlined, so one drawing is
correct in light and dark, costs no request at any size, and is seeded from the
page's own address — every product and post gets its own picture, identical in
every build.

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
