/**
 * `/resources` URLs.
 *
 * Both parameters are optional and independent: `tag` filters the grid, `url`
 * opens one resource's sheet. An empty result is the bare path, which keeps
 * "All" a real link rather than an onClick handler.
 */
export function resourcesHref(tag?: string, url?: string): string {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (url) params.set("url", url);

  const query = params.toString();
  return query ? `/resources?${query}` : "/resources";
}
