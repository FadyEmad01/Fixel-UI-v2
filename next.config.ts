import type { NextConfig } from "next";
import { withPostHogConfig } from "@posthog/nextjs-config";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY ?? "";

// Source map upload is silently skipped when the key is missing, which leaves
// production stack traces minified with no error to explain why. Make it loud.
if (!personalApiKey && process.env.NODE_ENV === "production") {
  console.warn(
    "[next.config] POSTHOG_PERSONAL_API_KEY is not set, so PostHog source map upload is disabled. " +
      "Production stack traces will stay minified. Set it in .env.local " +
      "(needs the 'error tracking write' and 'organization read' scopes).",
  );
}

export default withPostHogConfig(nextConfig, {
  personalApiKey, // Personal API key with "sourcemap upload" scope
  envId: '308401', // Your environment ID (project ID)
  host: 'https://eu.i.posthog.com', // Your PostHog instance URL (EU)
  sourcemaps: {
    // Upload only when a personal API key is configured (see .env.example).
    // With an empty key we skip instead of throwing, so `next dev` and
    // contributor builds still work; the warning above covers production.
    enabled: Boolean(personalApiKey),
    deleteAfterUpload: true,
    // project and version default to git repo name and current git commit
  },
});
  