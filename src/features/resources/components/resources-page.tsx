import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/catalog-skeleton";

import { resourceCatalog } from "../lib/catalog";
import { ResourcesBrowser } from "./resources-browser";

/** `?tag=` picks the category, `?url=` the resource whose sheet is open. */
export interface ResourcesSearchParams {
  /** Active category, e.g. `UI`. */
  tag?: string;
  /** The resource whose sheet is open, as its curated URL. */
  url?: string;
}

interface ResourcesPageProps {
  searchParams: Promise<ResourcesSearchParams>;
}

/**
 * The `/resources` shell: a header, category chips, search, and a grid.
 *
 * The header is static and ships in the initial HTML. Only the parts that read
 * `searchParams` — the count, the chips, and the grid — sit inside Suspense
 * boundaries, which Cache Components requires for dynamic data. Awaiting
 * `searchParams` there also makes shared `?tag=`/`?url=` links render correctly
 * on the first request.
 *
 * `?url=` is read here only to seed the sheet, which then owns it on the
 * client (see `ResourcesBrowser`). A sheet interaction must not re-render this
 * server tree: the grid would re-serialize the whole catalog — and its ~24 KB
 * of blur placeholders — for a change the client can make for free.
 */
export function ResourcesPage({ searchParams }: ResourcesPageProps) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <div className="flex gap-3 flex-row md:items-start md:justify-between">
          <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once lg:text-7xl">
            Resources
          </h1>
          <span className="text-my-secondary font-archivo md:text-2xl text-md text-nowrap tabular-nums">
            [{" "}
            <Suspense
              fallback={
                <span
                  aria-hidden="true"
                  className="inline-block h-[1.1em] w-[2ch] animate-pulse rounded-sm bg-muted align-middle"
                />
              }
            >
              <ResourceCount searchParams={searchParams} />
            </Suspense>{" "}
            ]
          </span>
        </div>
        <p className="max-w-sm text-muted-foreground">
          Hand-picked sites, tools, and libraries worth keeping close.
        </p>
      </header>

      <hr className="my-6 border-primary/15" />

      <Suspense fallback={<CatalogSkeleton chips search icon />}>
        <ResourcesCatalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

/** The filtered count beside the title. */
async function ResourceCount({ searchParams }: ResourcesPageProps) {
  const { tag } = await searchParams;
  const { resources } = resourceCatalog(tag);

  return <>{resources.length}</>;
}

/**
 * Server-rendered from the curated list plus the metadata snapshot; everything
 * below the header is interactive only for search and the sheet.
 */
async function ResourcesCatalog({ searchParams }: ResourcesPageProps) {
  const { tag: activeCategory, url: initialUrl } = await searchParams;
  const { tag, resources, categories, counts, total } =
    resourceCatalog(activeCategory);

  return (
    <ResourcesBrowser
      resources={resources}
      categories={categories}
      activeCategory={tag}
      initialUrl={initialUrl}
      counts={counts}
      total={total}
    />
  );
}
