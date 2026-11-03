import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EasingViewer } from "@/features/easings/components/easing-viewer";
import { allEasings, getEasing } from "@/features/easings/data";

interface EasingRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allEasings().map((easing) => ({
    slug: easing.slug,
  }));
}

export async function generateMetadata({
  params,
}: EasingRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const easing = getEasing(slug);

  if (!easing) return { title: "Easing not found" };

  return {
    title: easing.name,
    description: easing.description,
  };
}

async function EasingPage({ params }: EasingRouteProps) {
  const { slug } = await params;
  const easing = getEasing(slug);

  if (!easing) notFound();

  return <EasingViewer easing={easing} items={allEasings()} />;
}

export default function Page({ params }: EasingRouteProps) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <EasingPage params={params} />
    </Suspense>
  );
}
