import { access, readdir, readFile } from "node:fs/promises";
import { join, sep } from "node:path";

import { parseFrontmatter } from "./mdx.mts";
import {
  KINDS,
  type Kind,
  REGISTRY_NAME,
  REGISTRY_ROOT,
  type RegistryItem,
} from "./registry.mts";

/**
 * The checks `registry:generate` cannot make for you.
 *
 * A component can be a perfectly valid shadcn item and still be unusable on the
 * site: no example to render live, no article for the docs page, no poster for
 * the card. Each of those is silent until someone visits the page, so they fail
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

    // A folder kind's shape is part of the contract: one directory per item,
    // with its payload inside. A stray flat file, or a folder missing its
    // payload, is invisible to discovery, so it would otherwise go unreported.
    if (kind.layout === "folder") {
      const kindDir = join(cwd, REGISTRY_ROOT, REGISTRY_NAME, kind.dir);
      const entries = await readdir(kindDir, { withFileTypes: true }).catch(
        () => [],
      );

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          issues.push(
            `${entry.name}: a ${kind.kind} lives in ${kind.dir}/<slug>/<slug>.tsx`,
          );
          continue;
        }

        if (!(await exists(join(kindDir, entry.name, `${entry.name}.tsx`)))) {
          issues.push(
            `${entry.name}: missing ${kind.dir}/${entry.name}/${entry.name}.tsx`,
          );
        }
      }
    }

    // Kinds without articles (illustrations today) are inline-rendered: they
    // need no examples, no poster, and no catalog metadata.
    if (!contentDir) continue;

    const kindItems = items.filter(
      (item) => item.kind === kind.kind && !item.hidden,
    );

    for (const item of kindItems) {
      const { name, meta } = item;

      if (item.examples.length === 0) {
        issues.push(`${name}: missing examples/ (at least one .tsx)`);
      } else if (
        meta.example &&
        !item.examples.some((example) => example.name === meta.example)
      ) {
        issues.push(
          `${name}: example "${meta.example}" does not exist under ${name}/examples/`,
        );
      }

      const article = `${contentDir}/${name}.mdx`;
      const source = await readFile(join(cwd, article), "utf8").catch(
        () => null,
      );

      if (source === null) {
        issues.push(`${name}: missing ${article}`);
      } else {
        const { data } = parseFrontmatter(source);

        if (!data.title) {
          issues.push(`${name}: missing title in ${article} frontmatter`);
        }

        if (!data.description) {
          issues.push(`${name}: missing description in ${article} frontmatter`);
        }
      }

      if (!meta.category?.trim()) {
        issues.push(`${name}: missing a category in ${name}/meta.ts`);
      }

      if (!meta.tags || meta.tags.length === 0) {
        issues.push(`${name}: missing at least one tag in ${name}/meta.ts`);
      }

      if (meta.author) {
        if (!meta.author.name?.trim()) {
          issues.push(`${name}: empty author.name in ${name}/meta.ts`);
        }

        if (meta.author.url && !/^https?:\/\//.test(meta.author.url)) {
          issues.push(
            `${name}: author.url must be an http(s) URL in ${name}/meta.ts`,
          );
        }
      }

      const poster = meta.media?.poster;
      const video = meta.media?.video;

      if (!poster) {
        issues.push(`${name}: missing media.poster in ${name}/meta.ts`);
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
