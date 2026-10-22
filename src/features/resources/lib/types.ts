/**
 * Shapes for the curated resource list and the generated metadata snapshot.
 *
 * Two sources, one rule: `data/resources.ts` is the only hand-edited file.
 * Everything in `generated/resources.json` is written by
 * `pnpm resources:sync` and must never be edited by hand.
 */

/** How the last metadata fetch went. `pending` means "listed, never synced". */
export type ResourceStatus = "ok" | "partial" | "pending" | "failed";

/** One line in the hand-curated list. */
export interface ResourceSeed {
  /** The site's address, including the protocol. */
  url: string;
  /** Display categories, e.g. `"UI"`. Order matters: the first is the primary. */
  categories: string[];
}

/** One entry in the generated snapshot. */
export interface ResourceSnapshotEntry {
  /** Curated URL exactly as written in `data/resources.ts`. */
  url: string;
  /** `https://example.com` — the identity used for lookups. */
  normalizedUrl: string;
  /** Display name, falling back to the hostname when a page is shy. */
  name: string;
  /** The page's raw title, when it had one. */
  title: string | null;
  description: string | null;
  /** Social preview image, absolutized against `finalUrl`. */
  image: string | null;
  /** Touch icon or favicon, absolutized against `finalUrl`. */
  icon: string | null;
  siteName: string | null;
  themeColor: string | null;
  /** The URL after redirects, used for outbound links. */
  finalUrl: string;
  status: ResourceStatus;
  /** When the metadata was last successfully read. Kept on failure. */
  fetchedAt: string | null;
  lastError: string | null;
}

/** The generated file. */
export interface ResourceSnapshot {
  generatedAt: string | null;
  resources: ResourceSnapshotEntry[];
}

/** A seed merged with its snapshot, which is what the UI consumes. */
export interface Resource {
  url: string;
  normalizedUrl: string;
  categories: string[];
  name: string;
  title: string | null;
  description: string | null;
  image: string | null;
  icon: string | null;
  siteName: string | null;
  themeColor: string | null;
  /** Where the "open site" button points: the post-redirect URL when known. */
  externalUrl: string;
  status: ResourceStatus;
  fetchedAt: string | null;
  lastError: string | null;
}
