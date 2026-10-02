// "use client";

// import { ChevronRight, File, Folder } from "lucide-react";
// import { Children, type ReactNode, useState } from "react";

// export interface CodeGroupTab {
//   label: string;
//   filename?: string;
//   folder?: string;
//   path?: string;
// }

// interface CodeGroupProps {
//   tabs: CodeGroupTab[];
//   children: ReactNode;
//   className?: string;
// }

// interface FileTreeNode {
//   name: string;
//   path: string;
//   tabIndex?: number;
//   children: FileTreeNode[];
// }

// function createFileTree(tabs: CodeGroupTab[]) {
//   const root: FileTreeNode = { name: "", path: "", children: [] };

//   tabs.forEach((tab, tabIndex) => {
//     const path =
//       tab.path ??
//       (tab.folder
//         ? `${tab.folder}/${tab.filename ?? tab.label}`
//         : (tab.filename ?? tab.label));
//     const parts = path.split("/").filter(Boolean);
//     let current = root;

//     parts.forEach((part, partIndex) => {
//       const nodePath = parts.slice(0, partIndex + 1).join("/");
//       let node = current.children.find((child) => child.name === part);

//       if (!node) {
//         node = { name: part, path: nodePath, children: [] };
//         current.children.push(node);
//       }

//       if (partIndex === parts.length - 1) {
//         node.tabIndex = tabIndex;
//       }

//       current = node;
//     });
//   });

//   return root.children;
// }

// function FileTree({
//   nodes,
//   activeIndex,
//   onSelect,
//   depth = 0,
// }: {
//   nodes: FileTreeNode[];
//   activeIndex: number;
//   onSelect: (index: number) => void;
//   depth?: number;
// }) {
//   return (
//     <div className="space-y-0.5">
//       {nodes.map((node) => (
//         <TreeNode
//           key={node.path}
//           node={node}
//           activeIndex={activeIndex}
//           onSelect={onSelect}
//           depth={depth}
//         />
//       ))}
//     </div>
//   );
// }

// function TreeNode({
//   node,
//   activeIndex,
//   onSelect,
//   depth,
// }: {
//   node: FileTreeNode;
//   activeIndex: number;
//   onSelect: (index: number) => void;
//   depth: number;
// }) {
//   const [isOpen, setIsOpen] = useState(true);
//   const isFolder = node.children.length > 0;

//   if (isFolder) {
//     return (
//       <div>
//         <button
//           type="button"
//           aria-expanded={isOpen}
//           className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
//           style={{ paddingLeft: `${8 + depth * 12}px` }}
//           onClick={() => setIsOpen((open) => !open)}
//         >
//           <ChevronRight
//             aria-hidden="true"
//             className={`size-3.5 shrink-0 transition-transform${isOpen ? " rotate-90" : ""}`}
//           />
//           <Folder aria-hidden="true" className="size-4 shrink-0" />
//           <span className="truncate">{node.name}</span>
//         </button>
//         {isOpen ? (
//           <FileTree
//             nodes={node.children}
//             activeIndex={activeIndex}
//             onSelect={onSelect}
//             depth={depth + 1}
//           />
//         ) : null}
//       </div>
//     );
//   }

//   if (node.tabIndex === undefined) {
//     return null;
//   }

//   const tabId = `code-tab-${node.tabIndex}`;

//   return (
//     <button
//       type="button"
//       id={tabId}
//       role="tab"
//       aria-selected={activeIndex === node.tabIndex}
//       aria-controls={`code-panel-${node.tabIndex}`}
//       className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-foreground/5 hover:text-foreground${activeIndex === node.tabIndex ? " bg-foreground/10 font-medium text-foreground" : " text-muted-foreground"}`}
//       style={{ paddingLeft: `${28 + depth * 12}px` }}
//       onClick={() => onSelect(node.tabIndex as number)}
//     >
//       <File aria-hidden="true" className="size-3.5 shrink-0" />
//       <span className="truncate">{node.name}</span>
//     </button>
//   );
// }

// export function CodeGroup({ tabs, children, className }: CodeGroupProps) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const panels = Children.toArray(children);
//   const tree = createFileTree(tabs);

//   return (
//     <div
//       className={`grid min-h-[500px] overflow-hidden rounded-2xl border border-border bg-muted grid-cols-[18rem_minmax(0,1fr)]${className ? ` ${className}` : ""}`}
//     >
//       <aside className="min-w-0 border-b border-border bg-muted/60 md:border-r md:border-b-0">
//         <div
//           className="max-h-48 overflow-y-auto p-2 max-h-[calc(500px-3rem)]"
//           role="tablist"
//           aria-label="Code files"
//         >
//           <FileTree
//             nodes={tree}
//             activeIndex={activeIndex}
//             onSelect={setActiveIndex}
//           />
//         </div>
//       </aside>
//       <div
//         className="min-w-0 [&>*]:h-full [&>*]:max-h-none [&>*]:rounded-none [&>*]:border-0"
//         role="tabpanel"
//         aria-labelledby={`code-tab-${activeIndex}`}
//         id={`code-panel-${activeIndex}`}
//       >
//         {panels[activeIndex]}
//       </div>
//     </div>
//   );
// }

"use client";

import { ChevronRight, File, Folder, Menu, X } from "lucide-react";
import { Children, type ReactNode, useState } from "react";

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

interface FileTreeNode {
  name: string;
  path: string;
  tabIndex?: number;
  children: FileTreeNode[];
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

function FileTree({
  nodes,
  activeIndex,
  onSelect,
  depth = 0,
}: {
  nodes: FileTreeNode[];
  activeIndex: number;
  onSelect: (index: number) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          activeIndex={activeIndex}
          onSelect={onSelect}
          depth={depth}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  activeIndex,
  onSelect,
  depth,
}: {
  node: FileTreeNode;
  activeIndex: number;
  onSelect: (index: number) => void;
  depth: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.children.length > 0;

  if (isFolder) {
    return (
      <div>
        <button
          type="button"
          aria-expanded={isOpen}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
          onClick={() => setIsOpen((open) => !open)}
        >
          <ChevronRight
            aria-hidden="true"
            className={`size-3.5 shrink-0 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          <Folder aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen ? (
          <FileTree
            nodes={node.children}
            activeIndex={activeIndex}
            onSelect={onSelect}
            depth={depth + 1}
          />
        ) : null}
      </div>
    );
  }

  if (node.tabIndex === undefined) {
    return null;
  }

  const tabId = `code-tab-${node.tabIndex}`;
  const isActive = activeIndex === node.tabIndex;

  return (
    <button
      type="button"
      id={tabId}
      role="tab"
      aria-selected={isActive}
      aria-controls={`code-panel-${node.tabIndex}`}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-foreground/5 hover:text-foreground ${
        isActive
          ? "bg-foreground/10 font-medium text-foreground"
          : "text-muted-foreground"
      }`}
      style={{ paddingLeft: `${28 + depth * 12}px` }}
      onClick={() => onSelect(node.tabIndex as number)}
    >
      <File aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function CodeGroup({ tabs, children, className }: CodeGroupProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const panels = Children.toArray(children);
  const tree = createFileTree(tabs);
  const activeTab = tabs[activeIndex];

  return (
    <div
      className={`flex h-[500px] w-full flex-col overflow-hidden rounded-xl bg-background md:flex-row ${
        className || ""
      }`}
    >
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="flex h-12 items-center justify-between border-b border-border bg-muted/40 px-4 md:hidden">
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
        } w-full shrink-0 flex-col border-b border-border bg-muted max-h-[40vh] md:max-h-none md:flex md:w-[240px] md:border-b-0 md:border-r`}
      >
        <div className="hidden h-10 items-center border-b border-border px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:flex">
          Explorer
        </div>
        <div
          className="flex-1 overflow-y-auto p-2"
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
        className="flex min-w-0 flex-1 flex-col bg-background"
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
        <div className="flex-1 overflow-auto [&>*]:m-0 [&>*]:h-full [&>*]:max-h-none [&>*]:rounded-none [&>*]:border-0">
          {panels[activeIndex]}
        </div>
      </main>
    </div>
  );
}
