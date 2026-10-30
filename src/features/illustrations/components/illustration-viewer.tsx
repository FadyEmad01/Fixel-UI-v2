"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";

import { type IllustrationSlug, illustrations } from "../generated";
import { ILLUSTRATION_CATEGORIES } from "../lib/categories";
import { illustrationViewerHref } from "../lib/href";

const DOT_WINDOW = 7;

type IllustrationNavigationItem = {
  slug: string;
  title: string;
};

export function IllustrationViewer({
  illustration,
  tag,
  illustrations: allItems,
}: {
  illustration: IllustrationNavigationItem;
  tag?: string;
  illustrations: IllustrationNavigationItem[];
}) {
  const [selectedSlug, setSelectedSlug] = React.useState(illustration.slug);
  const [lastIllustrationSlug, setLastIllustrationSlug] = React.useState(
    illustration.slug,
  );

  if (illustration.slug !== lastIllustrationSlug) {
    setLastIllustrationSlug(illustration.slug);
    setSelectedSlug(illustration.slug);
  }

  const categoryItems = tag
    ? allItems.filter((item) => ILLUSTRATION_CATEGORIES[item.slug] === tag)
    : allItems;
  const items = categoryItems.some((item) => item.slug === selectedSlug)
    ? categoryItems
    : allItems;
  const activeIndex = items.findIndex((item) => item.slug === selectedSlug);
  const currentIndex = Math.max(0, activeIndex);
  const currentIllustration =
    items.find((item) => item.slug === selectedSlug) ?? illustration;
  const previous = items[(currentIndex - 1 + items.length) % items.length];
  const next = items[(currentIndex + 1) % items.length];
  const dotStart = Math.max(
    0,
    Math.min(
      currentIndex - Math.floor(DOT_WINDOW / 2),
      items.length - DOT_WINDOW,
    ),
  );
  const dots = items.slice(dotStart, dotStart + DOT_WINDOW);
  const Preview = illustrations[currentIllustration.slug as IllustrationSlug];

  const navigate = React.useCallback(
    (slug: string) => {
      if (slug === selectedSlug) return;
      setSelectedSlug(slug);
      window.history.replaceState(null, "", illustrationViewerHref(slug, tag));
    },
    [selectedSlug, tag],
  );

  const navigateBy = React.useCallback(
    (direction: -1 | 1) => {
      if (items.length < 2) return;
      const current = Math.max(
        0,
        items.findIndex((item) => item.slug === selectedSlug),
      );
      const destination =
        items[(current + direction + items.length) % items.length];
      if (destination) navigate(destination.slug);
    },
    [items, navigate, selectedSlug],
  );

  React.useEffect(() => {
    if (items.length < 2) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

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
  }, [items.length, navigateBy]);

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <h1 className="sr-only">{currentIllustration.title}</h1>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="flex max-h-[82svh] w-full max-w-5xl items-center justify-center">
          {Preview ? (
            <Preview />
          ) : (
            <span className="font-heading text-5xl font-semibold text-muted-foreground/50">
              {currentIllustration.title.trim().charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>
      </div>

      {items.length > 1 && previous && next ? (
        <nav
          aria-label="Illustration navigation"
          className="relative mx-auto mb-6 flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
        >
          <button
            type="button"
            onClick={() => navigateBy(-1)}
            aria-label={`Previous illustration: ${previous.title}`}
            title="Previous illustration (←)"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full  bg-my-bg dark:bg-muted text-foreground transition hover:bg-my-bg/70 dark:hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none px-7"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>

          <div className="flex items-center">
            {dots.map((item, offset) => {
              const index = dotStart + offset;
              const active = index === currentIndex;

              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => navigate(item.slug)}
                  aria-label={`Show illustration ${index + 1}: ${item.title}`}
                  aria-current={active ? "true" : undefined}
                  className="group flex size-5 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span
                    className={[
                      "size-1.5 rounded-full transition-all duration-200",
                      active
                        ? "scale-125 bg-foreground"
                        : "bg-foreground/20 group-hover:bg-foreground/45",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigateBy(1)}
            aria-label={`Next illustration: ${next.title}`}
            title="Next illustration (→)"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none px-7"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </main>
  );
}
