import type { CubicBezierPoints } from "@/features/easings/lib/types";

/**
 * Site-wide search: the shape the navbar panel consumes.
 *
 * The index is built on the server (`build-index.ts`) from the three catalogs,
 * then handed to the client as plain serializable fields. Keeping the contract
 * here — and free of catalog imports — is what lets the panel stay a small
 * client module instead of pulling `registry.json` or the resource snapshot
 * into the browser.
 */

export type SearchKind = "resources" | "illustrations" | "easings";

/** `all` searches every catalog; a kind narrows the list to one. */
export type SearchScope = "all" | SearchKind;

export interface SearchItem {
  /** `${kind}:${slug}` — stable across scopes and queries. */
  id: string;
  kind: SearchKind;
  /** Catalog identity (resource URL, illustration slug, easing slug). */
  slug: string;
  title: string;
  description: string;
  /** Short right-aligned row label: the host, the family, or "Easing". */
  label: string;
  /** Matchable text that never renders: SEO title, categories, synonyms. */
  keywords: string[];
  /** Catalog URL that opens this item's sheet. */
  href: string;
  /** Resources only: the site's own address. */
  externalUrl?: string;
  /** Resources only: card media. */
  image?: string | null;
  icon?: string | null;
  isNew?: boolean;
  /** Easings only. */
  points?: CubicBezierPoints;
}
