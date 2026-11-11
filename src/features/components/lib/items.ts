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
  author: ComponentAuthor | null;
  /** Which example under `examples/` the docs and live preview use. */
  defaultExample: string | null;
};

const manifest = registryJson as unknown as { items: ManifestItem[] };
const catalog = (catalogJson as { items: CatalogEntry[] }).items;

export type ComponentMedia = {
  poster: string;
  video?: string;
};

/** Attribution shown under the docs hero. */
export type ComponentAuthor = {
  name: string;
  url?: string;
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
  author: ComponentAuthor | null;
  href: string;
  /** `/preview/<category>/<slug>` — the full-bleed live preview. */
  previewHref: string;
  /** Example the live preview renders. */
  defaultExample: string;
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

function toComponent(item: ManifestItem, entry: CatalogEntry): ComponentItem {
  const category = entry.category ?? "Uncategorized";

  return {
    slug: item.name,
    title: item.title,
    description: item.description,
    category,
    tags: entry.tags,
    media: entry.media,
    author: entry.author,
    href: componentHref(item.name),
    previewHref: previewHref(category, item.name),
    defaultExample: entry.defaultExample ?? "",
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
