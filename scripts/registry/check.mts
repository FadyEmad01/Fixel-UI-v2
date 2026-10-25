import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { discoverItems, renderManifest } from "./lib/registry.mts";

/**
 * Fail when the committed `registry.json` no longer matches `registry/`.
 *
 *   pnpm registry:check
 *
 * Runs in CI; locally it is the answer to "did I forget to regenerate?".
 */

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = join(cwd, "registry.json");

const expected = renderManifest(await discoverItems(cwd));
const actual = await readFile(manifestPath, "utf8").catch(() => "");

if (actual !== expected) {
  console.error(
    "registry.json is stale. Run `pnpm registry:generate` and commit the result.",
  );
  process.exit(1);
}

console.log("registry.json is up to date.");
