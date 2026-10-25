import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site";
import { CodeBlock } from "@/shared/components/code-block/server";
import { type IllustrationSlug, illustrations } from "../generated";
import {
  addCommands,
  assistantLinks,
  assistantPrompt,
  dependencyCommands,
  installUrl,
  usageSnippet,
  v0Url,
} from "../lib/install";
import {
  componentName,
  type Illustration,
  type IllustrationFile,
} from "../lib/items";
import { illustrationMarkdown } from "../lib/markdown";
import { InstallTabs } from "./install-tabs";
import { PageActions } from "./page-actions";

async function FileBlocks({ files }: { files: IllustrationFile[] }) {
  return (
    <div className="flex flex-col gap-4">
      {files.map((file) => (
        <CodeBlock
          key={file.path}
          title={file.path}
          lang="tsx"
          code={file.content}
        />
      ))}
    </div>
  );
}

/**
 * One illustration's page: preview, install, usage, source.
 *
 * Everything installable is rendered from `registry.json`, the same document
 * `shadcn build` publishes, so the snippet a visitor copies here is byte-for-byte
 * what the CLI writes.
 */
export function IllustrationDoc({
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

  return (
    <div className="flex flex-col">
      <Link
        href="/illustration"
        className="inline-flex w-fit items-center gap-1.5 font-archivo text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Illustrations
      </Link>

      <header className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
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

      <hr className="my-6 border-primary/15" />

      <div
        role="img"
        aria-label={`${illustration.title} illustration preview`}
        className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-8"
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

      <section id="installation" className="mt-10 scroll-mt-28">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Installation
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Works in any project with a{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            components.json
          </code>{" "}
          and the{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            @/
          </code>{" "}
          alias.
        </p>

        <InstallTabs
          automatic={addCommands(itemUrl)}
          dependencies={
            illustration.dependencies.length > 0
              ? dependencyCommands(illustration.dependencies)
              : undefined
          }
          packages={illustration.dependencies}
        >
          <FileBlocks files={illustration.files} />
        </InstallTabs>
      </section>

      <section id="usage" className="mt-10 scroll-mt-28">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Usage
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Takes a{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            className
          </code>{" "}
          and sizes to its container, so it can sit in a card, a table cell, or
          an empty state.
        </p>

        <CodeBlock
          className="mt-4"
          title="usage.tsx"
          lang="tsx"
          code={usageSnippet(illustration.slug, name)}
        />
      </section>

      <section id="source" className="mt-10 scroll-mt-28">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Source
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            components/illustrations/kit.tsx
          </code>{" "}
          is shared by every illustration, so installing another one reuses the
          file instead of replacing it.
        </p>

        <div className="mt-4">
          <FileBlocks files={illustration.files} />
        </div>
      </section>
    </div>
  );
}
