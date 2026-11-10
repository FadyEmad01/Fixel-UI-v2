import examplesJson from "../generated/examples.json";

/**
 * The examples that feed the docs.
 *
 * `registry:generate` mirrors `registry/fixel/components/<slug>/examples/*.tsx`
 * into `examples.json`, with the item import rewritten to
 * `@/components/fixel/<slug>`. The file on disk is the truth; nothing on the
 * docs side types a snippet by hand.
 */

export type ComponentExample = {
  /** File stem, e.g. `basic`. */
  name: string;
  /** `Basic`, derived from the stem at generation time. */
  title: string;
  /** The whole example file, ready to copy. */
  source: string;
};

export type ComponentExamples = {
  /** Name of the example the docs and live preview use. */
  default: string;
  items: ComponentExample[];
};

const examples = examplesJson as Record<string, ComponentExamples>;

export function componentExamples(slug: string): ComponentExamples | undefined {
  return examples[slug];
}

/** The example named by `meta.example`, else the first file. */
export function defaultExample(slug: string): ComponentExample | undefined {
  const set = examples[slug];
  if (!set) return undefined;

  return set.items.find((item) => item.name === set.default) ?? set.items[0];
}
