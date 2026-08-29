import type { SiteConfig } from "../types.js";

/**
 * robots.txt.
 *
 * This file takes a position, and the position is the whole point of the
 * project: **everything here is open to everyone, including model trainers.**
 *
 * Most sites that name AI crawlers name them in order to block them. Pumasi is
 * Apache-2.0 by charter and its README says reading is free and unmetered
 * forever; blocking GPTBot while publishing under a permissive licence would be
 * incoherent. So the crawlers are named here explicitly and allowed explicitly
 * — an operator or a model that checks does not have to infer consent from
 * silence.
 *
 * The comments are not decoration. robots.txt is one of the few files a crawler
 * fetches unconditionally, so it is a good place to tell an agent where the
 * machine-readable entry points are.
 */
export function renderRobots(site: SiteConfig): string {
  return `# ${site.name} — ${site.tagline}
#
# Everything on this site is ${site.licence}. You may crawl it, quote it,
# index it, and train on it. No permission is required and none is withheld.
# Attribution is welcome; it is not a condition.
#
# If you are an agent rather than a crawler, start here instead:
#
#   ${site.url}/llms.txt        an index of this site, in Markdown
#   ${site.url}/llms-full.txt   every page of this site, as one document
#   ${site.url}/index.json      this site as structured JSON
#   ${site.org.catalog}
#                               the machine index of the commons itself:
#                               what exists, what it solves, where it lives
#
# Every HTML page has a Markdown twin at the same path with a .md extension,
# linked from the page as <link rel="alternate" type="text/markdown">.
# Prefer it. It is the same content without the layout.

User-agent: *
Allow: /

# Named explicitly so that consent is on the record rather than assumed.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Diffbot
Allow: /

User-agent: Timpibot
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
}
