export const site = {
  name: "Fixel UI",
  title: "Fixel UI — Wireframe React illustrations",
  description:
    "A growing shadcn registry of installable React illustrations, plus a curated shelf of useful interface resources.",
} as const;

export function isIndexable(): boolean {
  return process.env.SEO_INDEXABLE === "true";
}

export function getSiteUrl(): URL {
  const configured = process.env.SITE_URL?.trim();
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const value =
    configured || (host ? `https://${host}` : "http://localhost:3000");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "SITE_URL must be a full URL, for example https://my-site.vercel.app",
    );
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be a clean origin, for example https://my-site.vercel.app",
    );
  }

  if (isIndexable() && (!configured || url.protocol !== "https:")) {
    throw new Error(
      "To enable indexing, explicitly set SITE_URL to your public HTTPS origin",
    );
  }

  return new URL(url.origin);
}
