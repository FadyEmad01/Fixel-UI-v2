import type { DetailSection } from "./detail";
import type { PreviewConfig } from "./preview";

export const CATALOG_KINDS = [
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
] as const;

export type CatalogKind = (typeof CATALOG_KINDS)[number];

export const REGISTRY_TYPES = [
  "registry:ui",
  "registry:component",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:page",
  "registry:file",
  "registry:item",
] as const;

export type RegistryType = (typeof REGISTRY_TYPES)[number];

export const RESOURCE_STATUS = ["draft", "published", "deprecated"] as const;

export type ResourceStatus = (typeof RESOURCE_STATUS)[number];

export interface CatalogItem {
  id: string;

  title: string;

  description: string;

  kind: CatalogKind;

  registryType: RegistryType;

  tags: string[];

  preview: PreviewConfig;

  sections: DetailSection[];

  dependencies: string[];

  registryDependencies: string[];

  status: ResourceStatus;
}
