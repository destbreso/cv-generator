/**
 * CVs here are plain text: no template renders Markdown. Models still like to
 * add emphasis ("**ensuring WCAG AA accessibility**"), and those markers then
 * show up literally in the preview and the printed CV. This strips inline
 * Markdown emphasis and code spans from every string in a value, recursively,
 * keeping the words. Asterisks that are not paired emphasis are left alone,
 * except a stray "**", which never means anything in a CV.
 */
export function stripInlineMarkdown<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*/g, "") as T;
  }
  if (Array.isArray(value)) return value.map(stripInlineMarkdown) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stripInlineMarkdown(v)])) as T;
  }
  return value;
}
