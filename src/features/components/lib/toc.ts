/**
 * The detail page's table of contents.
 *
 * Headings come from the generated `articles.json`, which is written by
 * `registry:generate` with the same slugger `rehype-slug` uses, so every link
 * points at an id that exists. Usage, Installation, and Source are appended
 * here rather than authored in every article: a component that writes none of
 * them still gets all three, in the default order.
 */

export type TocEntry = {
  id: string;
  label: string;
  depth: number;
};

export type ArticleToc = {
  headings: TocEntry[];
  hasUsage: boolean;
  hasExamples: boolean;
  hasInstall: boolean;
  hasSource: boolean;
};

const DEFAULT_SECTIONS = [
  { id: "usage", label: "Usage", depth: 2 },
  { id: "installation", label: "Installation", depth: 2 },
  { id: "source", label: "Source", depth: 2 },
] as const;

/** The authored headings plus whichever default sections are missing. */
export function mergeDefaultSections(article: ArticleToc): TocEntry[] {
  const entries = [...article.headings];

  // `<Examples />` renders the usage snippets too, so an article that shows
  // every example does not also need the single default one.
  const authored: Record<string, boolean> = {
    usage: article.hasUsage || article.hasExamples,
    installation: article.hasInstall,
    source: article.hasSource,
  };

  for (const section of DEFAULT_SECTIONS) {
    const present = entries.some((entry) => entry.id === section.id);

    if (!authored[section.id] && !present) entries.push({ ...section });
  }

  return entries;
}
