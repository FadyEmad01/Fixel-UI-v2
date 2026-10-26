import { PostHog } from "posthog-node";
import { isPostHogEnabled } from "./posthog";

// Singleton posthog-node client for production server-side captures.
let posthogInstance: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  if (!isPostHogEnabled()) return null;

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
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
