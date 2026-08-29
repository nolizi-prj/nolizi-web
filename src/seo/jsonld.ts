/**
 * JSON-LD (schema.org) builders.
 *
 * Structured data is the one channel where a search engine and a language model
 * want exactly the same thing: unambiguous facts, typed, in one place. Every
 * value here is drawn from content that also appears on the page — nothing is
 * asserted to machines that a person cannot see and check.
 */

import type { Doc, SiteConfig } from "../types.js";

export function organisation(site: SiteConfig): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organisation`,
    name: site.org.name,
    url: site.url,
    description: site.description,
    email: site.org.email,
    sameAs: [site.org.github],
  };
}

export function website(site: SiteConfig): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.lang,
    publisher: { "@id": `${site.url}/#organisation` },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
  };
}

export function webPage(site: SiteConfig, doc: Doc, urlPath: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}${urlPath}#page`,
    url: `${site.url}${urlPath}`,
    name: doc.matter.title,
    description: doc.matter.description,
    inLanguage: site.lang,
    isPartOf: { "@id": `${site.url}/#website` },
    ...(doc.matter.updated ? { dateModified: doc.matter.updated } : {}),
  };
}

export function blogPosting(site: SiteConfig, doc: Doc, urlPath: string, wordCount: number): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${site.url}${urlPath}#post`,
    headline: doc.matter.title,
    description: doc.matter.description,
    url: `${site.url}${urlPath}`,
    datePublished: doc.matter.date,
    dateModified: doc.matter.updated ?? doc.matter.date,
    inLanguage: site.lang,
    wordCount,
    keywords: doc.matter.tags ?? [],
    author: { "@type": "Organization", name: doc.matter.author ?? site.org.name },
    publisher: { "@id": `${site.url}/#organisation` },
    isPartOf: { "@id": `${site.url}/blog/#blog` },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}${urlPath}#page` },
  };
}

export function blog(site: SiteConfig, posts: Array<{ doc: Doc; urlPath: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/blog/#blog`,
    name: `${site.name} — writing`,
    url: `${site.url}/blog/`,
    inLanguage: site.lang,
    publisher: { "@id": `${site.url}/#organisation` },
    blogPost: posts.map(({ doc, urlPath }) => ({
      "@type": "BlogPosting",
      headline: doc.matter.title,
      description: doc.matter.description,
      url: `${site.url}${urlPath}`,
      datePublished: doc.matter.date,
    })),
  };
}

/**
 * A Pumasi product is free, open-source, self-hostable software. That is three
 * schema.org facts — `SoftwareApplication`, an `Offer` at zero, and a
 * `SoftwareSourceCode` link — and stating them explicitly is what lets a model
 * answer "is there an open-source Calendly?" without reading prose.
 */
export function softwareApplication(site: SiteConfig, doc: Doc, urlPath: string): object {
  const compareTo = (doc.matter.compareTo ?? []) as string[];
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${site.url}${urlPath}#software`,
    name: doc.matter.title,
    description: doc.matter.description,
    url: `${site.url}${urlPath}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (Node.js 22+, or a container)",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(doc.matter.repo
      ? {
          codeRepository: doc.matter.repo,
          mainEntity: {
            "@type": "SoftwareSourceCode",
            codeRepository: doc.matter.repo,
            programmingLanguage: "TypeScript",
            license: "https://www.apache.org/licenses/LICENSE-2.0",
          },
        }
      : {}),
    ...(compareTo.length
      ? { alternativeHeadline: `An open-source alternative to ${compareTo.join(" and ")}` }
      : {}),
    publisher: { "@id": `${site.url}/#organisation` },
  };
}

export function breadcrumbs(site: SiteConfig, trail: Array<{ name: string; path: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

/** A FAQ block lifted from content, for pages that answer discrete questions. */
export function faq(pairs: Array<{ question: string; answer: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
