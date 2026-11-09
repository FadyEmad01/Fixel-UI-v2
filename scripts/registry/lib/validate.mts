import { access } from "node:fs/promises";
import { join, sep } from "node:path";

import { KINDS, type Kind, type RegistryItem } from "./registry.mts";

/**
 * The checks `registry:generate` cannot make for you.
 *
 * A component can be a perfectly valid shadcn item and still be unusable on the
 * site: no demo to render live, no article for the docs page, no poster for the
 * card. Each of those is silent until someone visits the page, so they fail
 * `registry:check` instead.
 */

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** Public URL (`/components/x/poster.webp`) -> repo path (`public/components/...`). */
function publicPath(url: string): string {
  return join("public", url.replace(/^\/+/, "")).split(sep).join("/");
}

export async function validateCatalog(
  items: RegistryItem[],
  cwd: string,
  kinds: Kind[] = KINDS,
): Promise<string[]> {
  const issues: string[] = [];

  for (const kind of kinds) {
    const contentDir = kind.contentDir;

    // Kinds without articles (illustrations today) are inline-rendered: they
    // need no demo, no poster, and no catalog metadata.
    if (!contentDir) continue;

    const kindItems = items.filter(
      (item) => item.kind === kind.kind && !item.hidden,
    );

    for (const item of kindItems) {
      const { name, meta } = item;

      if (!item.demoContent) {
        issues.push(`${name}: missing ${name}.demo.tsx`);
      }

      const article = `${contentDir}/${name}.mdx`;
      if (!(await exists(join(cwd, article)))) {
        issues.push(`${name}: missing ${article}`);
      }

      if (!meta.category?.trim()) {
        issues.push(`${name}: missing a category in ${name}.meta.ts`);
      }

      if (!meta.tags || meta.tags.length === 0) {
        issues.push(`${name}: missing at least one tag in ${name}.meta.ts`);
      }

      const poster = meta.media?.poster;
      const video = meta.media?.video;

      if (!poster) {
        issues.push(`${name}: missing media.poster in ${name}.meta.ts`);
      } else {
        if (!poster.startsWith(`/components/${name}/`)) {
          issues.push(
            `${name}: media.poster must live under /components/${name}/, found ${poster}`,
          );
        }

        const file = publicPath(poster);
        if (!(await exists(join(cwd, file)))) {
          issues.push(`${name}: missing ${file}`);
        }
      }

      if (video) {
        if (!video.startsWith(`/components/${name}/`)) {
          issues.push(
            `${name}: media.video must live under /components/${name}/, found ${video}`,
          );
        }

        const file = publicPath(video);
        if (!(await exists(join(cwd, file)))) {
          issues.push(`${name}: missing ${file}`);
        }
      }
    }
  }

  return issues;
}
