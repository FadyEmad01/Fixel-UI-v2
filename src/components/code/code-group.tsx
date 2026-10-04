"use client";

import { File, Menu, X } from "lucide-react";
import { Children, type ReactNode, useState } from "react";
import { FileTree, type FileTreeNode } from "../ui/file-tree";

export interface CodeGroupTab {
  label: string;
  filename?: string;
  folder?: string;
  path?: string;
}

interface CodeGroupProps {
  tabs: CodeGroupTab[];
  children: ReactNode;
  className?: string;
}

function createFileTree(tabs: CodeGroupTab[]) {
  const root: FileTreeNode = { name: "", path: "", children: [] };

  tabs.forEach((tab, tabIndex) => {
    const path =
      tab.path ??
      (tab.folder
        ? `${tab.folder}/${tab.filename ?? tab.label}`
        : (tab.filename ?? tab.label));
    const parts = path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, partIndex) => {
      const nodePath = parts.slice(0, partIndex + 1).join("/");
      let node = current.children.find((child) => child.name === part);

      if (!node) {
        node = { name: part, path: nodePath, children: [] };
        current.children.push(node);
      }

      if (partIndex === parts.length - 1) {
        node.tabIndex = tabIndex;
      }

      current = node;
    });
  });

  return root.children;
}

export function CodeGroup({ tabs, children, className }: CodeGroupProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const panels = Children.toArray(children);
  const tree = createFileTree(tabs);
  const activeTab = tabs[activeIndex];

  return (
    <div
      className={`flex h-[500px] min-h-0 w-full flex-col overflow-hidden rounded-xl bg-background md:flex-row ${
        className || ""
      }`}
    >
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="flex h-12 items-center justify-between border-b border-border bg-muted px-4 md:hidden">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <File aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="truncate">
            {activeTab?.filename || activeTab?.label || "File"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-1.5 rounded-md bg-foreground/5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          {isMobileOpen ? (
            <X className="size-3.5" />
          ) : (
            <Menu className="size-3.5" />
          )}
          {isMobileOpen ? "Close" : "Files"}
        </button>
      </div>

      {/* Sidebar (File Tree) */}
      <aside
        className={`${
          isMobileOpen ? "flex" : "hidden"
        } min-h-0 w-full shrink-0 flex-col border-b border-border bg-muted max-h-[40vh] md:max-h-none md:flex md:w-[200px] md:border-b-0 md:border-r`}
      >
        <div className="hidden h-10 items-center border-b border-border px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:flex">
          Explorer
        </div>
        <div
          className="min-h-0 flex-1 overflow-y-auto p-2"
          role="tablist"
          aria-label="Code files"
        >
          <FileTree
            nodes={tree}
            activeIndex={activeIndex}
            onSelect={(idx) => {
              setActiveIndex(idx);
              setIsMobileOpen(false); // Auto-close explorer on mobile after selection
            }}
          />
        </div>
      </aside>

      {/* Main Content (Code Viewer) */}
      <main
        className="flex min-h-0 min-w-0 flex-1 flex-col bg-background"
        role="tabpanel"
        aria-labelledby={`code-tab-${activeIndex}`}
        id={`code-panel-${activeIndex}`}
      >
        {/* Top bar indicating active file name (Desktop Only) */}
        {/* <div className="hidden h-10 items-center border-b border-border bg-muted px-4 text-sm text-foreground md:flex">
          <File
            aria-hidden="true"
            className="mr-2 size-4 text-muted-foreground"
          />
          {activeTab?.filename || activeTab?.label || "File"}
        </div> */}

        {/* Render the actual code panel contents */}
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto [&>*]:m-0 [&>*]:h-full [&>*]:max-h-none [&>*]:rounded-none [&>*]:border-0">
          {panels[activeIndex]}
        </div>
      </main>
    </div>
  );
}
