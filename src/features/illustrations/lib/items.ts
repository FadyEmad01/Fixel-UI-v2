import registryJson from "../../../../registry.json";

/**
 * The illustration catalog, read from the committed registry manifest.
 *
 * `registry.json` is generated from `registry/fixel/illustrations/**`, so this
 * module never inspects the filesystem: titles, descriptions, install targets,
 * and source snippets all come from the same document `shadcn build` reads.
 */

type ManifestFile = {
  path: string;
  target: string;
  content: string;
};

type ManifestItem = {
  name: string;
  title: string;
  description: string;
  hidden?: boolean;
  dependencies?: string[];
  /** ISO dates stamped by `registry:generate` from the payload hash. */
  uploadedAt?: string;
  updatedAt?: string;
  files: ManifestFile[];
};

const manifest = registryJson as unknown as { items: ManifestItem[] };

export type IllustrationFile = {
  /** Path inside the consumer's project, e.g. `components/illustrations/kit.tsx`. */
  path: string;
  content: string;
};

export type Illustration = {
  slug: string;
  title: string;
  description: string;
  href: string;
  /** Registry collection, derived from the source path: `fixel / illustrations`. */
  family: string;
  /** npm packages the item imports, e.g. `lucide-react`. */
  dependencies: string[];
  /** When the item first landed. `null` until the manifest is regenerated. */
  uploadedAt: string | null;
  updatedAt: string | null;
  files: IllustrationFile[];
};

/** `kbd` → `KbdIllustration`, matching the export in the item file. */
export function componentName(slug: string): string {
  return `${slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Illustration`;
}

/**
 * `registry/fixel/illustrations/button.tsx` → `fixel / illustrations`.
 *
 * Read from the item's own file (the last entry — shared files are prepended),
 * so a second kind folder names itself without a second constant to keep in
 * sync with `scripts/registry/lib/registry.mts`.
 */
function familyOf(item: ManifestItem): string {
  const path = item.files.at(-1)?.path;
  if (!path) return "fixel";

  const collection = path.split("/").slice(1, -1);
  return collection.length > 0 ? collection.join(" / ") : "fixel";
}

function toIllustration(item: ManifestItem): Illustration {
  return {
    slug: item.name,
    title: item.title,
    description: item.description,
    href: `/illustration/${item.name}`,
    family: familyOf(item),
    dependencies: item.dependencies ?? [],
    uploadedAt: item.uploadedAt ?? null,
    updatedAt: item.updatedAt ?? null,
    files: item.files.map((file) => ({
      path: file.target,
      content: file.content,
    })),
  };
}

/** Every visible illustration, alphabetically. */
export function allIllustrations(): Illustration[] {
  return manifest.items
    .filter((item) => !item.hidden)
    .map(toIllustration)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getIllustration(slug: string): Illustration | undefined {
  const item = manifest.items.find(
    (candidate) => candidate.name === slug && !candidate.hidden,
  );
  return item ? toIllustration(item) : undefined;
}
