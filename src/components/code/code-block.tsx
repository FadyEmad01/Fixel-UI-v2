import { FileCode2, FolderClosed } from "lucide-react";
import type { ReactNode } from "react";

import { highlightCode } from "../../lib/code/highlight";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  meta?: string;
  lineNumbers?: boolean;
  lineNumberStart?: number;
  showCopyButton?: boolean;
  showHeader?: boolean;
  icon?: "file" | "folder";
  actions?: ReactNode;
  className?: string;
}

function getFileIcon(
  filename: string | undefined,
  icon: CodeBlockProps["icon"],
) {
  if (icon === "folder" || (filename?.endsWith("/") ?? false)) {
    return FolderClosed;
  }

  return FileCode2;
}

export async function CodeBlock({
  code,
  language = "tsx",
  filename,
  meta,
  lineNumbers = true,
  lineNumberStart = 1,
  showCopyButton = true,
  showHeader = true,
  icon,
  actions,
  className,
}: CodeBlockProps) {
  const html = await highlightCode(code, language, {
    meta,
    lineNumbers,
    lineNumberStart,
  });
  const FileIcon = getFileIcon(filename, icon);
  const hasHeader = showHeader && (filename || actions || showCopyButton);

  return (
    <div
      className={`relative flex min-h-0 h-[500px] max-h-[500px] flex-col overflow-hidden rounded-2xl bg-muted ${className ? ` ${className}` : ""}`}
    >
      {hasHeader ? (
        <div className="flex  flex-none items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-2 py-3 text-muted-foreground">
            {filename ? (
              <FileIcon aria-hidden="true" className="size-4 shrink-0" />
            ) : null}
            {filename ? (
              <span className="truncate font-mono text-xs" title={filename}>
                {filename}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {actions}
            {showCopyButton ? <CopyButton code={code} /> : null}
          </div>
        </div>
      ) : null}

      {!hasHeader ? (
        <>
          <div className="mt-3" />
          {showCopyButton ? (
            <div className="absolute z-10 right-0 top-0 bg-muted rounded-lg p-1">
              <CopyButton className="hover:bg-transparent" code={code} />
            </div>
          ) : null}
        </>
      ) : null}

      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden mx-3 mb-3 rounded-lg bg-white dark:bg-black/20">
        <ScrollArea className="h-full min-h-0 min-w-0 w-full">
          <div
            className="shiki-styles text-[13px] leading-6 [&_.shiki]:!m-0 [&_.shiki]:!bg-transparent [&_code_.line]:px-4 [&_.shiki]:min-w-full [&_.shiki]:w-max [&_.shiki]:py-4 [&_.shiki_.line]:inline-block [&_.shiki_.line]:w-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates the trusted syntax-highlighted markup.
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
