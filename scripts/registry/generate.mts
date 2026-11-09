import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { extractHeadings } from "./lib/mdx.mts";
import {
  dateLedger,
  discoverItems,
  KINDS,
  REGISTRY_ROOT,
  type RegistryItem,
  renderBarrel,
  renderManifest,
  resolveDates,
} from "./lib/registry.mts";

/**
 * Regenerate `registry.json` and every kind's local mirror.
 *
 *   pnpm registry:generate
 *
 * `registry.json` is committed: it is what the site reads for titles, source
 * snippets, install targets, and the uploaded/updated dates. Each mirror under
 * `src/features/<kind>/generated` is gitignored and exists so the docs render
 * exactly the files consumers get, plus the catalog metadata and article table
 * of contents that only the site needs.
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

for (const kind of KINDS) {
  const kindItems = items.filter((item) => item.kind === kind.kind);
  const mirror = join(cwd, kind.mirrorDir);

  // The mirror is fully generated and gitignored: wiping it drops artifacts
  // from deleted items instead of leaving them importable forever.
  await rm(mirror, { recursive: true, force: true });
  await mkdir(mirror, { recursive: true });

  for (const item of kindItems) {
    await writeFile(join(mirror, `${item.name}.tsx`), item.content, "utf8");

    if (item.demoContent) {
      await writeFile(
        join(mirror, `${item.name}.demo.tsx`),
        item.demoContent,
        "utf8",
      );
    }
  }

  // Keep image metadata lightweight so social-image routes do not bundle the
  // complete registry source code just to render a title and description.
  await writeFile(
    join(mirror, "metadata.json"),
    json({
      items: kindItems.map(({ name, title, description, hidden }) => ({
        slug: name,
        title,
        description,
        hidden,
      })),
    }),
    "utf8",
  );

  // Catalog-only metadata: the docs site needs category, tags, and media, but
  // shadcn's manifest schema has no place for them.
  await writeFile(
    join(mirror, "catalog.json"),
    json({
      items: kindItems.map(({ name, meta }) => ({
        slug: name,
        category: meta.category ?? null,
        tags: meta.tags ?? [],
        media: meta.media ?? null,
        usage: meta.usage ?? null,
      })),
    }),
    "utf8",
  );

  await writeFile(
    join(mirror, kind.barrelFile),
    renderBarrel(items, kind),
    "utf8",
  );

  if (kind.contentDir) {
    const articles = await renderArticles(kindItems, kind, mirror);
    await writeFile(join(mirror, "docs.ts"), articles.docs, "utf8");
    await writeFile(join(mirror, "articles.json"), json(articles.toc), "utf8");
  }
}

console.log(
  `Registry: ${items.length} items in ${REGISTRY_ROOT}/, ${items.length} mirrored files.`,
);

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/** `folder-preview` -> `FolderPreviewDocs`, matching the generated import. */
function docsName(slug: string): string {
  return `${slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Docs`;
}

/**
 * The MDX import map, plus everything the docs page needs from the raw source.
 *
 * Imports are static so every bundler can see them; a dynamic template path
 * would not be statically analyzable under Turbopack. An article that does not
 * exist yet is skipped rather than emitted as a broken import — `registry:check`
 * is what reports it.
 *
 * `body` is kept verbatim so "Copy page" and `/md` export the authored
 * markdown; `hasInstall`/`hasSource` say whether the author placed the
 * placeholders, which is what decides if the page appends them.
 */
async function renderArticles(
  kindItems: RegistryItem[],
  kind: (typeof KINDS)[number],
  mirror: string,
): Promise<{
  docs: string;
  toc: Record<
    string,
    {
      headings: ReturnType<typeof extractHeadings>;
      body: string;
      hasInstall: boolean;
      hasSource: boolean;
    }
  >;
}> {
  const imports: string[] = [];
  const entries: string[] = [];
  const toc: Record<
    string,
    {
      headings: ReturnType<typeof extractHeadings>;
      body: string;
      hasInstall: boolean;
      hasSource: boolean;
    }
  > = {};

  for (const item of kindItems) {
    if (item.hidden) continue;

    const article = join(cwd, kind.contentDir ?? "", `${item.name}.mdx`);
    const source = await readFile(article, "utf8").catch(() => null);
    if (source === null) continue;

    const specifier = relative(mirror, article).split("\\").join("/");
    const name = docsName(item.name);

    imports.push(
      `import ${name} from "${specifier.startsWith(".") ? specifier : `./${specifier}`}";`,
    );
    entries.push(`  "${item.name}": ${name},`);
    toc[item.name] = {
      headings: extractHeadings(source),
      body: source.replace(/\r\n/g, "\n"),
      hasInstall: /<Install\s*\/>/.test(source),
      hasSource: /<Source\s*\/>/.test(source),
    };
  }

  const docs = `// Generated by scripts/registry/generate.mts. Do not edit.
${imports.join("\n")}

export const ${kind.kind}Docs = {
${entries.join("\n")}
} as const;
`;

  return { docs, toc };
}

/** Author date of the commit that added `path`, if git can tell us. */
function addedAt(root: string, path: string): string | undefined {
  try {
    const log = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--format=%aI", "--", path],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );

    // Newest first, so the last line is the commit that created the file.
    return log.trim().split("\n").filter(Boolean).at(-1);
  } catch {
    // No git (a tarball checkout, a sandbox): fall back to "now".
    return undefined;
  }
}
