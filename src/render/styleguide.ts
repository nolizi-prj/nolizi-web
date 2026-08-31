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
    title: "Danger — failed, or destructive",
    note: "Anything that failed or that destroys something. New in the v1 system: its absence is exactly why three products each invented their own red.",
    tokens: ["--danger", "--danger-soft", "--danger-line"],
  },
  {
    title: "Product signals — identity, never interaction",
    note: "One hue per product, matched at roughly 6:1 on paper. A signal marks which product a surface belongs to — the mark, one edge rule, the live path in a diagram — and never colours a control. The thing you click is green in all three products, which is the whole reason these exist.",
    tokens: ["--signal-sign", "--signal-booking", "--signal-tunnel"],
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
          System stacks only, and on this site one of them: the reader's own
          monospace, for headings, body and navigation alike. No font is
          fetched, so nothing blocks the first paint and nothing shifts after
          it. JetBrains Mono and Geist Mono are named first, so a developer who
          already has one installed gets it for free.
        </p>
        <p>
          A second stack, <code>--font-ui</code>, exists in the theme and is
          used by nothing here. It is for the product applications — a signing
          canvas, a calendar grid, a request log — where a forty-row table in
          monospace costs real columns. Those surfaces move
          <code>--font-body</code> to it and leave
          <code>--font-display</code> where it is, so the console voice stays
          in every heading, label and number.
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
          Four ranks, and a screen is allowed exactly one primary. Every rank
          keeps the prompt caret, so a quiet button still reads as the same
          kind of object as a loud one. Danger is outlined rather than filled:
          a delete button that is the loudest thing on the screen gets pressed
          by accident.
        </p>
        <p>
          <a class="button" href="#components">Primary</a>
          <a class="button button-quiet" href="#components">Secondary</a>
          <a class="button button-ghost" href="#components">Tertiary</a>
          <a class="button button-danger" href="#components">Delete</a>
        </p>
        <p style="margin-top: var(--space-2xs)">
          <a class="button button-sm" href="#components">Small</a>
          <a class="button button-lg" href="#components">Large</a>
          <span class="button" aria-disabled="true">Disabled</span>
        </p>

        <h3>The stage ladder</h3>
        <p>
          One badge, five rungs, the same object in every Pumasi repository.
          The brackets are drawn by CSS and never typed. The ladder gets louder
          as the claim gets stronger — <code>[LAUNCHED]</code> is the only
          filled badge in the system, so it cannot be reached by accident.
        </p>
        <p>
          <span class="badge badge-planned">planned</span>
          <span class="badge badge-seed">seed</span>
          <span class="badge badge-alpha">alpha</span>
          <span class="badge badge-beta">beta</span>
          <span class="badge badge-launched">launched</span>
        </p>

        <h3>Elevation</h3>
        <p>
          Four steps, and this surface spends none of them on blur: a thing
          that is higher here is higher because its border is heavier.
          <a href="/brand/product-theme.css">The application layer</a>
          re-expresses the same four steps as real shadows, because a menu
          opening over a table has to look like it is floating. Same tokens,
          same markup, different surface.
        </p>
        <div class="cards">
          <div class="card"><h3>Card</h3><p>Elevation 2. The commons' one container: square, one visible border, and its whole hover state is that border going accent.</p></div>
          <div class="card card-signal" data-product="sign"><h3>Signal card</h3><p>The same card with one edge rule in a product's signal colour. A card is identified along one edge and nowhere else.</p></div>
        </div>

        <h3>Callouts</h3>
        <div class="callout callout-warn"><strong>Warn — in progress.</strong> Used for a limitation a reader must know before adopting something.</div>
        <div class="callout callout-good" style="margin-top: var(--space-2xs)"><strong>OK — settled.</strong> Used for something verified: a gate passed, a claim checked.</div>
        <div class="callout callout-note" style="margin-top: var(--space-2xs)"><strong>Accent — attention.</strong> Used sparingly, and never twice on one screen.</div>

        <h2 id="marks">The marks</h2>
        <p>
          Every mark is a 32-unit grid, a 3-unit margin, a 2-unit stroke, and
          no curve anywhere — because nothing in this theme has one. Each was
          checked at 16 pixels before it was checked at 96, which is why
          Booking's calendar has six cells and not thirty. Exactly one element
          per mark is saturated, and it is that product's signal.
        </p>
        <p><img src="/brand/pumasi-logo.svg" alt="The Pumasi lockup: the bracketed mark beside the wordmark." width="288" height="80"></p>
        <div class="swatches">
          <div class="swatch"><div class="swatch-chip" style="display: grid; place-items: center; background: var(--paper-sunken)"><img src="/brand/pumasi-icon.svg" alt="The Pumasi commons mark: three bars of unequal length inside a pair of brackets." width="32" height="32"></div><div class="swatch-label">commons</div></div>
          <div class="swatch"><div class="swatch-chip" style="display: grid; place-items: center; background: var(--paper-sunken)"><img src="/brand/pumasi-sign-icon.svg" alt="The Pumasi Sign mark: a page with a turned corner and a diamond seal." width="32" height="32"></div><div class="swatch-label">sign</div></div>
          <div class="swatch"><div class="swatch-chip" style="display: grid; place-items: center; background: var(--paper-sunken)"><img src="/brand/pumasi-booking-icon.svg" alt="The Pumasi Booking mark: a calendar of six cells with one taken." width="32" height="32"></div><div class="swatch-label">booking</div></div>
          <div class="swatch"><div class="swatch-chip" style="display: grid; place-items: center; background: var(--paper-sunken)"><img src="/brand/pumasi-tunnel-icon.svg" alt="The Pumasi Tunnel mark: three lanes collapsing into one outbound stream." width="32" height="32"></div><div class="swatch-label">tunnel</div></div>
        </div>
        <p>
          Each file resolves its colours twice: it reads the page's token when
          there is one, and falls back to a literal when there is not — with
          its own <code>prefers-color-scheme</code> block choosing which
          literal. So one file is correct inlined and correct in an
          <code>&lt;img&gt;</code>, in light and in dark. The architecture
          drawings work the same way:
          <a href="/brand/arch-commons.svg">commons</a>,
          <a href="/brand/arch-sign.svg">sign</a>,
          <a href="/brand/arch-booking.svg">booking</a>,
          <a href="/brand/arch-tunnel.svg">tunnel</a>.
        </p>

        <h2 id="reuse">Taking the theme</h2>
        <p>
          Tokens are named for their role — <code>--accent</code>, never
          <code>--green</code>. A token named for what it looks like has to be
          renamed when the look changes, which is how a theme layer stops being
          one. Another Pumasi product can link this file and inherit the
          palette, the type scale and the spacing without inheriting this
          website's layout:
        </p>
        <pre tabindex="0"><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;https://pumasi.ai/theme.css&quot;&gt;
&lt;link rel=&quot;stylesheet&quot; href=&quot;https://pumasi.ai/base.css&quot;&gt;
&lt;link rel=&quot;stylesheet&quot; href=&quot;https://pumasi.ai/brand/product-theme.css&quot;&gt;
&lt;body data-product=&quot;sign&quot;&gt;</code></pre>
        <p>
          The third file is optional and is for applications rather than
          documents: it moves body text to the proportional stack, turns the
          four elevation steps into real shadows, and adds the form controls a
          website does not have. It changes no colour, no type scale and no
          corner. <code>data-product</code> binds <code>--signal</code>, and a
          signal never colours a control.
        </p>
        <p>
          Or copy the file. It is Apache-2.0, it has no dependencies, and it is
          under three hundred lines. Copying it is the expected thing to do —
          this is a commons, and a vendored copy that cannot break when someone
          else deploys is worth more than a shared URL that can.
        </p>`;
}
