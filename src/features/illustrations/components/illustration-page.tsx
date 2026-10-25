import {
  ILLUSTRATION_CATEGORIES,
  illustrationCategories,
} from "../lib/categories";
import { allIllustrations } from "../lib/items";
import { IllustrationBrowser } from "./illustration-browser";

/**
 * The `/illustration` catalog: header, family chips, search, and a grid.
 *
 * Mirrors `/resources` on purpose — one catalog pattern, two kinds of content.
 * The `tag` filter is resolved here so the page stays a server component and a
 * filtered view is shareable.
 */
export function IllustrationPage({
  activeCategory,
}: {
  activeCategory?: string;
}) {
  const categories = illustrationCategories();
  const tag =
    activeCategory && categories.includes(activeCategory)
      ? activeCategory
      : undefined;

  const illustrations = tag
    ? allIllustrations().filter(
        (illustration) => ILLUSTRATION_CATEGORIES[illustration.slug] === tag,
      )
    : allIllustrations();

  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
        <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once lg:text-7xl">
          Illustrations
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Coded wireframe illustrations you can install and drop into any React
          surface.
        </p>
      </header>

      <hr className="my-6 border-primary/15" />

      <IllustrationBrowser
        illustrations={illustrations}
        categories={categories}
        activeCategory={tag}
      />
    </div>
  );
}
