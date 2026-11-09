import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/catalog-skeleton";
import { allComponents } from "../lib/items";
import {
  type ComponentCatalogItem,
  ComponentsBrowser,
} from "./components-browser";

/** `?tag=` picks the category shown in the grid. */
export interface ComponentsSearchParams {
  /** Active category, e.g. `UI`. */
  tag?: string;
}

interface ComponentsPageProps {
  searchParams: Promise<ComponentsSearchParams>;
}

/**
 * The `/components` shell: header, category chips, search, and a grid.
 *
 * Mirrors `/illustration` on purpose — one catalog pattern, two kinds of
 * content. The header is static; only the part that reads `searchParams` sits
 * inside Suspense, which Cache Components requires for dynamic data.
 */
export function ComponentsPage({ searchParams }: ComponentsPageProps) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once lg:text-7xl">
          Components
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Animated components you can install with the shadcn CLI and drop into
          any React surface.
        </p>
      </header>

      <hr className="my-6 border-primary/15" />

      <Suspense fallback={<CatalogSkeleton chips search />}>
        <ComponentsCatalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

/**
 * The `tag` filter is resolved here so a filtered view is shareable and the
 * grid stays server-rendered.
 */
async function ComponentsCatalog({ searchParams }: ComponentsPageProps) {
  const { tag: activeTag } = await searchParams;
  const components = allComponents();
  const categories = [
    ...new Set(components.map((component) => component.category)),
  ].sort((a, b) => a.localeCompare(b));

  const tag =
    activeTag && categories.includes(activeTag) ? activeTag : undefined;

  const visible = (
    tag
      ? components.filter((component) => component.category === tag)
      : components
  ).map(
    (component): ComponentCatalogItem => ({
      slug: component.slug,
      title: component.title,
      description: component.description,
      href: component.href,
      media: component.media,
      category: component.category,
      tags: component.tags,
    }),
  );

  return (
    <ComponentsBrowser
      components={visible}
      categories={categories}
      activeCategory={tag}
    />
  );
}
