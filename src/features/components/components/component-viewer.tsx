"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentType, useCallback, useEffect, useState } from "react";

import { componentPreviews } from "../generated";

/**
 * While the catalog is empty the generated barrel has no keys, so the lookup
 * narrows to `never`. Widen it once here instead of casting at the call site.
 */
const previews = componentPreviews as Record<string, ComponentType | undefined>;

/** The minimal shape the viewer needs; all of it is serializable. */
export type PreviewItem = {
  slug: string;
  title: string;
  /** `/preview/<category>/<slug>` — written into the URL while navigating. */
  previewHref: string;
  /** `/components/<slug>` — where Escape returns to. */
  href: string;
};

/**
 * The full-bleed live preview.
 *
 * The component is lazy-loaded from the generated demo barrel, so opening one
 * preview never pulls every other demo into the bundle. Left/right move through
 * the catalog without a server round-trip, and Escape returns to the docs page.
 */
export function ComponentViewer({
  component,
  components,
}: {
  component: PreviewItem;
  components: PreviewItem[];
}) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(component.slug);
  const [lastSlug, setLastSlug] = useState(component.slug);

  // Follow a server navigation (a direct link or a refresh) into new state.
  if (component.slug !== lastSlug) {
    setLastSlug(component.slug);
    setSelectedSlug(component.slug);
  }

  const current =
    components.find((item) => item.slug === selectedSlug) ?? component;
  const currentIndex = Math.max(
    0,
    components.findIndex((item) => item.slug === selectedSlug),
  );
  const previous =
    components[(currentIndex - 1 + components.length) % components.length];
  const next = components[(currentIndex + 1) % components.length];
  const Preview = previews[current.slug];

  const navigate = useCallback((item: PreviewItem) => {
    setSelectedSlug(item.slug);
    // Keep the address bar shareable without re-rendering the server tree.
    window.history.replaceState(null, "", item.previewHref);
  }, []);

  const navigateBy = useCallback(
    (direction: -1 | 1) => {
      if (components.length < 2) return;

      const at = Math.max(
        0,
        components.findIndex((item) => item.slug === selectedSlug),
      );
      const destination =
        components[(at + direction + components.length) % components.length];
      if (destination) navigate(destination);
    },
    [components, navigate, selectedSlug],
  );

  const close = useCallback(() => {
    router.push(current.href);
  }, [current.href, router]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        if (target.isContentEditable) return;
        if (
          target.closest(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
          )
        ) {
          return;
        }
      }

      event.preventDefault();
      navigateBy(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, navigateBy]);

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-background">
      <h1 className="sr-only">{current.title}</h1>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 py-12 sm:px-12">
        {Preview ? (
          <Preview />
        ) : (
          <span className="font-heading text-5xl font-semibold text-muted-foreground/50">
            {current.title.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}
      </div>

      <nav
        aria-label="Component preview navigation"
        className="relative mx-auto mb-6 flex items-center gap-2 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
      >
        <button
          type="button"
          onClick={() => navigateBy(-1)}
          disabled={components.length < 2}
          aria-label={
            previous ? `Previous component: ${previous.title}` : "Previous"
          }
          title="Previous component (←)"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-4 text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40 dark:bg-muted dark:hover:bg-muted/70"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>

        <div className="flex min-w-0 items-center gap-2 px-2">
          <span className="truncate font-archivo text-xs font-medium">
            {current.title}
          </span>
          <span className="font-archivo text-[11px] text-muted-foreground">
            {currentIndex + 1}/{components.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigateBy(1)}
          disabled={components.length < 2}
          aria-label={next ? `Next component: ${next.title}` : "Next"}
          title="Next component (→)"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-4 text-background transition hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>

        <Link
          href={current.href}
          aria-label="Close preview"
          title="Close preview (Esc)"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-my-bg text-foreground transition hover:bg-my-bg/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-muted dark:hover:bg-muted/70"
        >
          <X className="size-4" aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}
