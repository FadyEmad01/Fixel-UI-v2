import type { Metadata } from "next";

import {
  ComponentsPage,
  type ComponentsSearchParams,
} from "@/features/components/components/components-page";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Animated React components from Fixel UI — installable with the shadcn CLI, previewed live.",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<ComponentsSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      {/* `searchParams` is awaited inside the feature's Suspense boundary, so
          the static shell below streams first. */}
      <ComponentsPage searchParams={searchParams} />
    </main>
  );
}
