import { renderSiteOgImage } from "@/features/illustrations/lib/og-image";

export const alt =
  "Fixel UI — installable wireframe React illustrations and useful interface resources.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderSiteOgImage();
}
