/**
 * The integration test: build the real site into a temporary directory and
 * assert the promises this project makes to its two audiences.
 *
 * These are contract tests, not snapshots. A snapshot would fail on every
 * wording change and pass on a silently dropped canonical tag; each assertion
 * below corresponds to something that would actually break for a reader, a
 * crawler, or a model.
 */

import { strict as assert } from "node:assert";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { build } from "../src/build.js";
import type { OutputFile } from "../src/types.js";

let out: string;
let files: OutputFile[];
const byPath = new Map<string, string>();

before(async () => {
  out = await mkdtemp(join(tmpdir(), "pumasi-web-"));
  files = await build(out);
  for (const file of files) byPath.set(file.path, file.contents);
});

after(async () => {
  await rm(out, { recursive: true, force: true });
});

const htmlPages = () => files.filter((f) => f.path.endsWith(".html"));

test("the build produces the pages a visitor needs", () => {
  for (const path of [
    "index.html",
    "about/index.html",
    "how-it-works/index.html",
    "for-machines/index.html",
    "design/index.html",
    "products/index.html",
    "products/pumasi-booking/index.html",
    "blog/index.html",
    "404.html",
  ]) {
    assert.ok(byPath.has(path), `missing ${path}`);
  }
});

test("every content page has a Markdown twin at the documented path", () => {
  for (const file of htmlPages()) {
    if (file.path === "404.html") continue;
    const slug = file.path.replace(/\/?index\.html$/, "");
    // Section indexes are generated; their intro page supplies the twin.
    const expected = slug === "" ? "index.md" : `${slug}.md`;
    assert.ok(byPath.has(expected), `${file.path} has no Markdown twin at ${expected}`);
  }
});

test("every indexable page carries the SEO tags that matter", () => {
  for (const file of htmlPages()) {
    if (file.path === "404.html") continue;
    assert.match(file.contents, /<link rel="canonical" href="https:\/\/pumasi\.ai/, file.path);
    assert.match(file.contents, /<meta name="description" content="[^"]{20,}"/, file.path);
    assert.match(file.contents, /<meta property="og:title"/, file.path);
    assert.match(file.contents, /application\/ld\+json/, file.path);
    assert.match(file.contents, /<html lang="en">/, file.path);
  }
});

test("every page points a machine at its own Markdown", () => {
  for (const file of htmlPages()) {
    if (file.path === "404.html") continue;
    assert.match(
      file.contents,
      /<link rel="alternate" type="text\/markdown" href="https:\/\/pumasi\.ai[^"]*\.md"/,
      file.path,
    );
  }
});

test("the 404 page is excluded from indexes", () => {
  assert.match(byPath.get("404.html") as string, /noindex/);
  assert.doesNotMatch(byPath.get("sitemap.xml") as string, /404/);
});

test("no page ships JavaScript or calls a third party", () => {
  for (const file of htmlPages()) {
    // Code samples legitimately quote URLs and tags, so they are excluded:
    // the question is what the browser fetches, not what the prose shows.
    const markup = file.contents.replace(/<pre[\s\S]*?<\/pre>/g, "");

    // The only <script> permitted is a JSON-LD data block, which does not execute.
    for (const match of markup.matchAll(/<script([^>]*)>/g)) {
      assert.match(match[1] as string, /type="application\/ld\+json"/, `${file.path}: ${match[0]}`);
    }
    assert.doesNotMatch(markup, /src="https?:\/\//, file.path);
    assert.doesNotMatch(markup, /<link[^>]+href="https?:\/\/[^"]*\.css"/, file.path);
    assert.doesNotMatch(markup, /fonts\.googleapis|cdn\./, file.path);
  }
});

test("exactly one h1 per page", () => {
  for (const file of htmlPages()) {
    const count = (file.contents.match(/<h1[\s>]/g) ?? []).length;
    assert.equal(count, 1, `${file.path} has ${count} h1 elements`);
  }
});

test("code blocks are not re-indented by the HTML writer", () => {
  const product = byPath.get("products/pumasi-booking/index.html") as string;
  const block = /<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/.exec(product);
  assert.ok(block, "expected a code block on the product page");
  for (const line of (block[1] as string).split("\n")) {
    assert.doesNotMatch(line, /^\s{4,}\S/, `code line was indented by the renderer: ${line}`);
  }
});

test("llms.txt indexes every page, with Markdown URLs", () => {
  const llms = byPath.get("llms.txt") as string;
  for (const slug of ["about", "how-it-works", "for-machines", "products/pumasi-booking"]) {
    assert.ok(llms.includes(`https://pumasi.ai/${slug}.md`), `llms.txt omits ${slug}`);
  }
  assert.match(llms, /^# Pumasi/);
  assert.ok(llms.includes("/llms-full.txt"));
});

test("llms-full.txt contains the actual prose of every page", () => {
  const full = byPath.get("llms-full.txt") as string;
  assert.ok(full.includes("The problem is duplication"), "home page body missing");
  assert.ok(full.includes("read for busy times"), "product body missing");
  assert.ok(full.includes("per-seat tax") || full.includes("per employee per month"), "post body missing");
});

test("index.json is valid, typed, and states the reuse terms", () => {
  const data = JSON.parse(byPath.get("index.json") as string);
  assert.equal(data.site, "Pumasi");
  assert.equal(data.licence, "Apache-2.0");
  assert.equal(data.reuse.may_train, true);
  assert.ok(data.products.length >= 1);
  assert.ok(data.posts.length >= 3);
  for (const entry of [...data.products, ...data.pages, ...data.posts]) {
    assert.match(entry.url, /^https:\/\/pumasi\.ai\//, entry.slug);
    assert.match(entry.markdown, /\.md$/, entry.slug);
    assert.ok(entry.words > 0, `${entry.slug} has no words`);
  }
});

test("robots.txt allows the major AI crawlers explicitly", () => {
  const robots = byPath.get("robots.txt") as string;
  for (const agent of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]) {
    assert.ok(robots.includes(`User-agent: ${agent}`), `robots.txt does not name ${agent}`);
  }
  assert.doesNotMatch(robots, /^Disallow: \//m, "a commons must not disallow crawling");
  assert.ok(robots.includes("Sitemap: https://pumasi.ai/sitemap.xml"));
});

test("the sitemap lists every canonical page and no Markdown twin", () => {
  const sitemap = byPath.get("sitemap.xml") as string;
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] as string);
  assert.ok(locs.includes("https://pumasi.ai/"));
  assert.ok(locs.includes("https://pumasi.ai/products/pumasi-booking/"));
  assert.ok(locs.includes("https://pumasi.ai/blog/"));
  for (const loc of locs) assert.doesNotMatch(loc, /\.md$/);
  assert.equal(new Set(locs).size, locs.length, "the sitemap repeats a URL");
});

test("the feed is Atom, dated, and carries full post text", () => {
  const feed = byPath.get("feed.xml") as string;
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/);
  const entries = [...feed.matchAll(/<entry>/g)].length;
  assert.ok(entries >= 3, `expected at least 3 entries, got ${entries}`);
  assert.match(feed, /<content type="text">[\s\S]{500,}/);
  assert.match(feed, /<published>\d{4}-\d{2}-\d{2}T/);
});

test("the Markdown twin carries the canonical URL and the body", async () => {
  const twin = await readFile(join(out, "products/pumasi-booking.md"), "utf8");
  assert.match(twin, /^---\n/);
  assert.match(twin, /url: https:\/\/pumasi\.ai\/products\/pumasi-booking\//);
  assert.match(twin, /content_licence: Apache-2\.0/);
  assert.ok(twin.includes("read for busy times"));
});

test("a product twin claims a product licence only when its card states one", async () => {
  // pumasi-web's own content is Apache-2.0 and every twin says so. That is not
  // a statement about the product the card describes. pumasi-booking and
  // pumasi-sign carry no LICENSE file on their default branch, so their twins
  // must not hand a crawler a licence nobody granted.
  for (const slug of ["pumasi-booking", "pumasi-sign"]) {
    const twin = await readFile(join(out, `products/${slug}.md`), "utf8");
    assert.match(twin, /content_licence: Apache-2\.0/, slug);
    assert.ok(!/product_licence:/.test(twin), `${slug} twin claims a product licence`);
  }
  const tunnel = await readFile(join(out, "products/pumasi-tunnel.md"), "utf8");
  assert.match(tunnel, /product_licence: "Apache-2\.0"/);
});

test("a product states its limitation before its features", () => {
  const page = byPath.get("products/pumasi-booking/index.html") as string;
  const limitation = page.indexOf("no lawyer has reviewed its privacy pack");
  const firstHeading = page.indexOf("<h2");
  assert.ok(limitation > 0, "the limitation is not on the page at all");
  assert.ok(limitation < firstHeading, "the limitation appears after the first section");
});

test("the theme is linked before the structural layer that reads its tokens", () => {
  for (const file of htmlPages()) {
    const theme = file.contents.indexOf('href="/theme.css"');
    const base = file.contents.indexOf('href="/base.css"');
    assert.ok(theme > 0 && base > 0, `${file.path} is missing a stylesheet`);
    assert.ok(theme < base, `${file.path} links base.css before theme.css`);
  }
});

test("illustrations are inline and theme-aware", () => {
  const home = byPath.get("index.html") as string;
  assert.match(home, /<svg[^>]*viewBox/, "the home page has no inline illustration");
  assert.match(home, /var\(--art-/, "illustrations do not use theme tokens");
});

/**
 * This assertion used to be `doesNotMatch(/<img /)`, on the reasoning that an
 * `<img>` cannot follow the colour scheme. That is true of an image that does
 * not try to: a custom property does not cross into an `<img>`'s own document.
 * A brand mark carries its own `prefers-color-scheme` block and its own
 * literals for exactly this reason, so it does follow the scheme — and the
 * blanket ban would have kept the marks off the page rather than keeping bad
 * images off it. The rule is now the property that was actually wanted.
 */
test("a linked image is either a themed brand mark or a screenshot", async () => {
  for (const [path, contents] of byPath) {
    if (!path.endsWith(".html")) continue;
    for (const m of (contents as string).matchAll(/<img [^>]*src="([^"]+)"/g)) {
      const src = m[1] as string;
      // A screenshot is evidence of what the software actually renders. It
      // cannot follow the reader's scheme and it is not supposed to: repainting
      // a screenshot would make it stop being evidence.
      if (src.startsWith("/screenshots/")) continue;

      // Everything else is a drawing, and a drawing follows the page.
      assert.match(src, /^\/brand\/[a-z-]+\.svg$/, `${path} links ${src}, which is neither a brand SVG nor a screenshot`);
      const svg = await readFile(join("assets", src.replace(/^\//, "")), "utf8");
      assert.match(
        svg,
        /@media \(prefers-color-scheme: dark\)/,
        `${src} is linked as an <img> but has no dark scheme, so it cannot follow the page`,
      );
      assert.match(svg, /var\(--[a-z-]+, #[0-9a-f]{6}\)/, `${src} has no literal fallback for the <img> case`);
    }
  }
});
