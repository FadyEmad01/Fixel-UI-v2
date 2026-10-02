"use client";

import { ChevronRight, FileCodeCorner, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

export interface FileTreeNode {
  name: string;
  path: string;
  tabIndex?: number;
  children: FileTreeNode[];
}

interface FileTreeProps {
  nodes: FileTreeNode[];
  activeIndex: number;
  onSelect: (index: number) => void;
  depth?: number;
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
  const paddingLeft = 8 + depth * 20;

  if (isFolder) {
    return (
      <div>
        <button
          type="button"
          aria-expanded={isOpen}
          className="relative z-0 flex w-full items-center gap-2 py-1.5 pe-2 text-left text-xs font-medium text-muted-foreground transition-colors before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-muted hover:text-foreground"
          style={{ paddingLeft }}
          onClick={() => setIsOpen((open) => !open)}
        >
          <ChevronRight
            aria-hidden="true"
            className={`size-3.5 shrink-0 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          {isOpen ? (
            <FolderOpen
              aria-hidden="true"
              className="pointer-events-none size-4 shrink-0 text-muted-foreground"
            />
          ) : (
            <Folder
              aria-hidden="true"
              className="pointer-events-none size-4 shrink-0 text-muted-foreground"
            />
          )}
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
      className={`relative z-0 flex w-full items-center gap-2 py-1.5 pe-2 text-left text-xs transition-colors before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10 before:bg-muted hover:text-foreground ${
        isActive
          ? "font-medium text-foreground before:bg-background"
          : "text-muted-foreground"
      }`}
      style={{ paddingLeft: 28 + depth * 20 }}
      onClick={() => onSelect(node.tabIndex as number)}
    >
      <FileCodeCorner
        aria-hidden="true"
        className="pointer-events-none size-4 shrink-0 text-muted-foreground"
      />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileTree({
  nodes,
  activeIndex,
  onSelect,
  depth = 0,
}: FileTreeProps) {
  return (
    <div className="relative space-y-0.5 before:absolute before:inset-y-0 before:left-0 before:w-full before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(20px-1px),var(--border)_calc(20px-1px),var(--border)_20px)]">
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
