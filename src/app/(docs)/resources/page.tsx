import type { Metadata } from "next";

import {
  ResourcesPage,
  type ResourcesSearchParams,
} from "@/features/resources/components/resources-page";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Hand-picked sites, tools, and libraries from the Fixel UI team — searchable, filterable, and worth keeping close.",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ResourcesSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      {/* `searchParams` is awaited inside the feature's Suspense boundaries, so
          the static shell below streams first. */}
      <ResourcesPage searchParams={searchParams} />
    </main>
  );
}
