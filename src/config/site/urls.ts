const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const urls = {
  origin: siteUrl,

  routes: {
    home: "/",
    collections: "/collections",
  },

  registry: {
    root: "/r/registry.json",
  },
} as const;
