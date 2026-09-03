import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { OutputFile } from "./types.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "site");
const ASSETS = join(ROOT, "assets");
const description = "A collection of the software your business runs on — scheduling, signatures, forms, and more — with leading features at a fraction of the usual cost.";

function page(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nolizi — Collection of Knowledge</title>
  <meta name="description" content="${description}"><meta name="theme-color" content="#fdfdfb">
  <link rel="canonical" href="https://nolizi.com/">
  <meta property="og:title" content="Nolizi — Collection of Knowledge"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="https://nolizi.com/">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a><div class="mandala" aria-hidden="true"></div>
  <div class="site-shell">
    <nav class="nav wrap" aria-label="Primary">
      <a class="brand" href="/" aria-label="Nolizi home"><img src="/logo.svg" width="120" height="30" alt="Nolizi"></a>
      <div class="nav-links"><a href="#products">Products</a><a href="#how">How it works</a><a href="#pricing">Pricing</a></div>
      <a class="button button-ink nav-cta" href="#cta">Get started</a>
    </nav>
    <main id="main">
      <header class="hero wrap">
        <h1>Collection of <em>Knowledge</em>,<br>Built by Nolizi</h1>
        <p class="hero-copy">${description}</p>
        <div class="actions"><a class="button" href="#cta">Get started</a><a class="text-link" href="#products">Explore the collection <span aria-hidden="true">→</span></a></div>
      </header>
      <section class="section wash" id="products"><div class="wrap">
        <p class="eyebrow">The collection</p><h2>One subscription. The tools you already pay six vendors for.</h2>
        <p class="section-copy">We focus on network-based growth products — the everyday software teams share with people outside their walls.</p>
        <div class="cards">
          <article class="card"><span class="glyph">SC</span><h3>Nolizi Schedule</h3><p>Share a link, get booked. Calendar scheduling without the back-and-forth.</p></article>
          <article class="card"><span class="glyph">SG</span><h3>Nolizi Sign</h3><p>Legally binding e-signatures with a clean audit trail, sent in seconds.</p></article>
          <article class="card"><span class="glyph">FM</span><h3>Nolizi Forms</h3><p>Forms and intake flows that route answers where your team works.</p></article>
          <article class="card"><span class="glyph">DC</span><h3>Nolizi Docs</h3><p>Shareable documents and proposals that track who read what, when.</p></article>
        </div>
      </div></section>
      <section class="section wrap" id="how">
        <p class="eyebrow">How it works</p><h2>Leading software, rebuilt the fast way.</h2>
        <div class="steps">
          <article class="step"><span>01</span><h3>Start from open source</h3><p>We build on proven open foundations instead of reinventing them, inspired by the best software in each category.</p></article>
          <article class="step"><span>02</span><h3>Accelerate with AI</h3><p>AI-assisted development lets a small team ship in weeks what used to take years.</p></article>
          <article class="step"><span>03</span><h3>Pass the savings on</h3><p>Lower build cost becomes lower price. The whole collection for less than one incumbent seat.</p></article>
        </div>
      </section>
      <section class="section wash" id="pricing"><div class="wrap pricing-grid">
        <div><p class="eyebrow">Pricing</p><h2>Low cost, by design.</h2><p class="section-copy">Open foundations and AI-speed development mean we don’t carry the cost structure of the incumbents — and neither do you. One plan, every tool in the collection.</p></div>
        <article class="price-card"><p class="price-name">Everything plan</p><p class="price"><strong>$12</strong><span>/ user / month</span></p><ul><li>Every product in the collection</li><li>Unlimited external recipients</li><li>New tools added as we ship them</li></ul><a class="button button-ink" href="#cta">Start free</a></article>
      </div></section>
      <section class="cta wrap" id="cta"><p class="eyebrow">Begin here</p><h2>Start with one tool.<br>Keep the whole field.</h2><p>Try any product in the collection free — no card, no call.</p><a class="button" href="mailto:hello@nolizi.com?subject=Get%20started%20with%20Nolizi">Get started</a></section>
    </main>
    <footer class="footer"><div class="wrap footer-inner"><a class="brand" href="/"><img src="/logo.svg" width="112" height="28" alt="Nolizi"></a><nav aria-label="Footer"><a href="#products">Products</a><a href="#how">How it works</a><a href="#pricing">Pricing</a></nav><p>© 2026 Nolizi. Center of Knowledge Field.</p></div></footer>
  </div>
</body></html>`;
}

function notFound(): string {
  return page().replace('<main id="main">', '<main id="main"><section class="cta wrap"><p class="eyebrow">404</p><h1>Nothing planted here.</h1><p><a href="/">Return to Nolizi</a></p></section><div hidden>').replace('</main>', '</div></main>').replace('<meta name="description"', '<meta name="robots" content="noindex"><meta name="description"');
}

export async function build(outDir = OUT): Promise<OutputFile[]> {
  const files: OutputFile[] = [
    { path: "index.html", contents: page() }, { path: "404.html", contents: notFound() },
    { path: "robots.txt", contents: "User-agent: *\nAllow: /\nSitemap: https://nolizi.com/sitemap.xml\n" },
    { path: "sitemap.xml", contents: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://nolizi.com/</loc></url></urlset>\n' },
  ];
  await rm(outDir, { recursive: true, force: true }); await mkdir(outDir, { recursive: true });
  for (const file of files) await writeFile(join(outDir, file.path), file.contents, "utf8");
  for (const asset of ["styles.css", "logo.svg", "favicon.svg", "mandala.gif", "mandala-static.svg"]) {
    await copyFile(join(ASSETS, asset), join(outDir, asset));
  }
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const files = await build(); const css = await readFile(join(ASSETS, "styles.css"), "utf8");
  process.stdout.write(`built Nolizi — ${files.length} documents, ${(css.length / 1024).toFixed(1)} kB CSS → ${OUT}\n`);
}
