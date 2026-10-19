import type { Instrumentation } from "next";

export function register() {
  // No-op: posthog-node is initialized lazily inside onRequestError.
}

// Captures unhandled server-side errors (Server Components, Route Handlers,
// Server Actions) into PostHog Error Tracking. See the PostHog Next.js
// error-tracking docs; the cookie lookup connects the error to the client
// session that triggered it.
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { getPostHogServer } = await import("@/lib/posthog-server");
  const posthog = getPostHogServer();
  if (!posthog) {
    return;
  }

  // Match the distinct_id from the posthog-js cookie so the server exception
  // is attributed to the same session as the client events.
  let distinctId: string | undefined;
  const rawCookie = request.headers.cookie;
  if (rawCookie) {
    const cookieString = Array.isArray(rawCookie)
      ? rawCookie.join("; ")
      : rawCookie;
    const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);
    if (match?.[1]) {
      try {
        const cookieData: unknown = JSON.parse(decodeURIComponent(match[1]));
        if (
          typeof cookieData === "object" &&
          cookieData !== null &&
          "distinct_id" in cookieData
        ) {
          distinctId = String(
            (cookieData as { distinct_id: unknown }).distinct_id,
          );
        }
      } catch {
        // Malformed cookie — report without a distinct_id rather than fail.
      }
    }
  }

  posthog.captureException(error, distinctId, {
    route_path: context.routePath,
    route_type: context.routeType,
    router_kind: context.routerKind,
  });
};
