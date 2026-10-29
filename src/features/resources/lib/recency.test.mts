import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isInNewestBatch,
  orderByRecency,
  RECENT_BATCH_GAP_MS,
} from "./recency.ts";

/** Build the shapes the helper only reads. */
function entry(name: string, uploadedAt: string | null) {
  return { name, uploadedAt };
}

const runStart = Date.parse("2026-10-27T14:57:00.000Z");
const at = (offsetMs: number) => new Date(runStart + offsetMs).toISOString();

describe("orderByRecency", () => {
  it("keeps a single batch in seed order and marks all of it new", () => {
    const list = [
      entry("a", at(0)),
      entry("b", at(2_000)),
      entry("c", at(4_000)),
    ];

    const { resources, newestBatchStart } = orderByRecency(list);

    assert.deepEqual(
      resources.map((resource) => resource.name),
      ["a", "b", "c"],
    );
    for (const resource of resources) {
      assert.equal(
        isInNewestBatch(resource.uploadedAt, newestBatchStart),
        true,
      );
    }
  });

  it("moves a newer batch to the top and drops the label from the old one", () => {
    const list = [
      entry("old-1", at(0)),
      entry("old-2", at(1_000)),
      entry("new-1", at(RECENT_BATCH_GAP_MS + 60_000)),
      entry("new-2", at(RECENT_BATCH_GAP_MS + 61_000)),
    ];

    const { resources, newestBatchStart } = orderByRecency(list);

    assert.deepEqual(
      resources.map((resource) => resource.name),
      ["new-1", "new-2", "old-1", "old-2"],
    );
    assert.deepEqual(
      resources.map((resource) =>
        isInNewestBatch(resource.uploadedAt, newestBatchStart),
      ),
      [true, true, false, false],
    );
  });

  it("treats a slow sync as one batch even when it spans more than a gap", () => {
    // Chained: each fetch is 10 minutes after the last, 30 minutes in total.
    const step = RECENT_BATCH_GAP_MS - 5 * 60 * 1000;
    const list = [
      entry("first", at(0)),
      entry("second", at(step)),
      entry("third", at(step * 2)),
    ];

    const { resources, newestBatchStart } = orderByRecency(list);

    assert.deepEqual(
      resources.map((resource) => resource.name),
      // One batch, so the input order survives even though the times differ.
      ["first", "second", "third"],
    );
    for (const resource of resources) {
      assert.equal(
        isInNewestBatch(resource.uploadedAt, newestBatchStart),
        true,
      );
    }
  });

  it("sorts undated resources last and never marks them new", () => {
    const list = [
      entry("unsynced", null),
      entry("dated", at(0)),
      entry("bad-date", "not a date"),
    ];

    const { resources, newestBatchStart } = orderByRecency(list);

    assert.deepEqual(
      resources.map((resource) => resource.name),
      ["dated", "unsynced", "bad-date"],
    );
    assert.equal(isInNewestBatch("not a date", newestBatchStart), false);
    assert.equal(isInNewestBatch(null, newestBatchStart), false);
  });

  it("reports no batch when nothing has a date", () => {
    const { resources, newestBatchStart } = orderByRecency([
      entry("a", null),
      entry("b", null),
    ]);

    assert.equal(newestBatchStart, null);
    assert.deepEqual(
      resources.map((resource) => resource.name),
      ["a", "b"],
    );
  });
});
