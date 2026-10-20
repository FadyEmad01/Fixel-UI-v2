import type { Metadata } from "next";
import Showcase from "./showcase.mdx";

// A styling workspace, not a public search landing page.
export const metadata: Metadata = {
  title: "MDX Preview | Fixel UI",
  description: "Internal preview of Fixel UI MDX prose and blocks.",
  robots: { index: false, follow: false },
};

export default function MdxPreviewPage() {
  return (
    <main className="mx-auto w-full min-h-screen max-w-5xl px-5 py-12 sm:px-8 sm:py-20">
      <article className="mx-auto w-full max-w-2xl">
        <Showcase />
      </article>
    </main>
  );
}
