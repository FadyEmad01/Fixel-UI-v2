import type { Metadata } from "next";
import { isIndexable } from "@/lib/site";
import { HomePageView } from "./home-page-view";

export const metadata: Metadata = {
  // Canonical lives here, not in the root layout, so a future route cannot
  // accidentally inherit the homepage's canonical URL.
  alternates: { canonical: "/" },
  robots: isIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function Page() {
  return <HomePageView />;
}
