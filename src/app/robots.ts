import type { MetadataRoute } from "next";

import { urls } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/r/"],
    },

    sitemap: `${urls.origin}/sitemap.xml`,
  };
}
