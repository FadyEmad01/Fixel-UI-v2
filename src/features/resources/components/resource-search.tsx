"use client";

import { Globe, Search, X } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Resource } from "../lib/types";
import { resourceHost } from "../lib/url";
import { Highlight } from "./highlight";

function SuggestionFavicon({ resource }: { resource: Resource }) {
  const host = resourceHost(resource.normalizedUrl);
  const [mode, setMode] = React.useState<"icon" | "google" | "globe">(() => {
    if (resource.icon) return "icon";
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
    mode === "icon" && resource.icon
      ? resource.icon
      : host
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

/**
 * The free-text filter, with suggestions that jump straight to a site.
 *
 * Suggestions are rendered inline rather than portaled so tab order stays
 * natural: type, Tab into the list, Enter to open that resource's sheet.
 */
export function ResourceSearch({
  value,
  onChange,
  suggestions,
  onSelect,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions: Resource[];
  onSelect: (resource: Resource) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();
  const showSuggestions =
    open && value.trim().length > 0 && suggestions.length > 0;

  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-8 font-archivo", className)}
    >
      <label htmlFor="resource-search" className="sr-only">
        Search resources
      </label>

      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        id="resource-search"
        type="text"
        inputMode="search"
        autoComplete="off"
        placeholder="Search resources"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="h-8 pr-8 pl-8 bg-muted border-none"
      />

      <output className="sr-only">
        {showSuggestions
          ? `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"} available`
          : ""}
      </output>

      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}

      {showSuggestions ? (
        <div
          id={panelId}
          className="absolute top-full left-0 z-30 mt-1 w-full origin-top rounded-lg bg-popover p-1 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10"
        >
          <ul>
            {suggestions.map((resource) => (
              <li key={resource.normalizedUrl}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSelect(resource);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                >
                  <SuggestionFavicon resource={resource} />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    <Highlight text={resource.name} query={value} />
                  </span>
                  <span className="shrink-0 font-archivo text-[10px] text-muted-foreground">
                    {resourceHost(resource.normalizedUrl)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
