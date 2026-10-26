import assert from "node:assert/strict";
import { test } from "node:test";

import { createSourceTree } from "./source-tree.ts";

test("install paths fold into nested folders", () => {
  const tree = createSourceTree([
    "components/illustrations/kit.tsx",
    "components/illustrations/button.tsx",
  ]);

  assert.equal(tree.length, 1);
  const folder = tree[0];
  assert.equal(folder?.name, "components");
  assert.deepEqual(
    folder?.children.map((child) => child.name),
    ["illustrations"],
  );

  const files = folder?.children[0]?.children ?? [];
  assert.deepEqual(
    files.map((file) => [file.name, file.index]),
    [
      ["kit.tsx", 0],
      ["button.tsx", 1],
    ],
  );
});

test("a shared prefix is reused instead of duplicated", () => {
  const tree = createSourceTree([
    "components/illustrations/kit.tsx",
    "components/illustrations/button.tsx",
    "lib/utils.ts",
  ]);

  assert.deepEqual(
    tree.map((node) => node.name),
    ["components", "lib"],
  );
  assert.equal(tree[0]?.children.length, 1, "components must appear once");

  const paths = tree.flatMap(function walk(node): string[] {
    return [node.path, ...node.children.flatMap(walk)];
  });
  assert.equal(new Set(paths).size, paths.length, "every path is unique");
});
