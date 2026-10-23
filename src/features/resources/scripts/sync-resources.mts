import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resources } from "../data/resources.ts";
import type { ResourceSnapshot, ResourceSnapshotEntry } from "../lib/types.ts";
import { normalizeResourceUrl, resourceHost } from "../lib/url.ts";
import { blurDataUrl } from "./lib/blur.mts";
import { extractMetadata } from "./lib/extract.mts";
import { fetchImage, fetchPage } from "./lib/fetch.mts";

/**
 * Refresh `generated/resources.json` from the curated list.
 *
 * Run with `pnpm resources:sync`, or `pnpm resources:sync -- --force` to
 * re-read every page. Entries that fail keep their previous metadata: a bot
 * wall or a timeout must never blank out a card that worked yesterday.
 *
 * Each preview image also gets a Plaiceholder LQIP (`blurDataUrl`), built here
 * because the image URL is only known after the page is read. The blur is
 * reused while the image is unchanged; a forced sync rebuilds it.
 */

const here = dirname(fileURLToPath(import.meta.url));
const snapshotPath = resolve(here, "../generated/resources.json");

/** How long a successful fetch is trusted before the script re-reads the page. */
const REFRESH_AFTER_DAYS = 14;
const force = process.argv.includes("--force");

function isFresh(
  entry: ResourceSnapshotEntry | undefined,
): entry is ResourceSnapshotEntry {
  if (!entry?.fetchedAt || entry.status === "failed") return false;
  const age = Date.now() - Date.parse(entry.fetchedAt);
  return Number.isFinite(age) && age < REFRESH_AFTER_DAYS * 86_400_000;
}

async function readSnapshot(): Promise<ResourceSnapshot> {
  try {
    const parsed = JSON.parse(
      await readFile(snapshotPath, "utf8"),
    ) as ResourceSnapshot;
    return {
      generatedAt: parsed.generatedAt ?? null,
      resources: Array.isArray(parsed.resources) ? parsed.resources : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(
        `[resources] Could not read the old snapshot: ${String(error)}`,
      );
    }
    return { generatedAt: null, resources: [] };
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Prefer freshly extracted values, but never trade a known value for a missing one. */
function keep<T>(next: T | null, previous: T | null | undefined): T | null {
  return next ?? previous ?? null;
}

/**
 * The blur for `image`, reusing the stored one when the image has not changed.
 *
 * A blur is a nicety: a failed download or an image sharp cannot decode leaves
 * the resource intact and simply stores `null`.
 */
async function resolveBlur(
  image: string | null,
  previous: ResourceSnapshotEntry | undefined,
  force: boolean,
): Promise<string | null> {
  if (!image) return null;

  if (!force && image === previous?.image && previous.blurDataUrl) {
    return previous.blurDataUrl;
  }

  try {
    const { data, contentType } = await fetchImage(image);
    const blur = await blurDataUrl(data);
    const kb = (blur.length / 1000).toFixed(1);
    console.log(`    · blur ${contentType.split(";")[0]} → ${kb} kB`);
    return blur;
  } catch (error) {
    console.warn(`    ! ${image} — blur skipped: ${errorMessage(error)}`);
    return null;
  }
}

/**
 * Snapshots written before the blur existed have no `blurDataUrl` key. The
 * cached path skips the page fetch, so build just the missing blur from the
 * stored image URL instead of forcing a full refresh.
 */
async function backfillBlur(
  entry: ResourceSnapshotEntry,
): Promise<string | null> {
  // `in` would narrow the typed entry to `never`; probe the parsed JSON instead.
  const stored = (entry as { blurDataUrl?: string | null }).blurDataUrl;
  if (stored !== undefined) return stored;
  return resolveBlur(entry.image, entry, false);
}

async function main(): Promise<void> {
  const previous = await readSnapshot();
  const previousByUrl = new Map(
    previous.resources.map((entry) => [entry.normalizedUrl, entry]),
  );

  const startedAt = Date.now();
  const next: ResourceSnapshotEntry[] = [];
  let refreshed = 0;
  let cached = 0;
  let failed = 0;

  console.log(
    `[resources] ${resources.length} curated URL(s)${force ? ", forced refresh" : `, re-reading older than ${REFRESH_AFTER_DAYS} days`}`,
  );

  for (const seed of resources) {
    const normalizedUrl = normalizeResourceUrl(seed.url);
    if (!normalizedUrl) {
      console.warn(`  ! ${seed.url} — not a valid http(s) URL, skipped`);
      failed += 1;
      continue;
    }

    const existing = previousByUrl.get(normalizedUrl);

    if (!force && isFresh(existing)) {
      next.push({
        ...existing,
        url: seed.url,
        blurDataUrl: await backfillBlur(existing),
      });
      cached += 1;
      console.log(`  · ${normalizedUrl} — cached`);
      continue;
    }

    try {
      const { html, finalUrl } = await fetchPage(normalizedUrl);
      const meta = extractMetadata(html, finalUrl);
      const hostname = resourceHost(seed.url);

      // A page that renders its shell before its metadata can look like a
      // nameless hostname. Keep the name we already know in that case.
      const name =
        meta.name === hostname && existing?.name && existing.name !== hostname
          ? existing.name
          : meta.name;

      const image = keep(meta.image, existing?.image);
      const blur = await resolveBlur(image, existing, force);

      next.push({
        url: seed.url,
        normalizedUrl,
        name,
        title: keep(meta.title, existing?.title),
        description: keep(meta.description, existing?.description),
        image,
        blurDataUrl: blur,
        icon: keep(meta.icon, existing?.icon),
        siteName: keep(meta.siteName, existing?.siteName),
        themeColor: keep(meta.themeColor, existing?.themeColor),
        finalUrl,
        status: name && (meta.description || meta.image) ? "ok" : "partial",
        fetchedAt: new Date().toISOString(),
        lastError: null,
      });

      refreshed += 1;
      console.log(`  ✓ ${normalizedUrl} — ${name}`);
    } catch (error) {
      const message = errorMessage(error);
      failed += 1;
      console.warn(`  ! ${normalizedUrl} — ${message}`);

      next.push(
        existing
          ? { ...existing, url: seed.url, status: "failed", lastError: message }
          : {
              url: seed.url,
              normalizedUrl,
              name: resourceHost(seed.url),
              title: null,
              description: null,
              image: null,
              blurDataUrl: null,
              icon: null,
              siteName: null,
              themeColor: null,
              finalUrl: seed.url,
              status: "failed",
              fetchedAt: null,
              lastError: message,
            },
      );
    }
  }

  const snapshot: ResourceSnapshot = {
    generatedAt: new Date().toISOString(),
    resources: next.sort((a, b) =>
      a.normalizedUrl.localeCompare(b.normalizedUrl),
    ),
  };

  await mkdir(dirname(snapshotPath), { recursive: true });
  await writeFile(
    snapshotPath,
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf8",
  );

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `[resources] ${refreshed} refreshed, ${cached} cached, ${failed} failed in ${seconds}s → ${snapshotPath}`,
  );
}

await main();
