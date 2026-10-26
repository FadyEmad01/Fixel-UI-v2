/**
 * Text matching for the illustration grid.
 *
 * Kept apart from `items.ts` so a client component can filter without pulling
 * the registry manifest import into its bundle.
 */

export type SearchableIllustration = {
  slug: string;
  title: string;
  description: string;
};

function haystack(illustration: SearchableIllustration): string {
  return [illustration.title, illustration.slug, illustration.description]
    .join("\n")
    .toLowerCase();
}

/** True when every whitespace-separated term appears somewhere in the card. */
export function matchesQuery(
  illustration: SearchableIllustration,
  query: string,
): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const hay = haystack(illustration);
  return terms.every((term) => hay.includes(term));
}

/** Filter by free text, preserving the catalog order. */
export function filterIllustrations<T extends SearchableIllustration>(
  illustrations: T[],
  query: string,
): T[] {
  if (query.trim() === "") return illustrations;
  return illustrations.filter((illustration) =>
    matchesQuery(illustration, query),
  );
}
