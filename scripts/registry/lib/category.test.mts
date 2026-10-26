import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ILLUSTRATION_CATEGORIES,
  illustrationCategories,
} from "../../../src/features/illustrations/lib/categories.ts";
import { discoverItems } from "./registry.mts";

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

test("every visible illustration sits in exactly one family", async () => {
  const items = await discoverItems(cwd);
  const visible = items
    .filter((item) => !item.hidden)
    .map((item) => item.name)
    .sort();

  const mapped = Object.keys(ILLUSTRATION_CATEGORIES).sort();

  const missing = visible.filter((slug) => !mapped.includes(slug));
  const unknown = mapped.filter((slug) => !visible.includes(slug));

  assert.deepEqual(missing, [], "these illustrations have no chip");
  assert.deepEqual(unknown, [], "these chips point at nothing");
});

test("families are a real partition, not a free-text field", () => {
  const values = Object.values(ILLUSTRATION_CATEGORIES);

  assert.equal(illustrationCategories().length, 6);

  for (const family of illustrationCategories()) {
    const size = values.filter((value) => value === family).length;
    assert.ok(size >= 1, `${family} holds ${size} illustration(s)`);
  }
});
