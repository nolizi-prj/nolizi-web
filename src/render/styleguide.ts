/**
 * The living style guide at /design/.
 *
 * It is generated from this list rather than hand-written in HTML, so a token
 * that is renamed in `theme.css` and not renamed here shows up as a broken
 * swatch on a page someone actually looks at. A style guide that can drift
 * silently from its theme is worse than none.
 */

import { escapeHtml } from "../html.js";

const COLOUR_GROUPS: Array<{ title: string; note: string; tokens: string[] }> = [
  {
    title: "Neutrals",
    note: "Warm, never grey-blue. Named by role, so a repaint does not require a rename.",
    tokens: [
      "--paper", "--paper-raised", "--paper-sunken", "--line", "--line-strong",
      "--ink-faint", "--ink-muted", "--ink", "--ink-strong",
    ],
  },
  {
    title: "Accent — the one colour",
    note: "Links, the primary action, and exactly one emphasis per view. One accent is a constraint, not a shortage: it means the accented thing is always the thing to do next.",
    tokens: ["--accent", "--accent-strong", "--accent-soft", "--accent-line", "--accent-contrast"],
  },
  {
    title: "Warn — in progress",
    note: "Anything provisional: a limitation, a caution, a maturity that is not yet stable.",
    tokens: ["--warn", "--warn-soft", "--warn-line"],
  },
  {
    title: "OK — settled",
    note: "Anything verified: a passing gate, a stable release, a machine affordance that works.",
    tokens: ["--ok", "--ok-soft", "--ok-line"],
  },
  {
    title: "Illustration",
    note: "Fills for the art system. Tuned to sit behind text without competing with it.",
    tokens: ["--art-ground", "--art-1", "--art-2", "--art-3", "--art-4", "--art-ink"],
  },
];

const TYPE_STEPS: Array<{ token: string; sample: string; font: string }> = [
  { token: "--text-3xl", sample: "A commons of working software", font: "var(--font-display)" },
  { token: "--text-2xl", sample: "Built by agents, governed by people", font: "var(--font-display)" },
  { token: "--text-xl", sample: "What actually exists", font: "var(--font-display)" },
  { token: "--text-lg", sample: "The merge gate, in four requirements", font: "var(--font-display)" },
  { token: "--text-md", sample: "A lede: slightly larger than body, and quieter.", font: "var(--font-body)" },
  { token: "--text-base", sample: "Body text. The measure is capped so a line never outruns the eye.", font: "var(--font-body)" },
  { token: "--text-sm", sample: "Metadata, captions, and the footer.", font: "var(--font-body)" },
  { token: "--text-xs", sample: "LABELS AND BADGES", font: "var(--font-body)" },
];

const SPACE_STEPS = [
  "--space-3xs", "--space-2xs", "--space-xs", "--space-sm",
  "--space-md", "--space-lg", "--space-xl", "--space-2xl",
];

export function renderStyleGuide(): string {
  const colours = COLOUR_GROUPS.map(
    (group) => `
        <h3>${escapeHtml(group.title)}</h3>
        <p>${escapeHtml(group.note)}</p>
        <div class="swatches">
          ${group.tokens
            .map(
              (token) => `<div class="swatch">
            <div class="swatch-chip" style="background: var(${token})"></div>
            <div class="swatch-label">${escapeHtml(token)}</div>
          </div>`,
            )
            .join("\n          ")}
        </div>`,
  ).join("\n");

  const type = TYPE_STEPS.map(
    (step) => `<div>
            <div class="label">${escapeHtml(step.token)}</div>
            <div style="font-size: var(${step.token}); font-family: ${step.font}; line-height: var(--leading-snug);">${escapeHtml(step.sample)}</div>
          </div>`,
  ).join("\n          ");

  const space = SPACE_STEPS.map(
    (token) => `<div class="space-row">
            <span class="space-bar" style="width: var(${token})"></span>
            <span>${escapeHtml(token)}</span>
          </div>`,
  ).join("\n          ");

  return `
        <h2 id="colour">Colour</h2>
        <p>
          Every pair used for text meets WCAG AA in both schemes. Switch your
          system between light and dark and this page repaints — there is no
          toggle here, because there is no JavaScript here, and the operating
          system already knows the answer.
        </p>
${colours}

        <h2 id="type">Type</h2>
        <p>
          System stacks only. A serif for display because this site is mostly
          argument; the body sans is whatever the reader's platform already has
          loaded. No font is fetched, so nothing blocks the first paint and
          nothing shifts after it.
        </p>
        <p>
          Every step is fluid — <code>clamp()</code> between a phone and a
          desktop — so the scale never needs a breakpoint to stay readable.
        </p>
        <div class="type-specimen">
          ${type}
        </div>

        <h2 id="space">Space</h2>
        <p>A 4px base on roughly a 1.5 ratio. A one-off value is a bug.</p>
        <div class="space-scale">
          ${space}
        </div>

        <h2 id="components">Components</h2>
        <p>The pieces this site is assembled from, rendered live.</p>

        <h3>Buttons</h3>
        <p>
          <a class="button" href="#components">Primary</a>
          <a class="button button-quiet" href="#components">Quiet</a>
        </p>

        <h3>Badges</h3>
        <p>
          <span class="badge">seed</span>
          <span class="badge badge-stable">stable</span>
          <span class="badge badge-planned">planned</span>
        </p>

        <h3>Callouts</h3>
        <div class="callout callout-warn"><strong>Warn — in progress.</strong> Used for a limitation a reader must know before adopting something.</div>
        <div class="callout callout-good" style="margin-top: var(--space-2xs)"><strong>OK — settled.</strong> Used for something verified: a gate passed, a claim checked.</div>
        <div class="callout callout-note" style="margin-top: var(--space-2xs)"><strong>Accent — attention.</strong> Used sparingly, and never twice on one screen.</div>

        <h2 id="reuse">Taking the theme</h2>
        <p>
          Every theme file supplies the same token vocabulary — <code>--accent</code>,
          never <code>--clay</code>. A token named for what it looks like has to
          be renamed when the look changes, which is how a theme layer stops
          being one. Because the names are stable, another Pumasi product can
          link a theme and inherit the palette, the type scale and the spacing
          without inheriting this website's layout:
        </p>
        <pre tabindex="0"><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;https://pumasi.ai/themes/signal.css&quot;&gt;</code></pre>
        <p>
          Or copy the file. It is Apache-2.0, it has no dependencies, and it is
          under three hundred lines. Copying it is the expected thing to do —
          this is a commons, and a vendored copy that cannot break when someone
          else deploys is worth more than a shared URL that can.
        </p>`;
}
