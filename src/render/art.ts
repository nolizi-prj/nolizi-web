/**
 * The art system.
 *
 * Every picture on this site is SVG generated here and inlined into the page.
 * That is not a purity exercise — it buys four things at once:
 *
 *  1. **It themes itself.** Inline SVG inherits the page's CSS custom
 *     properties, so one drawing is correct in light and in dark without a
 *     second file and without a `<picture>` element.
 *  2. **No extra requests, at any size.** Nothing to lazy-load, no layout
 *     shift, no CDN.
 *  3. **Sharp on every screen**, including the phone this is designed for
 *     first, with no `srcset`.
 *  4. **Deterministic.** Compositions are seeded from the page's slug, so every
 *     product and post has its own picture that never changes between builds.
 *
 * The vocabulary matches the theme: square corners, visible structure, a
 * terminal's way of showing a list. Nothing here has a curve in it, because
 * nothing in the theme does.
 */

/* -------------------------------------------------------------------
 * A small deterministic generator. Same slug in, same picture out.
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

function open(width: number, height: number, title?: string): string {
  const id = `art-${hashString(title ?? String(width * height)).toString(36)}`;
  const label = title ? ` role="img" aria-labelledby="${id}"` : ` aria-hidden="true"`;
  const titleTag = title ? `<title id="${id}">${title}</title>` : "";
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false"${label}>${titleTag}`;
}

/* -------------------------------------------------------------------
 * The mark
 * ------------------------------------------------------------------- */

/**
 * A bracketed stack: three rows of work inside a boundary. It has to survive
 * being 16 pixels wide in a browser tab, so it is two brackets and three bars
 * and nothing else.
 */
export function logoMark(className = "mark"): string {
  return `<svg class="${className}" viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <path d="M 8 3 L 3 3 L 3 29 L 8 29" fill="none" stroke="var(--ink-strong)" stroke-width="2"/>
    <path d="M 24 3 L 29 3 L 29 29 L 24 29" fill="none" stroke="var(--ink-strong)" stroke-width="2"/>
    <rect x="9" y="8" width="14" height="3" fill="var(--accent)"/>
    <rect x="9" y="14.5" width="10" height="3" fill="var(--warn)"/>
    <rect x="9" y="21" width="14" height="3" fill="var(--ok)"/>
  </svg>`;
}

/**
 * The same mark as a standalone file. A favicon gets no page CSS, so the
 * colours are literal here and a media query handles dark browser chrome.
 */
export function faviconSvg(): string {
  return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <style>
    .k{stroke:#0a0a09}.a{fill:#197a3d}.b{fill:#9a5b00}.c{fill:#5f5f58}
    @media (prefers-color-scheme: dark){
      .k{stroke:#f2f7f4}.a{fill:#55d37c}.b{fill:#e0a955}.c{fill:#94a09a}
    }
  </style>
  <path class="k" d="M 8 3 L 3 3 L 3 29 L 8 29" fill="none" stroke-width="2"/>
  <path class="k" d="M 24 3 L 29 3 L 29 29 L 24 29" fill="none" stroke-width="2"/>
  <rect class="a" x="9" y="8" width="14" height="3"/>
  <rect class="b" x="9" y="14.5" width="10" height="3"/>
  <rect class="c" x="9" y="21" width="14" height="3"/>
</svg>
`;
}

/* -------------------------------------------------------------------
 * The hero
 * ------------------------------------------------------------------- */

/**
 * The commons as a terminal listing: everything the market already charges
 * rent for, most of it still an empty checkbox, one row shipped. It states the
 * project's position — one product exists, the backlog is public — in a form
 * nobody has to read a paragraph to get.
 */
export function heroArt(): string {
  const W = 720;
  const H = 520;
  const title =
    "A terminal-style listing of software the commons could build, drawn as boxed rows, with one row checked off and marked shipped and the others still empty.";

  const rows = [8, 5, 11, 6, 9, 7, 12, 5]
    .map((len, i) => {
      const y = 96 + i * 46;
      const done = i === 2;
      return `<g>
    <rect x="48" y="${y}" width="${W - 96}" height="34" fill="none" stroke="var(--art-4)" stroke-width="1.5"/>
    <text x="62" y="${y + 23}" font-family="ui-monospace, monospace" font-size="14" fill="${done ? "var(--art-1)" : "var(--art-3)"}">${done ? "[x]" : "[ ]"}</text>
    <rect x="98" y="${y + 13}" width="${len * 13}" height="8" fill="${done ? "var(--art-1)" : "var(--art-4)"}" opacity="${done ? 1 : 0.6}"/>
    ${
      done
        ? `<text x="${W - 118}" y="${y + 23}" font-family="ui-monospace, monospace" font-size="12" fill="var(--art-1)">shipped</text>`
        : `<rect x="${W - 118}" y="${y + 14}" width="52" height="6" fill="var(--art-4)" opacity="0.45"/>`
    }
  </g>`;
    })
    .join("\n  ");

  return `${open(W, H, title)}
  <rect width="${W}" height="${H}" fill="var(--art-ground)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="var(--art-ink)" stroke-width="2" opacity="0.5"/>
  <text x="48" y="66" font-family="ui-monospace, monospace" font-size="15" fill="var(--art-1)">$ pumasi catalog --what-exists</text>
  <line x1="24" y1="80" x2="${W - 24}" y2="80" stroke="var(--art-ink)" stroke-width="1" opacity="0.3"/>
  ${rows}
</svg>`;
}

/* -------------------------------------------------------------------
 * Seeded compositions
 * ------------------------------------------------------------------- */

/** A woven plot, seeded from a page's slug. Product cards and figures. */
export function plotArt(seed: string, width = 560, height = 240, density = 0.5): string {
  const random = rng(hashString(seed));
  const cols = 14;
  const rows = 6;
  const cw = width / cols;
  const ch = height / rows;
  const cells: string[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (random() > density) continue;
      const colour = pick(random, PALETTE);
      const x = round(c * cw);
      const y = round(r * ch);
      const inset = round(cw * 0.1);
      const opacity = round(0.18 + random() * 0.5);
      const shape = random();

      if (shape < 0.55) {
        cells.push(
          `<rect x="${round(x + inset)}" y="${round(y + inset)}" width="${round(cw - inset * 2)}" height="${round(ch - inset * 2)}" fill="${colour}" opacity="${opacity}"/>`,
        );
      } else if (shape < 0.85) {
        cells.push(
          [1, 2, 3]
            .map((i) => {
              const ly = round(y + (ch / 4) * i);
              return `<line x1="${round(x + inset)}" y1="${ly}" x2="${round(x + cw - inset)}" y2="${ly}" stroke="${colour}" stroke-width="1.5" opacity="${opacity}"/>`;
            })
            .join(""),
        );
      } else {
        const s = round(Math.min(cw, ch) * 0.4);
        cells.push(
          `<rect x="${round(x + cw / 2 - s / 2)}" y="${round(y + ch / 2 - s / 2)}" width="${s}" height="${s}" fill="${colour}" opacity="${opacity}"/>`,
        );
      }
    }
  }

  return `${open(width, height)}
  <rect width="${width}" height="${height}" fill="var(--art-ground)"/>
  ${cells.join("\n  ")}
</svg>`;
}

/** A wide banner for a post: the same vocabulary arranged as a horizon. */
export function coverArt(seed: string, width = 1000, height = 320): string {
  const random = rng(hashString(seed) ^ 0x9e3779b9);
  const baseline = height * 0.72;

  const columns: string[] = [];
  const count = 34;
  for (let i = 0; i < count; i += 1) {
    const x = round((i / count) * width);
    const w = round(width / count - 3);
    const h = round(24 + random() ** 1.7 * (height * 0.55));
    columns.push(
      `<rect x="${x}" y="${round(baseline - h)}" width="${w}" height="${h}" fill="${pick(random, PALETTE)}" opacity="${round(0.18 + random() * 0.45)}"/>`,
    );
  }

  const seeds: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    const cx = round(random() * width);
    const cy = round(random() * baseline * 0.7);
    const r = round(2 + random() * 5);
    seeds.push(
      `<rect x="${round(cx - r)}" y="${round(cy - r)}" width="${round(r * 2)}" height="${round(r * 2)}" fill="var(--art-2)" opacity="${round(0.2 + random() * 0.4)}"/>`,
    );
  }

  return `${open(width, height)}
  <rect width="${width}" height="${height}" fill="var(--art-ground)"/>
  ${seeds.join("\n  ")}
  ${columns.join("\n  ")}
  <line x1="0" y1="${round(baseline)}" x2="${width}" y2="${round(baseline)}" stroke="var(--art-ink)" stroke-width="1.5" opacity="0.28"/>
</svg>`;
}

/**
 * A diagram, not a decoration: the merge gate as five stops, which is the
 * single fact about Pumasi hardest to convey in a sentence.
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
      <rect x="${cx - 26}" y="70" width="52" height="52" fill="${last ? "var(--art-1)" : "var(--art-ground)"}" stroke="${last ? "var(--art-1)" : "var(--art-2)"}" stroke-width="2.5"/>
      <text x="${cx}" y="103" text-anchor="middle" font-family="ui-monospace, monospace" font-size="17" font-weight="600" fill="${last ? "var(--art-ground)" : "var(--art-ink)"}">${i + 1}</text>
      <text x="${cx}" y="152" text-anchor="middle" font-family="ui-monospace, monospace" font-size="15" font-weight="600" fill="var(--art-ink)">${stop.label}</text>
      <text x="${cx}" y="176" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="var(--art-ink)" opacity="0.62">${stop.sub}</text>
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
  <rect width="${W}" height="${H}" fill="var(--art-ground)"/>
  <g>${rails}</g>
  ${nodes}
</svg>`;
}
