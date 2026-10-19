# PostHog error tracking

> ⚠️ **Needs your attention**
> - Configure the production build environment with `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and `NEXT_PUBLIC_POSTHOG_HOST`; the repository has no traceable production CI or deploy path.
> - Also provide `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` wherever the app runs so browser error capture can initialize.
> - Reconcile the existing `.env.local` names `POSTHOG_PERSONAL_API_KEY` and `POSTHOG_HOST` with the names the build config actually reads: `POSTHOG_API_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
> - Add the PostHog personal API key as the secret `POSTHOG_API_KEY` in the deployment provider's build settings; keep it out of source and Docker `ARG`/`ENV` values.
> - Ensure the production build environment retains Git metadata or exposes provider-native repository and commit variables so source-map release name and version can be resolved.
> - If production uses Docker, forward only provider-set Git variables through `ARG`/`ENV` and provide `POSTHOG_API_KEY` as a build secret.

## What error tracking does now

- The browser SDK is initialized in `instrumentation-client.ts` with `capture_exceptions: true`, so unhandled errors and unhandled promise rejections are sent to PostHog.
- Next.js render errors are covered by `src/app/global-error.tsx`, which calls `posthog.captureException(error)` from the framework's global error boundary.
- The SDK is installed and initialized: this project now has PostHog error capture rather than only the previous application code.

## Source-map upload

Source-map upload is configured in `next.config.ts` through the existing `withPostHogConfig` integration. The production build command is:

```sh
pnpm build
```

The build is set up to upload source maps, but the repository does not contain a traceable production CI or deployment workflow. Uploads start, and the build command succeeds with uploads, only once `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and `NEXT_PUBLIC_POSTHOG_HOST` are present where `pnpm build` runs. Source maps are configured for deletion after upload. The actual deployment provider must supply Git metadata for release resolution.

## What you still need to do

1. Use the deployment provider's production build settings for this repository and run the existing command `pnpm build`.
2. Add `POSTHOG_API_KEY` as a CI/deployment secret. This must be a PostHog personal API key with the source-map upload preset/scope. The credentials were stored locally for this project, but no repository CI workflow exists to carry the key into production builds.
3. Add the non-secret build variables `POSTHOG_PROJECT_ID=308401` and `NEXT_PUBLIC_POSTHOG_HOST` with the configured PostHog host value. Add the runtime variables `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` as well; the token is public, while the personal API key is not.
4. Make sure the provider's build environment retains `.git` or exposes its native repository and commit variables, so the uploader can associate uploaded maps with the release and commit. If the provider builds through Docker, use a build secret for `POSTHOG_API_KEY`, not a Docker `ARG` or `ENV`.
5. Reconcile the local credential naming before relying on it: `next.config.ts` reads `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and `NEXT_PUBLIC_POSTHOG_HOST`, while the credentials setup also populated `POSTHOG_PERSONAL_API_KEY` and `POSTHOG_HOST`. The deployment environment must use the names read by the source configuration.

## Release linking

Release linking was not wired. No deploy path could be identified in the repository, so no release-ID startup behavior or SDK version change was introduced. Local runs, tests, and pull-request builds remain unchanged and do not send a release ID.

## Verify it

Trigger an error in the running app, then inspect [PostHog error tracking](https://eu.posthog.com/project/308401/error_tracking). Uploaded symbol sets appear at [error-tracking configuration](https://eu.posthog.com/project/308401/error_tracking/configuration). After the real production build is configured with the required values, confirm the exception has a readable stack trace and that the uploaded symbol set is present.
