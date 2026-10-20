import { isValidElement, type ReactNode } from "react";

/**
 * Flatten a React node tree into plain text.
 *
 * MDX hands us already-parsed `children`, which may be strings, arrays, or
 * elements. For code fences we need the raw source back so it can be copied and
 * (re)highlighted on the server.
 */
export function toPlainText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);

  if (Array.isArray(node)) {
    return node.map(toPlainText).join("");
  }

  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return toPlainText(props.children);
  }

  return "";
}

/** Pull the language tag out of a `className="language-tsx"` prop. */
export function languageFromClassName(
  className: string | undefined,
): string | undefined {
  if (!className) return undefined;
  const match = /language-([\w-]+)/.exec(className);
  return match?.[1];
}
