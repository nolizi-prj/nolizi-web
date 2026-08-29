/**
 * Front matter: a deliberately small, strictly-parsed subset of YAML.
 *
 * Why not a YAML library: the only thing above the `---` fences in this
 * repository is scalars, flow sequences and block sequences. A full YAML parser
 * would accept a great deal this site has no meaning for, and would resolve
 * ambiguous input silently.
 *
 * The rule this parser follows instead is the one the commons applies to
 * scheduling: **never guess**. Anything outside the documented subset raises,
 * with the file and line in the message, and fails the build. A page that
 * renders with a silently-dropped `description` is worse than a build that
 * stops.
 *
 * Supported:
 *
 *     key: bare scalar
 *     key: "quoted scalar"      (also single quotes)
 *     key: true | false          (booleans)
 *     key: 42                    (numbers)
 *     key: [a, b, "c d"]         (flow sequence)
 *     key:                       (block sequence)
 *       - a
 *       - "b"
 *     # comments, on their own line
 */

export interface ParsedFile {
  data: Record<string, unknown>;
  body: string;
}

const FENCE = /^---\r?\n/;

export class FrontMatterError extends Error {
  constructor(message: string, readonly file: string, readonly line: number) {
    super(`${file}:${line}: ${message}`);
    this.name = "FrontMatterError";
  }
}

/** Split a file into front matter and body. A file without fences has no data. */
export function parseFile(raw: string, file = "<memory>"): ParsedFile {
  const text = raw.replace(/^﻿/, "");
  if (!FENCE.test(text)) return { data: {}, body: text };

  const afterOpen = text.replace(FENCE, "");
  const close = afterOpen.search(/^---[ \t]*\r?$/m);
  if (close === -1) {
    throw new FrontMatterError("front matter opened with --- but never closed", file, 1);
  }
  const block = afterOpen.slice(0, close);
  const body = afterOpen.slice(close).replace(/^---[ \t]*\r?\n?/, "");
  // +1 for the opening fence line, so reported line numbers match the real file.
  return { data: parseBlock(block, file, 2), body: body.replace(/^\r?\n/, "") };
}

function parseBlock(block: string, file: string, firstLine: number): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const lines = block.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const lineNo = firstLine + i;
    i += 1;

    if (raw.trim() === "" || raw.trimStart().startsWith("#")) continue;

    if (/^\s/.test(raw)) {
      throw new FrontMatterError(`unexpected indentation: ${raw.trim()}`, file, lineNo);
    }

    const colon = raw.indexOf(":");
    if (colon === -1) {
      throw new FrontMatterError(`expected "key: value", got: ${raw.trim()}`, file, lineNo);
    }

    const key = raw.slice(0, colon).trim();
    if (key === "") throw new FrontMatterError("empty key", file, lineNo);
    if (key in out) throw new FrontMatterError(`duplicate key "${key}"`, file, lineNo);

    const rest = raw.slice(colon + 1).trim();

    if (rest === "") {
      // Block sequence, or an explicitly empty value.
      const items: unknown[] = [];
      while (i < lines.length && /^\s*-\s/.test(lines[i] ?? "")) {
        const item = (lines[i] ?? "").replace(/^\s*-\s+/, "");
        items.push(scalar(item, file, firstLine + i));
        i += 1;
      }
      if (items.length === 0) {
        throw new FrontMatterError(
          `"${key}" has no value and no "- " list beneath it`,
          file,
          lineNo,
        );
      }
      out[key] = items;
      continue;
    }

    if (rest.startsWith("[")) {
      if (!rest.endsWith("]")) {
        throw new FrontMatterError(
          `flow sequence for "${key}" must open and close on one line`,
          file,
          lineNo,
        );
      }
      const inner = rest.slice(1, -1).trim();
      out[key] = inner === "" ? [] : splitFlow(inner, file, lineNo).map((p) => scalar(p, file, lineNo));
      continue;
    }

    out[key] = scalar(rest, file, lineNo);
  }

  return out;
}

/** Split on commas that are not inside quotes. */
function splitFlow(inner: string, file: string, line: number): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === ",") {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (quote) throw new FrontMatterError("unterminated quote in flow sequence", file, line);
  parts.push(current.trim());
  return parts.filter((p) => p !== "");
}

function scalar(input: string, file: string, line: number): unknown {
  const value = stripComment(input).trim();

  if (value === "") throw new FrontMatterError("empty value", file, line);

  const quoted = value.match(/^"(.*)"$/s) ?? value.match(/^'(.*)'$/s);
  if (quoted) return quoted[1] ?? "";

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (/^-?\d*\.\d+$/.test(value)) return Number(value);

  if (value.includes(": ")) {
    throw new FrontMatterError(
      `unquoted value contains ": " and would be ambiguous — quote it: ${value}`,
      file,
      line,
    );
  }
  return value;
}

/** Drop a trailing ` # comment`, but never a `#` inside quotes or mid-word. */
function stripComment(input: string): string {
  if (/^["']/.test(input.trim())) return input;
  const at = input.search(/\s+#/);
  return at === -1 ? input : input.slice(0, at);
}
