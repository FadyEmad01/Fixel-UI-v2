import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderLineNumber,
} from "@shikijs/transformers";
import { codeToHtml } from "shiki";

export interface HighlightCodeOptions {
  meta?: string;
  lineNumbers?: boolean;
  lineNumberStart?: number;
}

export async function highlightCode(
  code: string,
  language: string,
  options: HighlightCodeOptions = {},
) {
  const transformers = [
    transformerNotationDiff(),
    transformerNotationErrorLevel(),
    transformerNotationHighlight(),
    transformerNotationFocus(),
    transformerNotationWordHighlight(),
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
    ...(options.lineNumbers
      ? [transformerRenderLineNumber({ start: options.lineNumberStart })]
      : []),
  ];

  return codeToHtml(code, {
    lang: language,
    meta: options.meta ? { __raw: options.meta } : undefined,
    themes: {
      light: "min-light",
      dark: "vitesse-dark",
    },
    defaultColor: false,
    transformers,
  });
}
