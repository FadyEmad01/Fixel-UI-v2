import { allEasings } from "@/features/easings/data";
import { easingsHref } from "@/features/easings/lib/href";
import { ILLUSTRATION_CATEGORIES } from "@/features/illustrations/lib/categories";
import { illustrationsHref } from "@/features/illustrations/lib/href";
import { allIllustrations } from "@/features/illustrations/lib/items";
import { resourcesHref } from "@/features/resources/lib/href";
import { allResources } from "@/features/resources/lib/resources";
import { resourceHost } from "@/features/resources/lib/url";

import type { SearchItem } from "./types";

/**
 * The whole site in one flat list.
 *
 * Server-only: it reads the resource snapshot and the committed registry
 * manifest, both of which must stay out of the browser bundle. Each item is
 * reduced to the fields the panel renders, and `href` points at the catalog
 * URL that opens the item's sheet — the same destination a card on the grid
 * links to, so search and browsing land in the same place.
 *
 * The order is catalogs-then-catalog-order, which the panel relies on for its
 * "All" grouping and for the default (empty query) list.
 */
export function buildSearchIndex(): SearchItem[] {
  return [
    ...allResources().map((resource): SearchItem => {
      const host = resourceHost(resource.normalizedUrl);

      return {
        id: `resources:${resource.normalizedUrl}`,
        kind: "resources",
        slug: resource.normalizedUrl,
        title: resource.name,
        description: resource.description ?? `A curated link to ${host}.`,
        label: host,
        keywords: [
          resource.title ?? "",
          ...resource.categories,
          resource.siteName ?? "",
          "resource",
          "resources",
          "site",
          "link",
        ],
        href: resourcesHref(undefined, resource.url),
        externalUrl: resource.externalUrl,
        image: resource.image,
        icon: resource.icon,
        isNew: resource.isNew,
      };
    }),
    ...allIllustrations().map((illustration): SearchItem => {
      const category =
        ILLUSTRATION_CATEGORIES[illustration.slug] ?? "Illustration";

      return {
        id: `illustrations:${illustration.slug}`,
        kind: "illustrations",
        slug: illustration.slug,
        title: illustration.title,
        description: illustration.description,
        label: category,
        keywords: [
          illustration.slug,
          category,
          "illustration",
          "illustrations",
        ],
        href: illustrationsHref(undefined, illustration.slug),
      };
    }),
    ...allEasings().map(
      (easing): SearchItem => ({
        id: `easings:${easing.slug}`,
        kind: "easings",
        slug: easing.slug,
        title: easing.name,
        description: easing.description,
        label: "Easing",
        keywords: [
          easing.slug,
          "easing",
          "easings",
          "cubic bezier",
          "cubic-bezier",
          ...easing.points.map(String),
        ],
        href: easingsHref(easing.slug),
        points: easing.points,
      }),
    ),
  ];
}
