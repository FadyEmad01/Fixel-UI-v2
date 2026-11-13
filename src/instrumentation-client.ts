import posthog from "posthog-js";

import { isPostHogEnabled } from "@/lib/posthog";
import { posthogLogCapture } from "@/lib/posthog-log-capture";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (isPostHogEnabled() && token) {
  posthog.init(token, {
    // Reverse proxy defined in next.config.ts rewrites.
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
    capture_pageview: "history_change",
    capture_pageleave: "if_capture_pageview",
    autocapture: {
      dom_event_allowlist: ["click", "submit"],
      element_allowlist: ["a", "button", "form"],
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
    mask_personal_data_properties: true,
  });
  posthogLogCapture.clientInitialized();
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "[PostHog] Production tracking is disabled because the project token or host is missing.",
  );
}
