import { allResources, resourceCategories } from "../lib/resources";
import { ResourcesBrowser } from "./resources-browser";

/**
 * The `/resources` catalog: a header, category chips, search, and a grid.
 *
 * Server-rendered from the curated list plus the metadata snapshot. `tag` picks
 * the category here (shareable, no client store); everything below the header
 * is interactive only for search and the sheet.
 */
export function ResourcesPage({
  activeCategory,
  selectedUrl,
}: {
  activeCategory?: string;
  selectedUrl?: string;
}) {
  const categories = resourceCategories();
  const tag =
    activeCategory && categories.includes(activeCategory)
      ? activeCategory
      : undefined;
  const resources = tag
    ? allResources().filter((resource) => resource.categories.includes(tag))
    : allResources();

  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once lg:text-7xl">
          Resources
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Hand-picked sites, tools, and libraries worth keeping close.
        </p>
      </header>

      <hr className="my-6 border-primary/15" />

      <ResourcesBrowser
        resources={resources}
        categories={categories}
        activeCategory={tag}
        selectedUrl={selectedUrl}
      />
    </div>
  );
}
