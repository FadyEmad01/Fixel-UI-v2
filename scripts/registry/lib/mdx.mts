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
