/**
 * The build.
 *
 * One pass over the content produces, for every document, both renderings:
 * the HTML a person reads and the Markdown a machine fetches. They are the same
 * `Doc`, so they cannot disagree — which is the whole design of this site.
 *
 * The build is strict. A missing description, a heading anchor that collides, a
 * shortcode that does not exist, an internal link that points nowhere: each one
 * stops the build with the file named. A site that ships broken links is a site
 * whose author found out from a search engine.
 */

import { existsSync } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  byDateDesc,
  byOrderThenTitle,
  loadContent,
  loadSiteConfig,
  markdownPathFor,
  outputHtmlPath,
  outputMarkdownPath,
  urlPathFor,
} from "./content.js";
import { renderMarkdown } from "./markdown.js";
import { renderLayout } from "./render/layout.js";
import {
  renderBlogIndex,
  renderHome,
  renderPage,
  renderPost,
  renderProduct,
  renderProductIndex,
} from "./render/pages.js";
import { renderStyleGuide } from "./render/styleguide.js";
import { assertNoStrayShortcodes, expandShortcodes } from "./render/shortcodes.js";
import { faviconSvg } from "./render/art.js";
import { DEFAULT_THEME, themeById, type Theme } from "./themes.js";
import { renderFeed } from "./emit/feed.js";
import { renderLlmsFull, renderLlmsIndex } from "./emit/llms.js";
import { renderMachineIndex, renderMarkdownTwin } from "./emit/machine.js";
import { renderRobots } from "./emit/robots.js";
import { renderSitemap, sitemapEntriesFor } from "./emit/sitemap.js";
import * as ld from "./seo/jsonld.js";
import type { Doc, OutputFile, RenderedDoc, SiteConfig } from "./types.js";

/**
 * The project root, found by walking up to the nearest package.json rather
 * than assuming a fixed depth. The compiled build lands in `dist/` for a real
 * build and in `.build/src/` for the test build; a hard-coded `..` is correct
 * for exactly one of those.
 */
function findRoot(from: string): string {
  let dir = from;
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`could not find a package.json above ${from}`);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = findRoot(HERE);
const CONTENT = join(ROOT, "content");
const ASSETS = join(ROOT, "assets");
const OUT = join(ROOT, "site");

/** The build date, fixed once so every artefact in one build agrees. */
function today(): string {
  const override = process.env.PUMASI_BUILD_DATE;
  if (override) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(override)) {
      throw new Error(`PUMASI_BUILD_DATE must be YYYY-MM-DD, got "${override}"`);
    }
    return override;
  }
  return new Date().toISOString().slice(0, 10);
}

export interface BuildOptions {
  /** Which design theme to render. Defaults to the registry default. */
  themeId?: string;
  /**
   * Review-only chrome injected above the masthead, built per URL so that
   * switching theme keeps you on the page you were reading. Absent in a real
   * build.
   */
  previewBar?: (urlPath: string) => string;
}

export async function build(outDir = OUT, options: BuildOptions = {}): Promise<OutputFile[]> {
  const theme = themeById(options.themeId ?? DEFAULT_THEME);
  const bar = (urlPath: string) => options.previewBar?.(urlPath);
  const site = await loadSiteConfig(CONTENT);
  const docs = await loadContent(CONTENT);
  const date = today();

  const rendered = docs.map((doc) => renderDoc(doc, theme));
  const rendering = new Map(rendered.map((doc) => [doc.slug, doc]));

  const pages = rendered
    .filter((d) => d.kind === "page" && d.slug !== "")
    .sort(byOrderThenTitle);
  const products = rendered.filter((d) => d.kind === "product").sort(byOrderThenTitle);
  const posts = rendered.filter((d) => d.kind === "post").sort(byDateDesc);
  const home = rendering.get("");
  if (!home) throw new Error("content/pages/index.md is required — it is the home page");

  const files: OutputFile[] = [];

  // `products` and `blog` are section intros: their prose is rendered inside
  // the generated index below, so they get a Markdown twin but no page of
  // their own. Emitting both would put the same text at one URL twice.
  const SECTION_INTROS = new Set(["products", "blog"]);

  for (const doc of rendered) {
    if (!SECTION_INTROS.has(doc.slug)) {
      files.push({
        path: outputHtmlPath(doc.slug),
        contents: htmlFor(site, doc, products, posts, theme, bar),
      });
    }
    files.push({ path: outputMarkdownPath(doc.slug), contents: renderMarkdownTwin(site, doc) });
  }

  // Section indexes. Their intros are optional pages; when one exists it is
  // rendered inside the index rather than at its own URL.
  const productIntro = rendering.get("products") ?? null;
  const blogIntro = rendering.get("blog") ?? null;

  files.push({
    path: "products/index.html",
    contents: renderLayout({
      site,
      theme,
      previewBar: bar("/products/"),
      title: productIntro?.matter.title ?? "Products",
      description:
        productIntro?.matter.description ??
        "Every product the Pumasi commons has built, and what each one cannot do yet.",
      urlPath: "/products/",
      markdownPath: productIntro ? markdownPathFor("products") : undefined,
      jsonLd: [
        ld.organisation(site),
        ld.breadcrumbs(site, [
          { name: "Home", path: "/" },
          { name: "Products", path: "/products/" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: `${site.url}/products/`,
          name: "Products",
          hasPart: products.map((p) => ({
            "@type": "SoftwareApplication",
            name: p.matter.title,
            url: `${site.url}${p.urlPath}`,
            applicationCategory: "BusinessApplication",
            isAccessibleForFree: true,
          })),
        },
      ],
      main: renderProductIndex(productIntro, products, theme),
    }),
  });

  files.push({
    path: "blog/index.html",
    contents: renderLayout({
      site,
      theme,
      previewBar: bar("/blog/"),
      title: blogIntro?.matter.title ?? "Writing",
      description:
        blogIntro?.matter.description ??
        "Updates from the commons, and what the market currently charges for the software it is rebuilding.",
      urlPath: "/blog/",
      markdownPath: blogIntro ? markdownPathFor("blog") : undefined,
      jsonLd: [
        ld.organisation(site),
        ld.blog(site, posts.map((p) => ({ doc: p, urlPath: p.urlPath }))),
        ld.breadcrumbs(site, [
          { name: "Home", path: "/" },
          { name: "Writing", path: "/blog/" },
        ]),
      ],
      main: renderBlogIndex(blogIntro, posts),
    }),
  });

  // Machine-readable surfaces.
  const sitemapDocs = [
    ...rendered.filter((d) => d.slug !== "products" && d.slug !== "blog"),
  ];
  const sitemapEntries = [
    ...sitemapEntriesFor(sitemapDocs, date),
    { urlPath: "/products/", lastmod: date, changefreq: "weekly" as const, priority: "0.9" },
    { urlPath: "/blog/", lastmod: date, changefreq: "weekly" as const, priority: "0.8" },
  ].sort((a, b) => a.urlPath.localeCompare(b.urlPath));

  files.push({ path: "sitemap.xml", contents: renderSitemap(site, sitemapEntries) });
  files.push({ path: "robots.txt", contents: renderRobots(site) });
  files.push({
    path: "feed.xml",
    contents: renderFeed(site, posts, posts[0]?.matter.updated ?? posts[0]?.matter.date ?? date),
  });
  files.push({
    path: "llms.txt",
    contents: renderLlmsIndex(site, { pages, products, posts }, date),
  });
  files.push({
    path: "llms-full.txt",
    contents: renderLlmsFull(site, [home, ...pages, ...products, ...posts], date),
  });
  files.push({ path: "index.json", contents: renderMachineIndex(site, rendered, date) });
  files.push({ path: "favicon.svg", contents: faviconSvg(theme) });
  files.push({ path: "404.html", contents: notFoundPage(site, theme, bar("/404.html")) });

  // Assets are copied rather than generated, so the link checker is told
  // about them explicitly instead of inferring a whole directory.
  const assetPaths = (await readdir(ASSETS, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => `/${relative(ASSETS, join(entry.parentPath, entry.name))}`);

  checkInternalLinks(files, assetPaths, site);

  await writeAll(outDir, files);
  await cp(ASSETS, outDir, { recursive: true });

  return files;
}

function renderDoc(doc: Doc, theme: Theme): RenderedDoc {
  const { html, headings, text } = renderMarkdown(doc.body);
  const context = doc.source;
  const expanded = expandShortcodes(html, context, theme.artRadius);
  assertNoStrayShortcodes(expanded, context);

  return {
    ...doc,
    urlPath: urlPathFor(doc.slug),
    markdownPath: markdownPathFor(doc.slug),
    html: expanded,
    headings,
    text,
  };
}

function htmlFor(
  site: SiteConfig,
  doc: RenderedDoc,
  products: RenderedDoc[],
  posts: RenderedDoc[],
  theme: Theme,
  bar: (urlPath: string) => string | undefined,
): string {
  const words = doc.text.split(/\s+/).filter(Boolean).length;
  const previewBar = bar(doc.urlPath);

  if (doc.slug === "") {
    return renderLayout({
      site,
      theme,
      previewBar,
      title: doc.matter.title,
      description: doc.matter.description,
      urlPath: "/",
      markdownPath: doc.markdownPath,
      jsonLd: [ld.organisation(site), ld.website(site)],
      main: renderHome(doc, products, posts, theme),
      bodyClass: "home",
    });
  }

  if (doc.kind === "product") {
    return renderLayout({
      site,
      theme,
      previewBar,
      title: doc.matter.title,
      description: doc.matter.description,
      urlPath: doc.urlPath,
      markdownPath: doc.markdownPath,
      updatedAt: doc.matter.updated,
      jsonLd: [
        ld.organisation(site),
        ld.softwareApplication(site, doc, doc.urlPath),
        ld.breadcrumbs(site, [
          { name: "Home", path: "/" },
          { name: "Products", path: "/products/" },
          { name: doc.matter.title, path: doc.urlPath },
        ]),
      ],
      main: renderProduct(doc, theme),
    });
  }

  if (doc.kind === "post") {
    return renderLayout({
      site,
      theme,
      previewBar,
      title: doc.matter.title,
      description: doc.matter.description,
      urlPath: doc.urlPath,
      markdownPath: doc.markdownPath,
      ogType: "article",
      publishedAt: doc.matter.date,
      updatedAt: doc.matter.updated,
      author: doc.matter.author ?? site.org.name,
      tags: doc.matter.tags,
      jsonLd: [
        ld.organisation(site),
        ld.blogPosting(site, doc, doc.urlPath, words),
        ld.breadcrumbs(site, [
          { name: "Home", path: "/" },
          { name: "Writing", path: "/blog/" },
          { name: doc.matter.title, path: doc.urlPath },
        ]),
      ],
      main: renderPost(doc, site, theme),
    });
  }

  // The style guide is generated from the theme so it cannot drift from it.
  const body = doc.slug === "design" ? doc.html + renderStyleGuide() : doc.html;

  return renderLayout({
    site,
    theme,
    previewBar,
    title: doc.matter.title,
    description: doc.matter.description,
    urlPath: doc.urlPath,
    markdownPath: doc.markdownPath,
    updatedAt: doc.matter.updated,
    jsonLd: [
      ld.organisation(site),
      ld.webPage(site, doc, doc.urlPath),
      ld.breadcrumbs(site, [
        { name: "Home", path: "/" },
        { name: doc.matter.title, path: doc.urlPath },
      ]),
    ],
    main: renderPage({ ...doc, html: body }),
  });
}

function notFoundPage(site: SiteConfig, theme: Theme, previewBar: string | undefined): string {
  return renderLayout({
    site,
    theme,
    previewBar,
    title: "Not here",
    description: "That page does not exist on this site.",
    urlPath: "/404.html",
    noindex: true,
    main: `      <div class="prose wrap">
        <header class="page-head">
          <h1>Not here</h1>
          <p class="lede">
            That address does not exist on this site. Nothing was logged, because
            this site logs nothing.
          </p>
        </header>
        <p>
          If you arrived from somewhere that promised otherwise, the index is at
          <a href="/">the home page</a>, and the complete list of every URL here
          is <a href="/sitemap.xml">/sitemap.xml</a>.
        </p>
        <p>
          If you are a machine: <a href="/llms.txt">/llms.txt</a> lists every
          page with its Markdown twin, and <a href="/index.json">/index.json</a>
          is the same thing typed.
        </p>
      </div>`,
  });
}

/**
 * Internal links must resolve to something this build emitted.
 *
 * Cheap to run, and it catches the failure mode that hurts a small site most:
 * a renamed page leaves a dead link that nobody clicks for six months while a
 * search engine quietly downgrades the page pointing at it.
 */
function checkInternalLinks(
  files: OutputFile[],
  assetPaths: string[],
  site: SiteConfig,
): void {
  const emitted = new Set([...files.map((f) => `/${f.path}`), ...assetPaths]);
  for (const file of files) {
    if (file.path.endsWith("/index.html")) emitted.add(`/${file.path.replace(/index\.html$/, "")}`);
  }
  emitted.add("/");

  const problems: string[] = [];
  for (const file of files) {
    if (!file.path.endsWith(".html")) continue;
    for (const match of file.contents.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = match[1] as string;
      if (href.startsWith("//")) continue;
      if (emitted.has(href)) continue;
      if (emitted.has(href.endsWith("/") ? href : `${href}/`)) continue;
      problems.push(`${file.path} → ${href}`);
    }
  }

  if (problems.length) {
    throw new Error(
      `${problems.length} internal link(s) point at nothing this build emitted:\n  ` +
        `${problems.join("\n  ")}\n\n` +
        `Every href must resolve to a generated file. Site root is ${site.url}.`,
    );
  }
}

async function writeAll(outDir: string, files: OutputFile[]): Promise<void> {
  await rm(outDir, { recursive: true, force: true });
  for (const file of files) {
    const target = join(outDir, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.contents, "utf8");
  }
}

/** Only run when executed directly, so tests can import `build`. */
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const started = Date.now();
  const themeId = process.env.PUMASI_THEME ?? DEFAULT_THEME;
  const files = await build(OUT, { themeId });
  const bytes = files.reduce((sum, f) => sum + Buffer.byteLength(f.contents), 0);
  const kinds = new Map<string, number>();
  for (const file of files) {
    const ext = file.path.slice(file.path.lastIndexOf(".")) || "(none)";
    kinds.set(ext, (kinds.get(ext) ?? 0) + 1);
  }
  const summary = [...kinds.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ext, n]) => `${n}${ext}`)
    .join("  ");

  process.stdout.write(
    `built ${files.length} files (${summary}) — ${(bytes / 1024).toFixed(0)} kB — in ${Date.now() - started} ms\n` +
      `→ ${OUT}\n`,
  );
  // A quiet reassurance that the two audiences really did both get served.
  const md = files.filter((f) => f.path.endsWith(".md")).length;
  const html = files.filter((f) => f.path.endsWith(".html")).length;
  process.stdout.write(
    `  theme "${themeId}" — ${html} HTML pages, ${md} Markdown twins, ${await readSize(themeId)} of CSS\n`,
  );
}

async function readSize(themeId: string): Promise<string> {
  const base = await readFile(join(ASSETS, "base.css"), "utf8");
  const theme = await readFile(join(ASSETS, "themes", `${themeId}.css`), "utf8");
  return `${((base.length + theme.length) / 1024).toFixed(0)} kB`;
}
