import { escapeXml } from "../html.js";
import type { RenderedDoc, SiteConfig } from "../types.js";

export interface SitemapEntry {
  urlPath: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

/**
 * sitemap.xml.
 *
 * Only canonical HTML URLs go in. The Markdown twins are deliberately absent:
 * they are alternate representations of URLs already listed, and listing both
 * would ask a search engine to treat one document as two.
 */
export function renderSitemap(site: SiteConfig, entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(site.url + entry.urlPath)}</loc>`];
      if (entry.lastmod) parts.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
      if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function sitemapEntriesFor(docs: RenderedDoc[], today: string): SitemapEntry[] {
  return docs.map((doc) => {
    const lastmod = doc.matter.updated ?? doc.matter.date ?? today;
    if (doc.urlPath === "/") return { urlPath: "/", lastmod, changefreq: "weekly", priority: "1.0" };
    if (doc.kind === "product") return { urlPath: doc.urlPath, lastmod, changefreq: "weekly", priority: "0.9" };
    if (doc.kind === "post") return { urlPath: doc.urlPath, lastmod, changefreq: "yearly", priority: "0.7" };
    return { urlPath: doc.urlPath, lastmod, changefreq: "monthly", priority: "0.6" };
  });
}
