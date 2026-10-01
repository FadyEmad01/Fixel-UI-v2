import { brandConfig } from "./brand";

export const seoConfig = {
  title: brandConfig.product.name,

  description: brandConfig.product.description,

  keywords: [
    "React components",
    "Next.js",
    "shadcn",
    "Tailwind CSS",
    "animated components",
    "frontend resources",
    "UI blocks",
    "coded illustrations",
  ],

  creator: brandConfig.creator.name,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: brandConfig.product.name,
    image: "/og-image.png",
  },

  twitter: {
    card: "summary_large_image",
    image: "/og-image.png",
  },
} as const;
