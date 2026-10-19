import { PostHog } from "posthog-node";

// Singleton posthog-node client for server-side captures. Initialized lazily
// so `next dev` and contributor builds without PostHog env keep working.
let posthogInstance: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN and NEXT_PUBLIC_POSTHOG_HOST are required by PostHog server-side capture; server exceptions are silently missed until they are configured.",
      );
    }
    return null;
  }

  if (!posthogInstance) {
    posthogInstance = new PostHog(token, {
      host,
      // Send each exception on its own so nothing is lost if the request
      // lifecycle (or the serverless function) ends right after an error.
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogInstance;
}
