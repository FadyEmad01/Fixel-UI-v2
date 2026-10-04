import type { CatalogItem, CatalogKind } from "@/types/catalog";

const collectionRouteByKind = {
  component: "ui",
  block: "blocks",
  illustration: "illustrations",
  animation: "animations",
  easing: "easings",
  effect: "effects",
  hook: "hooks",
  utility: "utilities",
  pattern: "patterns",
  template: "templates",
  page: "pages",
} satisfies Record<CatalogKind, string>;

export function getCollectionRoute(kind: CatalogKind) {
  return collectionRouteByKind[kind];
}

export function getCatalogItemHref(item: CatalogItem) {
  return `/collections/${item.id}`;
}
