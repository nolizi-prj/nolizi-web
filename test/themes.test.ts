/**
 * Every theme must be able to dress the whole site. These tests build the real
 * site once per theme, so a token a theme forgot to define shows up here rather
 * than as an invisible colour on a page nobody checked.
 */

import { strict as assert } from "node:assert";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { build } from "../src/build.js";
import { THEMES, themeById } from "../src/themes.js";

/** Tokens base.css consumes. A theme that omits one renders unstyled. */
const REQUIRED_TOKENS = [
  "--paper", "--paper-raised", "--paper-sunken", "--line", "--line-strong",
  "--ink-faint", "--ink-muted", "--ink", "--ink-strong",
  "--accent", "--accent-strong", "--accent-soft", "--accent-line", "--accent-contrast",
  "--warn", "--warn-soft", "--warn-line", "--ok", "--ok-soft", "--ok-line",
  "--art-ground", "--art-1", "--art-2", "--art-3", "--art-4", "--art-ink",
  "--font-display", "--font-body", "--font-mono",
  "--text-xs", "--text-sm", "--text-base", "--text-md", "--text-lg",
  "--text-xl", "--text-2xl", "--text-3xl",
  "--leading-tight", "--leading-snug", "--leading-body",
  "--tracking-display", "--tracking-caps", "--weight-display",
  "--measure", "--measure-wide",
  "--space-3xs", "--space-2xs", "--space-xs", "--space-sm", "--space-md",
  "--space-lg", "--space-xl", "--space-2xl", "--space-3xl",
  "--gutter", "--page-max",
  "--radius-sm", "--radius", "--radius-lg", "--radius-pill",
  "--border", "--border-strong", "--rule",
  "--shadow-sm", "--shadow", "--shadow-lg",
  "--ease", "--duration", "--focus-ring", "--focus-offset",
];

test("every theme defines the whole token vocabulary", async () => {
  for (const theme of THEMES) {
    const css = await readFile(`assets/themes/${theme.id}.css`, "utf8");
    for (const token of REQUIRED_TOKENS) {
      assert.match(css, new RegExp(`\\${token}\\s*:`), `${theme.id}.css is missing ${token}`);
    }
  }
});

test("no theme leaves a light-only palette: each defines a dark scheme", async () => {
  for (const theme of THEMES) {
    const css = await readFile(`assets/themes/${theme.id}.css`, "utf8");
    assert.match(css, /@media \(prefers-color-scheme: dark\)/, `${theme.id}.css has no dark scheme`);
  }
});

test("the structural layer holds no colour of its own", async () => {
  const base = await readFile("assets/base.css", "utf8");
  const stripped = base
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // The print block is exempt on purpose: paper is white and ink is black
    // whichever theme is on screen, so those two values are a fact about
    // printing rather than a design decision a theme should own.
    .replace(/@media print \{[\s\S]*?\n\}/g, "");
  assert.doesNotMatch(stripped, /#[0-9a-f]{3,8}\b/i, "base.css contains a hex colour");
  assert.doesNotMatch(stripped, /\brgba?\(/i, "base.css contains an rgb() colour");
});

test("each theme builds the entire site", async () => {
  for (const theme of THEMES) {
    const out = await mkdtemp(join(tmpdir(), `pumasi-${theme.id}-`));
    try {
      const files = await build(out, { themeId: theme.id });
      const html = files.filter((f) => f.path.endsWith(".html"));
      assert.ok(html.length >= 10, `${theme.id} produced only ${html.length} pages`);
      for (const file of html) {
        assert.ok(
          file.contents.includes(`href="/themes/${theme.id}.css"`),
          `${theme.id}: ${file.path} does not link its own theme`,
        );
      }
      const favicon = files.find((f) => f.path === "favicon.svg");
      assert.ok(favicon, `${theme.id} produced no favicon`);
      // A favicon gets no page CSS, so it must not depend on custom properties.
      assert.doesNotMatch(favicon.contents, /var\(--/, `${theme.id} favicon uses a CSS variable`);
    } finally {
      await rm(out, { recursive: true, force: true });
    }
  }
});

test("an unknown theme fails loudly rather than falling back", () => {
  assert.throws(() => themeById("nope"), /unknown theme "nope"/);
});
