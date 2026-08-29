import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  byDateDesc, byOrderThenTitle, markdownPathFor, outputHtmlPath,
  outputMarkdownPath, urlPathFor,
} from "../src/content.js";
import type { Doc } from "../src/types.js";

const doc = (slug: string, matter: Partial<Doc["matter"]>): Doc => ({
  kind: "post", slug, source: `${slug}.md`, body: "x",
  matter: { title: slug, description: "d", ...matter },
});

test("URLs are directory-style with a trailing slash", () => {
  assert.equal(urlPathFor(""), "/");
  assert.equal(urlPathFor("about"), "/about/");
  assert.equal(urlPathFor("products/pumasi-booking"), "/products/pumasi-booking/");
});

test("the Markdown twin is the same path with .md", () => {
  assert.equal(markdownPathFor(""), "/index.md");
  assert.equal(markdownPathFor("about"), "/about.md");
  assert.equal(markdownPathFor("blog/x"), "/blog/x.md");
});

test("output paths put HTML in a directory and Markdown beside it", () => {
  assert.equal(outputHtmlPath(""), "index.html");
  assert.equal(outputHtmlPath("about"), "about/index.html");
  assert.equal(outputMarkdownPath("about"), "about.md");
});

test("posts sort newest first, with a stable tiebreak", () => {
  const sorted = [
    doc("b", { date: "2026-08-29" }),
    doc("a", { date: "2026-08-29" }),
    doc("c", { date: "2026-08-28" }),
  ].sort(byDateDesc);
  assert.deepEqual(sorted.map((d) => d.slug), ["a", "b", "c"]);
});

test("pages sort by explicit order, then title", () => {
  const sorted = [
    doc("z", { order: 2, title: "Z" }),
    doc("a", { title: "A" }),
    doc("y", { order: 1, title: "Y" }),
  ].sort(byOrderThenTitle);
  assert.deepEqual(sorted.map((d) => d.slug), ["y", "z", "a"]);
});
