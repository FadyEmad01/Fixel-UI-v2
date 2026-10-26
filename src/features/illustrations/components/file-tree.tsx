import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
} from "lucide-react";

import type { SourceTreeNode } from "../lib/source-tree";

export function FileTree({
  nodes,
  selectedIndex,
  expandedFolders,
  onSelect,
  onToggleFolder,
}: {
  nodes: SourceTreeNode[];
  selectedIndex: number;
  expandedFolders: Set<string>;
  onSelect: (index: number) => void;
  onToggleFolder: (path: string) => void;
}) {
  return (
    <nav aria-label="Source files" className="h-full overflow-auto p-3">
      <p className="mb-3 px-2 font-archivo text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Explorer
      </p>
      <TreeNodes
        nodes={nodes}
        selectedIndex={selectedIndex}
        expandedFolders={expandedFolders}
        onSelect={onSelect}
        onToggleFolder={onToggleFolder}
      />
    </nav>
  );
}

function TreeNodes({
  nodes,
  selectedIndex,
  expandedFolders,
  onSelect,
  onToggleFolder,
}: {
  nodes: SourceTreeNode[];
  selectedIndex: number;
  expandedFolders: Set<string>;
  onSelect: (index: number) => void;
  onToggleFolder: (path: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nodes.map((node) => {
        const isFile = node.index !== undefined;
        const expanded = expandedFolders.has(node.path);

        return (
          <li key={node.path}>
            {isFile ? (
              <button
                type="button"
                onClick={() => onSelect(node.index as number)}
                aria-current={node.index === selectedIndex ? "page" : undefined}
                className={[
                  "flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  node.index === selectedIndex
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                ].join(" ")}
              >
                <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{node.name}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onToggleFolder(node.path)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {expanded ? (
                    <ChevronDown
                      className="size-3 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronRight
                      className="size-3 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {expanded ? (
                    <FolderOpen
                      className="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Folder className="size-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span className="truncate">{node.name}</span>
                </button>
                {expanded && node.children.length > 0 ? (
                  <div className="ml-2 border-l border-border pl-2">
                    <TreeNodes
                      nodes={node.children}
                      selectedIndex={selectedIndex}
                      expandedFolders={expandedFolders}
                      onSelect={onSelect}
                      onToggleFolder={onToggleFolder}
                    />
                  </div>
                ) : null}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
