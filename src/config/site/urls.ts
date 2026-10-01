const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const urls = {
  origin: siteUrl,

  routes: {
    home: "/",
    collections: "/collections",

    ui: "/collections/ui",
    blocks: "/collections/blocks",
    illustrations: "/collections/illustrations",
    animations: "/collections/animations",
    easings: "/collections/easings",
    effects: "/collections/effects",
    hooks: "/collections/hooks",
    utilities: "/collections/utilities",
  },

  registry: {
    root: "/r/registry.json",
  },
} as const;
