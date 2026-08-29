import { strict as assert } from "node:assert";
import { test } from "node:test";
import { coverArt, faviconSvg, heroArt, logoMark, plotArt } from "../src/render/art.js";

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
  const svg = faviconSvg();
  assert.doesNotMatch(svg, /var\(--/);
  assert.match(svg, /prefers-color-scheme: dark/);
  assert.match(svg, /^<svg /);
});
