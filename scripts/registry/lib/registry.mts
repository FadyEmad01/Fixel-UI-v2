import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * The installable registry: source folders under `registry/`, the manifest
 * shadcn reads (`registry.json`), and the local mirror this site renders.
 *
 * Everything here is derived from the files. Adding an illustration means
 * adding `registry/fixel/illustrations/<slug>.tsx` and re-running
 * `pnpm registry:generate`; no other file needs editing.
 *
 * Items are single files rather than folders so the source tree has the same
 * shape as the installed one: an item's `./kit` import resolves here and in the
 * consumer's `components/illustrations/` folder alike, which lets `tsc` check
 * the registry sources directly.
 */

/** Origin used in install commands, badges, and the manifest `homepage`. */
export const SITE_URL = "https://fixel-ui-v2.vercel.app";

export const REGISTRY_NAME = "fixel";

/** Repo-relative directory the manifest and generated JSON live in. */
export const REGISTRY_ROOT = "registry";

/** Where the site mirrors the catalog so it imports exactly what consumers get. */
export const MIRROR_ROOT = "src/features/illustrations/generated";

/** An installable item is one file; its filename is the slug. */
export const ITEM_EXTENSION = ".tsx";

/** Optional registry-only metadata, read from `<slug>.meta.ts` beside the item. */
export const META_EXTENSION = ".meta.ts";

export type Kind = {
  /** Folder name under `registry/<registry>/`. */
  dir: string;
  /** Catalog kind, independent of the shadcn registry type. */
  kind: string;
  /** shadcn type for the item and its files. */
  type: "registry:component";
  /** Install directory, expressed as a target alias prefix. */
  targetPrefix: string;
  /** Optional: sections want a different card for each kind. */
  section: string;
};

// One entry today. Adding `blocks` means adding a folder and a line here, not
// restructuring the generator.
export const KINDS: Kind[] = [
  {
    dir: "illustrations",
    kind: "illustration",
    type: "registry:component",
    targetPrefix: "@components/illustrations",
    section: "illustration",
  },
];

export type ItemMeta = {
  title?: string;
  description?: string;
  hidden?: boolean;
  /** Installed alongside other items instead of being imported by name. */
  shared?: boolean;
  /** Packages the install command must add, beyond what imports reveal. */
  dependencies?: string[];
  registryDependencies?: string[];
};

/**
 * Packages an item may import, and the name to install for each.
 *
 * Read from the source rather than `package.json`: the install command has to
 * name exactly what the file needs, and `motion/react` ships as `motion`.
 */
const PACKAGES: Array<{ specifier: string; name: string }> = [
  { specifier: "lucide-react", name: "lucide-react" },
  { specifier: "motion/react", name: "motion" },
];

function detectDependencies(content: string): string[] {
  return PACKAGES.filter((pkg) => content.includes(`"${pkg.specifier}"`)).map(
    (pkg) => pkg.name,
  );
}

export type RegistryItem = {
  name: string;
  kind: string;
  section: string;
  type: Kind["type"];
  title: string;
  description: string;
  hidden: boolean;
  shared: boolean;
  /** Repo-relative path, as `shadcn build` expects it. */
  path: string;
  /** Consumer path, honouring their `components` alias and `src/` layout. */
  target: string;
  content: string;
  dependencies: string[];
  registryDependencies: string[];
};

const ACRONYMS = new Set(["otp", "ui"]);

/** `input-otp` → `Input OTP`, `kbd` → `Kbd`. */
export function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) =>
      ACRONYMS.has(word)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export function defaultDescription(title: string): string {
  return `${title} drawn as a coded wireframe illustration.`;
}

async function readMeta(file: string): Promise<ItemMeta> {
  try {
    const module = (await import(pathToFileURL(file).href)) as {
      default: ItemMeta;
    };
    return module.default ?? {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ERR_MODULE_NOT_FOUND") {
      return {};
    }
    throw error;
  }
}

/**
 * Every item in the registry, sorted so `kit` (the shared foundation) leads and
 * the rest read alphabetically.
 */
export async function discoverItems(
  cwd: string,
  kinds: Kind[] = KINDS,
): Promise<RegistryItem[]> {
  const items: RegistryItem[] = [];

  for (const kind of kinds) {
    const kindDir = resolve(cwd, REGISTRY_ROOT, REGISTRY_NAME, kind.dir);

    const entries = await readdir(kindDir, { withFileTypes: true }).catch(
      () => [],
    );

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(ITEM_EXTENSION)) continue;

      const name = entry.name.slice(0, -ITEM_EXTENSION.length);
      const file = join(kindDir, entry.name);
      const content = await readFile(file, "utf8");

      const meta = await readMeta(join(kindDir, `${name}${META_EXTENSION}`));
      const title = meta.title ?? toTitle(name);

      items.push({
        name,
        kind: kind.kind,
        section: kind.section,
        type: kind.type,
        title,
        description: meta.description ?? defaultDescription(title),
        hidden: meta.hidden ?? false,
        shared: meta.shared ?? false,
        path: relative(cwd, file).split(sep).join("/"),
        target: `${kind.targetPrefix}/${name}.tsx`,
        content,
        dependencies: [
          ...new Set([
            ...detectDependencies(content),
            ...(meta.dependencies ?? []),
          ]),
        ].sort(),
        registryDependencies: meta.registryDependencies ?? [],
      });
    }
  }

  return items.sort((a, b) => {
    if (a.shared !== b.shared) return a.shared ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export type ManifestFile = {
  path: string;
  type: Kind["type"];
  target: string;
  content: string;
};

export type ManifestItem = {
  name: string;
  type: Kind["type"];
  title: string;
  description: string;
  hidden?: boolean;
  dependencies?: string[];
  registryDependencies?: string[];
  contentHash?: string;
  uploadedAt?: string;
  updatedAt?: string;
  files: ManifestFile[];
};

/**
 * When an item first appeared, and when its payload last changed.
 *
 * There is no database, so the dates live in the committed manifest and are
 * driven by `contentHash` — a hash of the exact files an install writes. That
 * makes `pnpm registry:generate` the only writer, and makes re-running it a
 * no-op until something actually changes.
 */
export type ItemDates = {
  contentHash: string;
  uploadedAt: string;
  updatedAt: string;
};

export type DateLedger = Record<string, ItemDates>;

function toFile(item: RegistryItem): ManifestFile {
  return {
    path: item.path,
    type: item.type,
    target: item.target,
    content: item.content,
  };
}

/**
 * Hash the payload, not the filesystem: two items with the same name and the
 * same installed bytes keep their dates even if the repo moved around them.
 */
export function contentHash(files: ManifestFile[]): string {
  const hash = createHash("sha256");

  for (const file of files) {
    hash.update(file.target).update("\0");
    hash.update(file.content).update("\0");
  }

  return `sha256:${hash.digest("hex")}`;
}

/**
 * The manifest `shadcn build` reads.
 *
 * Shared items (the kit) are attached to any item whose source imports them, as
 * an extra file. `registryDependencies` cannot do this job: a bare name is
 * looked up in the default shadcn registry, so `["kit"]` fails wherever the item
 * is hosted. Shipping the file makes the automatic install identical to the
 * manual one.
 *
 * `dates` is passed in rather than computed here so `check` can rebuild the
 * manifest from the committed dates and compare text-for-text without a clock.
 */
export function buildManifest(items: RegistryItem[], dates: DateLedger = {}) {
  const shared = items.filter((item) => item.shared);

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: SITE_URL,
    items: items.map((item): ManifestItem => {
      const sharedFiles = shared.filter(
        (candidate) =>
          candidate.name !== item.name &&
          // Only embed a shared file the item actually imports, so a standalone
          // illustration does not drag the whole kit into its install.
          item.content.includes(`"./${candidate.name}"`),
      );

      // A shared file's imports are the item's imports: `kit.tsx` pulls in
      // `lucide-react`, so every item that ships it must declare it too.
      const dependencies = [
        ...new Set([
          ...sharedFiles.flatMap((file) => file.dependencies),
          ...item.dependencies,
        ]),
      ].sort();

      const entry = dates[item.name];

      return {
        name: item.name,
        type: item.type,
        title: item.title,
        description: item.description,
        ...(item.hidden ? { hidden: true } : {}),
        ...(dependencies.length > 0 ? { dependencies } : {}),
        ...(item.registryDependencies.length > 0
          ? { registryDependencies: item.registryDependencies }
          : {}),
        ...(entry
          ? {
              contentHash: entry.contentHash,
              uploadedAt: entry.uploadedAt,
              updatedAt: entry.updatedAt,
            }
          : {}),
        files: [...sharedFiles.map(toFile), toFile(item)],
      };
    }),
  };
}

/**
 * Carry the committed dates forward, and only move them when the payload moves.
 *
 * - unseen item → `uploadedAt` from the seed (git), else now
 * - same hash   → untouched, so regenerating never churns the manifest
 * - new hash    → `uploadedAt` kept, `updatedAt` bumped
 */
export function resolveDates(
  items: RegistryItem[],
  previous: DateLedger = {},
  options: { now?: Date; seed?: Record<string, string> } = {},
): DateLedger {
  const now = (options.now ?? new Date()).toISOString();
  const seed = options.seed ?? {};
  const dates: DateLedger = {};

  for (const item of buildManifest(items).items) {
    const hash = contentHash(item.files);
    const before = previous[item.name];

    if (!before) {
      const created = seed[item.name] ?? now;
      dates[item.name] = { contentHash: hash, uploadedAt: created, updatedAt: created };
    } else if (before.contentHash === hash) {
      dates[item.name] = { ...before, contentHash: hash };
    } else {
      dates[item.name] = {
        contentHash: hash,
        uploadedAt: before.uploadedAt,
        updatedAt: now,
      };
    }
  }

  return dates;
}

/** Read the dates back out of a manifest, ignoring entries that lack them. */
export function dateLedger(manifest: unknown): DateLedger {
  const items = (manifest as { items?: unknown })?.items;
  const ledger: DateLedger = {};

  if (!Array.isArray(items)) return ledger;

  for (const item of items as Array<Partial<ManifestItem>>) {
    if (
      typeof item.name !== "string" ||
      typeof item.contentHash !== "string" ||
      typeof item.uploadedAt !== "string" ||
      typeof item.updatedAt !== "string"
    ) {
      continue;
    }

    ledger[item.name] = {
      contentHash: item.contentHash,
      uploadedAt: item.uploadedAt,
      updatedAt: item.updatedAt,
    };
  }

  return ledger;
}

/** The exact `registry.json` text, so generate and check can never disagree. */
export function renderManifest(
  items: RegistryItem[],
  dates: DateLedger = {},
): string {
  return `${JSON.stringify(buildManifest(items, dates), null, 2)}\n`;
}

/**
 * `<slug> → component` for the docs site, built from the mirrored files.
 *
 * Imported by the catalog so a card renders the same code a consumer installs.
 */
export function renderBarrel(items: RegistryItem[], kind: string): string {
  const visible = items.filter((item) => item.kind === kind && !item.hidden);

  const imports = visible
    .map(
      (item) => `import { ${componentName(item.name)} } from "./${item.name}";`,
    )
    .join("\n");

  const entries = visible
    .map((item) => `  "${item.name}": ${componentName(item.name)},`)
    .join("\n");

  return `// Generated by scripts/registry/generate.mts. Do not edit.
${imports}

export const illustrations = {
${entries}
} as const;

export type IllustrationSlug = keyof typeof illustrations;
`;
}

/** `kbd` → `KbdIllustration`, matching the export in every item file. */
export function componentName(slug: string): string {
  return `${slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Illustration`;
}
