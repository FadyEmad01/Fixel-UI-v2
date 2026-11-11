import GithubSlugger from "github-slugger";

/**
 * Article headings for the docs table of contents.
 *
 * The site renders each MDX article with `rehype-slug`, which derives ids with
 * `github-slugger`. Reading the source with the same library means the TOC
 * links point at ids that actually exist, without a second pass over the
 * rendered DOM.
 */

export type TocHeading = {
  id: string;
  label: string;
  depth: number;
};

export type Frontmatter = {
  data: Record<string, string | boolean>;
  /** The article without its frontmatter block. */
  body: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/**
 * Flat `key: value` frontmatter, the only shape the docs use.
 *
 * `shortcut: no nested or folded values, swap in a YAML parser when an article
 * needs them` — an author writing `>` or `|` gets an error instead of silently
 * getting a literal string.
 */
export function parseFrontmatter(source: string): Frontmatter {
  const normalized = source.replace(/\r\n/g, "\n");
  const match = FRONTMATTER.exec(normalized);

  if (!match) return { data: {}, body: normalized };

  const data: Record<string, string | boolean> = {};

  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }

    const key = line.slice(0, separator).trim();
    const raw = line.slice(separator + 1).trim();

    if (raw === "true" || raw === "false") {
      data[key] = raw === "true";
    } else if (!raw || raw.startsWith(">") || raw.startsWith("|")) {
      throw new Error(`Frontmatter "${key}" must be a single-line value`);
    } else {
      data[key] = raw.replace(/^(["'])(.*)\1$/, "$2");
    }
  }

  return { data, body: normalized.slice(match[0].length) };
}

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^(#{2,3})\s+(.+)$/;

/** Drop inline markdown so the label reads like the rendered heading. */
export function plainHeadingText(raw: string): string {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

/**
 * Every `##` and `###` heading, in document order.
 *
 * `#` is the page title, supplied by the item metadata, and fenced code is
 * skipped so an example snippet can never become a TOC entry.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let fenced = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (FENCE.test(line)) {
      fenced = !fenced;
      continue;
    }

    if (fenced) continue;

    const match = HEADING.exec(line);
    if (!match) continue;

    const label = plainHeadingText(match[2]);
    if (!label) continue;

    headings.push({
      id: slugger.slug(label),
      label,
      depth: match[1].length,
    });
  }

  return headings;
}
