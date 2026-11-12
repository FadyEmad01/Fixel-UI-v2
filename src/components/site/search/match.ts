import type { SearchItem, SearchKind, SearchScope } from "./types";

/**
 * Catalog order for the "All" grouping and the chip row.
 *
 * Declared here rather than in `types.ts` because this module is the one Node's
 * test runner loads directly: runtime imports between the search modules must
 * stay extensionless-free, and type-only imports are erased.
 */
export const SEARCH_KINDS = [
  "resources",
  "illustrations",
  "easings",
] as const satisfies readonly SearchKind[];

/**
 * Text matching for the navbar search.
 *
 * Kept pure and separate from the panel so the ranking rules can be tested
 * without a DOM, and so a re-render never rebuilds the haystacks (they are
 * computed from the same plain fields the server already serialized).
 */

/** Split a query into lowercase terms; punctuation and extra spaces vanish. */
function termsOf(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Lower is better. `null` means at least one term is missing.
 *
 * Title-prefix beats word-prefix beats substring, which keeps "but" above a
 * resource whose description merely mentions buttons. Everything that does
 * not match the title is grouped by where it matched, so the catalog order
 * survives inside each rank.
 */
function rank(item: SearchItem, terms: string[]): number | null {
  const title = item.title.toLowerCase();
  const words = title.split(/[^a-z0-9]+/);
  const aside = `${item.label}\n${item.keywords.join("\n")}`.toLowerCase();
  const body = item.description.toLowerCase();

  let score = 0;

  for (const term of terms) {
    if (title.startsWith(term)) continue;
    if (words.some((word) => word.startsWith(term))) {
      score += 1;
      continue;
    }
    if (title.includes(term)) {
      score += 2;
      continue;
    }
    if (aside.includes(term)) {
      score += 4;
      continue;
    }
    if (body.includes(term)) {
      score += 6;
      continue;
    }
    return null;
  }

  return score;
}

/**
 * The visible rows for a query and scope, best match first.
 *
 * An empty query is not a special case: every scoped item matches with a score
 * of zero, so the catalog's own order is preserved.
 */
export function matchItems(
  items: SearchItem[],
  query: string,
  scope: SearchScope,
): SearchItem[] {
  const scoped =
    scope === "all" ? items : items.filter((item) => item.kind === scope);
  const terms = termsOf(query);
  if (terms.length === 0) return scoped;

  const scored: Array<{ item: SearchItem; index: number; score: number }> = [];

  scoped.forEach((item, index) => {
    const score = rank(item, terms);
    if (score !== null) scored.push({ item, index, score });
  });

  scored.sort((a, b) => a.score - b.score || a.index - b.index);

  return scored.map((entry) => entry.item);
}

/**
 * The empty-query "All" list, split by catalog and skipping empty groups.
 *
 * Returns kinds in `SEARCH_KINDS` order so the headings never shuffle.
 */
export function groupByKind(
  items: SearchItem[],
): Array<{ kind: SearchKind; items: SearchItem[] }> {
  return SEARCH_KINDS.map((kind) => ({
    kind,
    items: items.filter((item) => item.kind === kind),
  })).filter((group) => group.items.length > 0);
}
