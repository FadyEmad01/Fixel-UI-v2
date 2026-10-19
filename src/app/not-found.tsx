import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * App-wide 404 page.
 *
 * Rendered for any URL that matches no route (including unknown component
 * slugs, which `src/proxy.ts` rewrites here) and for `notFound()` calls that
 * happen before streaming starts. Because it lives at the app root it renders
 * inside the root layout, so the site Navbar is present.
 */

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="mx-auto h-screen flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="chroma-text chroma-text-animate-once font-heading text-7xl font-semibold tracking-tight">
        404
      </p>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          We couldn&apos;t find that page
        </h1>
        <p className="text-muted-foreground max-w-sm text-pretty">
          The component or page you were looking for may have moved, or the link
          might be mistyped.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          {/* <Link href="/ui">Browse components</Link> */}
        </Button>
        <Button
          asChild
          className="bg-neutral-200/70 font-archivo text-black hover:bg-neutral-200/90 dark:bg-neutral-800/70 dark:text-white dark:hover:bg-neutral-800/90"
        >
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
