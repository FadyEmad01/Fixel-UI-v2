import { highlight, languageLabel } from "@/shared/lib/shiki/highlight";

import { type CodeBlockProps, CodeBlockShell } from "./code-block-shell";

export type ServerCodeBlockProps = Pick<
  CodeBlockProps,
  | "title"
  | "icon"
  | "allowCopy"
  | "viewportClassName"
  | "className"
  | "data-line-numbers"
  | "data-line-numbers-start"
> & {
  /** Source to render. A single trailing newline is trimmed. */
  code: string;
  /** Language tag, e.g. `tsx`, `bash`, `json`. Unknown tags fall back to plain text. */
  lang?: string;
};

/**
 * Server-rendered code block.
 *
 * Highlighting happens here (at build / request time on the server) so the
 * browser never ships a syntax highlighter. The interactive shell is a small
 * client island (`CodeBlockShell`) that only handles copy and scrolling.
 */
export async function CodeBlock({
  code,
  lang,
  title,
  ...props
}: ServerCodeBlockProps) {
  const normalized = code.replace(/\n$/, "");
  const html = await highlight(normalized, lang);

  return (
    <CodeBlockShell
      code={normalized}
      html={html}
      title={title ?? languageLabel(lang)}
      {...props}
    />
  );
}
