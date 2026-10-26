import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  dateLedger,
  discoverItems,
  KINDS,
  MIRROR_ROOT,
  REGISTRY_ROOT,
  renderBarrel,
  renderManifest,
  resolveDates,
} from "./lib/registry.mts";

/**
 * Regenerate `registry.json` and the local mirror.
 *
 *   pnpm registry:generate
 *
 * `registry.json` is committed: it is what the site reads for titles, source
 * snippets, install targets, and the uploaded/updated dates. The mirror under
 * `src/features/illustrations/generated` is gitignored and exists so the docs
 * render the exact files consumers get.
 *
 * Dates are content-hash driven, so running this again with no edits is a no-op.
 */

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = join(cwd, "registry.json");

const items = await discoverItems(cwd);

// The committed manifest is the only memory of the dates: read it before
// overwriting so unchanged items keep their timestamps.
const previous = await readFile(manifestPath, "utf8").catch(() => "");
const dates = dateLedger(previous ? JSON.parse(previous) : null);

// A brand new item has no date yet. Ask git when its file first landed, so the
// first generation reports history instead of "the moment I ran the script".
const seed: Record<string, string> = {};

for (const item of items) {
  if (dates[item.name]) continue;

  const added = addedAt(cwd, item.path);
  if (added) seed[item.name] = added;
}

await writeFile(
  manifestPath,
  renderManifest(items, resolveDates(items, dates, { seed })),
  "utf8",
);

for (const item of items) {
  const file = join(cwd, MIRROR_ROOT, `${item.name}.tsx`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, item.content, "utf8");
}

for (const kind of KINDS) {
  await writeFile(
    join(cwd, MIRROR_ROOT, "index.ts"),
    renderBarrel(items, kind.kind),
    "utf8",
  );
}

console.log(
  `Registry: ${items.length} items in ${REGISTRY_ROOT}/, ${items.length} mirrored files.`,
);

/** Author date of the commit that added `path`, if git can tell us. */
function addedAt(root: string, path: string): string | undefined {
  try {
    const log = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--format=%aI", "--", path],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );

    // Newest first, so the last line is the commit that created the file.
    return log
      .trim()
      .split("\n")
      .filter(Boolean)
      .at(-1);
  } catch {
    // No git (a tarball checkout, a sandbox): fall back to "now".
    return undefined;
  }
}
