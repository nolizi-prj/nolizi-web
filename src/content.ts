/**
 * Loading content off disk, and turning it into `Doc`s.
 *
 * Validation is strict and fatal. Every field this site depends on for SEO or
 * for machine readers — a title, a description, a date on a post — is required
 * here rather than defaulted, because a silently-defaulted description becomes
 * a page that ranks for nothing and tells an agent nothing.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, basename } from "node:path";
import { parseFile } from "./frontmatter.js";
import type { Doc, DocKind, FrontMatter, SiteConfig } from "./types.js";

export class ContentError extends Error {
  constructor(message: string, readonly file: string) {
    super(`${file}: ${message}`);
    this.name = "ContentError";
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Blog files are named `YYYY-MM-DD-slug.md`; the date prefix is not in the URL. */
const DATED_FILENAME = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

export async function loadSiteConfig(contentDir: string): Promise<SiteConfig> {
  const file = join(contentDir, "site.json");
  const parsed = JSON.parse(await readFile(file, "utf8")) as SiteConfig;

  for (const key of ["name", "url", "tagline", "description", "lang", "licence"] as const) {
    if (!parsed[key]) throw new ContentError(`site.json is missing "${key}"`, file);
  }
  if (parsed.url.endsWith("/")) {
    throw new ContentError(`site.json "url" must not end with a slash`, file);
  }
  if (!/^https?:\/\//.test(parsed.url)) {
    throw new ContentError(`site.json "url" must be absolute`, file);
  }
  return parsed;
}

export async function loadContent(contentDir: string): Promise<Doc[]> {
  const docs: Doc[] = [];
  docs.push(...(await loadDir(join(contentDir, "pages"), "page", contentDir)));
  docs.push(...(await loadDir(join(contentDir, "products"), "product", contentDir)));
  docs.push(...(await loadDir(join(contentDir, "blog"), "post", contentDir)));
  return docs;
}

async function loadDir(dir: string, kind: DocKind, contentRoot: string): Promise<Doc[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }

  const docs: Doc[] = [];
  for (const name of names.sort()) {
    const path = join(dir, name);
    if ((await stat(path)).isDirectory()) continue;
    if (!name.endsWith(".md")) continue;
    docs.push(await loadDoc(path, kind, contentRoot));
  }
  return docs;
}

async function loadDoc(path: string, kind: DocKind, contentRoot: string): Promise<Doc> {
  const raw = await readFile(path, "utf8");
  const rel = relative(contentRoot, path);
  const { data, body } = parseFile(raw, rel);
  const matter = data as FrontMatter;

  if (typeof matter.title !== "string" || matter.title.trim() === "") {
    throw new ContentError('front matter needs a "title"', rel);
  }
  if (typeof matter.description !== "string" || matter.description.trim() === "") {
    throw new ContentError(
      'front matter needs a "description" — it is the meta description, the ' +
        "card subtitle, the feed summary and the llms.txt line, all at once",
      rel,
    );
  }
  if (matter.description.length > 200) {
    throw new ContentError(
      `"description" is ${matter.description.length} characters; keep it under 200 so ` +
        "search engines show it whole",
      rel,
    );
  }
  if (body.trim() === "") throw new ContentError("body is empty", rel);

  for (const key of ["date", "updated"] as const) {
    const value = matter[key];
    if (value !== undefined && (typeof value !== "string" || !ISO_DATE.test(value))) {
      throw new ContentError(`"${key}" must be an ISO date, YYYY-MM-DD`, rel);
    }
  }

  const slug = slugFor(kind, path, matter, rel);

  if (kind === "post" && !matter.date) {
    throw new ContentError('a post needs a "date"', rel);
  }

  return { kind, slug, source: path, matter, body };
}

function slugFor(kind: DocKind, path: string, matter: FrontMatter, rel: string): string {
  const name = basename(path, ".md");

  if (kind === "page") {
    if (typeof matter.slug === "string") return matter.slug.replace(/^\/|\/$/g, "");
    return name === "index" ? "" : name;
  }

  if (kind === "product") return `products/${name}`;

  const dated = DATED_FILENAME.exec(basename(path));
  if (!dated) {
    throw new ContentError(
      "a post filename must be YYYY-MM-DD-slug.md, so the directory sorts chronologically",
      rel,
    );
  }
  if (matter.date && matter.date !== dated[1]) {
    throw new ContentError(
      `filename date ${dated[1]} disagrees with front matter date ${matter.date}`,
      rel,
    );
  }
  return `blog/${dated[2]}`;
}

/** "" for the home page, otherwise "/slug/". Trailing slash, always. */
export function urlPathFor(slug: string): string {
  return slug === "" ? "/" : `/${slug}/`;
}

/** The Markdown twin an agent can fetch: "/index.md" or "/slug.md". */
export function markdownPathFor(slug: string): string {
  return slug === "" ? "/index.md" : `/${slug}.md`;
}

export function outputHtmlPath(slug: string): string {
  return slug === "" ? "index.html" : `${slug}/index.html`;
}

export function outputMarkdownPath(slug: string): string {
  return slug === "" ? "index.md" : `${slug}.md`;
}

/** Newest first. Ties break on slug so the order is stable across builds. */
export function byDateDesc(a: Doc, b: Doc): number {
  const cmp = (b.matter.date ?? "").localeCompare(a.matter.date ?? "");
  return cmp !== 0 ? cmp : a.slug.localeCompare(b.slug);
}

/** `order` first where given, then title. Stable across builds. */
export function byOrderThenTitle(a: Doc, b: Doc): number {
  const ao = a.matter.order ?? 1000;
  const bo = b.matter.order ?? 1000;
  return ao !== bo ? ao - bo : a.matter.title.localeCompare(b.matter.title);
}
