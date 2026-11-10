"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { filterComponents } from "../lib/search";
import { ComponentCard, type ComponentCardData } from "./component-card";
import { ComponentFilter } from "./component-filter";
import { ComponentSearch } from "./component-search";

/** Everything the grid needs; `tags` only feed the search index. */
export type ComponentCatalogItem = ComponentCardData & {
  tags: string[];
};

/**
 * The interactive half of the catalog: search and the grid.
 *
 * Category filtering stays on the server (the chips are plain links); only the
 * free text lives in React state, so a filtered view is still a shareable URL.
 */
export function ComponentsBrowser({
  components,
  categories,
  activeCategory,
}: {
  components: ComponentCatalogItem[];
  categories: string[];
  activeCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const visible = useMemo(
    () => filterComponents(components, deferredQuery),
    [components, deferredQuery],
  );

  return (
    <>
      <div className="mb-10 flex flex-row gap-3 md:items-start md:justify-between">
        <ComponentFilter
          categories={categories}
          activeCategory={activeCategory}
          className=""
        />

        <ComponentSearch
          value={query}
          onChange={setQuery}
          className="md:ml-auto md:max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((component) => (
          <ComponentCard key={component.slug} component={component} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {deferredQuery.trim()
            ? `No components found for "${deferredQuery.trim()}".`
            : activeCategory
              ? `No components in ${activeCategory} yet.`
              : "No components yet."}
        </p>
      ) : null}
    </>
  );
}
