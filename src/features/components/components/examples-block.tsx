import type { ComponentType } from "react";

import { CodeBlock } from "@/shared/components/code-block/server";
import { componentExamples as exampleBarrel } from "../generated";
import { componentExamples } from "../lib/examples";

/**
 * The generated barrel has no keys until the first component ships, so index it
 * through a record instead of relying on the inferred literal type.
 */
const previews = exampleBarrel as Record<
  string,
  Record<string, ComponentType> | undefined
>;

/**
 * Every example, stacked: the live component above the exact file that renders
 * it.
 *
 * The preview and the code come from the same mirrored file, so the snippet a
 * reader copies is the one they just saw.
 */
export function ExamplesBlock({ slug }: { slug: string }) {
  const set = componentExamples(slug);
  if (!set) return null;

  return (
    <div className="flex flex-col gap-10">
      {set.items.map((example) => {
        const Preview = previews[slug]?.[example.name];

        return (
          <div key={example.name} className="flex flex-col gap-4">
            <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-border/60 bg-muted/30 p-8">
              {Preview ? <Preview /> : null}
            </div>

            <CodeBlock
              code={example.source}
              lang="tsx"
              title={`${example.name}.tsx`}
            />
          </div>
        );
      })}
    </div>
  );
}
