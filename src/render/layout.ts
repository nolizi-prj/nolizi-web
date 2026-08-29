/**
 * The page shell.
 *
 * Constraints this file keeps, on purpose:
 *
 *  - **No JavaScript.** Not a bundle, not an analytics snippet, not a font
 *    loader. Every page is complete when the HTML arrives, which is the same
 *    property that makes it trivially readable by a crawler that does not run
 *    scripts — and most still do not.
 *  - **No third-party requests.** No CDN, no Google Fonts, no tracker. Nothing
 *    to consent to, so no cookie banner, so no interstitial between a reader
 *    and the text.
 *  - **Semantic landmarks.** header / nav / main / article / footer, one `h1`
 *    per page, a skip link first in the tab order.
 */

import { escapeHtml } from "../html.js";
import { logoMark } from "./art.js";
import { renderMeta, type MetaInput } from "../seo/meta.js";
import type { SiteConfig } from "../types.js";

export interface LayoutInput extends MetaInput {
  /** The page content, already HTML. */
  main: string;
  /** Extra class on `<body>`, for page-specific styling. */
  bodyClass?: string;
}

export function renderLayout(input: LayoutInput): string {
  const { site } = input;
  return `<!doctype html>
<html lang="${escapeHtml(site.lang)}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    ${renderMeta(input)}
    <!-- Tokens and components first, then the structural layer that reads
         them. base.css holds no colour, font or size of its own, so the
         design lives entirely in theme.css. -->
    <link rel="stylesheet" href="/theme.css">
    <link rel="stylesheet" href="/base.css">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  </head>
  <body${input.bodyClass ? ` class="${escapeHtml(input.bodyClass)}"` : ""}>
    <a class="skip" href="#main">Skip to content</a>
    ${renderHeader(site, input.urlPath)}
    <main id="main">
${input.main}
    </main>
    ${renderFooter(site, input.markdownPath)}
  </body>
</html>
`;
}

function renderHeader(site: SiteConfig, current: string): string {
  const links = site.nav
    .map((item) => {
      const active = current === item.href || (item.href !== "/" && current.startsWith(item.href));
      return `<a href="${escapeHtml(item.href)}"${active ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("\n          ");

  return `<header class="masthead">
      <div class="wrap masthead-inner">
        <a class="wordmark" href="/">
          ${logoMark()}
          <span class="wordmark-name">${escapeHtml(site.name)}</span>
          <span class="wordmark-tagline">${escapeHtml(site.tagline)}</span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${links}
        </nav>
      </div>
    </header>`;
}

function renderFooter(site: SiteConfig, markdownPath?: string): string {
  const links = site.footer
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("\n            ");

  // The footer is where the machine affordances are stated in plain sight,
  // rather than hidden in a header a person never sees. An agent reading the
  // rendered page finds them; so does a curious human.
  const machine = markdownPath
    ? `<p class="footer-machine">
            Reading this as a machine? This page is also
            <a href="${escapeHtml(markdownPath)}">Markdown</a>. The site index is
            <a href="/llms.txt">/llms.txt</a> and <a href="/index.json">/index.json</a>.
          </p>`
    : `<p class="footer-machine">
            Reading this as a machine? Start at <a href="/llms.txt">/llms.txt</a>
            or <a href="/index.json">/index.json</a>.
          </p>`;

  return `<footer class="footer">
      <div class="wrap">
        <nav class="footer-links" aria-label="Footer">
            ${links}
        </nav>
        ${machine}
        <p class="footer-licence">
          ${escapeHtml(site.name)} is <a href="https://www.apache.org/licenses/LICENSE-2.0">${escapeHtml(site.licence)}</a>.
          Text and code alike. Reading is free, unmetered, and requires no account.
        </p>
        <p class="footer-nothing">
          This site sets no cookies, runs no JavaScript, and makes no
          third-party request. There is nothing here to consent to.
        </p>
      </div>
    </footer>`;
}
