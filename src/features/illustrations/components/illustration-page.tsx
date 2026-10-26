import { getSiteUrl } from "@/lib/site";
import {
  ILLUSTRATION_CATEGORIES,
  illustrationCategories,
} from "../lib/categories";
import { illustrationsHref, illustrationViewerHref } from "../lib/href";
import { addCommands, installUrl } from "../lib/install";
import { allIllustrations, getIllustration } from "../lib/items";
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
  selectedSlug,
}: {
  activeCategory?: string;
  selectedSlug?: string;
}) {
  const categories = illustrationCategories();
  const tag =
    activeCategory && categories.includes(activeCategory)
      ? activeCategory
      : undefined;

  const site = getSiteUrl();
  const illustrations = tag
    ? allIllustrations().filter(
        (illustration) => ILLUSTRATION_CATEGORIES[illustration.slug] === tag,
      )
    : allIllustrations();
  const toSheetItem = (
    illustration: ReturnType<typeof allIllustrations>[number],
  ) => {
    const itemUrl = installUrl(site, illustration.slug);
    return {
      slug: illustration.slug,
      title: illustration.title,
      description: illustration.description,
      category: ILLUSTRATION_CATEGORIES[illustration.slug] ?? "Uncategorized",
      uploadedAt: illustration.uploadedAt,
      updatedAt: illustration.updatedAt,
      href: illustrationsHref(tag, illustration.slug),
      viewerHref: illustrationViewerHref(illustration.slug, tag),
      installCommand: addCommands(itemUrl).pnpm,
    };
  };
  const sheetItems = illustrations.map(toSheetItem);
  const selected = selectedSlug ? getIllustration(selectedSlug) : undefined;
  const selectedItem = selected ? toSheetItem(selected) : null;

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
        illustrations={sheetItems}
        categories={categories}
        activeCategory={tag}
        selectedSlug={selectedItem?.slug}
        selectedItem={selectedItem}
      />
    </div>
  );
}
