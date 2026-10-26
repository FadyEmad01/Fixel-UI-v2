import { ArrowLeft, FileCode2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { formatLongDate } from "@/shared/lib/format-date";

export type DocsAnchor = {
  id: string;
  label: string;
};

export type IllustrationMetadata = {
  uploadedAt: string | null;
  updatedAt: string | null;
  category: string;
  family: string;
  files: number;
  dependencies: string[];
};

export function DocsLayout({
  children,
  anchors,
  metadata,
}: {
  children: ReactNode;
  anchors: DocsAnchor[];
  metadata: IllustrationMetadata;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[168px_minmax(0,1fr)] xl:grid-cols-[168px_minmax(0,1fr)_220px]">
      <div className="lg:hidden">
        <TableOfContents anchors={anchors} horizontal />
      </div>

      <aside className="sticky top-28 hidden self-start lg:block">
        <Link
          href="/illustration"
          className="inline-flex items-center gap-1.5 font-archivo text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Illustrations
        </Link>
        <div className="mt-8">
          <TableOfContents anchors={anchors} />
        </div>
      </aside>

      <article className="min-w-0">{children}</article>

      <aside className="sticky top-28 hidden self-start xl:block">
        <IllustrationMetadataPanel metadata={metadata} />
        {/*
        <Link href="#preview" className="mt-6 inline-flex items-center">
          Live preview
        </Link>
        */}
      </aside>
    </div>
  );
}

export function TableOfContents({
  anchors,
  horizontal = false,
}: {
  anchors: DocsAnchor[];
  horizontal?: boolean;
}) {
  return (
    <nav aria-label="On this page" className="min-w-0">
      {!horizontal ? (
        <h2 className="mb-3 font-archivo text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          On this page
        </h2>
      ) : null}
      <ul
        className={
          horizontal
            ? "flex w-max min-w-full gap-1 overflow-x-auto rounded-lg bg-muted/60 p-1"
            : "flex flex-col gap-1 border-l border-border pl-3"
        }
      >
        {anchors.map((anchor, index) => (
          <li key={anchor.id} className="shrink-0">
            <a
              href={`#${anchor.id}`}
              aria-current={index === 0 ? "location" : undefined}
              className={[
                "block rounded-md font-archivo text-xs transition-colors",
                horizontal ? "px-3 py-1.5" : "py-1.5 pl-2",
                index === 0
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {anchor.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function IllustrationMetadataPanel({
  metadata,
  className = "",
}: {
  metadata: IllustrationMetadata;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-5 border-l border-border pl-4 text-xs ${className}`}
    >
      <dl className="grid grid-cols-1 gap-4">
        <MetadataRow
          label="Uploaded"
          value={formatLongDate(metadata.uploadedAt)}
        />
        <MetadataRow
          label="Updated"
          value={formatLongDate(metadata.updatedAt)}
        />
        <MetadataRow label="Category" value={metadata.category} />
        <MetadataRow label="Family" value={metadata.family} />
        <div>
          <dt className="font-archivo text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Files
          </dt>
          <dd className="mt-1 inline-flex items-center gap-1.5 text-foreground">
            <FileCode2
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            {metadata.files} {metadata.files === 1 ? "file" : "files"}
          </dd>
        </div>
      </dl>

      {metadata.dependencies.length > 0 ? (
        <div>
          <h2 className="font-archivo text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Dependencies
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {metadata.dependencies.map((dependency) => (
              <li
                key={dependency}
                className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[10px] text-foreground"
              >
                {dependency}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function ArticleSection({
  id,
  title,
  description,
  children,
  className = "",
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mt-10 scroll-mt-32 ${className}`}>
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <div className="mt-2 max-w-xl text-sm text-muted-foreground">
          {description}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-archivo text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 leading-5 text-foreground">{value}</dd>
    </div>
  );
}
