import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

import { getSiteUrl } from "@/lib/site";
import { PageActions } from "@/shared/components/docs/page-actions";
import { getBaseMdxComponents } from "@/shared/components/mdx";
import { formatLongDate } from "@/shared/lib/format-date";
import {
  assistantLinks,
  assistantPrompt,
  installUrl,
  v0Url,
} from "@/shared/lib/registry/install";
import { highlight } from "@/shared/lib/shiki/highlight";
import { componentDocs } from "../generated/docs";
import { componentArticle, componentToc } from "../lib/articles";
import { componentExamples, defaultExample } from "../lib/examples";
import { type ComponentItem, componentName } from "../lib/items";
import { renderComponentMarkdown } from "../lib/markdown";
import {
  ArticleSection,
  HeroSection,
  MethodsSidebar,
  PageLayout,
  TableOfContents,
} from "./doc-page";
import { ExamplesBlock } from "./examples-block";
import { InstallBlock } from "./install-block";
import { SourceBlock } from "./source-block";
import { UsageBlock } from "./usage-block";

/**
 * The generated MDX map is typed as `{}` until the first component exists, so
 * index it through a record rather than relying on the inferred literal type.
 */
const docs = componentDocs as Record<
  string,
  ComponentType<{ components?: MDXComponents }> | undefined
>;

/**
 * One component's docs page.
 *
 * The layout is the supplied `doc-page` design: a heading table of contents on
 * the left, the article in the middle, and the resource details plus page
 * actions on the right. The article itself is MDX, so headings, prose, and
 * code all come from `content/components/<slug>.mdx`; only the hero and the
 * two install surfaces are rendered by the site.
 */
export async function ComponentDoc({
  component,
}: {
  component: ComponentItem;
}) {
  const site = getSiteUrl();
  const itemUrl = installUrl(site, component.slug);
  const name = componentName(component.slug);
  const article = componentArticle(component.slug);
  const examples = componentExamples(component.slug);
  const example = defaultExample(component.slug);
  const markdown = renderComponentMarkdown(
    component,
    itemUrl,
    article ?? {
      body: "",
      hasUsage: false,
      hasExamples: false,
      hasInstall: false,
      hasSource: false,
    },
    examples,
  );
  const assistants = assistantLinks(
    assistantPrompt(component.title, name, itemUrl, "component"),
  );

  const sourceFiles = await Promise.all(
    component.files.map(async (file) => ({
      path: file.path,
      content: file.content,
      html: await highlight(file.content, "tsx"),
    })),
  );

  const installProps = {
    itemUrl,
    dependencies: component.dependencies,
    files: sourceFiles,
  };

  const components = getBaseMdxComponents({
    // The article inherits the supplied page's rhythm: section titles, muted
    // prose, and lists that line up with the hero description.
    h2: (props) => <h2 {...props} className="text-xl font-medium mb-4 mt-12" />,
    h3: (props) => <h3 {...props} className="text-lg font-medium mb-3 mt-8" />,
    p: (props) => <p {...props} className="text-[#999] mb-6 leading-relaxed" />,
    ul: (props) => (
      <ul
        {...props}
        className="list-disc ms-6 mb-6 space-y-2 text-[#999] leading-relaxed"
      />
    ),
    ol: (props) => (
      <ol
        {...props}
        className="list-decimal ms-6 mb-6 space-y-2 text-[#999] leading-relaxed"
      />
    ),
    li: (props) => <li {...props} className="leading-relaxed [&>p]:my-0" />,

    // Placeholders the author writes wherever the section belongs in the
    // article. Whichever they leave out is appended after it.
    Usage: () => (example ? <UsageBlock source={example.source} /> : null),
    Examples: () => <ExamplesBlock slug={component.slug} />,
    Install: () => <InstallBlock {...installProps} />,
    Source: () => <SourceBlock files={sourceFiles} />,
  });

  const Doc = docs[component.slug];
  const hasUsage = article?.hasUsage ?? false;
  const hasExamples = article?.hasExamples ?? false;
  const hasInstall = article?.hasInstall ?? false;
  const hasSource = article?.hasSource ?? false;
  const toc = componentToc(component.slug).map((entry) => ({
    label: entry.label,
    href: `#${entry.id}`,
  }));

  return (
    <PageLayout
      leftSidebar={<TableOfContents items={toc} />}
      rightSidebar={
        <MethodsSidebar
          publishedAt={formatLongDate(component.uploadedAt)}
          category={component.category}
          tags={component.tags}
          previewHref={component.previewHref}
        />
      }
    >
      <HeroSection
        title={component.title}
        description={component.description}
        videoSrc={component.media?.video}
        posterSrc={component.media?.poster}
        actions={
          <PageActions
            markdown={markdown}
            markdownHref={`${component.href}/md`}
            v0={v0Url(itemUrl)}
            assistants={assistants}
          />
        }
      />

      {Doc ? <Doc components={components} /> : null}

      {/* An article that authored no usage placeholder still gets the default
          example, before Installation and Source. `<Examples />` counts as the
          usage section, since it shows the same snippet. */}
      {hasUsage || hasExamples || !example ? null : (
        <ArticleSection
          id="usage"
          title="Usage"
          description="The default example, straight from the registry."
        >
          <UsageBlock source={example.source} />
        </ArticleSection>
      )}

      {hasInstall ? null : (
        <ArticleSection
          id="installation"
          title="Installation"
          description="Works in any project with a components.json and the @/ alias."
        >
          <InstallBlock {...installProps} />
        </ArticleSection>
      )}

      {hasSource ? null : (
        <ArticleSection
          id="source"
          title="Source"
          description="The complete file this component installs."
        >
          <SourceBlock files={sourceFiles} />
        </ArticleSection>
      )}
    </PageLayout>
  );
}
