/**
 * Shortcodes: how a Markdown file asks for a picture.
 *
 * Content should not contain SVG. It should say what the picture is *of* and
 * let the art system draw it, so that a change to the theme changes every
 * illustration on the site at once.
 *
 *     {{figure:merge-gate|The four requirements, in order.}}
 *     {{figure:plot:booking|Every product gets its own woven plot.}}
 *     {{figure:cover:pricing}}
 *
 * Anything unrecognised raises rather than rendering as literal braces, on the
 * same principle as the front-matter parser: a typo should stop the build, not
 * ship.
 */

import { coverArt, mergeGateArt, plotArt } from "./art.js";

export class ShortcodeError extends Error {}

const PATTERN = /<p>\s*\{\{figure:([a-z0-9-]+)(?::([a-z0-9-]+))?(?:\|([^}]*))?\}\}\s*<\/p>/gi;

export function expandShortcodes(html: string, context: string): string {
  return html.replace(PATTERN, (_match, name: string, arg: string | undefined, caption: string | undefined) => {
    const art = draw(name.toLowerCase(), arg, context);
    // The caption is NOT escaped here: this pattern runs against HTML that
    // marked has already rendered and escaped. Escaping it a second time is
    // how "page's" becomes "page&amp;#39;s" on the page.
    const figcaption = caption?.trim()
      ? `\n  <figcaption>${caption.trim()}</figcaption>`
      : "";
    return `<figure class="figure">\n  ${art}${figcaption}\n</figure>`;
  });
}

function draw(name: string, arg: string | undefined, context: string): string {
  switch (name) {
    case "merge-gate":
      return mergeGateArt();
    case "plot":
      return plotArt(arg ?? context, 900, 300, 0.55);
    case "cover":
      return coverArt(arg ?? context, 1000, 300);
    default:
      throw new ShortcodeError(
        `${context}: unknown figure "${name}". Known figures: merge-gate, plot, cover.`,
      );
  }
}

/** Guard against a shortcode that never matched — usually a typo in the name. */
export function assertNoStrayShortcodes(html: string, context: string): void {
  const stray = /\{\{[a-z]/i.exec(html);
  if (stray) {
    throw new ShortcodeError(
      `${context}: a "{{" shortcode was left unexpanded near: ${html.slice(stray.index, stray.index + 60)}`,
    );
  }
}
