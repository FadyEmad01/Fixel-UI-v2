import { withPostHogConfig } from "@posthog/nextjs-config";
import type { NextConfig } from "next";

type NextConfigFunction = (
  phase: string,
  context: { defaultConfig: NextConfig },
) => NextConfig | Promise<NextConfig>;

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

const posthogConfig = {
  personalApiKey, // Personal API key with "error tracking write" + "organization read" scopes
  envId: "308401", // Your environment ID (project ID) — deprecated, prefer projectId
  host: "https://eu.i.posthog.com", // Your PostHog instance URL (EU)
  sourcemaps: {
    // Upload only when a personal API key is configured (see .env.example).
    // With an empty key we skip instead of throwing, so `next dev` and
    // contributor builds still work; the warning above covers production.
    enabled: Boolean(personalApiKey),
    deleteAfterUpload: true,
    // project and version default to git repo name and current git commit
  },
};

// Fail open. PostHog is telemetry, so a rotated key, a missing scope or a
// PostHog outage must not block a deploy. Two things can throw:
//   1. withPostHogConfig() itself, since it validates config at module load.
//   2. The function it returns, which Next invokes — that is where the
//      release-resolve network call happens during a production build.
// Note the published types claim this returns NextConfig, but at runtime it
// returns a config function, hence the cast through unknown.
const withPostHog = (() => {
  try {
    return withPostHogConfig(nextConfig, posthogConfig) as unknown as
      | NextConfig
      | NextConfigFunction;
  } catch (error) {
    console.warn(
      "[next.config] PostHog setup failed; building without source map upload.",
      error,
    );
    return nextConfig;
  }
})();

export default async function config(
  phase: string,
  context: { defaultConfig: NextConfig },
): Promise<NextConfig> {
  try {
    return typeof withPostHog === "function"
      ? await withPostHog(phase, context)
      : withPostHog;
  } catch (error) {
    console.warn(
      "[next.config] PostHog config hook failed; building without source map upload.",
      error,
    );
    return nextConfig;
  }
}
