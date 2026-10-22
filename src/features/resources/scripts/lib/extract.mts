import { parse } from "node-html-parser";

/**
 * Turning a page's `<head>` into card metadata.
 *
 * Pure and dependency-light so it can be tested without a network. Every field
 * is a fallback chain rather than a single tag: sites publish wildly different
 * amounts of metadata, and a missing image must not cost us the description.
 */

export interface PageMetadata {
  /** Short display name for the card. */
  name: string;
  /** The page's raw `<title>`, kept for the detail sheet. */
  title: string | null;
  description: string | null;
  image: string | null;
  icon: string | null;
  siteName: string | null;
  themeColor: string | null;
}

const MAX_DESCRIPTION = 280;
const MAX_NAME = 80;
const MAX_TITLE = 160;

/** Collapse whitespace, trim, drop empties, and cap the length. */
export function cleanText(
  value: string | null | undefined,
  max: number,
): string | null {
  if (!value) return null;
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.length > max ? text.slice(0, max).trimEnd() : text;
}

/**
 * Resolve a metadata value against the page URL.
 *
 * Rejects inline `data:` images and any non-http(s) scheme: the stored value is
 * rendered in an `<img src>`, so it should never be able to be a script URL.
 */
export function absoluteAssetUrl(
  value: string | null | undefined,
  base: string,
): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.startsWith("data:")) return null;

  try {
    const url = new URL(trimmed, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Pick a card title.
 *
 * `og:site_name` wins because it is the brand ("Figma"), not the page headline
 * ("Figma: The Collaborative Interface Design Tool"). Otherwise the title is
 * split on its tagline separator, and the hostname is the last resort.
 */
export function deriveName(
  title: string | null,
  siteName: string | null,
  hostname: string,
): string {
  const brand = cleanText(siteName, MAX_NAME);
  if (brand) return brand;

  const rawTitle = cleanText(title, MAX_TITLE);
  if (rawTitle) {
    const [head] = rawTitle.split(/\s+[|·—–]\s+|\s+-\s+/);
    const candidate = cleanText(head, MAX_NAME);
    if (candidate && candidate.length >= 2) return candidate;
    return cleanText(rawTitle, MAX_NAME) ?? hostname;
  }

  return hostname;
}

interface MetaLookup {
  content(key: string): string | null;
}

function readMeta(html: string): MetaLookup {
  const root = parse(html);
  const values = new Map<string, string>();

  for (const element of root.querySelectorAll("meta")) {
    const key = (
      element.getAttribute("property") ??
      element.getAttribute("name") ??
      ""
    )
      .trim()
      .toLowerCase();
    const content = element.getAttribute("content");

    // First occurrence wins, matching how browsers read duplicate meta tags.
    if (key && content && !values.has(key)) values.set(key, content);
  }

  return {
    content: (key) => values.get(key) ?? null,
  };
}

/** The `<link rel="icon">` chain, preferring the higher-resolution touch icon. */
function readIcon(html: string, base: string): string | null {
  const root = parse(html);
  const candidates: Array<{ rel: string[]; href: string | null }> = [];

  for (const element of root.querySelectorAll("link")) {
    const rel = (element.getAttribute("rel") ?? "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    candidates.push({ rel, href: element.getAttribute("href") ?? null });
  }

  const preferred = [
    ["apple-touch-icon", "apple-touch-icon-precomposed"],
    ["icon", "shortcut", "mask-icon"],
  ];

  for (const group of preferred) {
    for (const candidate of candidates) {
      if (!candidate.href) continue;
      if (candidate.rel.some((token) => group.includes(token))) {
        const resolved = absoluteAssetUrl(candidate.href, base);
        if (resolved) return resolved;
      }
    }
  }

  return null;
}

function readTitle(html: string): string | null {
  const root = parse(html);
  return cleanText(root.querySelector("title")?.text, MAX_TITLE);
}

/** Extract everything the card and the sheet need from one HTML document. */
export function extractMetadata(html: string, pageUrl: string): PageMetadata {
  const meta = readMeta(html);
  const title =
    meta.content("og:title") ??
    meta.content("twitter:title") ??
    readTitle(html);
  const siteName = meta.content("og:site_name");
  const hostname = (() => {
    try {
      return new URL(pageUrl).hostname.replace(/^www\./, "");
    } catch {
      return pageUrl;
    }
  })();

  return {
    name: deriveName(title, siteName, hostname),
    title: cleanText(title, MAX_TITLE),
    description: cleanText(
      meta.content("og:description") ??
        meta.content("twitter:description") ??
        meta.content("description"),
      MAX_DESCRIPTION,
    ),
    image: absoluteAssetUrl(
      meta.content("og:image:secure_url") ??
        meta.content("og:image") ??
        meta.content("twitter:image") ??
        meta.content("twitter:image:src"),
      pageUrl,
    ),
    icon: readIcon(html, pageUrl),
    siteName: cleanText(siteName, MAX_NAME),
    themeColor: cleanText(meta.content("theme-color"), 32),
  };
}
