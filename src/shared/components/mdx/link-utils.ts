/**
 * True for hrefs `next/link` must not handle — absolute URLs (`https:`,
 * `mailto:`, `tel:`) and protocol-relative URLs (`//cdn.example.com`).
 * Relative paths, hashes, and query strings stay internal.
 */
export function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i.test(href);
}
