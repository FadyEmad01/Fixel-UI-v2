/** Shareable catalog and live-preview URLs. */

/**
 * `UI` → `ui`, `Text Effects` → `text-effects`.
 *
 * The live preview route reads this segment, so it must be stable and
 * URL-safe: only lowercase letters, digits, and single hyphens survive.
 */
export function categorySlug(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function componentsHref(tag?: string): string {
  return tag ? `/components?tag=${encodeURIComponent(tag)}` : "/components";
}

export function componentHref(slug: string): string {
  return `/components/${encodeURIComponent(slug)}`;
}

/** The mock in `doc-page.tsx` uses `/preview/ui/apple-folder`. */
export function previewHref(category: string, slug: string): string {
  return `/preview/${categorySlug(category)}/${encodeURIComponent(slug)}`;
}
