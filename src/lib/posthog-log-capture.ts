"use client";

import posthog from "posthog-js";
import { isPostHogEnabled } from "./posthog";

function isPostHogConfigured() {
  return isPostHogEnabled();
}

export const posthogLogCapture = {
  clientInitialized() {
    if (isPostHogConfigured()) {
      posthog.logger.info("PostHog browser log capture initialized", {
        component: "instrumentation-client",
      });
    }
  },

  homePageViewed() {
    if (isPostHogConfigured()) {
      posthog.logger.info("Home page viewed", {
        route: "/",
      });
    }
  },

  globalErrorCaptured() {
    if (isPostHogConfigured()) {
      posthog.logger.error("Global application error captured", {
        boundary: "global-error",
      });
    }
  },
};
