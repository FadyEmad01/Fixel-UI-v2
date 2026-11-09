/**
 * Text matching for the component grid.
 *
 * Kept apart from `items.ts` so a client component can filter without pulling
 * the registry manifest import into its bundle.
 */

export type SearchableComponent = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
};

function haystack(component: SearchableComponent): string {
  return [
    component.title,
    component.slug,
    component.description,
    component.category,
    ...component.tags,
  ]
    .join("\n")
    .toLowerCase();
}

/** True when every whitespace-separated term appears somewhere in the card. */
export function matchesQuery(
  component: SearchableComponent,
  query: string,
): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const hay = haystack(component);
  return terms.every((term) => hay.includes(term));
}

/** Filter by free text, preserving the catalog order. */
export function filterComponents<T extends SearchableComponent>(
  components: T[],
  query: string,
): T[] {
  if (query.trim() === "") return components;
  return components.filter((component) => matchesQuery(component, query));
}
