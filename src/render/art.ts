/**
 * The art system.
 *
 * Every picture on this site is SVG generated here and inlined into the page.
 * That is not a purity exercise — it buys four things at once:
 *
 *  1. **It themes itself.** Inline SVG inherits the page's CSS custom
 *     properties, so one drawing is correct in light and in dark. An `<img>`
 *     cannot do this; it would need two files and a `<picture>` element.
 *  2. **No extra requests, at any size.** Nothing to lazy-load, nothing to
 *     wait for, no layout shift, no CDN, nothing to consent to.
 *  3. **It is sharp on every screen**, including the phone this is designed
 *     for first, without a `srcset`.
 *  4. **It is deterministic.** Compositions are seeded from the page's slug, so
 *     every product and post gets its own picture that never changes between
 *     builds — a real image, not a stock photo, and not a surprise in a diff.
 *
 * The geometry is the same idea throughout: a field, divided into plots, worked
 * in rows. Pumasi is neighbours working one another's fields in turn.
 */

/* -------------------------------------------------------------------
 * A small deterministic generator. Same slug in, same picture out,
 * forever.
 * ------------------------------------------------------------------- */

function hashString(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, well-distributed enough for arranging squares. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = ["var(--art-1)", "var(--art-2)", "var(--art-3)", "var(--art-4)"];

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)] as T;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Wrapper attributes shared by every drawing. */
function open(
  width: number,
  height: number,
  opts: { title?: string; className?: string } = {},
): string {
  const label = opts.title
    ? ` role="img" aria-labelledby="art-${hashString(opts.title).toString(36)}"`
    : ` aria-hidden="true"`;
  const cls = opts.className ? ` class="${opts.className}"` : "";
  const titleTag = opts.title
    ? `<title id="art-${hashString(opts.title).toString(36)}">${opts.title}</title>`
    : "";
  return `<svg${cls} viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false"${label}>${titleTag}`;
}

/* -------------------------------------------------------------------
 * The mark
 * ------------------------------------------------------------------- */

/**
 * Three arcs, each turning into the next: work handed on and coming back.
 * It has to survive being 16 pixels wide in a browser tab, so it is three
 * strokes and a dot and nothing else.
 */
export function logoMark(className = "mark"): string {
  const arc = (rotation: number, colour: string) =>
    `<path d="M 16 4 A 12 12 0 0 1 26.39 10" fill="none" stroke="${colour}" stroke-width="4.5" stroke-linecap="round" transform="rotate(${rotation} 16 16)"/>` +
    `<path d="M 16 8.5 A 7.5 7.5 0 0 1 22.5 12.25" fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round" opacity="0.55" transform="rotate(${rotation} 16 16)"/>`;

  return `<svg class="${className}" viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    ${arc(0, "var(--clay)")}
    ${arc(120, "var(--wheat)")}
    ${arc(240, "var(--sage)")}
    <circle cx="16" cy="16" r="2.6" fill="var(--ink-strong)"/>
  </svg>`;
}

/** The same mark as a standalone file. Favicons get no page CSS, so the
 *  colours are literal here and a media query handles dark tabs. */
export function faviconSvg(): string {
  const arc = (rotation: number, light: string, dark: string, cls: string) =>
    `<path class="${cls}" d="M 16 4 A 12 12 0 0 1 26.39 10" fill="none" stroke="${light}" stroke-width="4.5" stroke-linecap="round" transform="rotate(${rotation} 16 16)" data-dark="${dark}"/>`;

  return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <style>
    .a { stroke: #a8452a } .b { stroke: #9a6f16 } .c { stroke: #4c6647 } .d { fill: #2c2620 }
    @media (prefers-color-scheme: dark) {
      .a { stroke: #e8865c } .b { stroke: #dcae55 } .c { stroke: #9dbb94 } .d { fill: #ece3d4 }
    }
  </style>
  ${arc(0, "currentColor", "", "a")}
  ${arc(120, "currentColor", "", "b")}
  ${arc(240, "currentColor", "", "c")}
  <circle class="d" cx="16" cy="16" r="2.6"/>
</svg>
`.replace(/stroke="currentColor" /g, "");
}

/* -------------------------------------------------------------------
 * The hero
 * ------------------------------------------------------------------- */

/**
 * A field in perspective: rows running to a horizon, three plots worked in
 * turn, and a row of built things standing on the skyline. The three plot
 * colours are the three model families the merge gate requires — the picture
 * is the process.
 */
export function heroArt(): string {
  const W = 720;
  const H = 520;
  const horizon = 196;
  const vanishX = W * 0.52;

  const furrows: string[] = [];
  for (let i = 0; i <= 22; i += 1) {
    const t = i / 22;
    const bottomX = -W * 0.7 + t * (W * 2.4);
    const opacity = round(0.10 + 0.2 * (1 - Math.abs(t - 0.5) * 2) ** 2);
    furrows.push(
      `<line x1="${round(bottomX)}" y1="${H}" x2="${round(vanishX)}" y2="${horizon}" stroke="var(--art-ink)" stroke-width="1.25" opacity="${opacity}"/>`,
    );
  }

  // Contour bands across the rows, closer together as they recede.
  const bands: string[] = [];
  for (let i = 1; i <= 7; i += 1) {
    const t = i / 8;
    const y = round(horizon + (H - horizon) * t ** 2.1);
    bands.push(
      `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="var(--art-ink)" stroke-width="1" opacity="${round(0.06 + t * 0.1)}"/>`,
    );
  }

  // Three plots, overlapping where the work is shared.
  const plot = (points: string, colour: string, opacity: number) =>
    `<polygon points="${points}" fill="${colour}" opacity="${opacity}"/>`;

  // Built things on the skyline: one solid (Pumasi Booking), the rest outlined
  // (what the commons has not built yet).
  const skyline: string[] = [];
  const widths = [26, 18, 22, 14, 30, 16, 20];
  let x = 96;
  widths.forEach((w, i) => {
    const h = 22 + ((i * 13) % 26);
    const solid = i === 4;
    skyline.push(
      solid
        ? `<rect x="${x}" y="${horizon - h}" width="${w}" height="${h}" rx="2" fill="var(--art-1)"/>`
        : `<rect x="${x}" y="${horizon - h}" width="${w}" height="${h}" rx="2" fill="none" stroke="var(--art-ink)" stroke-width="1.5" opacity="0.32" stroke-dasharray="3 3"/>`,
    );
    x += w + 22;
  });

  return `${open(W, H, { title: "A field worked in rows, its plots divided between three neighbours, with one finished building standing on the skyline among the outlines of the ones not yet built." })}
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--art-2)" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="var(--art-1)" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--art-4)" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="var(--art-4)" stop-opacity="0.26"/>
    </linearGradient>
    <clipPath id="frame"><rect x="0" y="0" width="${W}" height="${H}" rx="18"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="var(--art-ground)"/>
    <rect width="${W}" height="${horizon}" fill="url(#sky)"/>
    <circle cx="${round(W * 0.78)}" cy="72" r="40" fill="var(--art-2)" opacity="0.5"/>
    <rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#soil)"/>
    <g>${furrows.join("\n    ")}</g>
    <g>${bands.join("\n    ")}</g>
    ${plot("40,520 250,520 200,240 118,240", "var(--art-1)", 0.2)}
    ${plot("250,520 470,520 392,240 200,240", "var(--art-3)", 0.16)}
    ${plot("470,520 690,520 520,240 392,240", "var(--art-2)", 0.14)}
    <line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="var(--art-ink)" stroke-width="1.5" opacity="0.25"/>
    <g>${skyline.join("\n    ")}</g>
  </g>
</svg>`;
}

/* -------------------------------------------------------------------
 * Seeded compositions
 * ------------------------------------------------------------------- */

/**
 * A woven plot: a grid where each cell is worked or left fallow, seeded from
 * the page slug. Used for product cards and post covers, so every page has its
 * own picture and the family still reads as one set.
 */
export function plotArt(seed: string, width = 560, height = 240, density = 0.5): string {
  const random = rng(hashString(seed));
  const cols = 14;
  const rows = 6;
  const cw = width / cols;
  const ch = height / rows;
  const cells: string[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const roll = random();
      if (roll > density) continue;
      const colour = pick(random, PALETTE);
      const x = round(c * cw);
      const y = round(r * ch);
      const inset = round(cw * 0.1);
      const opacity = round(0.18 + random() * 0.5);

      // Three marks in the vocabulary: a worked block, a row of furrows, a
      // seed. Which one appears is seeded, so it is stable per page.
      const shape = random();
      if (shape < 0.55) {
        cells.push(
          `<rect x="${round(x + inset)}" y="${round(y + inset)}" width="${round(cw - inset * 2)}" height="${round(ch - inset * 2)}" rx="${round(cw * 0.14)}" fill="${colour}" opacity="${opacity}"/>`,
        );
      } else if (shape < 0.85) {
        const lines = [1, 2, 3]
          .map((i) => {
            const ly = round(y + (ch / 4) * i);
            return `<line x1="${round(x + inset)}" y1="${ly}" x2="${round(x + cw - inset)}" y2="${ly}" stroke="${colour}" stroke-width="1.5" opacity="${opacity}" stroke-linecap="round"/>`;
          })
          .join("");
        cells.push(lines);
      } else {
        cells.push(
          `<circle cx="${round(x + cw / 2)}" cy="${round(y + ch / 2)}" r="${round(Math.min(cw, ch) * 0.22)}" fill="${colour}" opacity="${opacity}"/>`,
        );
      }
    }
  }

  return `${open(width, height)}
  <rect width="${width}" height="${height}" fill="var(--art-ground)"/>
  ${cells.join("\n  ")}
</svg>`;
}

/**
 * A wide cover for a post: the same vocabulary as `plotArt`, arranged as a
 * horizon so it reads as a banner rather than a swatch.
 */
export function coverArt(seed: string, width = 1000, height = 320): string {
  const random = rng(hashString(seed) ^ 0x9e3779b9);
  const baseline = height * 0.72;

  const columns: string[] = [];
  const count = 34;
  for (let i = 0; i < count; i += 1) {
    const x = round((i / count) * width);
    const w = round(width / count - 3);
    const h = round(24 + random() ** 1.7 * (height * 0.55));
    const colour = pick(random, PALETTE);
    columns.push(
      `<rect x="${x}" y="${round(baseline - h)}" width="${w}" height="${h}" rx="3" fill="${colour}" opacity="${round(0.18 + random() * 0.45)}"/>`,
    );
  }

  const seeds: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    seeds.push(
      `<circle cx="${round(random() * width)}" cy="${round(random() * baseline * 0.7)}" r="${round(2 + random() * 5)}" fill="var(--art-2)" opacity="${round(0.2 + random() * 0.4)}"/>`,
    );
  }

  return `${open(width, height)}
  <rect width="${width}" height="${height}" fill="var(--art-ground)"/>
  ${seeds.join("\n  ")}
  ${columns.join("\n  ")}
  <line x1="0" y1="${round(baseline)}" x2="${width}" y2="${round(baseline)}" stroke="var(--art-ink)" stroke-width="1.5" opacity="0.28"/>
  <g opacity="0.14">
    ${Array.from({ length: 6 }, (_, i) => {
      const y = round(baseline + ((height - baseline) / 6) * (i + 1));
      return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="var(--art-ink)" stroke-width="1"/>`;
    }).join("\n    ")}
  </g>
</svg>`;
}

/**
 * A diagram, not a decoration: the merge gate as four gates in a row, which is
 * the single fact about Pumasi that is hardest to convey in a sentence.
 */
export function mergeGateArt(): string {
  const W = 900;
  const H = 260;
  const stops = [
    { label: "Spec", sub: "written, with tests" },
    { label: "Review", sub: "a different model family" },
    { label: "Build", sub: "tests frozen, untouchable" },
    { label: "Review", sub: "a third family" },
    { label: "Merged", sub: "signed, costed, on the record" },
  ];
  const gap = W / stops.length;

  const nodes = stops
    .map((stop, i) => {
      const cx = round(gap * i + gap / 2);
      const last = i === stops.length - 1;
      return `<g>
      <circle cx="${cx}" cy="96" r="26" fill="${last ? "var(--art-3)" : "var(--art-ground)"}" stroke="${last ? "var(--art-3)" : "var(--art-1)"}" stroke-width="2.5" opacity="${last ? 0.9 : 1}"/>
      <text x="${cx}" y="102" text-anchor="middle" font-family="ui-monospace, monospace" font-size="17" font-weight="600" fill="var(--art-ink)">${i + 1}</text>
      <text x="${cx}" y="152" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17" font-weight="600" fill="var(--art-ink)">${stop.label}</text>
      <text x="${cx}" y="176" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" fill="var(--art-ink)" opacity="0.62">${stop.sub}</text>
    </g>`;
    })
    .join("\n    ");

  const rails = stops
    .slice(0, -1)
    .map((_, i) => {
      const x1 = round(gap * i + gap / 2 + 30);
      const x2 = round(gap * (i + 1) + gap / 2 - 30);
      return `<line x1="${x1}" y1="96" x2="${x2}" y2="96" stroke="var(--art-ink)" stroke-width="1.5" opacity="0.3" stroke-dasharray="5 5"/>`;
    })
    .join("\n    ");

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="art-gate" focusable="false" preserveAspectRatio="xMidYMid meet">
  <title id="art-gate">The merge gate: a specification with tests, reviewed by a different model family; a build that may not edit the frozen tests; a code review from a third family; and a merge recorded with its agent, model, sponsor and token cost.</title>
  <rect width="${W}" height="${H}" fill="var(--art-ground)" rx="14"/>
  <g>${rails}</g>
  ${nodes}
</svg>`;
}
