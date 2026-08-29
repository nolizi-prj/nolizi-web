/**
 * The theme registry.
 *
 * A theme is a stylesheet of tokens plus component rules, and a small amount of
 * shape information the SVG art system needs (corner radius, which mark and
 * which hero drawing to use). Everything else about a theme lives in its CSS.
 *
 * `base.css` is shared by all of them and holds no colour, no font and no size
 * of its own, so switching the theme file switches the design.
 */

export type ArtStyle = "geometric" | "wire" | "block";

export interface Theme {
  /** URL-safe id; also the stylesheet filename. */
  id: string;
  /** Display name. */
  name: string;
  /** One line on what the direction is. */
  blurb: string;
  /** The two or three references it is drawn from. */
  lineage: string;
  /** Corner radius the art system should use, in user units. */
  artRadius: number;
  /** Which mark and hero drawing this theme uses. */
  art: ArtStyle;
  /** Favicon stroke colours: [light, dark] for each of the three arcs. */
  faviconLight: [string, string, string];
  faviconDark: [string, string, string];
  faviconInk: [string, string];
}

export const THEMES: Theme[] = [
  {
    id: "signal",
    name: "Signal",
    blurb:
      "High-contrast and engineered. Near-black on white, one blue that only ever means “interactive”, headlines set tight, and a great deal of space.",
    lineage: "Vercel · Linear · Stripe",
    artRadius: 6,
    art: "geometric",
    faviconLight: ["#000000", "#a1a1a1", "#0059d1"],
    faviconDark: ["#ffffff", "#5c5c5c", "#5aa2ff"],
    faviconInk: ["#000000", "#ffffff"],
  },
  {
    id: "console",
    name: "Console",
    blurb:
      "Monospace everywhere — headings, body, navigation. Square corners, visible borders, console punctuation. The site looks like the machine-readable artefact it is.",
    lineage: "Bun · Raycast · Resend · the “mono everywhere” wave",
    artRadius: 0,
    art: "wire",
    faviconLight: ["#197a3d", "#9a5b00", "#5f5f58"],
    faviconDark: ["#55d37c", "#e0a955", "#94a09a"],
    faviconInk: ["#0a0a09", "#f2f7f4"],
  },
  {
    id: "press",
    name: "Press",
    blurb:
      "Editorial and structural. Type at hero scale, numbered sections under thick rules, hard corners, and a single signal red reserved for emphasis and structure markers.",
    lineage: "2026 brutalist-editorial · Swiss print",
    artRadius: 0,
    art: "block",
    faviconLight: ["#cc2200", "#111111", "#8a8a83"],
    faviconDark: ["#ff5233", "#f0f0ec", "#6d6d66"],
    faviconInk: ["#000000", "#ffffff"],
  },
];

export const DEFAULT_THEME = "signal";

export function themeById(id: string): Theme {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) {
    throw new Error(
      `unknown theme "${id}". Known themes: ${THEMES.map((t) => t.id).join(", ")}`,
    );
  }
  return theme;
}
