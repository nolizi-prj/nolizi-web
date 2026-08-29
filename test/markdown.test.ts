import { strict as assert } from "node:assert";
import { test } from "node:test";
import { renderMarkdown, slugify, stripTags } from "../src/markdown.js";

test("headings get stable, unique, human-readable anchors", () => {
  const { html, headings } = renderMarkdown("## What it costs\n\n### What it costs\n");
  assert.deepEqual(headings.map((h) => h.id), ["what-it-costs", "what-it-costs-2"]);
  assert.match(html, /<h2 id="what-it-costs">/);
  assert.match(html, /<h3 id="what-it-costs-2">/);
});

test("heading anchors are per-document, not shared between documents", () => {
  const a = renderMarkdown("## Same\n");
  const b = renderMarkdown("## Same\n");
  assert.deepEqual(a.headings[0]?.id, b.headings[0]?.id);
});

test("external links are marked, internal links are left alone", () => {
  const { html } = renderMarkdown("[out](https://example.com) and [in](/about/)\n");
  assert.match(html, /href="https:\/\/example.com" rel="noopener noreferrer external"/);
  assert.match(html, /<a href="\/about\/">in<\/a>/);
});

test("tables are wrapped so they scroll instead of widening the page", () => {
  const { html } = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |\n");
  assert.match(html, /<div class="table-scroll"[^>]*>\s*<table>/);
});

test("code is escaped and never interpreted as markup", () => {
  const { html } = renderMarkdown("```\n<script>alert(1)</script>\n```\n");
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test("images get lazy loading and an alt attribute", () => {
  const { html } = renderMarkdown("![a field](/x.svg)\n");
  assert.match(html, /alt="a field"/);
  assert.match(html, /loading="lazy"/);
});

test("slugify strips punctuation, accents and case", () => {
  assert.equal(slugify("What a Signed-In Tour Is Worth!"), "what-a-signed-in-tour-is-worth");
  assert.equal(slugify("Café  —  résumé"), "cafe-resume");
});

test("stripTags recovers readable text for word counts", () => {
  const text = stripTags("<p>One &amp; two</p><p>Three</p>");
  assert.equal(text, "One & two\nThree");
});
