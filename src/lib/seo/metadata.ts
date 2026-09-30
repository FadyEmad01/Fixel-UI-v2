import type { Metadata } from "next";

import {
  brandConfig,
  seoConfig,
  urls,
} from "@/config/site";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description,
  pathname = "/",
  image = seoConfig.openGraph.image,
  noIndex = false,
}: CreateMetadataOptions = {}): Metadata {
  const resolvedTitle = title
    ? `${title} — ${brandConfig.product.name}`
    : seoConfig.title;

  const resolvedDescription =
    description ?? seoConfig.description;

  const canonical = new URL(
    pathname,
    urls.origin,
  ).toString();

  return {
    title: resolvedTitle,

    description: resolvedDescription,

    keywords: [...seoConfig.keywords],

    metadataBase: new URL(urls.origin),

    alternates: {
      canonical,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : seoConfig.robots,

    openGraph: {
      type: seoConfig.openGraph.type,
      locale: seoConfig.openGraph.locale,
      siteName: seoConfig.openGraph.siteName,
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      images: [
        {
          url: image,
        },
      ],
    },

    twitter: {
      card: seoConfig.twitter.card,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },

    creator: brandConfig.creator.name,
  };
}