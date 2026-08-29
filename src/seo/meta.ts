/**
 * Everything inside `<head>` that is not style.
 *
 * Three audiences read this block and they want different things:
 *
 *  - **People** get the title and, indirectly, the fast first paint that comes
 *    from there being no script tag here at all.
 *  - **Search engines** get a canonical URL, a description, Open Graph and
 *    Twitter cards, and an explicit robots directive.
 *  - **Agents** get `<link rel="alternate" type="text/markdown">`, which points
 *    at the same document as Markdown. That link is the single most useful
 *    thing on this site for a machine reader: it means no model ever has to
 *    infer content out of layout markup.
 */

import { escapeHtml } from "../html.js";
import type { SiteConfig } from "../types.js";

export interface MetaInput {
  site: SiteConfig;
  /** Page title, without the site-name suffix. */
  title: string;
  description: string;
  /** Site-absolute path, e.g. "/about/". */
  urlPath: string;
  /** Site-absolute path to the Markdown twin, if there is one. */
  markdownPath?: string;
  /** "website" for pages, "article" for posts. */
  ogType?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  /** JSON-LD blocks, already built. */
  jsonLd?: object[];
  /** Set on pages that exist only for machines. */
  noindex?: boolean;
}

export function renderMeta(input: MetaInput): string {
  const { site } = input;
  const canonical = `${site.url}${input.urlPath}`;
  const isHome = input.urlPath === "/";
  const fullTitle = isHome
    ? `${site.name} — ${site.tagline}`
    : `${input.title} · ${site.name}`;

  const lines: string[] = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(input.description)}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    input.noindex
      ? `<meta name="robots" content="noindex, follow">`
      : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`,
  ];

  // The Markdown twin. `rel="alternate"` is the standards-correct way to say
  // "the same document, another representation" — crawlers that understand it
  // follow it, and the ones that do not are unharmed.
  if (input.markdownPath) {
    lines.push(
      `<link rel="alternate" type="text/markdown" href="${escapeHtml(site.url + input.markdownPath)}" title="This page as Markdown">`,
    );
  }

  lines.push(
    `<link rel="alternate" type="application/atom+xml" href="${escapeHtml(site.url)}/feed.xml" title="${escapeHtml(site.name)} — updates">`,
    `<link rel="alternate" type="application/json" href="${escapeHtml(site.url)}/index.json" title="This site as JSON">`,
  );

  lines.push(
    `<meta property="og:type" content="${input.ogType ?? "website"}">`,
    `<meta property="og:site_name" content="${escapeHtml(site.name)}">`,
    `<meta property="og:title" content="${escapeHtml(isHome ? fullTitle : input.title)}">`,
    `<meta property="og:description" content="${escapeHtml(input.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:locale" content="${escapeHtml(site.lang.replace("-", "_"))}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${escapeHtml(isHome ? fullTitle : input.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(input.description)}">`,
  );

  if (input.publishedAt) {
    lines.push(`<meta property="article:published_time" content="${escapeHtml(input.publishedAt)}">`);
  }
  if (input.updatedAt) {
    lines.push(`<meta property="article:modified_time" content="${escapeHtml(input.updatedAt)}">`);
  }
  if (input.author) {
    lines.push(`<meta name="author" content="${escapeHtml(input.author)}">`);
  }
  for (const tag of input.tags ?? []) {
    lines.push(`<meta property="article:tag" content="${escapeHtml(tag)}">`);
  }

  // The licence is a fact about the content, and a commons should say it in
  // machine-readable form rather than only in a footer.
  lines.push(`<meta name="licence" content="${escapeHtml(site.licence)}">`);
  lines.push(`<link rel="license" href="https://www.apache.org/licenses/LICENSE-2.0">`);

  for (const block of input.jsonLd ?? []) {
    lines.push(
      `<script type="application/ld+json">${jsonLdSafe(JSON.stringify(block, null, 2))}</script>`,
    );
  }

  return lines.join("\n    ");
}

/**
 * JSON-LD sits inside a `<script>`, so the only sequences that can break out
 * are the ones that close it. Escaping those keeps the JSON valid while making
 * the block inert as markup.
 */
export function jsonLdSafe(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
