import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Inter } from "next/font/google";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { getSiteUrl, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const archivoHeading = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    images: [
      {
        url: site.ogImage,
        width: site.ogImageWidth,
        height: site.ogImageHeight,
        alt: site.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        archivoHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
