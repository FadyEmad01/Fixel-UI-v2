import { getPlaiceholder } from "plaiceholder";

/**
 * A Plaiceholder LQIP for a curated site's preview image.
 *
 * The image URL is only known once the page has been read, so the blur is built
 * here — while syncing, where the bytes are already vetted — and stored in
 * `generated/resources.json`. The app never downloads an image to blur it.
 *
 * Returns a `data:` URL usable as a CSS background. Throws when the bytes are
 * not a decodable image; callers are expected to keep the resource and drop
 * the blur rather than fail the sync.
 */

/** Downscale target in pixels. 10 keeps card-level shapes at roughly 0.5 kB. */
const BLUR_SIZE = 10;

export async function blurDataUrl(image: Buffer): Promise<string> {
  const { base64 } = await getPlaiceholder(image, {
    size: BLUR_SIZE,
    format: ["png"],
  });

  return base64;
}
