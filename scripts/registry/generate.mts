import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  discoverItems,
  KINDS,
  MIRROR_ROOT,
  REGISTRY_ROOT,
  renderBarrel,
  renderManifest,
} from "./lib/registry.mts";

/**
 * Regenerate `registry.json` and the local mirror.
 *
 *   pnpm registry:generate
 *
 * `registry.json` is committed: it is what the site reads for titles, source
 * snippets, and install targets. The mirror under `src/components/illustrations`
 * is gitignored and exists so the docs render the exact files consumers get.
 */

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const items = await discoverItems(cwd);

await writeFile(join(cwd, "registry.json"), renderManifest(items), "utf8");

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
