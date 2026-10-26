"use client";

import { ArrowLeft, ArrowRight, Eye, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatLongDate } from "@/shared/lib/format-date";
import { type IllustrationSlug, illustrations } from "../generated";
import { InstallCommand } from "./install-command";

const DOT_WINDOW = 7;

export type IllustrationSheetItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  uploadedAt: string | null;
  updatedAt: string | null;
  href: string;
  viewerHref: string;
  installCommand: string;
};

export function IllustrationSheet({
  slug,
  selectedItem,
  items,
  onClose,
  onNavigate,
}: {
  slug: string | null;
  selectedItem: IllustrationSheetItem | null;
  items: IllustrationSheetItem[];
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(slug);
  const [lastSlugProp, setLastSlugProp] = React.useState(slug);

  if (slug !== lastSlugProp) {
    setLastSlugProp(slug);
    if (slug) setSelectedSlug(slug);
  }

  const availableItems = React.useMemo(() => {
    const seen = new Set<string>();
    const result: IllustrationSheetItem[] = [];

    for (const item of items) {
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      result.push(item);
    }

    if (selectedItem && !seen.has(selectedItem.slug)) {
      result.unshift(selectedItem);
    }

    return result;
  }, [items, selectedItem]);

  const activeIndex = availableItems.findIndex(
    (item) => item.slug === selectedSlug,
  );
  const activePosition = activeIndex < 0 ? 0 : activeIndex;
  const illustration =
    availableItems.find((item) => item.slug === selectedSlug) ?? selectedItem;
  const Preview = illustration
    ? illustrations[illustration.slug as IllustrationSlug]
    : null;

  const navigate = React.useCallback(
    (direction: -1 | 1) => {
      const count = availableItems.length;
      if (count < 2) return;

      const index = Math.max(
        0,
        availableItems.findIndex((item) => item.slug === selectedSlug),
      );
      const next = availableItems[(index + direction + count) % count];
      if (!next) return;

      setSelectedSlug(next.slug);
      onNavigate(next.slug);
    },
    [availableItems, selectedSlug, onNavigate],
  );

  React.useEffect(() => {
    if (!slug || availableItems.length < 2) return;

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
      navigate(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slug, availableItems.length, navigate]);

  const dotStart = Math.max(
    0,
    Math.min(
      activePosition - Math.floor(DOT_WINDOW / 2),
      availableItems.length - DOT_WINDOW,
    ),
  );
  const dotItems = availableItems.slice(dotStart, dotStart + DOT_WINDOW);
  const positionLabel = availableItems.length
    ? `Illustration ${activePosition + 1} of ${availableItems.length}`
    : "Illustration";

  return (
    <Sheet
      open={Boolean(slug)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className={[
          "data-[side=right]:inset-y-3 data-[side=right]:right-3",
          "data-[side=right]:h-auto",
          "data-[side=right]:w-[calc(100%_-_1.5rem)]",
          "data-[side=right]:max-w-[400px] data-[side=right]:sm:max-w-[400px]",
          "data-[side=right]:border-0",
          "flex flex-col gap-0 overflow-hidden rounded-[26px]",
          "bg-my-primary/90 p-3",
          "backdrop-blur-[20px] backdrop-saturate-150",
        ].join(" ")}
      >
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close illustration"
            title="Close (Esc)"
            className="absolute top-5.5 right-6 z-20 size-9 rounded-full border-none bg-my-primary text-foreground opacity-100 backdrop-blur-2xl transition hover:bg-my-primary/70 hover:text-[#211f1c] focus-visible:ring-1 focus-visible:ring-my-bg"
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex min-h-0 flex-1 flex-col">
          {illustration ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="relative aspect-video max-h-[38dvh] w-full shrink-0 overflow-hidden rounded-[20px] bg-my-bg p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
                />
                <div className="relative flex size-full items-center justify-center">
                  {Preview ? (
                    <Preview />
                  ) : (
                    <span className="font-heading text-4xl font-semibold text-muted-foreground/50">
                      {illustration.title.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
              </div>

              <section
                aria-label="Illustration details"
                // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users need to scroll the details pane.
                tabIndex={0}
                className="scroll-fade scroll-fade-52 scrollbar-none no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:ring-2 focus-visible:ring-[#211f1c]/20 focus-visible:ring-inset focus-visible:outline-none"
              >
                <div className="flex flex-col gap-4 px-1.5 pb-2">
                  <SheetHeader className="space-y-1.5 p-0 text-left">
                    <SheetTitle className="font-heading text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#211f1c] chroma-text chroma-text-animate-once">
                      {illustration.title}
                    </SheetTitle>
                    <SheetDescription className="font-archivo text-xs tracking-wide text-[#5f5a52]">
                      Fixel UI illustration
                    </SheetDescription>
                  </SheetHeader>

                  <p className="text-[13px] leading-[1.7] text-[#45423d]">
                    {illustration.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-black/[0.055] px-2 py-1 font-archivo text-[10px] font-medium tracking-[0.08em] text-[#55514a] capitalize">
                      {illustration.category}
                    </span>
                  </div>

                  {(illustration.uploadedAt || illustration.updatedAt) && (
                    <dl className="grid grid-cols-2 gap-3 border-t border-black/10 pt-3 font-archivo text-[11px] text-[#5f5a52]">
                      <div>
                        <dt className="uppercase tracking-[0.08em]">
                          Uploaded
                        </dt>
                        <dd className="mt-1 text-[#211f1c]">
                          {formatLongDate(illustration.uploadedAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-[0.08em]">Updated</dt>
                        <dd className="mt-1 text-[#211f1c]">
                          {formatLongDate(illustration.updatedAt)}
                        </dd>
                      </div>
                    </dl>
                  )}

                  <div className="flex flex-col gap-2">
                    <p className="font-archivo text-[10px] font-medium uppercase tracking-[0.08em] text-[#5f5a52]">
                      Installation command
                    </p>
                    <InstallCommand
                      command={illustration.installCommand}
                      className="bg-my-primary/70 text-[11px]"
                    />
                  </div>
                </div>
              </section>

              <div className="shrink-0 px-1">
                <Button
                  asChild
                  className="h-11 w-full rounded-full bg-my-secondary text-sm font-medium text-my-primary hover:bg-my-secondary/85"
                >
                  <Link
                    href={illustration.viewerHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Illustration
                    <Eye aria-hidden="true" data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {positionLabel}
            {illustration ? `: ${illustration.title}` : ""}
          </p>

          <nav
            aria-label="Illustration navigation"
            className="flex shrink-0 items-center justify-between gap-2 px-0.5 pt-3 pb-0.5"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={availableItems.length < 2}
              aria-label="Previous illustration"
              title="Previous illustration (←)"
              className="size-10 shrink-0 rounded-full bg-my-primary px-8 text-[#211f1c] shadow-sm hover:bg-white/85 hover:text-[#211f1c] disabled:opacity-40"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>

            {dotItems.length > 0 ? (
              <div className="flex min-w-0 items-center justify-center">
                {dotItems.map((item, offset) => {
                  const index = dotStart + offset;
                  const active = index === activePosition;

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setSelectedSlug(item.slug);
                        onNavigate(item.slug);
                      }}
                      aria-label={`Show illustration ${index + 1}: ${item.title}`}
                      aria-current={active ? "true" : undefined}
                      className="group flex size-5 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-[#211f1c]/30 focus-visible:outline-none"
                    >
                      <span
                        className={[
                          "size-1.5 rounded-full transition-all duration-200",
                          active
                            ? "scale-125 bg-[#211f1c]"
                            : "bg-[#211f1c]/20 group-hover:bg-[#211f1c]/45",
                        ].join(" ")}
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(1)}
              disabled={availableItems.length < 2}
              aria-label="Next illustration"
              title="Next illustration (→)"
              className="size-10 shrink-0 rounded-full bg-[#211f1c] px-8 text-white shadow-sm hover:bg-[#211f1c]/85 hover:text-white disabled:opacity-40"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
