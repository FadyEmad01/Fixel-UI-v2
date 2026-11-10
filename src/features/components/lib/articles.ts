import articlesJson from "../generated/articles.json";
import { type ArticleToc, mergeDefaultSections, type TocEntry } from "./toc";

/**
 * The authored articles, mirrored at generation time.
 *
 * `body` is the MDX source, used by "Copy page" and `/md`; `headings` is the
 * extracted table of contents; the flags say whether the author placed the
 * `<Usage />`, `<Examples />`, `<Install />`, and `<Source />` placeholders.
 */

type ComponentArticle = ArticleToc & { body: string };

const articles = articlesJson as Record<string, ComponentArticle>;

export function componentArticle(slug: string): ComponentArticle | undefined {
  return articles[slug];
}

/** Authored headings, with the default sections appended when missing. */
export function componentToc(slug: string): TocEntry[] {
  const article = articles[slug];
  if (!article) return [];

  return mergeDefaultSections(article);
}
