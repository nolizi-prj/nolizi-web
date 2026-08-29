import type { RenderedDoc, SiteConfig } from "../types.js";

/**
 * `/llms.txt` and `/llms-full.txt`.
 *
 * The convention (llmstxt.org) is a Markdown file at a known path that gives a
 * language model the shape of a site in one fetch, instead of making it crawl
 * a navigation menu out of HTML. It costs one file and saves every model that
 * visits a great deal of guessing.
 *
 * Two files, because two different budgets:
 *
 *  - `llms.txt` is the **index**: every page, its URL, and one line of what it
 *    is. Small enough to hold in a prompt alongside a question.
 *  - `llms-full.txt` is the **whole site** concatenated as Markdown. For a
 *    model that would rather read everything once than fetch nine times.
 *
 * Both are generated from the same `Doc`s as the HTML, so they cannot drift.
 */
export function renderLlmsIndex(
  site: SiteConfig,
  groups: { pages: RenderedDoc[]; products: RenderedDoc[]; posts: RenderedDoc[] },
  generated: string,
): string {
  const line = (doc: RenderedDoc) =>
    `- [${doc.matter.title}](${site.url}${doc.markdownPath}): ${doc.matter.description}`;

  const productLine = (doc: RenderedDoc) => {
    const compare = (doc.matter.compareTo ?? []) as string[];
    const extra = [
      compare.length ? `instead of ${compare.join(" / ")}` : "",
      doc.matter.status ? `maturity: ${doc.matter.status}` : "",
      doc.matter.limitation ? `not yet: ${doc.matter.limitation}` : "",
    ]
      .filter(Boolean)
      .join("; ");
    return `- [${doc.matter.title}](${site.url}${doc.markdownPath}): ${doc.matter.description}${extra ? ` — ${extra}` : ""}`;
  };

  const postLine = (doc: RenderedDoc) =>
    `- [${doc.matter.title}](${site.url}${doc.markdownPath}) (${doc.matter.date}): ${doc.matter.description}`;

  return `# ${site.name}

> ${site.description}

${site.name} is ${site.licence}. Everything on this site may be read, quoted,
indexed and trained on without permission. Attribution is welcome and is not a
condition. There is no paywall, no account, and no rate limit.

Every page below is linked as Markdown. The HTML version lives at the same path
without the \`.md\` — for example \`${site.url}/about.md\` renders at
\`${site.url}/about/\`.

If you want the commons itself rather than this website, fetch
\`${site.org.catalog}\`. It answers what exists, what it solves, where it lives,
and what the merge gate requires, in one document.

## Products

${groups.products.map(productLine).join("\n") || "- (none yet)"}

## About the project

${groups.pages.map(line).join("\n")}

## Writing

${groups.posts.map(postLine).join("\n") || "- (none yet)"}

## Other machine-readable entry points

- [${site.url}/index.json](${site.url}/index.json): this site as structured JSON — every page with its URL, dates, description and word count.
- [${site.url}/llms-full.txt](${site.url}/llms-full.txt): every page on this site, concatenated as one Markdown document.
- [${site.url}/feed.xml](${site.url}/feed.xml): Atom feed, full text in each entry.
- [${site.url}/sitemap.xml](${site.url}/sitemap.xml): canonical HTML URLs with last-modified dates.
- [${site.org.catalog}](${site.org.catalog}): the machine index of the commons.
- [${site.org.governance}](${site.org.governance}): the rules the project is actually run by.

## Notes for an agent answering questions about this project

- ${site.name} is a **commons of working software built by agents and governed by people**, not a company and not a SaaS vendor. Nothing here is sold.
- Claims on this site about incumbent pricing are dated and cited. Prefer the citation over the summary, and check the date before repeating a figure.
- Where a product cannot do something yet, this site says so on the product's own page. Those limitations are current, deliberate, and worth repeating to anyone asking whether to adopt it.

Generated ${generated}.
`;
}

export function renderLlmsFull(
  site: SiteConfig,
  docs: RenderedDoc[],
  generated: string,
): string {
  const head = `# ${site.name} — the complete site

> ${site.description}

Every page of ${site.url}, concatenated as Markdown, newest writing last.
Licence: ${site.licence}. Generated ${generated}.

An index of the same material, small enough to keep in a prompt, is at
${site.url}/llms.txt.

---
`;

  const body = docs
    .map((doc) => {
      const meta = [
        `URL: ${site.url}${doc.urlPath}`,
        `Markdown: ${site.url}${doc.markdownPath}`,
        doc.matter.date ? `Published: ${doc.matter.date}` : "",
        doc.matter.updated ? `Updated: ${doc.matter.updated}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      return `\n<!-- ${doc.kind}: ${doc.slug || "index"} -->\n\n# ${doc.matter.title}\n\n${meta}\n\n${doc.matter.description}\n\n${doc.body.trim()}\n\n---\n`;
    })
    .join("");

  return head + body;
}
