/** Shareable catalog and full-screen illustration URLs. */
export function illustrationsHref(tag?: string, slug?: string): string {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (slug) params.set("slug", slug);

  const query = params.toString();
  return query ? `/illustration?${query}` : "/illustration";
}

export function illustrationViewerHref(slug: string, tag?: string): string {
  const path = `/illustration/${encodeURIComponent(slug)}`;
  return tag ? `${path}?tag=${encodeURIComponent(tag)}` : path;
}
