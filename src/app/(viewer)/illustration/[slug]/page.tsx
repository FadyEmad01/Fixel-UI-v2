import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { IllustrationViewer } from "@/features/illustrations/components/illustration-viewer";
import { illustrationCategories } from "@/features/illustrations/lib/categories";
import {
  allIllustrations,
  getIllustration,
} from "@/features/illustrations/lib/items";

interface IllustrationRouteProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export function generateStaticParams() {
  return allIllustrations().map((illustration) => ({
    slug: illustration.slug,
  }));
}

export async function generateMetadata({
  params,
}: IllustrationRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const illustration = getIllustration(slug);

  if (!illustration) return { title: "Illustration not found" };

  return {
    title: illustration.title,
    description: illustration.description,
    alternates: { canonical: illustration.href },
  };
}

async function IllustrationPage({
  params,
  searchParams,
}: IllustrationRouteProps) {
  const [{ slug }, { tag: requestedTag }] = await Promise.all([
    params,
    searchParams,
  ]);
  const illustration = getIllustration(slug);

  if (!illustration) notFound();

  const tag =
    requestedTag && illustrationCategories().includes(requestedTag)
      ? requestedTag
      : undefined;
  const navigationItems = allIllustrations().map(
    ({ slug: itemSlug, title }) => ({
      slug: itemSlug,
      title,
    }),
  );

  return (
    <IllustrationViewer
      illustration={{ slug: illustration.slug, title: illustration.title }}
      tag={tag}
      illustrations={navigationItems}
    />
  );
}

export default function Page({ params, searchParams }: IllustrationRouteProps) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <IllustrationPage params={params} searchParams={searchParams} />
    </Suspense>
  );
}
