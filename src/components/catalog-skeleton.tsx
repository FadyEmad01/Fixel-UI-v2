import { Skeleton } from "@/components/ui/skeleton";

const CHIP_WIDTHS = ["w-12", "w-16", "w-20", "w-14"];
const CARDS = [0, 1, 2, 3, 4, 5];

/**
 * Placeholder for a catalog body: filter chips, search, and the card grid.
 *
 * Mirrors the real layout — same columns, `aspect-video` media box, caption
 * lines — so the streamed result lands without a layout shift.
 */
export function CatalogSkeleton({
  chips = false,
  search = false,
  icon = false,
}: {
  chips?: boolean;
  search?: boolean;
  icon?: boolean;
}) {
  return (
    <div aria-hidden="true">
      <span className="sr-only">Loading…</span>

      {chips || search ? (
        <div className="mb-10 flex flex-row gap-3 md:items-start md:justify-between">
          {chips ? (
            <div className="flex gap-2.5">
              {CHIP_WIDTHS.map((width) => (
                <Skeleton key={width} className={`h-8 ${width} rounded-lg`} />
              ))}
            </div>
          ) : null}

          {search ? (
            <Skeleton className="h-8 w-full rounded-md md:ml-auto md:max-w-xs" />
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div key={card} className="flex min-w-0 flex-col">
            <Skeleton className="aspect-video w-full rounded-lg" />

            <div className="mt-3 flex items-center gap-1.5 px-0.5">
              {icon ? <Skeleton className="size-3.5 rounded-[3px]" /> : null}
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="mt-1.5 flex flex-col gap-1.5 px-0.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
