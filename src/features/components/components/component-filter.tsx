import Link from "next/link";

import { cn } from "@/lib/utils";

const chipClasses =
  "inline-flex shrink-0 items-center rounded-lg px-3 py-1 text-base font-medium tracking-wider capitalize transition-colors";

/**
 * Category chips for the component grid.
 *
 * Filtering is URL-driven (`/components?tag=UI`) so a filtered view is
 * shareable and the page stays a server component. Renders nothing while no
 * categories exist, so the row never shows up empty.
 */
export function ComponentFilter({
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
      aria-label="Component filters"
      className={cn(
        "mx-auto w-full overflow-hidden font-archivo md:mx-0",
        className,
      )}
    >
      <div className="scroll-fade-x scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-2.5">
          <Link
            href="/components"
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

          {categories.map((category) => (
            <Link
              key={category}
              href={`/components?tag=${encodeURIComponent(category)}`}
              scroll={false}
              className={cn(
                chipClasses,
                activeCategory === category
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background",
              )}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
