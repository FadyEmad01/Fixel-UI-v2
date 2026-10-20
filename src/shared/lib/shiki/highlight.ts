import "server-only";

// Languages. Only the grammars the docs actually use are bundled, so the
// highlighter stays small. Add an import + entry when a new language is needed.
import bash from "@shikijs/langs/bash";
import css from "@shikijs/langs/css";
import html from "@shikijs/langs/html";
import js from "@shikijs/langs/js";
import json from "@shikijs/langs/json";
import mdx from "@shikijs/langs/mdx";
import ts from "@shikijs/langs/ts";
import tsx from "@shikijs/langs/tsx";
// Themes (dual light/dark). The names below MUST match the theme modules.
import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export const LIGHT_THEME = "github-light";
export const DARK_THEME = "github-dark";

const languageMap = {
  bash: bash,
  css: css,
  html: html,
  js: js,
  json: json,
  mdx: mdx,
  ts: ts,
  tsx: tsx,
} as const;

export type SupportedLanguage = keyof typeof languageMap;

/** Human-readable label for the code block header. */
const languageLabels: Record<SupportedLanguage, string> = {
  bash: "bash",
  css: "css",
  html: "html",
  js: "js",
  json: "json",
  mdx: "mdx",
  ts: "ts",
  tsx: "tsx",
};

/**
 * Common aliases authors (and rehype) hand us, normalized to a bundled grammar.
 * Anything not listed here is treated as unsupported and rendered as plain text.
 */
const languageAliases: Record<string, SupportedLanguage> = {
  shell: "bash",
  sh: "bash",
  console: "bash",
  zsh: "bash",
  javascript: "js",
  mjs: "js",
  cjs: "js",
  jsx: "tsx",
  typescript: "ts",
  mts: "ts",
  cts: "ts",
  markdown: "mdx",
  md: "mdx",
};

/** Is `lang` a language we can highlight? */
export function isSupportedLanguage(
  lang: string | undefined,
): lang is SupportedLanguage {
  return typeof lang === "string" && lang in languageMap;
}

/** Resolve an author-provided language tag to a bundled grammar, if any. */
export function resolveLanguage(
  lang: string | undefined,
): SupportedLanguage | undefined {
  if (!lang) return undefined;
  const normalized = lang.toLowerCase().trim();
  if (isSupportedLanguage(normalized)) return normalized;
  return languageAliases[normalized];
}

/** Label shown in the code block header. Falls back to the raw tag. */
export function languageLabel(lang: string | undefined): string | undefined {
  const resolved = resolveLanguage(lang);
  if (resolved) return languageLabels[resolved];
  return lang || undefined;
}

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter(): Promise<HighlighterCore> {
  // Created lazily and cached for the lifetime of the server process.
  highlighterPromise ??= createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: Object.values(languageMap),
    engine: createJavaScriptRegexEngine(),
  });

  return highlighterPromise;
}

/**
 * Highlight `code` into dual-theme HTML.
 *
 * Returns `null` when the language is unsupported, so callers can fall back to
 * plain, escaped text instead of throwing. The emitted markup carries
 * `--shiki-light*` / `--shiki-dark*` custom properties that `globals.css`
 * resolves against the `.dark` class managed by `next-themes` — no client-side
 * highlighter and no hydration mismatch.
 */
export async function highlight(
  code: string,
  lang: string | undefined,
): Promise<string | null> {
  "use cache";

  const resolved = resolveLanguage(lang);
  console.log("[highlight] lang=", lang, "resolved=", resolved);
  if (!resolved) return null;

  try {
    const highlighter = await getHighlighter();
    const html = highlighter.codeToHtml(code, {
      lang: resolved,
      themes: { light: LIGHT_THEME, dark: DARK_THEME },
      defaultColor: false,
    });
    console.log("[highlight] html ok, len=", html.length);
    return html;
  } catch (e) {
    console.error("[highlight] err", e);
    return null;
  }
}
