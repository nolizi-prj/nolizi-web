import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { OutputFile } from "./types.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "site");
const ASSETS = join(ROOT, "assets");
const LOGOS = join(ASSETS, "logos");
const description = "A collection of the software your business runs on — scheduling, signatures, forms, and more — with a leading set of features, for free or at a fraction of the usual cost.";

const products = [
  ["calendar", "Nolizi Calendar", "Share a link, get booked. Scheduling without the back-and-forth."],
  ["sign", "Nolizi Sign", "Legally-binding e-signatures with a clean audit trail."],
  ["forms", "Nolizi Forms", "Forms and intake flows that route answers where your team works."],
  ["tunnel", "Nolizi Tunnel", "Move files and data securely from one side to the other."],
] as const;

function productCards(): string {
  return products.map(([slug, name, copy]) => `<article class="product-card">
          ${slug === "calendar"
            ? '<span class="product-mark live-calendar" aria-hidden="true"><i></i><i></i><i></i><span><small data-calendar-month>SEP</small><b data-calendar-day>04</b></span></span>'
            : `<img class="product-mark" src="/logos/nolizi-${slug}.svg" width="96" height="70" alt="">`}
          <h2>${name}${slug === "forms" ? '<span class="status">Coming soon</span>' : ""}</h2>
          <p>${copy}</p>
        </article>`).join("\n        ");
}

function page(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nolizi — Collection of Knowledge</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#fdfdfb">
  <link rel="canonical" href="https://nolizi.com/">
  <meta property="og:title" content="Nolizi — Collection of Knowledge">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://nolizi.com/">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <script>document.addEventListener("DOMContentLoaded",()=>{const d=new Date();document.querySelector("[data-calendar-month]").textContent=d.toLocaleString("en",{month:"short"}).toUpperCase();document.querySelector("[data-calendar-day]").textContent=String(d.getDate()).padStart(2,"0")})</script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="mandala" aria-hidden="true"></div>
  <div class="page-shell">
    <header class="masthead"><a class="brand" href="/" aria-label="Nolizi home"><img src="/logo.svg" width="205" height="80" alt="Nolizi"></a></header>
    <main id="main" class="home">
      <section class="intro" aria-labelledby="page-title">
        <h1 id="page-title">Collection of <em>Knowledge</em>,<br>Built by Nolizi</h1>
        <p>${description}</p>
      </section>
      <section class="products" aria-label="Nolizi products">
        ${productCards()}
      </section>
    </main>
    <footer class="footer">
      <div class="copyright"><img src="/favicon.svg" width="24" height="24" alt=""><span>© 2026 Nolizi. Collection of Knowledge.</span></div>
      <nav aria-label="Footer"><a href="mailto:hello@nolizi.com">Contact</a><a href="mailto:hello@nolizi.com?subject=Nolizi%20privacy">Privacy</a></nav>
    </footer>
  </div>
</body>
</html>`;
}

function notFound(): string {
  return page()
    .replace('<main id="main" class="home">', '<main id="main" class="not-found">')
    .replace(/<section class="intro"[\s\S]*?<\/section>\s*<section class="products"[\s\S]*?<\/section>/, '<section><p class="error-code">404</p><h1>Nothing collected here.</h1><p><a href="/">Return to Nolizi</a></p></section>')
    .replace('<meta name="description"', '<meta name="robots" content="noindex">\n  <meta name="description"');
}

export async function build(outDir = OUT): Promise<OutputFile[]> {
  const files: OutputFile[] = [
    { path: "index.html", contents: page() },
    { path: "404.html", contents: notFound() },
    { path: "robots.txt", contents: "User-agent: *\nAllow: /\nSitemap: https://nolizi.com/sitemap.xml\n" },
    { path: "sitemap.xml", contents: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://nolizi.com/</loc></url></urlset>\n' },
  ];
  await rm(outDir, { recursive: true, force: true });
  await mkdir(join(outDir, "logos"), { recursive: true });
  for (const file of files) await writeFile(join(outDir, file.path), file.contents, "utf8");
  for (const asset of ["styles.css", "logo.svg", "favicon.svg", "mandala.gif", "mandala-static.svg"]) {
    await copyFile(join(ASSETS, asset), join(outDir, asset));
  }
  for (const [slug] of products) {
    await copyFile(join(LOGOS, `nolizi-${slug}.svg`), join(outDir, "logos", `nolizi-${slug}.svg`));
  }
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const files = await build();
  const css = await readFile(join(ASSETS, "styles.css"), "utf8");
  process.stdout.write(`built Nolizi — ${files.length} documents, ${(css.length / 1024).toFixed(1)} kB CSS → ${OUT}\n`);
}
