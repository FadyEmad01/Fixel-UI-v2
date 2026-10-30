import Link from "next/link";

import { cn } from "@/lib/utils";

const chipClasses =
  "inline-flex shrink-0 items-center rounded-lg px-3 py-1 text-base font-medium tracking-wider capitalize transition-colors";

// const badgeClasses =
//   "ml-1 inline-flex min-w-4 items-center justify-center rounded-xs bg-my-bg px-0.5 text-[10px] text-foreground tabular-nums";

// function Count({ value, active }: { value: number; active?: boolean }) {
//   return (
//     <span
//       className={cn(
//         badgeClasses,
//         // On the dark active chip the light pill would float, so invert it to a
//         // translucent overlay of the chip's own text colour instead.
//         active && "bg-my-bg text-foreground dark:bg-black",
//       )}
//     >
//       {value}
//     </span>
//   );
// }

/**
 * Tag filter chips for the resource grid.
 *
 * Filtering is URL-driven (`/resources?tag=UI`) so a filtered view is shareable
 * and the page itself stays a server component. Visual style matches the
 * library catalog chips. Counts are global, so they do not shrink as you type.
 */
export function CategoryFilter({
  categories,
  activeCategory,
  counts,
  total,
  className,
}: {
  categories: string[];
  activeCategory?: string;
  counts: Record<string, number>;
  total: number;
  className?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Category filters"
      className={cn(
        "mx-auto w-full overflow-hidden font-archivo md:mx-0",
        className,
      )}
    >
      <div className="scroll-fade-x scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-2.5">
          <Link
            href="/resources"
            scroll={false}
            className={cn(
              chipClasses,
              !activeCategory
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
            )}
          >
            All
            {/* <Count value={total} active={!activeCategory} /> */}
          </Link>

          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <Link
                key={category}
                href={`/resources?tag=${encodeURIComponent(category)}`}
                scroll={false}
                className={cn(
                  chipClasses,
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
                )}
              >
                {category}
                {/* <Count value={counts[category] ?? 0} active={isActive} /> */}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
