import { CATEGORY_ORDER, resources as seed } from "../data/resources";
import snapshotJson from "../generated/resources.json";

import type {
  Resource,
  ResourceSeed,
  ResourceSnapshot,
  ResourceSnapshotEntry,
} from "./types";
import { normalizeResourceUrl, resourceHost } from "./url";

/**
 * Reads the curated list and its metadata snapshot.
 *
 * Server-only: it imports the generated JSON. The snapshot is a cache, not a
 * source of truth — a URL that has never been synced still renders, with its
 * hostname standing in for the name.
 */

const snapshot = snapshotJson as ResourceSnapshot;

const snapshotByUrl = new Map<string, ResourceSnapshotEntry>(
  snapshot.resources.map((entry) => [entry.normalizedUrl, entry]),
);

function merge(entry: ResourceSeed): Resource {
  const normalized = normalizeResourceUrl(entry.url);
  const cached = normalized ? snapshotByUrl.get(normalized) : undefined;
  const host = resourceHost(entry.url);

  return {
    url: entry.url,
    normalizedUrl: normalized ?? entry.url,
    categories: entry.categories,
    name: cached?.name ?? host,
    title: cached?.title ?? null,
    description: cached?.description ?? null,
    image: cached?.image ?? null,
    icon: cached?.icon ?? null,
    siteName: cached?.siteName ?? null,
    themeColor: cached?.themeColor ?? null,
    externalUrl: cached?.finalUrl ?? entry.url,
    status: cached?.status ?? "pending",
    fetchedAt: cached?.fetchedAt ?? null,
    lastError: cached?.lastError ?? null,
  };
}

/** Every resource, in the order you wrote them. Duplicate URLs appear once. */
export function allResources(): Resource[] {
  const seen = new Set<string>();
  const merged: Resource[] = [];

  for (const entry of seed) {
    const key = normalizeResourceUrl(entry.url) ?? entry.url;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(merge(entry));
  }

  return merged;
}

/** Categories actually in use, ordered by `CATEGORY_ORDER` then alphabetically. */
export function resourceCategories(): string[] {
  const rank = new Map(
    CATEGORY_ORDER.map((category, index) => [category, index]),
  );
  const used = new Set<string>();

  for (const resource of allResources()) {
    for (const category of resource.categories) used.add(category);
  }

  return [...used].sort((a, b) => {
    const rankA = rank.get(a) ?? Number.MAX_SAFE_INTEGER;
    const rankB = rank.get(b) ?? Number.MAX_SAFE_INTEGER;
    return rankA === rankB ? a.localeCompare(b) : rankA - rankB;
  });
}

/** Resources in a category. An unknown or missing tag means "no filter". */
export function resourcesForTag(tag?: string): Resource[] {
  const all = allResources();
  if (!tag) return all;
  return all.filter((resource) => resource.categories.includes(tag));
}

/**
 * Look up one resource by URL. Unknown URLs return `undefined` — this is the
 * gate that keeps `/api/resources` from ever fetching something you did not
 * curate.
 */
export function findResource(value: string): Resource | undefined {
  const target = normalizeResourceUrl(value);
  if (!target) return undefined;

  return allResources().find((resource) => resource.normalizedUrl === target);
}

/** When the snapshot was last written, or `null` before the first sync. */
export function snapshotGeneratedAt(): string | null {
  return snapshot.generatedAt;
}
