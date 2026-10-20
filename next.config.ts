import createMDX from "@next/mdx";
import { withPostHogConfig } from "@posthog/nextjs-config";
import type { NextConfig } from "next";

type NextConfigFunction = (
  phase: string,
  context: { defaultConfig: NextConfig },
) => NextConfig | Promise<NextConfig>;

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
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

// MDX pipeline for imported `.mdx` files (e.g. docs pages). remark-gfm adds
// tables, task lists, and strikethrough; @shikijs/rehype highlights fenced
// code at compile time. Applied first so every export path — including the
// PostHog fail-open fallbacks below — keeps MDX support.
// Note: Turbopack cannot cross JavaScript plugin functions into Rust, so
// plugins are referenced by package-name string (see "Using Plugins with
// Turbopack" in the Next.js MDX guide).
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

const withMDXConfig = withMDX(nextConfig);

const personalApiKey = process.env.POSTHOG_API_KEY ?? "";
const projectId = process.env.POSTHOG_PROJECT_ID;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const uploadConfigured = Boolean(personalApiKey && projectId);

// Source map upload is silently skipped when credentials are missing, which
// leaves production stack traces minified with no error to explain why.
if (!uploadConfigured && process.env.NODE_ENV === "production") {
  console.warn(
    "[next.config] POSTHOG_API_KEY and POSTHOG_PROJECT_ID are required for PostHog source map upload. " +
      "Production stack traces will stay minified until they are configured at build time.",
  );
}

const posthogConfig = {
  personalApiKey, // Personal API key with "error tracking write" + "organization read" scopes
  projectId,
  host: posthogHost,
  sourcemaps: {
    // With incomplete credentials we skip instead of throwing, so `next dev`
    // and contributor builds still work; the warning above covers production.
    enabled: uploadConfigured,
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
    return withPostHogConfig(withMDXConfig, posthogConfig) as unknown as
      | NextConfig
      | NextConfigFunction;
  } catch (error) {
    console.warn(
      "[next.config] PostHog setup failed; building without source map upload.",
      error,
    );
    return withMDXConfig;
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
    return withMDXConfig;
  }
}
