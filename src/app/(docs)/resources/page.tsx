import type { Metadata } from "next";
import { Suspense } from "react";

import { ResourcesPage } from "@/features/resources/components/resources-page";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Hand-picked sites, tools, and libraries from the Fixel UI team — searchable, filterable, and worth keeping close.",
};

interface ResourcesRouteProps {
  searchParams: Promise<{
    /** Active category, e.g. `UI`. */
    tag?: string;
    /** The resource whose sheet is open, as its curated URL. */
    url?: string;
  }>;
}

/**
 * Awaiting `searchParams` inside Suspense keeps the static shell instant under
 * Cache Components, and makes shared `?tag=`/`?url=` links render correctly on
 * the first request.
 */
async function Catalog({ searchParams }: ResourcesRouteProps) {
  const { tag, url } = await searchParams;
  return <ResourcesPage activeCategory={tag} selectedUrl={url} />;
}

export default function Page({ searchParams }: ResourcesRouteProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
