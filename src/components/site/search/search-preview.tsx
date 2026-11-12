"use client";

import { MoveUpRight } from "lucide-react";
import Link from "next/link";

import { Kbd } from "@/components/ui/kbd";
import { EasingCurveSvg } from "@/features/easings/components/easing-curve-svg";
import {
  type IllustrationSlug,
  illustrations,
} from "@/features/illustrations/generated";
import { SiteIcon } from "@/features/resources/components/resource-card";
import { ResourceImage } from "@/features/resources/components/resource-image";
import { cn } from "@/lib/utils";

import type { SearchItem } from "./types";

const CTA: Record<SearchItem["kind"], string> = {
  resources: "Open in resources",
  illustrations: "Open in illustrations",
  easings: "Open in easings",
};

/**
 * The right-hand pane: the card the highlighted row would open.
 *
 * Not a lookalike — it reuses the same media pieces the catalog cards use
 * (`ResourceImage`, the generated illustration, `EasingCurveSvg`) inside the
 * same frame/title/description rhythm, so the preview and the grid are the
 * same object at two sizes.
 */
export function SearchPreview({
  item,
  onOpen,
}: {
  item: SearchItem | undefined;
  onOpen: () => void;
}) {
  if (!item) return <EmptyPreview />;

  return (
    <Link
      href={item.href}
      onClick={onOpen}
      aria-label={`${CTA[item.kind]}: ${item.title}`}
      className="group block min-w-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div
        className={cn(
          "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-muted",
          item.kind !== "resources" && "p-6",
        )}
      >
        <PreviewMedia item={item} />

        {item.kind === "resources" && item.isNew ? (
          <span className="absolute right-2 top-2 rounded-sm bg-my-secondary px-1.5 py-0.5 font-archivo text-[10px] font-medium capitalize text-white">
            New Drop
          </span>
        ) : null}

        {item.kind === "illustrations" ? (
          <span className="absolute right-2 top-2 rounded-md bg-background/85 px-2 py-1 font-archivo text-[10px] text-muted-foreground backdrop-blur">
            {item.label}
          </span>
        ) : null}
      </div>

      <div className="mt-3 min-w-0 px-0.5">
        <div className="flex items-center gap-1.5">
          {item.kind === "resources" ? (
            <SiteIcon icon={item.icon ?? null} normalizedUrl={item.slug} />
          ) : null}
          <p className="line-clamp-1 font-archivo text-base font-medium text-foreground">
            {item.kind === "resources" ? `@${item.title}` : item.title}
          </p>
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/5 pt-2 text-[11px] text-black/45 dark:border-white/10 dark:text-white/45">
          <span className="flex min-w-0 items-center gap-1 truncate">
            {CTA[item.kind]}
            <MoveUpRight className="size-3 shrink-0" aria-hidden="true" />
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Kbd className="h-4 min-w-4 rounded-[4px] bg-black/[0.06] px-1 text-[10px] text-black/55 dark:bg-white/10 dark:text-white/60">
              ↵
            </Kbd>
            <span>open</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Catalog art, switched on kind only — never on the catalog's data shape. */
function PreviewMedia({ item }: { item: SearchItem }) {
  if (item.kind === "resources") {
    return (
      <ResourceImage
        image={item.image ?? null}
        blurDataUrl={null}
        name={item.title}
        icon={item.icon ?? null}
        url={item.externalUrl ?? item.slug}
        alt=""
        className="size-full"
      />
    );
  }

  if (item.kind === "easings" && item.points) {
    return (
      <div className="flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
        <EasingCurveSvg
          points={item.points}
          animate
          showGrid
          showEndedCircle={false}
          width={180}
          height={180}
        />
      </div>
    );
  }

  const Preview = illustrations[item.slug as IllustrationSlug];

  if (!Preview) {
    return (
      <span
        aria-hidden="true"
        className="font-heading text-3xl font-semibold text-muted-foreground/50"
      >
        {item.title.trim().charAt(0).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
      <Preview />
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed border-black/10 px-6 text-center text-sm text-black/35 dark:border-white/10 dark:text-white/35">
      The highlighted card shows up here.
    </div>
  );
}
