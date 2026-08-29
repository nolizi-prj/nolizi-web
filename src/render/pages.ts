/**
 * The body of each kind of page. Everything here returns the contents of
 * `<main>`; the shell around it is `layout.ts`.
 */

import { escapeHtml } from "../html.js";
import { renderInline } from "../markdown.js";
import { coverArt, heroArt, plotArt } from "./art.js";
import type { RenderedDoc, SiteConfig } from "../types.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-08-29" → "29 August 2026". Parsed by hand: no timezone can intrude. */
export function humanDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const month = MONTHS[Number(m[2]) - 1] ?? m[2];
  return `${Number(m[3])} ${month} ${m[1]}`;
}

function readingTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/** A prose page: about, governance, contribute, and the machine-facing page. */
export function renderPage(doc: RenderedDoc): string {
  return `      <div class="wrap">
        <article class="prose">
          <header class="page-head">
            <h1>${escapeHtml(doc.matter.title)}</h1>
            <p class="lede">${renderInline(doc.matter.description)}</p>
          </header>
${doc.html}
        </article>
      </div>`;
}

/** The home page: the lede, then everything, from the front matter and content. */
export function renderHome(
  doc: RenderedDoc,
  products: RenderedDoc[],
  posts: RenderedDoc[],
): string {
  return `      <div class="wrap">
        <section class="hero">
          <div class="hero-text">
            <h1>${renderInline(String(doc.matter.heroTitle ?? doc.matter.title))}</h1>
            <p class="hero-lede">${renderInline(String(doc.matter.heroLede ?? doc.matter.description))}</p>
            <p class="hero-actions">
              <a class="button" href="/products/">See what exists</a>
              <a class="button button-quiet" href="/about/">Why it exists</a>
            </p>
          </div>
          <div class="hero-art">${heroArt()}</div>
        </section>

        <article class="prose">
${doc.html}
        </article>

        ${products.length ? productSection(products) : ""}
        ${posts.length ? postSection(posts.slice(0, 4)) : ""}
      </div>`;
}

function productSection(products: RenderedDoc[]): string {
  return `<section class="section" aria-labelledby="products-heading">
          <h2 id="products-heading">What exists today</h2>
          <div class="cards">
            ${products.map(productCard).join("\n            ")}
          </div>
        </section>`;
}

function postSection(posts: RenderedDoc[]): string {
  return `<section class="section" aria-labelledby="writing-heading">
          <h2 id="writing-heading">Recent writing</h2>
          <ul class="post-list">
            ${posts.map(postListItem).join("\n            ")}
          </ul>
          <p><a class="more" href="/blog/">All writing →</a></p>
        </section>`;
}

export function productCard(doc: RenderedDoc): string {
  const compareTo = (doc.matter.compareTo ?? []) as string[];
  const status = doc.matter.status ? String(doc.matter.status) : null;
  return `<article class="card">
              <div class="card-art">${plotArt(doc.slug, 560, 150, 0.45)}</div>
              <h3><a href="${escapeHtml(doc.urlPath)}">${escapeHtml(doc.matter.title)}</a></h3>
              ${status ? `<p class="badge badge-${escapeHtml(status)}">${escapeHtml(status)}</p>` : ""}
              <p>${renderInline(doc.matter.description)}</p>
              ${
                compareTo.length
                  ? `<p class="card-meta">Instead of ${compareTo.map((c) => escapeHtml(c)).join(", ")}</p>`
                  : ""
              }
              ${
                doc.matter.limitation
                  ? `<p class="card-limitation"><strong>Not yet:</strong> ${renderInline(String(doc.matter.limitation))}</p>`
                  : ""
              }
            </article>`;
}

export function postListItem(doc: RenderedDoc): string {
  const date = doc.matter.date ?? "";
  return `<li class="post-item">
              <a href="${escapeHtml(doc.urlPath)}">${escapeHtml(doc.matter.title)}</a>
              <p>${renderInline(doc.matter.description)}</p>
              <p class="post-meta">
                <time datetime="${escapeHtml(date)}">${escapeHtml(humanDate(date))}</time>
                <span aria-hidden="true">·</span> ${escapeHtml(readingTime(doc.text))}
              </p>
            </li>`;
}

/** A single product page. */
export function renderProduct(doc: RenderedDoc): string {
  const compareTo = (doc.matter.compareTo ?? []) as string[];
  const repo = doc.matter.repo ? String(doc.matter.repo) : null;
  const status = doc.matter.status ? String(doc.matter.status) : null;

  return `      <div class="wrap">
        <article class="prose">
        ${crumbs([{ name: "Products", path: "/products/" }, { name: doc.matter.title, path: doc.urlPath }])}
        <header class="page-head">
          <h1>${escapeHtml(doc.matter.title)}</h1>
          <p class="lede">${renderInline(doc.matter.description)}</p>
          <dl class="factbox">
            ${status ? `<div><dt>Maturity</dt><dd>${escapeHtml(status)}</dd></div>` : ""}
            ${compareTo.length ? `<div><dt>Instead of</dt><dd>${compareTo.map((c) => escapeHtml(c)).join(", ")}</dd></div>` : ""}
            <div><dt>Licence</dt><dd>Apache-2.0</dd></div>
            ${repo ? `<div><dt>Source</dt><dd><a href="${escapeHtml(repo)}" rel="noopener noreferrer external">GitHub</a></dd></div>` : ""}
          </dl>
          ${
            doc.matter.limitation
              ? `<p class="callout callout-warn"><strong>Before you use it:</strong> ${renderInline(String(doc.matter.limitation))}</p>`
              : ""
          }
        </header>
${doc.html}
        </article>
      </div>`;
}

/** The products index. */
export function renderProductIndex(intro: RenderedDoc | null, products: RenderedDoc[]): string {
  return `      <div class="wrap">
        <header class="page-head">
          <h1>${escapeHtml(intro?.matter.title ?? "Products")}</h1>
          <p class="lede">${renderInline(intro?.matter.description ?? "Everything the commons has built so far.")}</p>
        </header>
        ${intro ? `<article class="prose">${intro.html}</article>` : ""}
        <div class="cards cards-wide">
          ${products.map(productCard).join("\n          ")}
        </div>
      </div>`;
}

/** The blog index. */
export function renderBlogIndex(intro: RenderedDoc | null, posts: RenderedDoc[]): string {
  return `      <div class="wrap">
        <header class="page-head">
          <h1>${escapeHtml(intro?.matter.title ?? "Writing")}</h1>
          <p class="lede">${renderInline(intro?.matter.description ?? "Updates from the commons, and what the market is charging.")}</p>
          <p class="subscribe">
            Follow by <a href="/feed.xml">Atom feed</a> — no account, no email address.
          </p>
        </header>
        ${intro ? `<article class="prose">${intro.html}</article>` : ""}
        <ul class="post-list post-list-full">
          ${posts.map(postListItem).join("\n          ")}
        </ul>
      </div>`;
}

/** A single post. */
export function renderPost(doc: RenderedDoc, site: SiteConfig): string {
  const date = doc.matter.date ?? "";
  const tags = (doc.matter.tags ?? []) as string[];

  return `      <div class="wrap">
        <article class="prose">
        ${crumbs([{ name: "Writing", path: "/blog/" }, { name: doc.matter.title, path: doc.urlPath }])}
        <div class="post-cover">${coverArt(doc.slug, 1000, 260)}</div>
        <header class="page-head">
          <h1>${escapeHtml(doc.matter.title)}</h1>
          <p class="lede">${renderInline(doc.matter.description)}</p>
          <p class="post-meta">
            <time datetime="${escapeHtml(date)}">${escapeHtml(humanDate(date))}</time>
            <span aria-hidden="true">·</span> ${escapeHtml(readingTime(doc.text))}
            ${doc.matter.author ? `<span aria-hidden="true">·</span> ${escapeHtml(String(doc.matter.author))}` : ""}
            ${
              doc.matter.updated && doc.matter.updated !== date
                ? `<span aria-hidden="true">·</span> updated <time datetime="${escapeHtml(doc.matter.updated)}">${escapeHtml(humanDate(doc.matter.updated))}</time>`
                : ""
            }
          </p>
          ${
            tags.length
              ? `<p class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join(" ")}</p>`
              : ""
          }
        </header>
${doc.html}
        <footer class="post-footer">
          <p>
            Published by ${escapeHtml(site.org.name)} under Apache-2.0. Quote it,
            translate it, train on it — attribution is welcome, permission is not
            required.
          </p>
          <p><a class="more" href="/blog/">← All writing</a></p>
        </footer>
        </article>
      </div>`;
}

function crumbs(trail: Array<{ name: string; path: string }>): string {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return `<nav class="crumbs" aria-label="Breadcrumb">
          <ol>
            ${items
              .map((c, i) =>
                i === items.length - 1
                  ? `<li aria-current="page">${escapeHtml(c.name)}</li>`
                  : `<li><a href="${escapeHtml(c.path)}">${escapeHtml(c.name)}</a></li>`,
              )
              .join("\n            ")}
          </ol>
        </nav>`;
}
