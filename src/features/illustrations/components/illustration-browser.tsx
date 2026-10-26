"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";

import { illustrationsHref } from "../lib/href";
import { filterIllustrations } from "../lib/search";
import { IllustrationCard } from "./illustration-card";
import { IllustrationFilter } from "./illustration-filter";
import { IllustrationSearch } from "./illustration-search";
import {
  IllustrationSheet,
  type IllustrationSheetItem,
} from "./illustration-sheet";

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
  selectedSlug,
  selectedItem,
}: {
  illustrations: IllustrationSheetItem[];
  categories: string[];
  activeCategory?: string;
  selectedSlug?: string;
  selectedItem: IllustrationSheetItem | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const openedInSession = useRef(false);

  const visible = useMemo(
    () => filterIllustrations(illustrations, deferredQuery),
    [illustrations, deferredQuery],
  );

  const handleClose = useCallback(() => {
    if (openedInSession.current) {
      openedInSession.current = false;
      router.back();
      return;
    }

    router.replace(illustrationsHref(activeCategory), { scroll: false });
  }, [router, activeCategory]);

  const handleNavigate = useCallback(
    (nextSlug: string) => {
      router.replace(illustrationsHref(activeCategory, nextSlug), {
        scroll: false,
      });
    },
    [router, activeCategory],
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
            category={illustration.category}
            onOpen={() => {
              openedInSession.current = true;
            }}
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

      <IllustrationSheet
        slug={selectedSlug ?? null}
        selectedItem={selectedItem}
        items={visible}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
