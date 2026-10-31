"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  X,
} from "lucide-react";
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
import type { Resource } from "../lib/types";
import { normalizeResourceUrl, resourceHost } from "../lib/url";
import { SiteIcon } from "./resource-card";
import { ResourceImage } from "./resource-image";

/** How many pagination dots are shown at once; the window follows the active one. */
const DOT_WINDOW = 7;

type SheetState =
  | { status: "loading"; url: string }
  | { status: "ready"; url: string; resource: Resource }
  | { status: "error"; url: string; message: string };

type ResourceSheetProps = {
  /** The URL that opens the sheet, or `null` when it is closed. */
  url: string | null;

  /** Ordered list of URLs available for navigation. */
  resourceUrls: string[];

  /** Ask the parent to close the sheet. */
  onClose: () => void;

  /** Called when the carousel selects a different resource. */
  onNavigate?: (url: string) => void;
};

/** URLs are compared in normalized form so `?url=` variants still match. */
function resourceKey(value: string) {
  return normalizeResourceUrl(value) ?? value;
}

function sameResource(a: string | null, b: string | null) {
  if (!a || !b) return a === b;
  return resourceKey(a) === resourceKey(b);
}

function indexOfResource(urls: string[], value: string | null) {
  if (!value) return -1;
  const key = resourceKey(value);
  return urls.findIndex((candidate) => resourceKey(candidate) === key);
}

/**
 * The resource carousel sheet.
 *
 * Details come from `/api/resources`, which only answers for URLs in the
 * curated list — so opening `?url=` with anything else lands in the error
 * state instead of scraping an arbitrary site on a visitor's behalf.
 *
 * The sheet keeps its own "which resource am I looking at" state so arrows and
 * dots respond instantly; the parent can mirror it into `?url=` through
 * `onNavigate` without the fetch waiting for a round trip.
 */
export function ResourceSheet({
  url,
  resourceUrls,
  onClose,
  onNavigate,
}: ResourceSheetProps) {
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(url);
  const [lastUrlProp, setLastUrlProp] = React.useState(url);
  const [state, setState] = React.useState<SheetState>({
    status: "loading",
    url: url ?? "",
  });
  const [attempt, setAttempt] = React.useState(0);

  // Adopt `url` when the sheet opens. Changes while it is already open come
  // from this component's own `onNavigate`, so local state is the fresher
  // value and the prop is only an echo.
  if (url !== lastUrlProp) {
    setLastUrlProp(url);
    if (url && !lastUrlProp) setSelectedUrl(url);
  }

  // Unique, ordered URLs. When the open resource is filtered out of the grid
  // (shared link + a different `?tag=`), keep it reachable at the front.
  const availableUrls = React.useMemo(() => {
    const seen = new Set<string>();
    const urls: string[] = [];

    for (const candidate of resourceUrls) {
      const key = resourceKey(candidate);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      urls.push(candidate);
    }

    if (url) {
      const key = resourceKey(url);
      if (!seen.has(key)) {
        urls.unshift(url);
        seen.add(key);
      }
    }

    return urls;
  }, [resourceUrls, url]);

  const activeIndex = indexOfResource(availableUrls, selectedUrl);
  const activePosition = activeIndex < 0 ? 0 : activeIndex;

  // Fetch the selected resource. Aborting on change keeps a slow response from
  // overwriting the resource the visitor just moved to.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` is a retry counter; it only needs to re-run the request.
  React.useEffect(() => {
    if (!selectedUrl) return;

    const controller = new AbortController();
    setState({ status: "loading", url: selectedUrl });

    fetch(`/api/resources?url=${encodeURIComponent(selectedUrl)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          resource?: Resource;
          error?: string;
        } | null;

        if (!response.ok || !body?.resource) {
          throw new Error(body?.error ?? `Request failed (${response.status})`);
        }

        return body.resource;
      })
      .then((loaded) => {
        if (controller.signal.aborted) return;
        setState({ status: "ready", url: selectedUrl, resource: loaded });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          url: selectedUrl,
          message:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      });

    return () => controller.abort();
  }, [selectedUrl, attempt]);

  const selectResource = React.useCallback(
    (nextUrl: string) => {
      if (sameResource(nextUrl, selectedUrl)) return;
      setSelectedUrl(nextUrl);
      setAttempt(0);
      onNavigate?.(nextUrl);
    },
    [selectedUrl, onNavigate],
  );

  // Move one place in either direction, wrapping around at the ends.
  const navigate = React.useCallback(
    (direction: -1 | 1) => {
      const count = availableUrls.length;
      if (count < 2) return;

      const index = Math.max(0, indexOfResource(availableUrls, selectedUrl));
      selectResource(availableUrls[(index + direction + count) % count]);
    },
    [availableUrls, selectedUrl, selectResource],
  );

  // Arrow-key navigation, scoped to the open sheet. Typing and already-handled
  // keys keep their normal behaviour.
  React.useEffect(() => {
    if (!url || availableUrls.length < 2) return;

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
  }, [url, availableUrls.length, navigate]);

  // Only the slice of dots around the active resource is rendered, so a long
  // catalog never clips the marker the visitor needs to see.
  const dotStart = Math.max(
    0,
    Math.min(
      activePosition - Math.floor(DOT_WINDOW / 2),
      availableUrls.length - DOT_WINDOW,
    ),
  );
  const dotUrls = availableUrls.slice(dotStart, dotStart + DOT_WINDOW);

  // `state` remembers which URL it belongs to, so switching resources shows
  // the skeleton immediately instead of the previous resource's details.
  const current = state.url === (selectedUrl ?? "") ? state : null;
  const resource = current?.status === "ready" ? current.resource : null;
  const errorMessage = current?.status === "error" ? current.message : null;
  const loading = !resource && !errorMessage;

  const positionLabel =
    availableUrls.length > 0
      ? `Resource ${activePosition + 1} of ${availableUrls.length}`
      : "Resource";

  return (
    <Sheet
      open={Boolean(url)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className={[
          // The same `data-[side=right]` modifier as the base sheet classes, so
          // tailwind-merge actually replaces the full-height drawer defaults.
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
            aria-label="Close resource"
            title="Close (Esc)"
            className="absolute top-5.5 right-6 z-20 size-9 rounded-full bg-my-primary/70 text-foreground opacity-100 transition hover:bg-my-primary/70 backdrop-blur-2xl hover:text-foreground focus-visible:ring-1 dark:focus-visible:ring-border focus-visible:ring-my-bg border-none"
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex min-h-0 flex-1 flex-col">
          {loading && (
            <div
              aria-busy="true"
              className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain"
            >
              <SheetTitle className="sr-only">Loading resource</SheetTitle>

              <SheetDescription className="sr-only">
                Fetching the saved details for this resource.
              </SheetDescription>

              <div className="aspect-video w-full animate-pulse rounded-[20px] bg-my-bg/20" />

              <div className="flex flex-col gap-2.5 px-1.5 pb-2">
                <div className="h-7 w-3/4 animate-pulse rounded-md bg-my-bg/20" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-my-bg/20" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-my-bg/20" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-my-bg/20" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-my-bg/20" />
                <div className="mt-3 h-11 w-full animate-pulse rounded-full bg-my-bg/20" />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="no-scrollbar flex min-h-0 flex-1 flex-col justify-center gap-5 overflow-y-auto overscroll-contain px-2 py-10">
              <SheetHeader className="space-y-2 p-0 text-left">
                <SheetTitle className="font-heading text-2xl leading-tight font-semibold tracking-tight">
                  Couldn&apos;t load this resource
                </SheetTitle>

                <SheetDescription className="text-[13px] leading-6 text-foreground/65">
                  {errorMessage}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <RotateCcw aria-hidden="true" />
                  Try again
                </Button>

                <Button
                  variant="ghost"
                  className="rounded-full"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {resource && (
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="relative aspect-video max-h-[38dvh] w-full shrink-0 overflow-hidden rounded-[20px] bg-my-bg">
                <ResourceImage
                  key={resource.image ?? "fallback"}
                  image={resource.image}
                  blurDataUrl={resource.blurDataUrl}
                  name={resource.name}
                  icon={resource.icon}
                  url={resource.normalizedUrl}
                  alt={`${resource.name} preview`}
                  loading="eager"
                />
              </div>

              <section
                aria-label="Resource details"
                // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users must be able to scroll the details pane.
                tabIndex={0}
                className="scroll-fade scroll-fade-52 scrollbar-none overflow-y-auto no-scrollbar min-h-0 flex-1 overscroll-contain focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-inset focus-visible:outline-none"
              >
                <div className="flex flex-col gap-4 px-1.5 pb-2">
                  <SheetHeader className="space-y-1.5 p-0 text-left">
                    <SheetTitle className="font-heading text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-foreground chroma-text chroma-text-animate-once">
                      @{resource.name}
                    </SheetTitle>

                    <SheetDescription className="flex items-center gap-1.5 font-archivo text-xs tracking-wide text-foreground/65">
                      <SiteIcon icon={resource.icon} />
                      {resourceHost(resource.normalizedUrl)}
                    </SheetDescription>
                  </SheetHeader>

                  <p className="text-[13px] leading-[1.7] text-foreground/80">
                    {resource.description ??
                      "This site doesn't publish a description."}
                  </p>

                  {resource.categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {resource.categories.map((category) => (
                        <span
                          key={category}
                          className="rounded-md bg-foreground/[0.055] px-2 py-1 font-archivo text-[10px] font-medium tracking-[0.08em] text-foreground/65 capitalize"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {(resource.uploadedAt || resource.updatedAt) && (
                    <dl className="grid grid-cols-2 gap-3 border-t border-border pt-3 font-archivo text-[11px] text-foreground/65">
                      <div>
                        <dt className="uppercase tracking-[0.08em]">
                          Uploaded
                        </dt>
                        <dd className="mt-1 text-foreground">
                          {formatLongDate(resource.uploadedAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-[0.08em]">Updated</dt>
                        <dd className="mt-1 text-foreground">
                          {formatLongDate(resource.updatedAt)}
                        </dd>
                      </div>
                    </dl>
                  )}

                  {resource.status === "failed" && (
                    <p className="text-[11px] leading-5 text-foreground/65">
                      Showing the last details we could read from this site.
                    </p>
                  )}
                </div>
              </section>

              <div className="shrink-0 px-1">
                <Button
                  asChild
                  className="h-11 w-full rounded-full bg-my-secondary text-sm font-medium text-white hover:bg-my-secondary/85"
                >
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit site
                    <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {positionLabel}
            {resource ? `: ${resource.name}` : ""}
          </p>

          <nav
            aria-label="Resource navigation"
            className="flex shrink-0 items-center justify-between gap-2 px-0.5 pt-3 pb-0.5"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={availableUrls.length < 2}
              aria-label="Previous resource"
              title="Previous resource (←)"
              className="size-10 shrink-0 rounded-full bg-my-primary dark:bg-muted text-foreground shadow-sm hover:bg-my-primary/70 hover:text-foreground disabled:opacity-40 px-8"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>

            {availableUrls.length > 0 && (
              <div className="flex min-w-0 items-center justify-center">
                {dotUrls.map((dotUrl, offset) => {
                  const index = dotStart + offset;
                  const active = index === activePosition;

                  return (
                    <button
                      key={dotUrl}
                      type="button"
                      onClick={() => selectResource(dotUrl)}
                      aria-label={`Show resource ${index + 1}: ${resourceHost(dotUrl)}`}
                      aria-current={active ? "true" : undefined}
                      className="group flex size-5 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:outline-none"
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
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(1)}
              disabled={availableUrls.length < 2}
              aria-label="Next resource"
              title="Next resource (→)"
              className="size-10 shrink-0 rounded-full bg-foreground text-background shadow-sm hover:bg-foreground/85 hover:text-background disabled:opacity-40 px-8"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
