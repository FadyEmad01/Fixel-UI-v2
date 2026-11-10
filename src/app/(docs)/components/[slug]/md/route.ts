import { componentArticle } from "@/features/components/lib/articles";
import { allComponents, getComponent } from "@/features/components/lib/items";
import { renderComponentMarkdown } from "@/features/components/lib/markdown";
import { getSiteUrl } from "@/lib/site";
import { installUrl } from "@/shared/lib/registry/install";

/**
 * The page as plain text, for "View as Markdown" and for handing to an
 * assistant. Kept at a static route so it can be fetched without JavaScript.
 */

const components = allComponents();

export const generateStaticParams =
  components.length > 0
    ? () => components.map((component) => ({ slug: component.slug }))
    : undefined;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) {
    return new Response("Component not found", { status: 404 });
  }

  const markdown = renderComponentMarkdown(
    component,
    installUrl(getSiteUrl(), component.slug),
    componentArticle(component.slug) ?? {
      body: "",
      hasInstall: false,
      hasSource: false,
    },
  );

  return new Response(markdown, {
    headers: {
      // `text/plain` so browsers render it inline instead of downloading.
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
