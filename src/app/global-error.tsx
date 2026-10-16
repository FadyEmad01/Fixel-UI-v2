"use client";

import NextError from "next/error";
import posthog from "posthog-js";
import { useEffect } from "react";
import { posthogLogCapture } from "@/lib/posthog-log-capture";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error);
      posthogLogCapture.globalErrorCaptured();
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
