import { CodeBlock } from "@/shared/components/code-block/server";

/**
 * The Usage section.
 *
 * The source is the default example file, rewritten to the consumer alias at
 * generation time, so the docs cannot describe an API the component does not
 * have.
 */
export function UsageBlock({ source }: { source: string }) {
  return <CodeBlock code={source} lang="tsx" />;
}
