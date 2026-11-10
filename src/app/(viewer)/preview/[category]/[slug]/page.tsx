import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ComponentViewer } from "@/features/components/components/component-viewer";
import { categorySlug } from "@/features/components/lib/href";
import {
  allComponents,
  componentForPreview,
} from "@/features/components/lib/items";

interface PreviewRouteProps {
  params: Promise<{ category: string; slug: string }>;
}

/**
 * Prerender every live preview.
 *
 * Cache Components rejects an empty `generateStaticParams`, so while the
 * catalog is still being seeded the route renders on demand instead.
 */
const components = allComponents();

export const generateStaticParams =
  components.length > 0
    ? () =>
        components.map((component) => ({
          category: categorySlug(component.category),
          slug: component.slug,
        }))
    : undefined;

export async function generateMetadata({
  params,
}: PreviewRouteProps): Promise<Metadata> {
  const { category, slug } = await params;
  const component = componentForPreview(category, slug);

  if (!component) return { title: "Component not found" };

  return {
    title: `${component.title} preview`,
    description: component.description,
    // A bare canvas is not a landing page; keep it out of the index.
    robots: { index: false, follow: false },
  };
}

async function PreviewPage({ params }: PreviewRouteProps) {
  const { category, slug } = await params;
  const component = componentForPreview(category, slug);

  if (!component) notFound();

  const items = allComponents().map((item) => ({
    slug: item.slug,
    title: item.title,
    example: item.defaultExample,
    previewHref: item.previewHref,
    href: item.href,
  }));

  return (
    <ComponentViewer
      component={{
        slug: component.slug,
        title: component.title,
        example: component.defaultExample,
        previewHref: component.previewHref,
        href: component.href,
      }}
      components={items}
    />
  );
}

export default function Page({ params }: PreviewRouteProps) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <PreviewPage params={params} />
    </Suspense>
  );
}
