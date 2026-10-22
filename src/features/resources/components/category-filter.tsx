import Link from "next/link";

import { cn } from "@/lib/utils";

const chipClasses =
  "inline-flex shrink-0 items-center rounded-lg px-3 py-1 text-base font-medium tracking-wider capitalize transition-colors";

/**
 * Tag filter chips for the resource grid.
 *
 * Filtering is URL-driven (`/resources?tag=UI`) so a filtered view is shareable
 * and the page itself stays a server component. Visual style matches the
 * library catalog chips.
 */
export function CategoryFilter({
  categories,
  activeCategory,
  className,
}: {
  categories: string[];
  activeCategory?: string;
  className?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Category filters"
      className={cn(
        "mx-auto mb-10 w-full overflow-hidden font-archivo md:mx-0",
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
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
