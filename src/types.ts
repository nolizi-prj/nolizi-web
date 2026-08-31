/**
 * The shape of everything the generator moves around.
 *
 * One rule holds this file together: a `Doc` is the single source for BOTH
 * audiences. The HTML a person reads and the Markdown an agent fetches are two
 * renderings of the same document, never two documents that must be kept in
 * step by hand.
 */

export type DocKind = "page" | "product" | "post";

export interface SiteConfig {
  /** Display name, e.g. "Pumasi". */
  name: string;
  /** Origin with no trailing slash, e.g. "https://pumasi.ai". */
  url: string;
  /** One line under the wordmark. */
  tagline: string;
  /** Used for meta description on pages that do not set their own. */
  description: string;
  /** BCP 47, e.g. "en". */
  lang: string;
  /** SPDX identifier for the content and the code. */
  licence: string;
  /** Where the commons lives. */
  org: {
    name: string;
    github: string;
    /** The machine index of the commons itself — not of this website. */
    catalog: string;
    governance: string;
    email: string;
  };
  nav: Array<{ label: string; href: string }>;
  footer: Array<{ label: string; href: string }>;
}

/** Parsed front matter. Unknown keys are preserved and available to templates. */
export interface FrontMatter {
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). Required on posts. */
  date?: string;
  /** ISO date of the last substantive edit. Drives sitemap lastmod. */
  updated?: string;
  /** Lower sorts first within its kind. */
  order?: number;
  tags?: string[];
  author?: string;
  draft?: boolean;
  /** Product pages: the repository this product ships from. */
  repo?: string;
  /** Product pages: what a person would otherwise pay for. */
  compareTo?: string[];
  /** Product pages: the rung from the product's own roadmap/STAGE.md — seed | alpha | beta | launched. */
  status?: string;
  /** Product pages: the honest one-liner about what it cannot do yet. */
  limitation?: string;
  /**
   * Product pages: the SPDX licence of the PRODUCT's repository — set only
   * when that repository actually carries the file. Absent means absent: a
   * public repository with no LICENSE grants no rights, and this site does not
   * fill that silence with a default. Distinct from the site's own content
   * licence, which every page carries regardless.
   */
  productLicence?: string;
  [key: string]: unknown;
}

export interface Doc {
  kind: DocKind;
  /**
   * Path segment(s) with no leading or trailing slash. "" is the home page.
   * e.g. "about", "products/pumasi-booking", "blog/one-product-one-repository".
   */
  slug: string;
  /** Absolute path of the file this came from, for diagnostics. */
  source: string;
  matter: FrontMatter;
  /** The Markdown body, front matter stripped. */
  body: string;
}

/** A document after rendering, ready to be written out. */
export interface RenderedDoc extends Doc {
  /** Site-absolute URL path, e.g. "/about/" or "/". */
  urlPath: string;
  /** Site-absolute path of the Markdown twin, e.g. "/about.md". */
  markdownPath: string;
  /** Body rendered to HTML. */
  html: string;
  /** Headings found in the body, for tables of contents and llms.txt. */
  headings: Array<{ depth: number; text: string; id: string }>;
  /** Plain text of the body, for full-text machine output and word counts. */
  text: string;
}

/** One file to write into the output directory. */
export interface OutputFile {
  /** Path relative to the output root, e.g. "about/index.html". */
  path: string;
  contents: string;
}
