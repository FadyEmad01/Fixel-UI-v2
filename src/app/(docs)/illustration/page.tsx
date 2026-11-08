import type { Metadata } from "next";

import {
  IllustrationPage,
  type IllustrationSearchParams,
} from "@/features/illustrations/components/illustration-page";

export const metadata: Metadata = {
  title: "Illustrations",
  description:
    "Coded wireframe illustrations from Fixel UI — installable React components for empty states, cards, and docs.",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<IllustrationSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      {/* `searchParams` is awaited inside the feature's Suspense boundary, so
          the static shell below streams first. */}
      <IllustrationPage searchParams={searchParams} />
    </main>
  );
}
