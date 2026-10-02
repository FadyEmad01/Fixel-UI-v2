import { cache } from "react";
import { getDoc, getDocs } from "./docs";
import { normalizeCatalogItem } from "./normalize";
import { getRegistryCatalog, getRegistryItem } from "./registry";

export const getCatalog = cache(async () => {
  const registry = await getRegistryCatalog();
  const docs = getDocs();

  return registry.items.map((registryItem) => {
    const doc = docs.find((item) => item.id === registryItem.name);

    return normalizeCatalogItem(registryItem, doc);
  });
});

export const getCatalogItem = cache(async (id: string) => {
  const registryItem = await getRegistryItem(id);
  const doc = getDoc(id);

  if (!registryItem) {
    return null;
  }

  return normalizeCatalogItem(registryItem, doc);
});
