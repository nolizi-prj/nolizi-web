import { strict as assert } from "node:assert";
import { test } from "node:test";
import { coverArt, faviconSvg, heroArt, logoMark, plotArt } from "../src/render/art.js";
import { THEMES, themeById } from "../src/themes.js";

test("seeded art is identical between builds", () => {
  assert.equal(plotArt("pumasi-booking"), plotArt("pumasi-booking"));
  assert.equal(coverArt("the-per-seat-tax"), coverArt("the-per-seat-tax"));
});

test("different pages get visibly different art", () => {
  assert.notEqual(plotArt("a"), plotArt("b"));
});

test("art uses theme tokens so one drawing serves light and dark", () => {
  for (const svg of [heroArt(), plotArt("x"), coverArt("y"), logoMark()]) {
    assert.match(svg, /var\(--/, "art hard-codes a colour instead of using a token");
  }
});

test("decorative art is hidden from assistive technology; described art is not", () => {
  assert.match(plotArt("x"), /aria-hidden="true"/);
  assert.match(heroArt(), /role="img"/);
  assert.match(heroArt(), /<title id=/);
});

test("the favicon is self-contained, since a favicon gets no page CSS", () => {
  for (const theme of THEMES) {
    const svg = faviconSvg(theme);
    assert.doesNotMatch(svg, /var\(--/, theme.id);
    assert.match(svg, /prefers-color-scheme: dark/, theme.id);
    assert.match(svg, /^<svg /, theme.id);
  }
});

test("each art style draws its own mark and hero", () => {
  const marks = THEMES.map((t) => logoMark(t.art));
  assert.equal(new Set(marks).size, marks.length, "two themes share a mark");
  const heroes = THEMES.map((t) => heroArt(t.art));
  assert.equal(new Set(heroes).size, heroes.length, "two themes share a hero drawing");
});

test("a square theme gets square art", () => {
  const square = themeById("press");
  assert.equal(square.artRadius, 0);
  assert.doesNotMatch(plotArt("x", 560, 240, 0.9, square.artRadius), /<circle/);
});
