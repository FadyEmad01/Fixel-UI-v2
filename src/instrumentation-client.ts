import posthog from "posthog-js";

import { isPostHogEnabled } from "@/lib/posthog";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (isPostHogEnabled() && token && host) {
  posthog.init(token, {
    api_host: host,
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
    disable_session_recording: true,
  });
} else if (process.env.NODE_ENV === "production") {
  console.warn(
    "[PostHog] Production tracking is disabled because the project token or host is missing.",
  );
}
