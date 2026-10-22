import type { ResourceSeed } from "../lib/types";

/**
 * The curated resource list — the only file you edit by hand.
 *
 * Add a `url` and its categories, then run `pnpm resources:sync` to fetch the
 * site's name, description, and preview image into
 * `generated/resources.json`. The grid never contacts a third-party site at
 * request time, so an unsynced URL still shows up with its hostname as the
 * title until the next sync.
 *
 * Categories are yours to choose. The first one is the card's primary badge;
 * all of them are filterable via `?tag=`.
 */
export const resources: ResourceSeed[] = [
  { url: "https://ui.shadcn.com/", categories: ["UI", "Components" , "Design", "Development", "Resources", "Open Source", "Documentation" , "Tutorials" , "Community" , "Examples" , ] },
  // { url: "a", categories: ["UI",] },
];

/**
 * Chip order on `/resources`. Categories missing from this list are appended
 * alphabetically, so adding a new one to a resource above is enough.
 */
export const CATEGORY_ORDER = ["UI", "Tools", "Development"];
