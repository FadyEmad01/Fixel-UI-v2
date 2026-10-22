/**
 * URL identity for resources.
 *
 * A resource is looked up by its normalized URL, so a shared link with a
 * trailing slash, an uppercase host, or a `www.` prefix still resolves. Kept
 * dependency-free because the sync script imports it directly under Node.
 */

/**
 * Returns the canonical form of a site URL, or `null` when it is not a usable
 * http(s) address.
 *
 * Normalization drops the hash, the `www.` prefix, default ports, and a
 * trailing slash (except on the root path). Path case and query strings are
 * preserved: `/Docs` and `/docs` are different pages on some hosts.
 */
export function normalizeResourceUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  url.hash = "";
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";

  return url.toString();
}

/** The bare hostname of a resource URL, for fallbacks and captions. */
export function resourceHost(value: string): string {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}
