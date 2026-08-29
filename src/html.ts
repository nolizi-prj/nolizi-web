/** The five characters that must never reach the browser as markup. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaping for text nodes inside XML documents (sitemap, Atom feed). */
export function escapeXml(input: string): string {
  return escapeHtml(input);
}

/** Join class names, dropping the falsy ones. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Render an attribute only when it has a value. */
export function attr(name: string, value: string | undefined | null): string {
  return value ? ` ${name}="${escapeHtml(value)}"` : "";
}

/** Collapse the indentation that template literals introduce. */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce<string>(
    (acc, part, i) => acc + part + (i < values.length ? String(values[i] ?? "") : ""),
    "",
  );
}
