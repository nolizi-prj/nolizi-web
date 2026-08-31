/**
 * The theme contract.
 *
 * `base.css` reads tokens it does not define. If the theme stops supplying one,
 * the affected rule silently falls back to nothing and the page renders
 * unstyled in a way that is easy to miss on the pages nobody rechecks. These
 * tests make that a build failure instead.
 */

import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

/** Every token base.css consumes. */
const REQUIRED_TOKENS = [
  "--paper", "--paper-raised", "--paper-sunken", "--line", "--line-strong",
  "--ink-faint", "--ink-muted", "--ink", "--ink-strong",
  "--accent", "--accent-strong", "--accent-soft", "--accent-line", "--accent-contrast",
  "--warn", "--warn-soft", "--warn-line", "--ok", "--ok-soft", "--ok-line",
  "--danger", "--danger-soft", "--danger-line",
  "--signal", "--signal-soft", "--signal-line",
  "--signal-sign", "--signal-sign-soft", "--signal-sign-line",
  "--signal-booking", "--signal-booking-soft", "--signal-booking-line",
  "--signal-tunnel", "--signal-tunnel-soft", "--signal-tunnel-line",
  "--art-ground", "--art-1", "--art-2", "--art-3", "--art-4", "--art-ink",
  "--font-display", "--font-body", "--font-mono", "--font-ui",
  "--text-xs", "--text-sm", "--text-base", "--text-md", "--text-lg",
  "--text-xl", "--text-2xl", "--text-3xl",
  "--leading-tight", "--leading-snug", "--leading-body",
  "--tracking-display", "--tracking-caps",
  "--weight-body", "--weight-medium", "--weight-strong", "--weight-display",
  "--measure", "--measure-wide",
  "--space-3xs", "--space-2xs", "--space-xs", "--space-sm", "--space-md",
  "--space-lg", "--space-xl", "--space-2xl", "--space-3xl",
  "--gutter", "--page-max",
  "--radius-sm", "--radius", "--radius-lg", "--radius-pill",
  "--border", "--border-strong", "--border-accent", "--control-line",
  "--line-control", "--rule", "--edge",
  "--elev-0", "--elev-1", "--elev-2", "--elev-3",
  "--elev-1-border", "--elev-2-border", "--elev-3-border",
  "--elev-1-ground", "--elev-2-ground", "--elev-3-ground",
  "--shadow-sm", "--shadow", "--shadow-lg",
  "--btn-pad-y", "--btn-pad-x", "--btn-pad-y-sm", "--btn-pad-x-sm",
  "--btn-pad-y-lg", "--btn-pad-x-lg",
  "--ease", "--duration", "--focus-ring", "--focus-offset",
  "--mark-size",
];

test("the theme defines every token the structural layer consumes", async () => {
  const css = await readFile("assets/theme.css", "utf8");
  for (const token of REQUIRED_TOKENS) {
    assert.match(css, new RegExp(`\\${token}\\s*:`), `theme.css is missing ${token}`);
  }
});

test("base.css consumes no token the theme does not define", async () => {
  const base = await readFile("assets/base.css", "utf8");
  const known = new Set(REQUIRED_TOKENS);
  const used = new Set([...base.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1] as string));
  for (const token of used) {
    assert.ok(known.has(token), `base.css uses ${token}, which is not in the theme contract`);
  }
});

test("the theme carries a real dark scheme", async () => {
  const css = await readFile("assets/theme.css", "utf8");
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  // A dark block that redefines only a colour or two is an inversion, not a
  // scheme; this one is expected to restate the whole ramp.
  const dark = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));
  for (const token of [
    "--paper", "--ink", "--accent", "--art-1",
    "--danger", "--signal-sign", "--signal-booking", "--signal-tunnel",
    "--line-control",
  ]) {
    assert.match(dark, new RegExp(`\\${token}\\s*:`), `dark scheme does not redefine ${token}`);
  }
});

test("the structural layer holds no colour of its own", async () => {
  const base = await readFile("assets/base.css", "utf8");
  const stripped = base
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // The print block is exempt on purpose: paper is white and ink is black
    // whichever scheme is on screen, so those two values are a fact about
    // printing rather than a design decision the theme should own.
    .replace(/@media print \{[\s\S]*?\n\}/g, "");
  assert.doesNotMatch(stripped, /#[0-9a-f]{3,8}\b/i, "base.css contains a hex colour");
  assert.doesNotMatch(stripped, /\brgba?\(/i, "base.css contains an rgb() colour");
});
