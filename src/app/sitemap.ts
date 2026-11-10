import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", getSiteUrl()).toString() },
    { url: new URL("/resources", getSiteUrl()).toString() },
    { url: new URL("/components", getSiteUrl()).toString() },
    { url: new URL("/illustration", getSiteUrl()).toString() },
    { url: new URL("/easing", getSiteUrl()).toString() },
  ];
}
