import { z } from "zod";
import type { CatalogItem } from "../../types/catalog";
import { catalogItemSchema } from "../../types/schemas";

type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  meta?: Record<string, unknown>;
};
type Doc = {
  id: string;
  title: string;
  description: string;
  kind: CatalogItem["kind"];
  tags: string[];
  status: CatalogItem["status"];
};

const registryMetaSchema = z.object({
  kind: z.enum([
    "component",
    "block",
    "illustration",
    "animation",
    "easing",
    "effect",
    "hook",
    "utility",
    "pattern",
    "template",
    "page",
  ]),
  tags: z.array(z.string()).default([]),
  preview: z.object({
    renderer: z.enum([
      "react",
      "image",
      "video",
      "svg",
      "easing",
      "code",
      "none",
    ]),
    source: z.string().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    poster: z.string().optional(),
    file: z.string().optional(),
    language: z.string().optional(),
  }),
  sections: z.array(z.object({ type: z.string() })).default([]),
  status: z.enum(["draft", "published", "deprecated"]).default("draft"),
});

export function normalizeCatalogItem(
  registryItem: RegistryItem,
  doc: Doc | undefined,
): CatalogItem {
  const meta = registryMetaSchema.parse(registryItem.meta ?? {});
  const preview = meta.preview;

  return catalogItemSchema.parse({
    id: registryItem.name,
    title: doc?.title ?? registryItem.title ?? registryItem.name,
    description: doc?.description ?? registryItem.description ?? "",
    kind: doc?.kind ?? meta.kind,
    registryType: registryItem.type,
    tags: doc?.tags ?? meta.tags,
    preview,
    sections: meta.sections,
    dependencies: registryItem.dependencies ?? [],
    registryDependencies: registryItem.registryDependencies ?? [],
    status: doc?.status ?? meta.status,
  });
}
