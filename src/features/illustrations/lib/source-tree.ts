/**
 * The file tree behind the source explorer.
 *
 * Install paths arrive flat (`components/illustrations/kit.tsx`), so the tree is
 * built from the path segments and each leaf remembers the index of its file in
 * the flat list — clicking a leaf selects a code panel by position, not by path.
 */

export type SourceTreeNode = {
  name: string;
  path: string;
  /** Position in the flat file list; only leaves have one. */
  index?: number;
  children: SourceTreeNode[];
};

/**
 * Fold `paths` into a tree, keeping input order.
 *
 * Order matters: the shared kit precedes the item in the manifest, and the
 * explorer should list it first.
 */
export function createSourceTree(paths: string[]): SourceTreeNode[] {
  const root: SourceTreeNode = { name: "", path: "", children: [] };

  paths.forEach((path, index) => {
    const parts = path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, partIndex) => {
      const nodePath = parts.slice(0, partIndex + 1).join("/");
      let node = current.children.find((child) => child.name === part);

      if (!node) {
        node = { name: part, path: nodePath, children: [] };
        current.children.push(node);
      }

      if (partIndex === parts.length - 1) node.index = index;

      current = node;
    });
  });

  return root.children;
}
