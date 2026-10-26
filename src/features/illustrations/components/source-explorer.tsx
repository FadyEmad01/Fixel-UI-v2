"use client";

import {
  Check,
  Copy,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { IllustrationFile } from "../lib/items";
import { createSourceTree } from "../lib/source-tree";
import { FileTree } from "./file-tree";

export type SourceExplorerFile = IllustrationFile & {
  html: string | null;
};

export function SourceExplorer({ files }: { files: SourceExplorerFile[] }) {
  const paths = useMemo(() => files.map((file) => file.path), [files]);
  const nodes = useMemo(() => createSourceTree(paths), [paths]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [treeOpen, setTreeOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(
    () => new Set(collectFolders(nodes)),
  );
  const [copied, setCopied] = useState(false);
  const activeFile = files[selectedIndex] ?? files[0];

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (!activeFile) return null;

  async function copySource() {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function toggleFolder(path: string) {
    setExpandedFolders((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function selectFile(index: number) {
    setSelectedIndex(index);
    setTreeOpen(false);
    setCopied(false);
  }

  return (
    <div className="mt-4 flex h-[500px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-background md:flex-row">
      <div className="relative shrink-0 border-b border-border bg-muted/40 md:w-[200px] md:border-r md:border-b-0">
        <div className="flex h-11 items-center justify-between gap-2 px-3 md:hidden">
          <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{activeFile.path}</span>
          </div>
          <button
            type="button"
            onClick={() => setTreeOpen((open) => !open)}
            aria-expanded={treeOpen}
            aria-label={treeOpen ? "Close file list" : "Open file list"}
            className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 font-archivo text-[11px] text-muted-foreground hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {treeOpen ? (
              <PanelLeftClose className="size-3.5" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="size-3.5" aria-hidden="true" />
            )}
            {treeOpen ? "Close" : "Files"}
          </button>
        </div>

        <div
          className={[
            treeOpen
              ? "absolute inset-x-0 top-11 z-10 block max-h-[280px] border-t border-border bg-background shadow-lg md:static md:max-h-none md:border-0 md:shadow-none"
              : "hidden md:block",
            "h-[calc(500px-2.75rem)] md:h-full",
          ].join(" ")}
        >
          <FileTree
            nodes={nodes}
            selectedIndex={selectedIndex}
            expandedFolders={expandedFolders}
            onSelect={selectFile}
            onToggleFolder={toggleFolder}
          />
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="hidden h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3 md:flex">
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            {activeFile.path}
          </p>
          <button
            type="button"
            onClick={copySource}
            aria-label={copied ? "Source copied" : "Copy source file"}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {copied ? (
              <Check className="size-3.5 text-green-600" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        <section
          aria-label={`Source code: ${activeFile.path}`}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users need a focus target to scroll the source pane.
          tabIndex={0}
          className="shiki min-h-0 flex-1 overflow-auto p-4 text-[13px] leading-6 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset focus-visible:outline-none [&_pre]:m-0 [&_pre]:w-max [&_pre]:min-w-full [&_pre]:bg-transparent! [&_pre]:p-0 [&_code]:font-mono"
        >
          {activeFile.html ? (
            // Shiki escapes source text; only this server-generated markup enters the HTML sink.
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki escapes the source before producing this HTML.
            <div dangerouslySetInnerHTML={{ __html: activeFile.html }} />
          ) : (
            <pre className="m-0 w-max min-w-full whitespace-pre font-mono">
              <code>{activeFile.content}</code>
            </pre>
          )}
        </section>

        <div className="flex h-10 shrink-0 items-center justify-between border-t border-border px-3 md:hidden">
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {activeFile.path}
          </span>
          <button
            type="button"
            onClick={copySource}
            aria-label={copied ? "Source copied" : "Copy source file"}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {copied ? (
              <Check className="size-3.5 text-green-600" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function collectFolders(nodes: ReturnType<typeof createSourceTree>): string[] {
  return nodes.flatMap((node) =>
    node.children.length > 0
      ? [node.path, ...collectFolders(node.children)]
      : [],
  );
}
