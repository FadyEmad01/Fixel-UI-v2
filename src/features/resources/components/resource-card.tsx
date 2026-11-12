"use client";

import { Globe, MoveUpRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import type { Resource } from "../lib/types";
import { resourceHost } from "../lib/url";
import { Highlight } from "./highlight";
import { ResourceImage } from "./resource-image";

/**
 * One resource card.
 *
 * The card body is a stretched `<Link>` to `?url=…`, with the external link as
 * a sibling above it. Nested anchors are invalid, hence the overlay rather than
 * a wrapping link.
 *
 * A plain left click is taken over so the sheet opens without a Next.js
 * navigation. Modified clicks are left alone, so ctrl/cmd/shift/middle-click
 * still open the shareable URL in a new tab, and the `href` still works with
 * JavaScript disabled.
 */
export function ResourceCard({
  resource,
  href,
  query,
  onOpen,
}: {
  resource: Resource;
  href: string;
  query: string;
  onOpen: () => void;
}) {
  return (
    <article className="group relative min-w-0 rounded-xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <ResourceImage
          image={resource.image}
          blurDataUrl={resource.blurDataUrl}
          name={resource.name}
          icon={resource.icon}
          url={resource.normalizedUrl}
        />
        {resource.isNew ? (
          <span className="absolute right-2 top-2 rounded-sm bg-my-secondary px-1.5 py-0.5 font-archivo text-[10px] font-medium capitalize text-white">
            New Drop
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex-col items-start justify-between gap-3 px-0.5">
        <div className="min-w-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <SiteIcon
              icon={resource.icon}
              normalizedUrl={resource.normalizedUrl}
            />
            <p className="line-clamp-1 text-base font-medium text-foreground font-archivo">
              @<Highlight text={resource.name} query={query} />
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${resource.name} (opens in a new tab)`}
              className="relative z-10 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <MoveUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {resource.description ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
            <Highlight text={resource.description} query={query} />
          </p>
        ) : null}
      </div>

      <Link
        href={href}
        scroll={false}
        onClick={(event) => {
          // A nested control may have already handled this click.
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }

          event.preventDefault();
          onOpen();
        }}
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span className="sr-only">View {resource.name}</span>
      </Link>
    </article>
  );
}

/**
 * A site's own favicon, shown at text size.
 *
 * Falls back to Google's favicon service when the snapshot icon is missing or
 * fails to load. Falls back to a globe icon if nothing works.
 */
export function SiteIcon({
  icon,
  normalizedUrl,
}: {
  icon: string | null;
  normalizedUrl?: string | null;
}) {
  const host = normalizedUrl ? resourceHost(normalizedUrl) : null;
  const [mode, setMode] = React.useState<"icon" | "google" | "globe">(() => {
    if (icon) return "icon";
    if (host) return "google";
    return "globe";
  });

  if (mode === "globe") {
    return (
      <Globe
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    );
  }

  const src =
    mode === "icon" && icon
      ? icon
      : mode === "google" && host
        ? `https://www.google.com/s2/favicons?domain=${host}&sz=32`
        : "";

  if (!src) {
    return (
      <Globe
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: favicons come from arbitrary curated hosts.
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className="size-3.5 shrink-0 rounded-[3px] object-contain"
      onError={() => {
        if (mode === "icon") {
          setMode(host ? "google" : "globe");
          return;
        }
        if (mode === "google") {
          setMode("globe");
        }
      }}
    />
  );
}
