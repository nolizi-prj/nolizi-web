/**
 * A static server for looking at the build locally. Zero dependencies.
 *
 * It exists so that `npm run dev` shows the real thing — the same files a host
 * would serve — rather than a framework's approximation of them. It also
 * resolves extensionless paths the way a static host does, so a link that works
 * here works there.
 */

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "site");
const PORT = Number(process.env.PORT ?? 8080);

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

async function resolveFile(urlPath: string): Promise<string | null> {
  const clean = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, "");
  const base = join(ROOT, safe);

  const candidates = safe.endsWith("/")
    ? [join(base, "index.html")]
    : [base, `${base}.html`, join(base, "index.html")];

  for (const candidate of candidates) {
    if (!resolve(candidate).startsWith(ROOT)) continue;
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? "/");
  if (!file) {
    const notFound = join(ROOT, "404.html");
    res.writeHead(404, { "content-type": TYPES[".html"] as string });
    createReadStream(notFound).on("error", () => res.end("404")).pipe(res);
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  process.stdout.write(`serving ${ROOT}\n  http://localhost:${PORT}\n`);
});
