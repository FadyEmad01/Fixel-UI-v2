import type { CatalogKind } from "@/types/catalog";

export const collectionConfig = {
  ui: {
    kind: "component",
    title: "UI",
    description: "Reusable UI components.",
  },
  blocks: {
    kind: "block",
    title: "Blocks",
    description: "Complete sections and layouts.",
  },
  illustrations: {
    kind: "illustration",
    title: "Illustrations",
    description: "Coded illustrations and graphics.",
  },
  animations: {
    kind: "animation",
    title: "Animations",
    description: "Reusable motion patterns.",
  },
  easings: {
    kind: "easing",
    title: "Easings",
    description: "Timing and easing utilities.",
  },
  effects: {
    kind: "effect",
    title: "Effects",
    description: "Reusable visual effects.",
  },
  hooks: {
    kind: "hook",
    title: "Hooks",
    description: "Reusable React hooks.",
  },
  utilities: {
    kind: "utility",
    title: "Utilities",
    description: "Reusable helpers and utilities.",
  },
} as const satisfies Record<
  string,
  { kind: CatalogKind; title: string; description: string }
>;

export type CollectionRouteKey = keyof typeof collectionConfig;
