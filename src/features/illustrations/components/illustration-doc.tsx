import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site";
import { CodeBlock } from "@/shared/components/code-block/code-block";
import { highlight } from "@/shared/lib/shiki/highlight";
import { type IllustrationSlug, illustrations } from "../generated";
import { ILLUSTRATION_CATEGORIES } from "../lib/categories";
import {
  addCommands,
  assistantLinks,
  assistantPrompt,
  dependencyCommands,
  installUrl,
  usageSnippet,
  v0Url,
} from "../lib/install";
import { componentName, type Illustration } from "../lib/items";
import { illustrationMarkdown } from "../lib/markdown";
import {
  ArticleSection,
  DocsLayout,
  IllustrationMetadataPanel,
} from "./docs-layout";
import { InstallTabs } from "./install-tabs";
import { PageActions } from "./page-actions";
import { SourceExplorer, type SourceExplorerFile } from "./source-explorer";

/**
 * One illustration's page: static preview, install, usage, and source.
 *
 * Everything installable comes from the same manifest that `shadcn build`
 * publishes. Source files are highlighted on the server once, then shared by
 * the manual installer and the source section.
 */
export async function IllustrationDoc({
  illustration,
}: {
  illustration: Illustration;
}) {
  const site = getSiteUrl();
  const itemUrl = installUrl(site, illustration.slug);
  const name = componentName(illustration.slug);
  const markdown = illustrationMarkdown(illustration, itemUrl);
  const assistants = assistantLinks(
    assistantPrompt(illustration.title, name, itemUrl),
  );
  const Preview = illustrations[illustration.slug as IllustrationSlug];
  const sourceFiles: SourceExplorerFile[] = await Promise.all(
    illustration.files.map(async (file) => ({
      ...file,
      html: await highlight(file.content, "tsx"),
    })),
  );
  const metadata = {
    uploadedAt: illustration.uploadedAt,
    updatedAt: illustration.updatedAt,
    category: ILLUSTRATION_CATEGORIES[illustration.slug] ?? "Uncategorized",
    family: illustration.family,
    files: illustration.files.length,
    dependencies: illustration.dependencies,
  };

  return (
    <DocsLayout
      anchors={[
        { id: "preview", label: "Preview" },
        { id: "installation", label: "Installation" },
        { id: "usage", label: "Usage" },
        { id: "source", label: "Source" },
      ]}
      metadata={metadata}
    >
      <Link
        href="/illustration"
        className="mb-4 inline-flex items-center gap-1.5 font-archivo text-xs text-muted-foreground transition-colors hover:text-foreground lg:hidden"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Illustrations
      </Link>

      <header className="flex flex-col items-start justify-between gap-4 border-b border-primary/15 pb-6 md:flex-row md:items-end">
        <div className="min-w-0">
          <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight chroma-text chroma-text-animate-once sm:text-5xl">
            {illustration.title}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {illustration.description}
          </p>
        </div>

        <PageActions
          markdown={markdown}
          markdownHref={`${illustration.href}/md`}
          v0={v0Url(itemUrl)}
          assistants={assistants}
        />
      </header>

      <div className="my-5 rounded-xl border border-border bg-muted/20 p-4 xl:hidden">
        <IllustrationMetadataPanel
          metadata={metadata}
          className="grid grid-cols-2 gap-4 border-0 p-0 sm:grid-cols-3"
        />
      </div>

      <section
        id="preview"
        aria-label="Illustration preview"
        className="mt-6 scroll-mt-32"
      >
        <h2 className="mb-3 font-heading text-sm font-medium text-muted-foreground">
          Preview
        </h2>
        <div className="rounded-2xl bg-neutral-200/70 p-2 dark:bg-muted">
          <div
            role="img"
            aria-label={`${illustration.title} illustration`}
            className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-lg bg-background p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
            />
            <div className="relative flex h-full w-full items-center justify-center">
              {Preview ? (
                <Preview />
              ) : (
                <span className="font-heading text-4xl font-semibold text-muted-foreground/50">
                  {illustration.title.trim().charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <ArticleSection
        id="installation"
        title="Installation"
        description={
          <>
            Works in any project with a{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              components.json
            </code>{" "}
            and the{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              @/
            </code>{" "}
            alias.
          </>
        }
      >
        <InstallTabs
          automatic={addCommands(itemUrl)}
          dependencies={
            illustration.dependencies.length > 0
              ? dependencyCommands(illustration.dependencies)
              : undefined
          }
          packages={illustration.dependencies}
        >
          <SourceExplorer files={sourceFiles} />
        </InstallTabs>
      </ArticleSection>

      <ArticleSection
        id="usage"
        title="Usage"
        description={
          <>
            Takes a{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              className
            </code>{" "}
            and sizes to its container, so it can sit in a card, a table cell,
            or an empty state.
          </>
        }
      >
        <CodeBlock
          className="mt-4"
          title="usage.tsx"
          lang="tsx"
          code={usageSnippet(illustration.slug, name)}
        />
      </ArticleSection>

      <ArticleSection
        id="source"
        title="Source"
        description={
          <>
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              components/illustrations/kit.tsx
            </code>{" "}
            is shared by every illustration, so installing another one reuses
            the file instead of replacing it.
          </>
        }
      >
        <SourceExplorer files={sourceFiles} />
      </ArticleSection>
    </DocsLayout>
  );
}
