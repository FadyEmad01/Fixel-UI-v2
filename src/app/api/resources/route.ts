import { findResource } from "@/features/resources/lib/resources";

/**
 * Details for one curated resource.
 *
 * Deliberately a lookup, never a scraper: `?url=` is matched against the
 * curated list, so a visitor cannot use this endpoint to make the server fetch
 * an address of their choosing.
 */
export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get("url");

  if (!value) {
    return Response.json({ error: "Missing url parameter." }, { status: 400 });
  }

  const resource = findResource(value);

  if (!resource) {
    return Response.json(
      { error: "That site isn't in the curated resource list." },
      { status: 404 },
    );
  }

  return Response.json(
    { resource },
    {
      headers: {
        "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      },
    },
  );
}
