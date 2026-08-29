import { strict as assert } from "node:assert";
import { test } from "node:test";
import { parseFile, FrontMatterError } from "../src/frontmatter.js";

test("parses scalars, quotes, booleans and numbers", () => {
  const { data, body } = parseFile(
    ['---', 'title: Plain title', 'quoted: "has: a colon"', 'draft: true',
     'order: 3', 'ratio: 1.5', '---', '', 'Body text.'].join("\n"),
  );
  assert.equal(data.title, "Plain title");
  assert.equal(data.quoted, "has: a colon");
  assert.equal(data.draft, true);
  assert.equal(data.order, 3);
  assert.equal(data.ratio, 1.5);
  assert.equal(body.trim(), "Body text.");
});

test("parses flow and block sequences", () => {
  const { data } = parseFile(
    ['---', 'tags: [a, b, "c d"]', 'list:', '  - one', '  - "two"', '---', 'x'].join("\n"),
  );
  assert.deepEqual(data.tags, ["a", "b", "c d"]);
  assert.deepEqual(data.list, ["one", "two"]);
});

test("a file with no front matter is all body", () => {
  const { data, body } = parseFile("# Just markdown\n");
  assert.deepEqual(data, {});
  assert.equal(body, "# Just markdown\n");
});

test("comments and blank lines are ignored", () => {
  const { data } = parseFile(['---', '# a comment', '', 'title: T  # trailing', '---', 'x'].join("\n"));
  assert.equal(data.title, "T");
  assert.equal(Object.keys(data).length, 1);
});

test("a # inside a quoted value survives", () => {
  const { data } = parseFile(['---', 'title: "C# and F#"', '---', 'x'].join("\n"));
  assert.equal(data.title, "C# and F#");
});

// The parser's contract is that it never guesses. These are the cases where
// a lenient YAML parser would quietly pick an interpretation.
test("an unclosed fence raises", () => {
  assert.throws(() => parseFile("---\ntitle: T\nno close\n"), FrontMatterError);
});

test("a duplicate key raises rather than silently taking the last", () => {
  assert.throws(
    () => parseFile(['---', 'title: A', 'title: B', '---', 'x'].join("\n")),
    /duplicate key "title"/,
  );
});

test("an ambiguous unquoted colon raises rather than being split", () => {
  assert.throws(
    () => parseFile(['---', 'title: Pumasi: a commons', '---', 'x'].join("\n")),
    /quote it/,
  );
});

test("a key with neither a value nor a list raises", () => {
  assert.throws(() => parseFile(['---', 'title:', '---', 'x'].join("\n")), /no value/);
});

test("errors name the file and the line", () => {
  try {
    parseFile(['---', 'title: A', 'title: B', '---', 'x'].join("\n"), "content/pages/x.md");
    assert.fail("should have thrown");
  } catch (error) {
    assert.match(String(error), /content\/pages\/x\.md:3:/);
  }
});
