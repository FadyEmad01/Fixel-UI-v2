export function easingsHref(slug?: string): string {
  const params = new URLSearchParams();
  if (slug) params.set("slug", slug);

  const query = params.toString();
  return query ? `/easing?${query}` : "/easing";
}

export function easingViewerHref(slug: string): string {
  const path = `/easing/${encodeURIComponent(slug)}`;
  return path;
}
