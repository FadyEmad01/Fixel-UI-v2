import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { IllustrationDoc } from "@/features/illustrations/components/illustration-doc";
import {
  allIllustrations,
  getIllustration,
} from "@/features/illustrations/lib/items";

interface IllustrationRouteProps {
  params: Promise<{ slug: string }>;
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

/**
 * Resolving `params` inside the boundary keeps the shared shell instant when
 * navigating between illustrations, and lets each detail render stream in.
 */
async function IllustrationDetail({ params }: IllustrationRouteProps) {
  const { slug } = await params;
  const illustration = getIllustration(slug);

  if (!illustration) notFound();

  return <IllustrationDoc illustration={illustration} />;
}

export default function Page({ params }: IllustrationRouteProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <IllustrationDetail params={params} />
      </Suspense>
    </main>
  );
}
