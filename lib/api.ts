/**
 * Returns the full API path with basePath prefix.
 * Required because client-side fetch() does NOT auto-prepend
 * the Next.js basePath like <Link> does.
 *
 * @example apiPath("/api/generate-cv") → "/cv/api/generate-cv"
 */
export function apiPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}${path}`;
}
