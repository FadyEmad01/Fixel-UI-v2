import type { Metadata } from "next";
import { Suspense } from "react";

import { IllustrationPage } from "@/features/illustrations/components/illustration-page";

export const metadata: Metadata = {
  title: "Illustrations",
  description:
    "Coded wireframe illustrations from Fixel UI — installable React components for empty states, cards, and docs.",
};

interface IllustrationsRouteProps {
  searchParams: Promise<{
    /** Active family, e.g. `Input`. */
    tag?: string;
    /** The illustration whose catalog sheet is open. */
    slug?: string;
  }>;
}

/**
 * Awaiting `searchParams` inside Suspense keeps the static shell instant under
 * Cache Components and makes shared `?tag=` links render correctly on the first
 * request.
 */
async function Catalog({ searchParams }: IllustrationsRouteProps) {
  const { tag, slug } = await searchParams;
  return <IllustrationPage activeCategory={tag} selectedSlug={slug} />;
}

export default function Page({ searchParams }: IllustrationsRouteProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
