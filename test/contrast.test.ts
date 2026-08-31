/**
 * The contrast floor, computed rather than remembered.
 *
 * DESIGN_SYSTEM.md §4 calls AA "the floor and not negotiable" and says every
 * ratio in it is measured. Until this file existed, both of those were claims
 * about a person's diligence. They were not true twice: three published ratios
 * were off by a tenth or two, and — worse — `.terminal` inverted its ground to
 * `--ink-strong` in light while `.ok`, `.warn` and the `$` prompt kept values
 * that had only ever been measured against paper. Sign's prompt landed at
 * 2.88:1. Nobody caught it because nobody had rendered a light terminal.
 *
 * So the floor is arithmetic now. Every pair listed below is recomputed from
 * the stylesheets on every run, and an inverted surface is resolved the way a
 * browser resolves it — its own declarations first, the page's underneath.
 *
 * The list is not automatic, and that is this file's own limit: a pair that
 * nobody adds here is a pair nobody checks. Adding a colour to a surface means
 * adding its pair.
 */

import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

/** WCAG 2.x relative luminance. */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (linear[0] as number) + 0.7152 * (linear[1] as number) + 0.0722 * (linear[2] as number);
}

function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Every `--token: #hex` declaration in one block of CSS, in source order. */
function tokensIn(css: string): Map<string, string> {
  const found = new Map<string, string>();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    found.set(m[1] as string, (m[2] as string).toLowerCase());
  }
  return found;
}

/** The body of the first block opened by `opener`, brace-matched. */
function blockAfter(css: string, opener: string): string {
  const at = css.indexOf(opener);
  assert.notEqual(at, -1, `could not find ${opener}`);
  let depth = 0;
  const from = css.indexOf("{", at);
  for (let i = from; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(from + 1, i);
    }
  }
  throw new Error(`unterminated block after ${opener}`);
}

type Scheme = Map<string, string>;

interface Surfaces {
  light: Scheme;
  dark: Scheme;
  /** Only what `.terminal` declares for itself — NOT seeded from a scheme. */
  terminalOwn: Scheme;
  /** The token `.terminal`'s `background` actually resolves through. */
  terminalGround: string;
}

async function surfaces(): Promise<Surfaces> {
  const theme = await readFile("assets/theme.css", "utf8");
  const product = await readFile("assets/brand/product-theme.css", "utf8");

  const light = tokensIn(blockAfter(theme, ":root {"));
  const dark = new Map(light);
  for (const [k, v] of tokensIn(blockAfter(theme, "@media (prefers-color-scheme: dark)"))) {
    dark.set(k, v);
  }

  const terminalBlock = blockAfter(product, ".terminal {");
  const background = /background:\s*var\((--[a-z0-9-]+)\)/.exec(terminalBlock);
  assert.ok(background, ".terminal's background is not a var(); this test cannot find its ground");

  return {
    light,
    dark,
    terminalOwn: tokensIn(terminalBlock),
    terminalGround: background[1] as string,
  };
}

/**
 * How a token actually resolves inside an inverted surface: the surface's own
 * declaration if it has one, otherwise the page's — which is precisely the
 * failure mode being guarded against. Seeding the surface map from the page
 * instead would make every token look restated and the guard could never fire.
 */
function resolve(token: string, own: Scheme, page: Scheme): string | undefined {
  return own.get(token) ?? page.get(token);
}

/** foreground token · background token · floor · why this pair is on screen. */
const TEXT_PAIRS: Array<[string, string, string]> = [
  ["--ink", "--paper", "body text"],
  ["--ink-strong", "--paper", "headings"],
  ["--ink-muted", "--paper", "secondary prose, card body, table cells"],
  ["--ink", "--paper-raised", "body text on a card"],
  ["--ink-muted", "--paper-sunken", "text in a sunken block"],
  ["--accent", "--paper", "links, .more, the prompt caret"],
  ["--ok", "--paper", "verified text"],
  ["--warn", "--paper", "provisional text"],
  ["--danger", "--paper", ".field > .error"],
  ["--accent", "--accent-soft", ".callout-note, .badge-beta"],
  ["--warn", "--warn-soft", ".callout-warn, .badge-alpha"],
  ["--ok", "--ok-soft", ".callout-good"],
  ["--danger", "--danger-soft", ".callout-danger"],
  ["--accent-contrast", "--accent", ".button label"],
  ["--accent-contrast", "--ok", ".badge-launched label"],
  ["--paper", "--danger", ".button-danger on hover"],
  ["--signal-sign", "--paper", "Sign identity text"],
  ["--signal-booking", "--paper", "Booking identity text"],
  ["--signal-tunnel", "--paper", "Tunnel identity text"],
];

/** A boundary is not text: WCAG 1.4.11 asks 3:1, not 4.5:1. */
const BOUNDARY_PAIRS: Array<[string, string, string]> = [
  ["--line-control", "--paper", ".input, .slot, .button-quiet on the page"],
  ["--line-control", "--paper-raised", ".input, .slot inside a card"],
  ["--ink-faint", "--paper", "non-essential metadata — licensed below 4.5:1"],
];

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3.0;

for (const [name, pick] of [
  ["light", (s: Surfaces) => s.light],
  ["dark", (s: Surfaces) => s.dark],
] as const) {
  test(`every text pair clears AA in the ${name} scheme`, async () => {
    const scheme = pick(await surfaces());
    for (const [fg, bg, why] of TEXT_PAIRS) {
      const f = scheme.get(fg);
      const b = scheme.get(bg);
      assert.ok(f && b, `${name}: ${fg} or ${bg} is not a hex token in this scheme`);
      const r = ratio(f, b);
      assert.ok(
        r >= AA_TEXT,
        `${name}: ${fg} (${f}) on ${bg} (${b}) is ${r.toFixed(2)}:1, below ${AA_TEXT} — ${why}`,
      );
    }
  });

  test(`every boundary clears 3:1 in the ${name} scheme`, async () => {
    const scheme = pick(await surfaces());
    for (const [fg, bg, why] of BOUNDARY_PAIRS) {
      const f = scheme.get(fg) as string;
      const b = scheme.get(bg) as string;
      const r = ratio(f, b);
      assert.ok(
        r >= AA_NON_TEXT,
        `${name}: ${fg} (${f}) on ${bg} (${b}) is ${r.toFixed(2)}:1, below ${AA_NON_TEXT} — ${why}`,
      );
    }
  });
}

/**
 * The terminal, checked in BOTH schemes, because it is dark in both — and
 * checked the way the browser resolves it, not the way the file reads.
 *
 * This is the exact regression that shipped: the ground inverted and the ink
 * did not follow. Two things make it catchable, and an earlier version of this
 * test had neither, so it stayed green when the original defect was pasted
 * back in:
 *
 *  1. **The ground comes from the `background` declaration**, not from a token
 *     name assumed here. Move the ground to a different token and this follows
 *     it; assume `--paper-sunken` and it measures a pair that is not on screen.
 *  2. **`terminalOwn` holds only what `.terminal` declares**, and anything it
 *     does not declare falls through to the PAGE's value — which is what the
 *     browser does and what made the defect a defect. Seeding the map from the
 *     light scheme, as the first version did, made every token look restated.
 */
for (const scheme of ["light", "dark"] as const) {
  test(`the terminal clears AA on its own ground, on a ${scheme} page`, async () => {
    const s = await surfaces();
    const page = s[scheme];
    const ground = resolve(s.terminalGround, s.terminalOwn, page);
    assert.ok(ground, `.terminal's ground ${s.terminalGround} resolves to nothing`);
    for (const token of [
      "--ink", "--ink-muted", "--ok", "--warn", "--accent", "--danger",
      "--signal-sign", "--signal-booking", "--signal-tunnel",
    ]) {
      const fg = resolve(token, s.terminalOwn, page);
      assert.ok(fg, `${token} resolves to nothing inside .terminal`);
      const r = ratio(fg, ground);
      assert.ok(
        r >= AA_TEXT,
        `.terminal on a ${scheme} page: ${token} (${fg}) on ${s.terminalGround} (${ground}) ` +
          `is ${r.toFixed(2)}:1, below ${AA_TEXT}`,
      );
    }
  });
}

/**
 * The signals are a family because they share a contrast band, not because
 * they share a hue. If one drifts out of the band it stops reading as a
 * sibling.
 *
 * The bounds here are deliberately WIDER than the 5.75–6.70 / 8.99–10.58 that
 * §4 publishes: this guards the property — the three stay together — and not
 * the current values, which would make every retune a test edit. §4's exact
 * figures are documentation of where they sit today, and are the numbers to
 * recompute when a signal changes.
 */
test("the three product signals stay inside one contrast band", async () => {
  const { light, dark } = await surfaces();
  const signals = ["--signal-sign", "--signal-booking", "--signal-tunnel"];
  for (const [name, scheme, lo, hi] of [
    ["light", light, 5.5, 7.0],
    ["dark", dark, 8.5, 11.0],
  ] as const) {
    const ground = scheme.get("--paper") as string;
    for (const s of signals) {
      const r = ratio(scheme.get(s) as string, ground);
      assert.ok(
        r >= lo && r <= hi,
        `${name}: ${s} is ${r.toFixed(2)}:1, outside the published ${lo}–${hi} band`,
      );
    }
  }
});
