import type { Resource } from "./types";

/**
 * Text matching for the resource grid.
 *
 * Lives apart from `resources.ts` so client components can filter without
 * pulling the generated snapshot (or `node`-only imports) into the bundle.
 */

/** The fields a query is matched against, lowercased once per comparison. */
function haystack(resource: Resource): string {
  return [
    resource.name,
    resource.title ?? "",
    resource.description ?? "",
    resource.normalizedUrl,
  ]
    .join("\n")
    .toLowerCase();
}

/** True when every whitespace-separated term appears somewhere in the card. */
export function matchesQuery(resource: Resource, query: string): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const hay = haystack(resource);
  return terms.every((term) => hay.includes(term));
}

/** Filter by free text, preserving the curated order. */
export function filterResources(
  resources: Resource[],
  query: string,
): Resource[] {
  if (query.trim() === "") return resources;
  return resources.filter((resource) => matchesQuery(resource, query));
}
