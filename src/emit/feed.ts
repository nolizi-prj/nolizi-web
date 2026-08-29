import { escapeXml } from "../html.js";
import type { RenderedDoc, SiteConfig } from "../types.js";

/**
 * Atom 1.0, not RSS 2.0.
 *
 * Atom requires a globally unique `id` and a real `updated` timestamp per
 * entry, which is exactly what a machine consumer needs to tell a new post
 * from an edited one. RSS leaves both optional and readers guess.
 *
 * Full content ships in the feed, as `type="text"` Markdown rather than
 * escaped HTML. A reader gets the whole post without a second request, and an
 * agent subscribing to the feed gets the same clean text the `.md` twins serve.
 */
export function renderFeed(site: SiteConfig, posts: RenderedDoc[], updated: string): string {
  const entries = posts
    .map((post) => {
      const url = `${site.url}${post.urlPath}`;
      const published = `${post.matter.date}T00:00:00Z`;
      const modified = `${post.matter.updated ?? post.matter.date}T00:00:00Z`;
      const categories = (post.matter.tags ?? [])
        .map((tag) => `    <category term="${escapeXml(tag)}"/>`)
        .join("\n");

      return `  <entry>
    <title>${escapeXml(post.matter.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>
    <link rel="alternate" type="text/markdown" href="${escapeXml(site.url + post.markdownPath)}"/>
    <id>${escapeXml(url)}</id>
    <published>${escapeXml(published)}</published>
    <updated>${escapeXml(modified)}</updated>
    <summary type="text">${escapeXml(post.matter.description)}</summary>
${categories}${categories ? "\n" : ""}    <rights>Apache-2.0</rights>
    <content type="text">${escapeXml(post.body)}</content>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escapeXml(site.lang)}">
  <title>${escapeXml(site.name)} — writing</title>
  <subtitle>${escapeXml(site.description)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${escapeXml(site.url)}/feed.xml"/>
  <link rel="alternate" type="text/html" href="${escapeXml(site.url)}/blog/"/>
  <id>${escapeXml(site.url)}/</id>
  <updated>${escapeXml(updated)}T00:00:00Z</updated>
  <rights>Apache-2.0. Quote it, translate it, train on it.</rights>
  <author>
    <name>${escapeXml(site.org.name)}</name>
    <uri>${escapeXml(site.url)}</uri>
  </author>
${entries}
</feed>
`;
}
