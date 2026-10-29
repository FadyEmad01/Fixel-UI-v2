/**
 * Upload batching and ordering for the resource grid.
 *
 * `pnpm resources:sync` stamps `uploadedAt` per URL, so everything added in one
 * run lands within seconds of its siblings. Clustering those timestamps by a
 * gap threshold recovers the runs themselves, which keeps working for snapshots
 * written before batches existed — no batch id to store or backfill.
 *
 * Pure and dependency-free: `resources.ts` does the merging, this file only
 * decides what "newest batch" means.
 */

/** Two uploads further apart than this belong to different batches. */
export const RECENT_BATCH_GAP_MS = 15 * 60 * 1000;

/** The only field ordering needs. */
export interface RecencyEntry {
  uploadedAt: string | null;
}

export interface RecencyResult<T> {
  /** The input entries, newest batch first, then oldest. */
  resources: T[];
  /**
   * Oldest upload time still inside the newest batch, in epoch ms. `null` when
   * nothing in the list has a usable date.
   */
  newestBatchStart: number | null;
}

/** Epoch ms for a timestamp, or `null` when it is missing or unparseable. */
function toTime(value: string | null): number | null {
  if (!value) return null;

  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

/**
 * Order resources newest batch first and report where the newest batch starts.
 *
 * Within one batch the input order survives (stable sort), so the curated order
 * still groups a batch the way it was written. Undated resources — listed but
 * never synced — sort to the end and are never new.
 */
export function orderByRecency<T extends RecencyEntry>(
  entries: T[],
): RecencyResult<T> {
  const rows = entries.map((entry, index) => ({
    entry,
    index,
    time: toTime(entry.uploadedAt),
  }));

  const times = [
    ...new Set(rows.map((row) => row.time).filter((time) => time !== null)),
  ].sort((a, b) => b - a);

  // Walk newest -> oldest; a gap bigger than the threshold opens a new batch.
  // Chaining (rather than measuring against the newest time) keeps a slow sync
  // in one batch even when its first and last fetch are more than a gap apart.
  const batchOf = new Map<number, number>();
  let batch = 0;
  let newestBatchStart: number | null = null;

  for (let i = 0; i < times.length; i += 1) {
    const time = times[i];
    const previous = times[i - 1];

    if (previous !== undefined && previous - time > RECENT_BATCH_GAP_MS) {
      batch += 1;
    }

    if (batch === 0) newestBatchStart = time;
    batchOf.set(time, batch);
  }

  const ordered = [...rows].sort((a, b) => {
    if (a.time === null || b.time === null) {
      if (a.time === b.time) return a.index - b.index;
      return a.time === null ? 1 : -1;
    }

    const byBatch = (batchOf.get(a.time) ?? 0) - (batchOf.get(b.time) ?? 0);
    return byBatch !== 0 ? byBatch : a.index - b.index;
  });

  return {
    resources: ordered.map((row) => row.entry),
    newestBatchStart,
  };
}

/** True when an upload date falls inside the newest batch. */
export function isInNewestBatch(
  uploadedAt: string | null,
  newestBatchStart: number | null,
): boolean {
  if (newestBatchStart === null) return false;

  const time = toTime(uploadedAt);
  return time !== null && time >= newestBatchStart;
}
