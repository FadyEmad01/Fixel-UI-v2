import {
  loadRegistry,
  loadRegistryItem,
  RegistryItemNotFoundError,
} from "shadcn/registry";

export async function getRegistryCatalog() {
  return loadRegistry({
    cwd: process.cwd(),
    registryFile: "registry.json",
  });
}

export async function getRegistryItem(name: string) {
  try {
    return await loadRegistryItem(name, {
      cwd: process.cwd(),
    });
  } catch (error) {
    if (error instanceof RegistryItemNotFoundError) {
      return null;
    }

    throw error;
  }
}
