"use client";

import { useDeferredValue, useMemo, useState } from "react";

import type { Illustration } from "../lib/items";
import { filterIllustrations } from "../lib/search";
import { IllustrationCard } from "./illustration-card";
import { IllustrationFilter } from "./illustration-filter";
import { IllustrationSearch } from "./illustration-search";

/**
 * The interactive half of the catalog: search and the grid.
 *
 * Family filtering stays on the server (the chips are plain links); only the
 * free text lives in React state, so a filtered view is still a shareable URL.
 */
export function IllustrationBrowser({
  illustrations,
  categories,
  activeCategory,
}: {
  illustrations: Illustration[];
  categories: string[];
  activeCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const visible = useMemo(
    () => filterIllustrations(illustrations, deferredQuery),
    [illustrations, deferredQuery],
  );

  return (
    <>
      <div className="flex flex-row gap-3 md:items-start md:justify-between mb-10">
        <IllustrationFilter
          categories={categories}
          activeCategory={activeCategory}
          className=""
        />

        <IllustrationSearch
          value={query}
          onChange={setQuery}
          className="md:ml-auto md:max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((illustration) => (
          <IllustrationCard
            key={illustration.slug}
            slug={illustration.slug}
            title={illustration.title}
            description={illustration.description}
            href={illustration.href}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {deferredQuery.trim()
            ? `No illustrations found for "${deferredQuery.trim()}".`
            : activeCategory
              ? `No illustrations in ${activeCategory} yet.`
              : "No illustrations yet."}
        </p>
      ) : null}
    </>
  );
}
