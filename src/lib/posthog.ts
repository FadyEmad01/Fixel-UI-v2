/** Browser and server tracking stay disabled outside production builds. */
export function isPostHogEnabled(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
    Boolean(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
        process.env.NEXT_PUBLIC_POSTHOG_HOST,
    )
  );
}
