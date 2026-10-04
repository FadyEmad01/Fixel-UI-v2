import type { MetadataRoute } from "next";

import { urls } from "@/config/site";
import { getCatalog } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();

  return [
    {
      url: urls.origin,
    },

    {
      url: `${urls.origin}${urls.routes.collections}`,
    },
    ...catalog.map((item) => ({
      url: `${urls.origin}/collections/${item.id}`,
    })),
  ];
}
