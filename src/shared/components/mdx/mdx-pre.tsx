import { type ComponentProps, isValidElement, type ReactNode } from "react";

import { CodeBlock } from "@/shared/components/code-block/server";

import { languageFromClassName, toPlainText } from "./code-utils";

type CodeElementProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * MDX override for `<pre>`.
 *
 * MDX renders fenced code as `<pre><code class="language-…">…</code></pre>`. We
 * intercept the wrapper, recover the raw source, and hand it to the shared
 * server-rendered `CodeBlock`, so fences get the exact same highlighting, copy,
 * and scroll behaviour as every other code surface.
 */
export async function MdxPre({ children }: ComponentProps<"pre">) {
  if (isValidElement<CodeElementProps>(children)) {
    const { className, children: codeChildren } = children.props;
    const code = toPlainText(codeChildren).replace(/\n$/, "");

    if (code.length > 0) {
      return <CodeBlock code={code} lang={languageFromClassName(className)} />;
    }
  }

  // Plain `<pre>` (no nested code element): render as-is.
  return <pre>{children}</pre>;
}
