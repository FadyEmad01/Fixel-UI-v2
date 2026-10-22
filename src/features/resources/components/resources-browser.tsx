"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { resourcesHref } from "../lib/href";
import { filterResources } from "../lib/search";
import type { Resource } from "../lib/types";
import { CategoryFilter } from "./category-filter";
import { ResourceCard } from "./resource-card";
import { ResourceSearch } from "./resource-search";
import { ResourceSheet } from "./resource-sheet";

/**
 * The interactive half of the page: search, the grid, and the sheet.
 *
 * Category filtering stays on the server (chips are plain links); only the free
 * text lives in React state. The open sheet is driven by `?url=` so every card
 * has a shareable address and browser back closes it.
 */
export function ResourcesBrowser({
  resources,
  categories,
  activeCategory,
  selectedUrl,
}: {
  resources: Resource[];
  categories: string[];
  activeCategory?: string;
  selectedUrl?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const openedInSession = React.useRef(false);

  const visible = React.useMemo(
    () => filterResources(resources, deferredQuery),
    [resources, deferredQuery],
  );
  const suggestions = React.useMemo(() => visible.slice(0, 5), [visible]);

  const handleClose = React.useCallback(() => {
    if (openedInSession.current) {
      openedInSession.current = false;
      router.back();
      return;
    }

    router.replace(resourcesHref(activeCategory), { scroll: false });
  }, [router, activeCategory]);

  return (
    <>
      <div className="flex gap-3 flex-row md:items-start md:justify-between">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          className="mb-10"
        />

        <ResourceSearch
          value={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelect={(resource) => {
            openedInSession.current = true;
            router.push(resourcesHref(activeCategory, resource.url), {
              scroll: false,
            });
          }}
          className="md:max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((resource) => (
          <ResourceCard
            key={resource.normalizedUrl}
            resource={resource}
            href={resourcesHref(activeCategory, resource.url)}
            query={deferredQuery}
            onOpen={() => {
              openedInSession.current = true;
            }}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {deferredQuery.trim()
            ? `No resources found for "${deferredQuery.trim()}".`
            : activeCategory
              ? `No resources in ${activeCategory} yet.`
              : "No resources yet."}
        </p>
      ) : null}

      <ResourceSheet url={selectedUrl ?? null} onClose={handleClose} />
    </>
  );
}
