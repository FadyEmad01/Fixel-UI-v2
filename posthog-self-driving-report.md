# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web project. Session Replay and Error Tracking were already enabled; Support was enabled in this setup. Health checks, error-tracking, and Support signal sources now feed the Self-driving inbox.

Fresh scout configurations are picked up within about 30 minutes, and findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/308401/inbox) as data arrives.

## AI data processing

Approved before this setup ran.

## GitHub

The PostHog GitHub App was already connected before this setup.

## Products enabled

| Product | Result | Integration check |
| --- | --- | --- |
| Session Replay | Already enabled | The browser `posthog.init` configuration does not disable session recording. |
| Error Tracking | Already enabled | The browser `posthog.init` configuration captures exceptions. |
| Support (Conversations) | Enabled | Tickets will arrive only after an inbound email, inbox, or Slack channel is connected in PostHog. |

## Signal sources

| Signal source | Action |
| --- | --- |
| `health_checks` / `health_issue` | Enabled (source id `01a15352-3aa0-74c4-9123-903f444728f9`) |
| `error_tracking` / `issue_created` | Enabled (source id `01a15352-4655-7165-884c-24c07f297cc2`) |
| `error_tracking` / `issue_reopened` | Enabled (source id `01a15352-5196-7328-9d8f-37e46b4d50d2`) |
| `error_tracking` / `issue_spiking` | Enabled (source id `01a15352-5ce4-7c16-bdd7-da45bb4999f0`) |
| `conversations` / `ticket` | Enabled (source id `01a15352-691c-7c98-9605-cf64f0894d5b`) |
| Scout gate | On by default; no opt-out row was created. |
| Logs | Skipped: no evidence that the Logs product is in use. |
| Endpoints | Skipped: endpoint usage could not be assessed because the connected MCP token lacks `endpoint:read`. |
| Session Replay source | Intentionally not created: Replay Vision scanners own this route into the inbox. |

## Connected tools

No external issue tracker, error tracker, support desk, security scanner, review source, or search-analytics source was selected. No connected-tool responders were enabled.

## Scout troop

### Active troop

| Scout | What it watches |
| --- | --- |
| General | Cross-product relationships and surfaces without a specialist. |
| Product analytics | Product-flow and saved-analysis regressions. |
| Web analytics | Traffic, attribution, landing-page health, bounce, and 404 shifts. |
| Web vitals | Page performance regressions. |
| Unused features | Reachable interface elements and pages that receive unexpectedly little use. |

**Operational:** Inbox validation remains enabled. It runs report follow-up checks and sits outside the monitoring-troop ceiling.

### Capacity

- Daily run budget: **100**; used today: **0**; remaining today: **100**.
- Enabled-scout cap: **250**. One operational scout occupied a protected slot; **249** non-operational/custom slots were available before troop selection.
- The configured non-operational troop has five active scouts, leaving room below the ten-scout quality ceiling for up to five custom scouts.
- Announcement: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

### Disabled built-in scouts

| Scouts | Reason |
| --- | --- |
| AI observability, APM, Customer analytics, Data pipelines, Data warehouse, Revenue analytics | No repository or project evidence that these product surfaces are in use. |
| Conversations, Surveys, Experiments, Feature flags, Logs, Tasks, Workflows | No active usage evidence; enable later if those surfaces become active. |
| CSP violations | No CSP reporting evidence in the repository. |
| Anomaly detection, Insight alerts, Observability gaps, MCP tool calls, PR follow-up, Skills store | Not among the selected web-focused surfaces for this small project. |
| Error tracking | Covered by the native error-tracking responder. |
| Session replay | Covered by the Replay Vision scanners below. |
| Replay vision | Disabled because the new scanners need accumulated observations before an analyst layer adds value. |

## Custom scouts

No custom scouts were created. The setup proposed a homepage delivery-health check that would compare homepage reach with successful browser initialization and broad client-error impact; it overlaps Web analytics but adds browser-delivery coverage. The proposal was declined.

Surfaces ruled out: error bursts are owned by the native Error Tracking source; session-level visual breakage and friction are owned by Replay Vision; payment, AI, survey, support-workflow, CSP, data-pipeline, and account-analysis surfaces have no project evidence. If a future custom scout becomes noisy, set its `emit` option to `false` in PostHog to switch it to dry-run.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying findings into the inbox. These are the only components in this setup that spend Replay Vision quota. Findings arrive at half weight and require corroboration before they are promoted into a report.

| Brief | Scanner | Status | Scope | Sampling | Estimate |
| --- | --- | --- | --- | --- | --- |
| Breakage monitor | Fixel UI homepage breakage | Created | Recordings on the homepage path (`/`). The repository currently has only the homepage, so this is the highest-traffic and only identifiable flow rather than a completion funnel. | 50% | 0 matching sessions in the recent 3-day window; 0 observations/month; 0 credits/month. |
| Frustration monitor | Fixel UI visitor frustration | Created | Recordings containing a rage click, with no URL restriction. | 100% | 0 matching sessions in the recent 3-day window; 0 observations/month; 0 credits/month. |

Replay Vision quota was verified before creation: 2,500 credits remain in the current period and no quota is currently used. There were no recorded sessions in the estimate window, so both scanners are armed and begin working when browser recordings arrive.

## Files modified or created

| File | Change |
| --- | --- |
| `posthog-self-driving-report.md` | Created this setup handoff report. |

No application source files were modified.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so Support tickets can reach the enabled responder.
- [ ] Configure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in a local/deployment environment if they are not injected elsewhere; no project `.env` file currently sets them, so this repository will not send browser data until they are supplied.
- [ ] Generate browser traffic and verify session recordings arrive; both Replay Vision monitors currently have no sessions to analyze.
- [ ] Reauthorize the MCP connection with `endpoint:read` if endpoint monitoring is used, then assess and enable the Endpoints responders as appropriate.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Runs draw from the 100-per-day project budget, findings cluster into reports in the Self-driving inbox, and immediately actionable findings can begin coding tasks.
