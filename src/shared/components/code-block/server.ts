/**
 * Server-only code-block entry.
 *
 * `CodeBlock` is an async Server Component that highlights with Shiki, so this
 * module must never be imported from a Client Component. Import plain
 * components from `@/shared/components/code-block` (the client-safe barrel)
 * and this one only from Server Components.
 */
export { CodeBlock, type ServerCodeBlockProps } from "./code-block";
export { type CodeBlockProps, CodeBlockShell } from "./code-block-shell";
