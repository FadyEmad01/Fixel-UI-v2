import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const registryRoot = path.join(root, "registry");
const publicRoot = path.join(root, "public", "r");

const domains = await readdir(registryRoot, { withFileTypes: true });

for (const domain of domains) {
  if (!domain.isDirectory()) {
    continue;
  }

  const domainRoot = path.join(registryRoot, domain.name);
  const items = await readdir(domainRoot, { withFileTypes: true });

  for (const item of items) {
    if (!item.isDirectory()) {
      continue;
    }

    const source = path.join(domainRoot, item.name, "preview");
    const destination = path.join(publicRoot, item.name, "preview");

    try {
      await mkdir(destination, { recursive: true });
      const previewFiles = await readdir(source, {
        withFileTypes: true,
      });

      for (const previewFile of previewFiles) {
        if (
          !previewFile.isFile() ||
          !/\.(avif|gif|jpeg|jpg|mp4|png|svg|webm|webp)$/i.test(
            previewFile.name,
          )
        ) {
          continue;
        }

        await cp(
          path.join(source, previewFile.name),
          path.join(destination, previewFile.name),
        );
      }
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }
}
