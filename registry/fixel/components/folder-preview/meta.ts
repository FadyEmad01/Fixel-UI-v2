/**
 * Registry-only metadata for one catalog item.
 *
 * This file is never installed: the generator reads it and leaves it behind.
 * Title and description live in the article frontmatter; everything else it
 * does not set is inferred from the file name.
 */
export default {
  category: "UI",
  tags: ["folder", "preview", "hover", "motion"],
  author: {
    name: "Fady Emad",
    url: "https://github.com/FadyEmad01",
  },
  media: {
    poster: "/components/folder-preview/preview.webp",
    video: "/components/folder-preview/preview.mp4",
  },
  /** Which file under `examples/` the docs and the live preview use. */
  example: "basic",
};
