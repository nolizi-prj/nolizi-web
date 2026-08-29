/**
 * Theme preview: build the whole site once per theme and serve each on its own
 * port, with a switcher bar that keeps you on the page you were reading.
 *
 * Same content, same markup, same generator — only the stylesheet and a little
 * art shape information differ. That is the point of the comparison: any
 * difference you see between the three is a difference the theme is
 * responsible for, not a difference in the writing.
 *
 * This is review machinery. Nothing here runs in a real build, and the bar it
 * injects appears in no published page.
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "./build.js";
import { THEMES } from "./themes.js";
import { escapeHtml } from "./html.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_PORT = Number(process.env.PORT ?? 8081);

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
};

function barFor(currentIndex: number): (urlPath: string) => string {
  return (urlPath: string) => {
    const links = THEMES.map((theme, i) => {
      const href = `http://localhost:${BASE_PORT + i}${urlPath}`;
      const current = i === currentIndex ? ' aria-current="true"' : "";
      return `<a href="${escapeHtml(href)}"${current}>${i + 1} · ${escapeHtml(theme.name)}</a>`;
    }).join("\n      ");

    const theme = THEMES[currentIndex];
    return `<div class="preview-bar">
      <b>PICK A DESIGN</b>
      ${links}
      <span class="note">${escapeHtml(theme?.lineage ?? "")} — same content and markup in all three</span>
    </div>`;
  };
}

async function serve(dir: string, port: number): Promise<void> {
  const root = resolve(dir);
  return new Promise((ready) => {
    createServer(async (req, res) => {
      const path = decodeURIComponent((req.url ?? "/").split("?")[0] ?? "/");
      const target = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ""));
      const candidates = path.endsWith("/")
        ? [join(target, "index.html")]
        : [target, `${target}.html`, join(target, "index.html")];

      for (const candidate of candidates) {
        if (!resolve(candidate).startsWith(root)) continue;
        try {
          if ((await stat(candidate)).isFile()) {
            res.writeHead(200, {
              "content-type": TYPES[extname(candidate)] ?? "application/octet-stream",
              "cache-control": "no-cache",
            });
            createReadStream(candidate).pipe(res);
            return;
          }
        } catch {
          /* try the next candidate */
        }
      }
      res.writeHead(404, { "content-type": TYPES[".html"] as string });
      createReadStream(join(root, "404.html"))
        .on("error", () => res.end("404"))
        .pipe(res);
    }).listen(port, () => ready());
  });
}

const lines: string[] = ["", "  Three designs, same site. Compare them side by side:", ""];

for (const [i, theme] of THEMES.entries()) {
  const out = join(ROOT, "preview", theme.id);
  const port = BASE_PORT + i;
  await build(out, { themeId: theme.id, previewBar: barFor(i) });
  await serve(out, port);
  lines.push(`  ${i + 1}. ${theme.name.padEnd(9)} http://localhost:${port}`);
  lines.push(`     ${theme.lineage}`);
  lines.push(`     ${theme.blurb}`);
  lines.push("");
}

lines.push("  The bar at the top of every page switches theme without losing your place.");
lines.push("  Ctrl+C to stop.");
lines.push("");
process.stdout.write(lines.join("\n"));
