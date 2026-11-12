"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  currentSearchParams,
  pushUrl,
  replaceUrl,
  subscribeUrlChange,
} from "@/shared/lib/history-url";

import { resourcesHref } from "../lib/href";
import { filterResources } from "../lib/search";
import type { Resource } from "../lib/types";
import { normalizeResourceUrl } from "../lib/url";
import { CategoryFilter } from "./category-filter";
import { ResourceCard } from "./resource-card";
import { ResourceSearch } from "./resource-search";
import { ResourceSheet } from "./resource-sheet";

/**
 * The interactive half of the page: search, the grid, and the sheet.
 *
 * Category filtering stays on the server (chips are plain links); only the free
 * text lives in React state. The open sheet is mirrored into `?url=` so every
 * card has a shareable address and browser back closes it — but through the
 * native History API, not `router.push`. A sheet interaction is client state:
 * routing it through the server re-serializes the whole catalog (blur
 * placeholders included) just to change one query parameter.
 *
 * `initialUrl` is only the seed, so a shared link or a no-JS click still opens
 * the sheet on the first request. After hydration the URL is the source of
 * truth and this component mirrors it.
 */
export function ResourcesBrowser({
  resources,
  categories,
  activeCategory,
  initialUrl,
  counts,
  total,
}: {
  resources: Resource[];
  categories: string[];
  activeCategory?: string;
  initialUrl?: string;
  counts: Record<string, number>;
  total: number;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [openUrl, setOpenUrl] = useState<string | null>(initialUrl ?? null);

  /** True while the current history entry is the one we pushed for the sheet. */
  const pushedEntry = useRef(false);

  const visible = useMemo(
    () => filterResources(resources, deferredQuery),
    [resources, deferredQuery],
  );
  const suggestions = useMemo(() => visible.slice(0, 5), [visible]);

  // Back/forward, and any other component that rewrites the query string (the
  // navbar's search panel closing the sheet), tell us which resource is open.
  useEffect(() => {
    return subscribeUrlChange((event) => {
      // `popstate` means the visitor moved off the entry we pushed.
      if (event.type === "popstate") pushedEntry.current = false;
      setOpenUrl(currentSearchParams().get("url"));
    });
  }, []);

  // A real server navigation re-seeds the sheet. Our own history writes never
  // change these props, so they cannot fight the state above.
  // biome-ignore lint/correctness/useExhaustiveDependencies: a category change is a server navigation, which closes the sheet even though it leaves `initialUrl` untouched.
  useEffect(() => {
    setOpenUrl(initialUrl ?? null);
    pushedEntry.current = false;
  }, [initialUrl, activeCategory]);

  const openResource = useCallback(
    (url: string) => {
      // A double click would otherwise push a second entry for the same sheet,
      // and the first Escape would land back on it. Compare normalized URLs,
      // because a shared `?url=` can name the same resource in another form
      // (trailing slash, `www.`, uppercase host).
      const currentKey = openUrl ? normalizeResourceUrl(openUrl) : null;
      if (currentKey && normalizeResourceUrl(url) === currentKey) return;

      setOpenUrl(url);
      pushUrl(resourcesHref(activeCategory, url));
      pushedEntry.current = true;
    },
    [activeCategory, openUrl],
  );

  const handleClose = useCallback(() => {
    setOpenUrl(null);

    // Read and clear before going back: closing twice must not walk back two
    // history entries, and `popstate` clears it again on the way out.
    const shouldGoBack = pushedEntry.current;
    pushedEntry.current = false;

    if (shouldGoBack) {
      window.history.back();
      return;
    }

    // Opened from a shared link: there is no entry of ours to go back to.
    replaceUrl(resourcesHref(activeCategory));
  }, [activeCategory]);

  // Mirror the carousel's selection into `?url=` without adding history entries,
  // so a shared link always points at the resource on screen.
  const handleNavigate = useCallback(
    (nextUrl: string) => {
      setOpenUrl(nextUrl);
      replaceUrl(resourcesHref(activeCategory, nextUrl));
    },
    [activeCategory],
  );

  return (
    <>
      <div className="flex gap-3 flex-row md:items-start md:justify-between mb-10">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          counts={counts}
          total={total}
          className=""
        />

        <ResourceSearch
          value={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelect={(resource) => openResource(resource.url)}
          className="md:max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((resource, index) => (
          <ResourceCard
            key={resource.normalizedUrl}
            resource={resource}
            href={resourcesHref(activeCategory, resource.url)}
            query={deferredQuery}
            onOpen={() => openResource(resource.url)}
            // The first row is above the fold. Index 1 is the measured LCP
            // element, so it alone gets the high-priority hint.
            loading={index < 3 ? "eager" : "lazy"}
            fetchPriority={index === 1 ? "high" : "auto"}
            disableFade={index < 3}
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

      <ResourceSheet
        url={openUrl}
        resourceUrls={visible.map((resource) => resource.url)}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </>
  );
}
