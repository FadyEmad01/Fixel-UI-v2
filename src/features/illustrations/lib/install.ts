/**
 * Illustration-specific install surfaces.
 *
 * The commands, URLs, and assistant links are shared with every other catalog;
 * only the consumer snippet knows where illustrations are installed.
 */

export * from "@/shared/lib/registry/install";

/** The consumer import + JSX a visitor pastes after installing. */
export function usageSnippet(slug: string, componentName: string): string {
  return `import { ${componentName} } from "@/components/illustrations/${slug}";

<${componentName} />`;
}
