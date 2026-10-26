import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  contentHash,
  dateLedger,
  discoverItems,
  buildManifest,
  renderManifest,
} from "./lib/registry.mts";

/**
 * Fail when the committed `registry.json` no longer matches `registry/`.
 *
 *   pnpm registry:check
 *
 * Runs in CI; locally it is the answer to "did I forget to regenerate?".
 *
 * The committed dates are reused verbatim rather than recomputed, so this stays
 * clock-free: a stale hash is reported as a stale manifest, not as a date that
 * disagrees by a few seconds.
 */

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = join(cwd, "registry.json");

const items = await discoverItems(cwd);
const actual = await readFile(manifestPath, "utf8").catch(() => "");
const dates = dateLedger(parse(actual));

const expected = renderManifest(items, dates);

if (actual !== expected) {
  console.error(
    "registry.json is stale. Run `pnpm registry:generate` and commit the result.",
  );
  process.exit(1);
}

// A manifest can round-trip through `renderManifest` and still carry an old
// hash if only the date fields were hand-edited, so re-hash the payloads too.
const stale = buildManifest(items)
  .items.filter(
    (item) => dates[item.name]?.contentHash !== contentHash(item.files),
  )
  .map((item) => item.name);

if (stale.length > 0) {
  console.error(
    `registry.json has stale dates for: ${stale.join(", ")}. Run \`pnpm registry:generate\` and commit the result.`,
  );
  process.exit(1);
}

console.log("registry.json is up to date.");

function parse(value: string): unknown {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
