/**
 * The detail page's table of contents.
 *
 * Headings come from the generated `articles.json`, which is written by
 * `registry:generate` with the same slugger `rehype-slug` uses, so every link
 * points at an id that exists. `Install` and `Source` are appended here rather
 * than authored in every article: a component that writes neither still gets
 * both sections, in the default order.
 */

export type TocEntry = {
  id: string;
  label: string;
  depth: number;
};

export type ArticleToc = {
  headings: TocEntry[];
  hasInstall: boolean;
  hasSource: boolean;
};

const DEFAULT_SECTIONS = [
  { id: "installation", label: "Installation", depth: 2 },
  { id: "source", label: "Source", depth: 2 },
] as const;

/** The authored headings plus whichever default sections are missing. */
export function mergeDefaultSections(article: ArticleToc): TocEntry[] {
  const entries = [...article.headings];

  for (const section of DEFAULT_SECTIONS) {
    const authored =
      section.id === "installation" ? article.hasInstall : article.hasSource;
    const present = entries.some((entry) => entry.id === section.id);

    if (!authored && !present) entries.push({ ...section });
  }

  return entries;
}
