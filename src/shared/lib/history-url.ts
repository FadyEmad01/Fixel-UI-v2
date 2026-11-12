/**
 * URL updates that do not start a Next.js navigation.
 *
 * `window.history.pushState`/`replaceState` are patched by the App Router, so
 * they keep `usePathname`/`useSearchParams` in sync without fetching an RSC
 * payload — the URL changes, the rendered tree does not. That makes them the
 * right tool for UI that is mirrored into the query string (an open sheet, a
 * selected tab) but rendered on the client.
 *
 * Server Components still read the query string on a real request, so shared
 * and hard-loaded URLs keep rendering correctly; the history entry carries the
 * router's own state, so back/forward stay client-side.
 *
 * `URL_CHANGE_EVENT` covers the case `popstate` cannot: another component
 * rewriting the query string with `replaceUrl` (the navbar's search panel
 * closing an open sheet). Anything that mirrors the query string into state
 * should listen through `subscribeUrlChange` rather than to `popstate` alone.
 */

const URL_CHANGE_EVENT = "app:urlchange";

function write(mode: "push" | "replace", href: string) {
  window.history[mode === "push" ? "pushState" : "replaceState"](
    null,
    "",
    href,
  );
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

/** Add a history entry — the visitor can go back to the previous URL. */
export function pushUrl(href: string) {
  write("push", href);
}

/** Rewrite the current entry — no new place to go back to. */
export function replaceUrl(href: string) {
  write("replace", href);
}

/**
 * Calls `handler` whenever the URL changes without a server navigation:
 * browser back/forward (`popstate`) and local `pushUrl`/`replaceUrl` calls.
 *
 * The handler receives the event so it can tell the two apart — `popstate`
 * means the visitor moved to a different history entry.
 */
export function subscribeUrlChange(handler: (event: Event) => void) {
  window.addEventListener("popstate", handler);
  window.addEventListener(URL_CHANGE_EVENT, handler);

  return () => {
    window.removeEventListener("popstate", handler);
    window.removeEventListener(URL_CHANGE_EVENT, handler);
  };
}

/** The current query string, read at call time rather than from a hook. */
export function currentSearchParams() {
  return new URLSearchParams(window.location.search);
}
