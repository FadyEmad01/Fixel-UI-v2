"use client";

import { useEffect } from "react";
import { posthogLogCapture } from "@/lib/posthog-log-capture";

export function HomePageView() {
  useEffect(() => {
    posthogLogCapture.homePageViewed();
  }, []);

  return (
    <>
      <h1>asdasd</h1>
    </>
  );
}
