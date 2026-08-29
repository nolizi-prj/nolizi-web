/**
 * Markdown → HTML, plus the by-products both audiences need.
 *
 * A fresh `Marked` instance is built per document rather than configuring the
 * module-level singleton, because heading-id de-duplication is per-document
 * state and a shared slugger would leak counters between pages.
 */

import { Marked, Renderer } from "marked";
import { escapeHtml } from "./html.js";

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

export interface RenderedMarkdown {
  html: string;
  headings: Heading[];
  text: string;
}

/** URL-safe, stable, human-readable heading anchors. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isExternal(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith("mailto:");
}

export function renderMarkdown(source: string): RenderedMarkdown {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  const md = new Marked({ gfm: true, breaks: false });

  md.use({
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens);
        const plain = stripTags(text);
        const base = slugify(plain) || `section-${headings.length + 1}`;
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const id = n === 0 ? base : `${base}-${n + 1}`;
        headings.push({ depth: token.depth, text: plain, id });

        // A permalink that is invisible until focused or hovered: discoverable
        // for people, and a real anchor target for anything linking deep.
        const anchor =
          token.depth >= 2 && token.depth <= 4
            ? `<a class="anchor" href="#${id}" aria-label="Permalink to “${escapeHtml(plain)}”">#</a>`
            : "";
        return `<h${token.depth} id="${id}">${text}${anchor}</h${token.depth}>\n`;
      },

      link(token) {
        const text = this.parser.parseInline(token.tokens);
        const href = escapeHtml(token.href ?? "");
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        if (isExternal(token.href ?? "")) {
          return `<a href="${href}"${title} rel="noopener noreferrer external">${text}</a>`;
        }
        return `<a href="${href}"${title}>${text}</a>`;
      },

      image(token) {
        const src = escapeHtml(token.href ?? "");
        const alt = escapeHtml(stripTags(token.text ?? ""));
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        return `<img src="${src}" alt="${alt}"${title} loading="lazy" decoding="async">`;
      },

      code(token) {
        const lang = (token.lang ?? "").split(/\s+/)[0] ?? "";
        const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        // tabindex makes an overflowing block reachable by keyboard scroll.
        return `<pre tabindex="0"${lang ? ` data-lang="${escapeHtml(lang)}"` : ""}><code${cls}>${escapeHtml(token.text)}\n</code></pre>\n`;
      },

      table(token) {
        // Wide tables scroll inside their own box; the page never scrolls
        // sideways on a phone.
        const inner = defaultTable.call(this, token);
        return `<div class="table-scroll" role="region" tabindex="0" aria-label="Table">${inner}</div>\n`;
      },
    },
  });

  const html = md.parse(source, { async: false }) as string;
  return { html, headings, text: stripTags(html) };
}

// Captured before `use()` replaces it, so the table wrapper can delegate.
const defaultTable = Renderer.prototype.table;

/** HTML → readable plain text. Used for word counts and machine summaries. */
export function stripTags(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(p|div|li|h[1-6]|tr|pre|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Render a single line of Markdown with no wrapping paragraph. */
export function renderInline(source: string): string {
  return new Marked({ gfm: true }).parseInline(source, { async: false }) as string;
}
