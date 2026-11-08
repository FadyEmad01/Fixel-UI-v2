import {
  allResources,
  resourceCategories,
  resourceCategoryCounts,
} from "./resources";
import type { Resource } from "./types";

export interface ResourceCatalog {
  /** The validated category, or `undefined` for the unfiltered view. */
  tag?: string;
  resources: Resource[];
  categories: string[];
  counts: Record<string, number>;
  total: number;
}

/**
 * Everything `/resources` needs from one `?tag=` value.
 *
 * Validating here (rather than per component) keeps the count, the chips, and
 * the grid agreeing on what an unknown tag means: "All".
 */
export function resourceCatalog(activeCategory?: string): ResourceCatalog {
  const all = allResources();
  const categories = resourceCategories();
  const { total, counts } = resourceCategoryCounts();
  const tag =
    activeCategory && categories.includes(activeCategory)
      ? activeCategory
      : undefined;

  return {
    tag,
    resources: tag
      ? all.filter((resource) => resource.categories.includes(tag))
      : all,
    categories,
    counts,
    total,
  };
}
