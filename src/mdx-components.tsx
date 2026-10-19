import type { MDXComponents } from "mdx/types";

import { getBaseMdxComponents } from "./shared/components/mdx";

/**
 * Required by the MDX runtime with the App Router.
 *
 * This provides the global component map for every MDX file in the app:
 * Tailwind-styled prose elements plus the shared authoring blocks (`Steps`,
 * `Step`, `Callout`) and the `CodeBlock`-backed `<pre>` override.
 *
 * Feature-specific blocks (for example `<ComponentPreview />`) are NOT added
 * here. They are passed in by the feature that renders the MDX file, which
 * keeps this shared map free of feature imports.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getBaseMdxComponents(components);
}
