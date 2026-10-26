import { renderIllustrationOgImage } from "@/features/illustrations/lib/og-image";

export const alt = "A Fixel UI React illustration ready to install.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderIllustrationOgImage(slug);
}
