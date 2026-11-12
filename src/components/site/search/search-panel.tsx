"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Highlight } from "@/features/resources/components/highlight";
import { cn } from "@/lib/utils";

import { groupByKind, matchItems, SEARCH_KINDS } from "./match";
import { SearchPreview } from "./search-preview";
import type { SearchItem, SearchKind, SearchScope } from "./types";

const SCOPES: Array<{ value: SearchScope; label: string }> = [
  { value: "all", label: "All" },
  ...SEARCH_KINDS.map((kind) => ({
    value: kind,
    label: kind.charAt(0).toUpperCase() + kind.slice(1),
  })),
];

const KIND_LABEL: Record<SearchKind, string> = {
  resources: "Resources",
  illustrations: "Illustrations",
  easings: "Easings",
};

/**
 * Same chip treatment as the catalog filters (`category-filter.tsx` and
 * `illustration-filter.tsx`), so the panel reads as another catalog surface
 * rather than a separate widget.
 */
const chipClasses =
  "inline-flex shrink-0 items-center rounded-lg px-3 py-1 text-base font-medium tracking-wider capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

const kbdClasses =
  "h-4 min-w-4 rounded-[4px] bg-black/[0.06] px-1 text-[10px] text-black/55 dark:bg-white/10 dark:text-white/60";

/**
 * The navbar's search body: catalog chips on top, a result list on the left,
 * and the highlighted item's real catalog card on the right.
 *
 * Loaded with `next/dynamic` from the navbar, so the illustration previews
 * (the whole generated barrel) only reach the browser once someone opens
 * search. Rows are real links: the arrow keys are a shortcut for sighted
 * keyboard users, not the only way in.
 */
export default function SearchPanel({
  items,
  isOpen,
  onClose,
}: {
  items: SearchItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [scope, setScope] = React.useState<SearchScope>("all");
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef(new Map<string, HTMLAnchorElement>());

  const visible = React.useMemo(
    () => matchItems(items, deferredQuery, scope),
    [items, deferredQuery, scope],
  );

  const hasQuery = query.trim().length > 0;
  // Section headings only earn their space when the list really is every
  // catalog; a filtered or typed list stays flat and labels each row instead.
  const sections = hasQuery || scope !== "all" ? null : groupByKind(visible);
  const showRowLabel = hasQuery || scope !== "all";

  const safeIndex = Math.min(activeIndex, Math.max(visible.length - 1, 0));
  const activeItem = visible[safeIndex];

  const indexById = React.useMemo(
    () => new Map(visible.map((item, index) => [item.id, index])),
    [visible],
  );

  // Fresh search every time the panel opens; the scope is a deliberate choice
  // and survives, so reopening picks up where the last browse left off.
  React.useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);

    // A catalog sheet closing behind us (`SHEET_PARAMS` in the navbar) hands
    // focus back to <body> a beat after we mount, so reclaim the input for a
    // moment instead of only on the first frame. Never steal it from a real
    // element the visitor picked.
    const focusInput = () => {
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        active === document.documentElement
      ) {
        inputRef.current?.focus();
      }
    };

    focusInput();
    const frame = requestAnimationFrame(focusInput);
    const timers = [80, 240, 420].map((ms) => setTimeout(focusInput, ms));

    return () => {
      cancelAnimationFrame(frame);
      for (const timer of timers) clearTimeout(timer);
    };
  }, [isOpen]);

  // The panel stays mounted after its first open, and the shell marks it
  // `aria-hidden` while closed — so a focused input/link would be left inside
  // a hidden container. Let focus fall back to the page instead.
  React.useEffect(() => {
    if (isOpen) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && rootRef.current?.contains(active)) {
      active.blur();
    }
  }, [isOpen]);

  // A new query or scope starts the highlight at the top of the list.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the values are triggers, not inputs.
  React.useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery, scope]);

  React.useEffect(() => {
    if (!activeItem) return;
    rowRefs.current.get(activeItem.id)?.scrollIntoView({ block: "nearest" });
  }, [activeItem]);

  const openItem = React.useCallback(
    (item: SearchItem | undefined) => {
      if (!item) return;
      onClose();
      router.push(item.href);
    },
    [onClose, router],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(Math.min(safeIndex + 1, Math.max(visible.length - 1, 0)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(Math.max(safeIndex - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openItem(activeItem);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  const renderRow = (item: SearchItem) => {
    const index = indexById.get(item.id) ?? 0;
    const isActive = index === safeIndex;

    return (
      <li key={item.id}>
        <Link
          href={item.href}
          ref={(node) => {
            if (node) rowRefs.current.set(item.id, node);
            else rowRefs.current.delete(item.id);
          }}
          onClick={onClose}
          onMouseEnter={() => setActiveIndex(index)}
          onFocus={() => setActiveIndex(index)}
          aria-current={isActive ? "true" : undefined}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 font-archivo text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
            isActive
              ? "bg-black/[0.06] dark:bg-white/10"
              : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
          )}
        >
          <span className="min-w-0 flex-1 truncate">
            <Highlight text={item.title} query={query} />
          </span>

          {item.isNew ? (
            <span className="shrink-0 rounded-sm bg-my-secondary px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white">
              New
            </span>
          ) : null}

          {showRowLabel ? (
            <span className="max-w-[45%] shrink-0 truncate text-[10px] text-black/40 dark:text-white/40">
              {item.label}
            </span>
          ) : null}
        </Link>
      </li>
    );
  };

  const shortcut = useIsMac() ? "⌘K" : "Ctrl K";

  return (
    <div className="flex h-full min-h-0 flex-col font-archivo -mt-7">
      {/* Catalog chips — the same row the catalog pages wear. */}
      <nav aria-label="Search catalogs" className="shrink-0 overflow-hidden">
        <div className="scroll-fade-x scrollbar-none overflow-x-auto">
          <div className="flex w-max gap-2.5">
            {SCOPES.map((option) => {
              const isActive = scope === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setScope(option.value);
                    inputRef.current?.focus();
                  }}
                  className={cn(
                    chipClasses,
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Left: the query and the result list. */}
        <div className="flex min-h-0 flex-col">
          <div className="relative h-9 shrink-0">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <label htmlFor="site-search" className="sr-only">
              Search the site
            </label>
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              placeholder={
                scope === "all"
                  ? "Search resources, illustrations, easings…"
                  : `Search ${scope}…`
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 w-full rounded-lg border-none bg-muted pl-8 pr-14 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden"
            />

            <span className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none dark:hover:bg-white/10"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ) : (
                <Kbd className={kbdClasses}>{shortcut}</Kbd>
              )}
            </span>
          </div>

          <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {visible.length === 0 ? (
              <p className="px-2 py-10 text-center text-sm text-black/40 dark:text-white/40">
                No matches for “{query.trim()}”.
              </p>
            ) : sections ? (
              sections.map((section) => (
                <section key={section.kind} className="pb-1.5">
                  <h3 className="px-2 pt-1.5 pb-1 text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40">
                    {KIND_LABEL[section.kind]}
                  </h3>
                  <ul>{section.items.map(renderRow)}</ul>
                </section>
              ))
            ) : (
              <ul>{visible.map(renderRow)}</ul>
            )}
          </div>

          <div className="mt-2 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-black/45 dark:text-white/45">
            <span className="flex items-center gap-1">
              <KbdGroup>
                <Kbd className={kbdClasses}>↑</Kbd>
                <Kbd className={kbdClasses}>↓</Kbd>
              </KbdGroup>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd className={kbdClasses}>↵</Kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <Kbd className={kbdClasses}>esc</Kbd>
              close
            </span>
            <span className="ml-auto tabular-nums">
              {visible.length} {visible.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {/* Right: the card that row opens, drawn by the catalog's own media. */}
        <div className="hidden min-h-0 lg:flex lg:flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <SearchPreview item={activeItem} onOpen={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** `⌘K` on Apple platforms, `Ctrl K` everywhere else. */
function useIsMac() {
  const [isMac] = React.useState(() => {
    if (typeof navigator === "undefined") return false;
    return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  });

  return isMac;
}
