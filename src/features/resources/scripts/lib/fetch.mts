import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Fetching a curated page for its metadata.
 *
 * The only URLs this ever sees come from `data/resources.ts`, but the guard
 * below still matters: a typo or a compromised domain should not turn a local
 * dev command into a request to `169.254.169.254`. Private targets are
 * rejected before connecting and again on every redirect hop, because `fetch`
 * follows redirects without re-checking the host.
 */

const MAX_BYTES = 2_000_000;
const IMAGE_MAX_BYTES = 8_000_000;
const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 10_000;

const USER_AGENT =
  "fixel-ui-resource-sync/1.0 (+https://github.com/FadyEmad01/Fixel-UI-v2)";

/** True for addresses that must never be fetched: loopback, LAN, link-local, CGNAT, multicast, reserved. */
export function isPrivateAddress(address: string): boolean {
  const value = address
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, "");

  if (isIP(value) === 4) return isPrivateIpv4(value);
  if (isIP(value) !== 6) return false;

  if (value === "::" || value === "::1") return true;
  if (value.startsWith("fc") || value.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(value)) return true;
  if (value.startsWith("ff")) return true;

  // IPv4-mapped (::ffff:192.168.1.1) and IPv4-compatible forms.
  const mapped = value.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
  return mapped ? isPrivateIpv4(mapped[1]) : false;
}

function isPrivateIpv4(address: string): boolean {
  const parts = address.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)
  ) {
    return true;
  }

  const [a, b] = parts;

  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true; // link-local, cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 192 && b === 0) return true; // IETF protocol assignments
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a === 198 && b === 51) return true;
  if (a === 203 && b === 0) return true;
  if (a >= 224) return true; // multicast + reserved + broadcast

  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".home.arpa")
  );
}

/** Validate a URL and confirm every address it resolves to is public. */
export async function assertPublicUrl(value: string | URL): Promise<URL> {
  let url: URL;
  try {
    url = value instanceof URL ? value : new URL(value);
  } catch {
    throw new Error(`Not a valid URL: ${String(value)}`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }
  if (url.username || url.password) {
    throw new Error("URLs with credentials are not allowed.");
  }
  if (isBlockedHostname(url.hostname)) {
    throw new Error(`Refusing to fetch a local hostname: ${url.hostname}`);
  }

  const literal = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(literal)) {
    if (isPrivateAddress(literal)) {
      throw new Error(`Refusing to fetch a private address: ${literal}`);
    }
    return url;
  }

  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0) {
    throw new Error(`Could not resolve ${url.hostname}`);
  }
  for (const { address } of addresses) {
    if (isPrivateAddress(address)) {
      throw new Error(
        `Refusing to fetch ${url.hostname} (resolves to ${address})`,
      );
    }
  }

  return url;
}

export interface FetchedPage {
  html: string;
  /** The URL after redirects. Relative images resolve against this. */
  finalUrl: string;
}

export interface FetchedImage {
  data: Buffer;
  /** Kept for diagnostics: sharp cannot rasterise every format (e.g. SVG). */
  contentType: string;
}

/** Fetch a page as HTML, following a bounded number of vetted redirects. */
export async function fetchPage(value: string): Promise<FetchedPage> {
  let current = await assertPublicUrl(value);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "accept-language": "en",
      },
    });

    if (REDIRECT_CODES.has(response.status)) {
      const location = response.headers.get("location");
      if (!location)
        throw new Error(`HTTP ${response.status} without a Location header`);
      current = await assertPublicUrl(new URL(location, current).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      throw new Error(`Not an HTML page (${contentType || "no content type"})`);
    }

    const html = await readCapped(response, MAX_BYTES, contentType);
    return { html, finalUrl: current.toString() };
  }

  throw new Error(`Too many redirects (more than ${MAX_REDIRECTS})`);
}

const REDIRECT_CODES = new Set([301, 302, 303, 307, 308]);

/**
 * Fetch a curated page's preview image.
 *
 * Same address and redirect vetting as `fetchPage`, with an image-sized byte
 * cap. Plaiceholder takes a `Buffer`, so the caller needs the raw bytes rather
 * than a decoded string.
 */
export async function fetchImage(value: string): Promise<FetchedImage> {
  let current = await assertPublicUrl(value);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "user-agent": USER_AGENT,
        accept: "image/avif,image/webp,image/png,image/*;q=0.8",
        "accept-language": "en",
      },
    });

    if (REDIRECT_CODES.has(response.status)) {
      const location = response.headers.get("location");
      if (!location)
        throw new Error(`HTTP ${response.status} without a Location header`);
      current = await assertPublicUrl(new URL(location, current).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Not an image (${contentType || "no content type"})`);
    }

    return { data: await readBytes(response, IMAGE_MAX_BYTES), contentType };
  }

  throw new Error(`Too many redirects (more than ${MAX_REDIRECTS})`);
}

/** Read a response body, aborting once it exceeds `maxBytes`. */
async function readBytes(
  response: Response,
  maxBytes: number,
): Promise<Buffer> {
  if (!response.body) return Buffer.alloc(0);

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`Response larger than ${Math.round(maxBytes / 1000)} kB`);
    }
    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

async function readCapped(
  response: Response,
  maxBytes: number,
  contentType: string,
): Promise<string> {
  return decode(await readBytes(response, maxBytes), contentType);
}

function decode(bytes: Uint8Array, contentType: string): string {
  const charset = contentType
    .match(/charset=([^;]+)/i)?.[1]
    ?.trim()
    .toLowerCase();

  try {
    return new TextDecoder(charset || "utf-8").decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}
