import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/catalog-skeleton";

import { allEasings, getEasing } from "../data";
import { easingsHref, easingViewerHref } from "../lib/href";
import type { EasingSheetItem } from "../lib/types";
import { EasingsBrowser } from "./easings-browser";

/** `?slug=` picks the easing whose sheet is open. */
export interface EasingsSearchParams {
  slug?: string;
}

interface EasingsPageProps {
  searchParams: Promise<EasingsSearchParams>;
}

/**
 * The `/easing` shell: a static header, then the grid.
 *
 * Only the part that reads `searchParams` sits inside Suspense, which Cache
 * Components requires for dynamic data.
 */
export function EasingsPage({ searchParams }: EasingsPageProps) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once lg:text-7xl">
          Easings
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Cubic bezier easing presets with live previews and code examples.
        </p>
      </header>

      <hr className="my-6 border-primary/15" />

      <Suspense fallback={<CatalogSkeleton />}>
        <EasingsCatalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function EasingsCatalog({ searchParams }: EasingsPageProps) {
  const { slug: selectedSlug } = await searchParams;
  const easings = allEasings();
  const toSheetItem = (
    easing: ReturnType<typeof allEasings>[number],
  ): EasingSheetItem => {
    return {
      slug: easing.slug,
      name: easing.name,
      description: easing.description,
      points: easing.points,
      href: easingsHref(easing.slug),
      viewerHref: easingViewerHref(easing.slug),
    };
  };
  const sheetItems = easings.map(toSheetItem);
  const selected = selectedSlug ? getEasing(selectedSlug) : undefined;
  const selectedItem = selected ? toSheetItem(selected) : null;

  return (
    <EasingsBrowser
      easings={sheetItems}
      selectedSlug={selectedItem?.slug}
      selectedItem={selectedItem}
    />
  );
}
