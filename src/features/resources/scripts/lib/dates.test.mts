import assert from "node:assert/strict";
import { test } from "node:test";

import { type ResourceMetadata, resolveResourceDates } from "./dates.mts";

const metadata: ResourceMetadata = {
  name: "Fixel",
  title: "Fixel UI",
  description: "A component library.",
  image: "https://example.com/og.png",
  icon: "https://example.com/favicon.ico",
  siteName: "Fixel",
  themeColor: "#fff",
  finalUrl: "https://example.com/",
};

test("a new resource receives matching uploaded and updated dates", () => {
  const now = "2026-10-26T09:00:00.000Z";

  assert.deepEqual(resolveResourceDates(metadata, undefined, now), {
    uploadedAt: now,
    updatedAt: now,
  });
});

test("a routine metadata fetch preserves dates when details are unchanged", () => {
  const previous = {
    ...metadata,
    fetchedAt: "2026-10-25T09:00:00.000Z",
    uploadedAt: "2026-10-24T09:00:00.000Z",
    updatedAt: "2026-10-25T09:00:00.000Z",
  };

  assert.deepEqual(
    resolveResourceDates(metadata, previous, "2026-10-26T09:00:00.000Z"),
    {
      uploadedAt: previous.uploadedAt,
      updatedAt: previous.updatedAt,
    },
  );
});

test("changed metadata preserves uploadedAt and advances updatedAt", () => {
  const previous = {
    ...metadata,
    fetchedAt: "2026-10-25T09:00:00.000Z",
    uploadedAt: "2026-10-24T09:00:00.000Z",
    updatedAt: "2026-10-25T09:00:00.000Z",
  };

  assert.deepEqual(
    resolveResourceDates(
      { ...metadata, description: "Updated description." },
      previous,
      "2026-10-26T09:00:00.000Z",
    ),
    {
      uploadedAt: previous.uploadedAt,
      updatedAt: "2026-10-26T09:00:00.000Z",
    },
  );
});

test("legacy snapshots fall back to their first known fetch", () => {
  assert.deepEqual(
    resolveResourceDates(
      metadata,
      { fetchedAt: "2026-10-23T09:00:00.000Z" },
      "now",
    ),
    {
      uploadedAt: "2026-10-23T09:00:00.000Z",
      updatedAt: "2026-10-23T09:00:00.000Z",
    },
  );
});
