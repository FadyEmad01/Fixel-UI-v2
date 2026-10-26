import { installUrl } from "@/features/illustrations/lib/install";
import {
  allIllustrations,
  getIllustration,
} from "@/features/illustrations/lib/items";
import { illustrationMarkdown } from "@/features/illustrations/lib/markdown";
import { getSiteUrl } from "@/lib/site";

/**
 * The page as plain text, for "View as Markdown" and for handing to an
 * assistant. Kept at a static route so it can be fetched without JavaScript.
 */

export function generateStaticParams() {
  return allIllustrations().map((illustration) => ({
    slug: illustration.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const illustration = getIllustration(slug);

  if (!illustration) {
    return new Response("Illustration not found", { status: 404 });
  }

  const markdown = illustrationMarkdown(
    illustration,
    installUrl(getSiteUrl(), illustration.slug),
  );

  return new Response(markdown, {
    headers: {
      // `text/plain` so browsers render it inline instead of downloading.
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
