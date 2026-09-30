import type { MetadataRoute } from "next";

import { urls } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: urls.origin,
    },

    {
      url: `${urls.origin}${urls.routes.collections}`,
    },

    {
      url: `${urls.origin}${urls.routes.ui}`,
    },

    {
      url: `${urls.origin}${urls.routes.blocks}`,
    },

    {
      url: `${urls.origin}${urls.routes.illustrations}`,
    },

    {
      url: `${urls.origin}${urls.routes.animations}`,
    },

    {
      url: `${urls.origin}${urls.routes.easings}`,
    },

    {
      url: `${urls.origin}${urls.routes.effects}`,
    },

    {
      url: `${urls.origin}${urls.routes.hooks}`,
    },

    {
      url: `${urls.origin}${urls.routes.utilities}`,
    },
  ];
}