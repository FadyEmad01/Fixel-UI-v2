import registryJson from "../../../../registry.json";
import catalogJson from "../generated/catalog.json";
import { componentHref, previewHref } from "./href";

/**
 * The component catalog, read from the committed registry manifest plus the
 * generated catalog metadata.
 *
 * `registry.json` is the same document `shadcn build` publishes, so titles,
 * install targets, and source snippets cannot drift from what consumers get.
 * Category, tags, and media only exist for the site, so `registry:generate`
 * mirrors them into `catalog.json`.
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

type CatalogEntry = {
  slug: string;
  category: string | null;
  tags: string[];
  media: ComponentMedia | null;
  usage: string | null;
};

const manifest = registryJson as unknown as { items: ManifestItem[] };
const catalog = (catalogJson as { items: CatalogEntry[] }).items;

export type ComponentMedia = {
  poster: string;
  video?: string;
};

export type ComponentFile = {
  /** Path inside the consumer's project, e.g. `components/fixel/thing.tsx`. */
  path: string;
  content: string;
};

export type ComponentItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  media: ComponentMedia | null;
  href: string;
  /** `/preview/<category>/<slug>` — the full-bleed live preview. */
  previewHref: string;
  /** Consumer snippet shown in the usage section. */
  usage: string;
  dependencies: string[];
  uploadedAt: string | null;
  updatedAt: string | null;
  files: ComponentFile[];
};

/** `folder-preview` → `FolderPreview`, matching the item's default export. */
export function componentName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/** Until an item writes its own snippet, assume a default export. */
function defaultUsage(slug: string): string {
  const name = componentName(slug);
  return `import ${name} from "@/components/fixel/${slug}";

<${name} />`;
}

function toComponent(item: ManifestItem, entry: CatalogEntry): ComponentItem {
  const category = entry.category ?? "Uncategorized";

  return {
    slug: item.name,
    title: item.title,
    description: item.description,
    category,
    tags: entry.tags,
    media: entry.media,
    href: componentHref(item.name),
    previewHref: previewHref(category, item.name),
    usage: entry.usage ?? defaultUsage(item.name),
    dependencies: item.dependencies ?? [],
    uploadedAt: item.uploadedAt ?? null,
    updatedAt: item.updatedAt ?? null,
    files: item.files.map((file) => ({
      path: file.target,
      content: file.content,
    })),
  };
}

/** Every visible component, alphabetically. */
export function allComponents(): ComponentItem[] {
  const entries = new Map(catalog.map((entry) => [entry.slug, entry]));

  return manifest.items
    .filter((item) => !item.hidden && entries.has(item.name))
    .map((item) => toComponent(item, entries.get(item.name) as CatalogEntry))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getComponent(slug: string): ComponentItem | undefined {
  return allComponents().find((component) => component.slug === slug);
}

/**
 * The live preview route, keyed by the category segment in its URL.
 *
 * A slug under the wrong category is not the same page, so it must 404 rather
 * than silently render.
 */
export function componentForPreview(
  category: string,
  slug: string,
): ComponentItem | undefined {
  const target = previewHref(category, slug);
  return allComponents().find((component) => component.previewHref === target);
}
