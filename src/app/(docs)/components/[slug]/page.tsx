import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ComponentDoc } from "@/features/components/components/component-doc";
import { allComponents, getComponent } from "@/features/components/lib/items";

interface ComponentRouteProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender every component.
 *
 * Cache Components rejects an empty `generateStaticParams`, so while the
 * catalog is still being seeded this stays `undefined` and the route renders
 * on demand; it becomes an SSG route as soon as the first item lands.
 */
const components = allComponents();

export const generateStaticParams =
  components.length > 0
    ? () => components.map((component) => ({ slug: component.slug }))
    : undefined;

// With no static params yet the route still needs a prerender fallback, and
// the site navbar reads `usePathname()` above this segment. Opt out of the
// static-shell check until the first component makes the route fully static.
export const instant = false;

export async function generateMetadata({
  params,
}: ComponentRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) return { title: "Component not found" };

  return {
    title: component.title,
    description: component.description,
    alternates: { canonical: component.href },
    openGraph: {
      title: component.title,
      description: component.description,
      url: component.href,
      type: "website",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: component.title,
      description: component.description,
      images: ["/og-image.png"],
    },
  };
}

async function ComponentPage({ params }: ComponentRouteProps) {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) notFound();

  return <ComponentDoc component={component} />;
}

export default function Page({ params }: ComponentRouteProps) {
  // `params` is awaited inside the boundary so the shell can render instantly.
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ComponentPage params={params} />
    </Suspense>
  );
}
