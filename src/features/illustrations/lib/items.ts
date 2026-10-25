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
  /** npm packages the item imports, e.g. `lucide-react`. */
  dependencies: string[];
  files: IllustrationFile[];
};

/** `kbd` → `KbdIllustration`, matching the export in the item file. */
export function componentName(slug: string): string {
  return `${slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Illustration`;
}

/** `@components/illustrations/kit.tsx` → `components/illustrations/kit.tsx`. */
function consumerPath(target: string): string {
  return target.replace(/^@/, "");
}

function toIllustration(item: ManifestItem): Illustration {
  return {
    slug: item.name,
    title: item.title,
    description: item.description,
    href: `/illustration/${item.name}`,
    dependencies: item.dependencies ?? [],
    files: item.files.map((file) => ({
      path: consumerPath(file.target),
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
