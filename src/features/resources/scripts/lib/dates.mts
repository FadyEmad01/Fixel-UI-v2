import type { ResourceSnapshotEntry } from "../../lib/types.ts";

export type ResourceMetadata = Pick<
  ResourceSnapshotEntry,
  | "name"
  | "title"
  | "description"
  | "image"
  | "icon"
  | "siteName"
  | "themeColor"
  | "finalUrl"
>;

type PreviousResource = Partial<ResourceMetadata> & {
  fetchedAt?: string | null;
  uploadedAt?: string | null;
  updatedAt?: string | null;
};

const METADATA_FIELDS = [
  "name",
  "title",
  "description",
  "image",
  "icon",
  "siteName",
  "themeColor",
  "finalUrl",
] as const satisfies readonly (keyof ResourceMetadata)[];

/**
 * Preserve catalog dates when a sync only refreshes `fetchedAt`.
 *
 * Old snapshots have no explicit dates, so their first known fetch is used as
 * the best available baseline. A new entry starts both dates at its first sync.
 */
export function resolveResourceDates(
  next: ResourceMetadata,
  previous: PreviousResource | undefined,
  now: string,
): { uploadedAt: string; updatedAt: string } {
  const uploadedAt = previous?.uploadedAt ?? previous?.fetchedAt ?? now;
  const knownFields = previous
    ? METADATA_FIELDS.filter((field) => previous[field] !== undefined)
    : [];
  const changed = knownFields.some(
    (field) => next[field] !== previous?.[field],
  );

  return {
    uploadedAt,
    updatedAt: changed
      ? now
      : (previous?.updatedAt ?? previous?.fetchedAt ?? now),
  };
}
