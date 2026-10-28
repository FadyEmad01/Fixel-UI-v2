import type { Metadata } from "next";
import { Suspense } from "react";

import { EasingsPage } from "@/features/easings/components/easings-page";

export const metadata: Metadata = {
  title: "Easings",
  description: "Cubic bezier easing presets with live previews and code examples.",
};

interface EasingsRouteProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

async function Catalog({ searchParams }: EasingsRouteProps) {
  const { slug } = await searchParams;
  return <EasingsPage selectedSlug={slug} />;
}

export default function Page({ searchParams }: EasingsRouteProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
