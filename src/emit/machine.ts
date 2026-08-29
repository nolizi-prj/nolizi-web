import type { RenderedDoc, SiteConfig } from "../types.js";

/**
 * `/index.json` — this website, typed.
 *
 * `llms.txt` is for a model reading prose. This is for a program: a fetch, a
 * parse, and a decision, with no natural-language step in between. It is the
 * same idea as the commons' own `catalog.json`, applied to the website, and it
 * is deliberately flat and boring.
 *
 * Every entry carries `url` and `markdown` so a caller never has to construct
 * a path, and `words` so a caller can budget before fetching.
 */
export function renderMachineIndex(
  site: SiteConfig,
  docs: RenderedDoc[],
  generated: string,
): string {
  const entry = (doc: RenderedDoc) => ({
    kind: doc.kind,
    slug: doc.slug || "index",
    title: doc.matter.title,
    description: doc.matter.description,
    url: `${site.url}${doc.urlPath}`,
    markdown: `${site.url}${doc.markdownPath}`,
    ...(doc.matter.date ? { published: doc.matter.date } : {}),
    ...(doc.matter.updated ? { updated: doc.matter.updated } : {}),
    ...(doc.matter.tags ? { tags: doc.matter.tags } : {}),
    ...(doc.matter.repo ? { repository: doc.matter.repo } : {}),
    ...(doc.matter.compareTo ? { compare_to: doc.matter.compareTo } : {}),
    ...(doc.matter.status ? { maturity: doc.matter.status } : {}),
    ...(doc.matter.limitation ? { known_limitation: doc.matter.limitation } : {}),
    words: doc.text.split(/\s+/).filter(Boolean).length,
    headings: doc.headings
      .filter((h) => h.depth === 2)
      .map((h) => ({ text: h.text, anchor: `${site.url}${doc.urlPath}#${h.id}` })),
  });

  const payload = {
    $comment:
      "The machine-readable index of this website. For the commons itself — what software exists, what it solves, where it lives — fetch the catalog linked under `commons` below.",
    site: site.name,
    url: site.url,
    description: site.description,
    licence: site.licence,
    language: site.lang,
    generated,
    reuse: {
      may_crawl: true,
      may_quote: true,
      may_train: true,
      attribution: "welcome, not required",
      licence_url: "https://www.apache.org/licenses/LICENSE-2.0",
    },
    commons: {
      organisation: site.org.name,
      github: site.org.github,
      catalog: site.org.catalog,
      governance: site.org.governance,
    },
    entry_points: {
      llms_txt: `${site.url}/llms.txt`,
      llms_full_txt: `${site.url}/llms-full.txt`,
      sitemap: `${site.url}/sitemap.xml`,
      feed: `${site.url}/feed.xml`,
      markdown_convention:
        "Every HTML page has a Markdown twin at the same path with a .md extension; it is also linked from the page as <link rel=\"alternate\" type=\"text/markdown\">.",
    },
    counts: {
      pages: docs.filter((d) => d.kind === "page").length,
      products: docs.filter((d) => d.kind === "product").length,
      posts: docs.filter((d) => d.kind === "post").length,
    },
    products: docs.filter((d) => d.kind === "product").map(entry),
    pages: docs.filter((d) => d.kind === "page").map(entry),
    posts: docs.filter((d) => d.kind === "post").map(entry),
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}

/**
 * The Markdown twin of a page.
 *
 * Front matter is kept — a machine reader wants the title, description and
 * dates as data — but rewritten to a stable, documented set of keys rather
 * than passed through, and given the canonical URL so a file that has been
 * copied somewhere else still says where it came from.
 */
export function renderMarkdownTwin(site: SiteConfig, doc: RenderedDoc): string {
  const lines: string[] = ["---"];
  lines.push(`title: ${quote(doc.matter.title)}`);
  lines.push(`description: ${quote(doc.matter.description)}`);
  lines.push(`url: ${site.url}${doc.urlPath}`);
  lines.push(`kind: ${doc.kind}`);
  if (doc.matter.date) lines.push(`published: ${doc.matter.date}`);
  if (doc.matter.updated) lines.push(`updated: ${doc.matter.updated}`);
  if (doc.matter.tags?.length) lines.push(`tags: [${doc.matter.tags.map(quote).join(", ")}]`);
  if (doc.matter.repo) lines.push(`repository: ${doc.matter.repo}`);
  if (doc.matter.compareTo?.length) {
    lines.push(`compare_to: [${(doc.matter.compareTo as string[]).map(quote).join(", ")}]`);
  }
  if (doc.matter.status) lines.push(`maturity: ${doc.matter.status}`);
  if (doc.matter.limitation) lines.push(`known_limitation: ${quote(String(doc.matter.limitation))}`);
  lines.push(`licence: ${doc.matter.licence ?? "Apache-2.0"}`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${doc.matter.title}`);
  lines.push("");
  lines.push(doc.body.trim());
  lines.push("");
  return lines.join("\n");
}

function quote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
