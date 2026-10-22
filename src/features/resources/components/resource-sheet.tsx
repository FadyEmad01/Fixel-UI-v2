"use client";

import { ArrowUpRight, RotateCcw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Resource } from "../lib/types";
import { resourceHost } from "../lib/url";
import { ResourceFallback, SiteIcon } from "./resource-card";

type SheetState =
  | { status: "loading" }
  | { status: "ready"; resource: Resource }
  | { status: "error"; message: string };

/**
 * The resource detail sheet.
 *
 * Details come from `/api/resources`, which only answers for URLs in the
 * curated list — so opening `?url=` with anything else lands in the error
 * state instead of scraping an arbitrary site on a visitor's behalf.
 */
export function ResourceSheet({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  const [state, setState] = React.useState<SheetState>({ status: "loading" });
  const [attempt, setAttempt] = React.useState(0);
  const resource = state.status === "ready" ? state.resource : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` is a retry counter; it only needs to re-run the request.
  React.useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(`/api/resources?url=${encodeURIComponent(url)}`, {
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
      .then((loaded) => setState({ status: "ready", resource: loaded }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      });

    return () => controller.abort();
  }, [url, attempt]);

  return (
    <Sheet
      open={Boolean(url)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="gap-0 p-0">
        {state.status === "loading" ? (
          <div className="flex flex-col gap-4 p-4 pt-5" aria-busy="true">
            <SheetTitle className="sr-only">Loading resource</SheetTitle>
            <SheetDescription className="sr-only">
              Fetching the saved details for this resource.
            </SheetDescription>
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="aspect-video w-full animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        ) : null}

        {state.status === "error" ? (
          <>
            <SheetHeader className="pt-5">
              <SheetTitle>Couldn&apos;t load this resource</SheetTitle>
              <SheetDescription>{state.message}</SheetDescription>
            </SheetHeader>

            <SheetFooter>
              <Button
                variant="outline"
                onClick={() => setAttempt((value) => value + 1)}
              >
                <RotateCcw aria-hidden="true" />
                Try again
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </SheetFooter>
          </>
        ) : null}

        {resource ? (
          <>
            <SheetHeader className="pt-5">
              <div className="flex items-center gap-2">
                <SiteIcon icon={resource.icon} />
                <SheetTitle className="text-lg">{resource.name}</SheetTitle>
              </div>
              <SheetDescription className="font-archivo text-xs tracking-wide">
                {resourceHost(resource.normalizedUrl)}
              </SheetDescription>
            </SheetHeader>

            <div className="aspect-video w-full overflow-hidden border-y bg-muted">
              {resource.image ? (
                // biome-ignore lint/performance/noImgElement: metadata images come from arbitrary curated hosts.
                <img
                  src={resource.image}
                  alt=""
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="size-full object-cover"
                />
              ) : (
                <ResourceFallback name={resource.name} />
              )}
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto p-4">
              {resource.description ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {resource.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This site doesn&apos;t publish a description.
                </p>
              )}

              {resource.categories.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1">
                  {resource.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-sm bg-neutral-200/70 px-1.5 py-0.5 font-archivo text-[10px] font-medium capitalize text-muted-foreground dark:bg-muted"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : null}

              {resource.status === "failed" ? (
                <p className="text-xs text-muted-foreground">
                  Showing the last details we could read from this site.
                </p>
              ) : null}
            </div>

            <SheetFooter className="border-t">
              <Button asChild className="w-full">
                <a
                  href={resource.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site
                  <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
                </a>
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
