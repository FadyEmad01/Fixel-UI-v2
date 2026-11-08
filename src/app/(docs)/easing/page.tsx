import type { Metadata } from "next";

import {
  EasingsPage,
  type EasingsSearchParams,
} from "@/features/easings/components/easings-page";

export const metadata: Metadata = {
  title: "Easings",
  description:
    "Cubic bezier easing presets with live previews and code examples.",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<EasingsSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 md:px-6 lg:px-8">
      {/* `searchParams` is awaited inside the feature's Suspense boundary, so
          the static shell below streams first. */}
      <EasingsPage searchParams={searchParams} />
    </main>
  );
}
