/**
 * Registry-only metadata for one catalog item.
 *
 * This file is never installed: the generator reads it and leaves it behind.
 * Everything it does not set is inferred from the file name.
 */
export default {
  title: "Folder Preview",
  description: "A folder tile that lifts its cover to reveal the image inside.",
  category: "UI",
  tags: ["folder", "preview", "hover", "motion"],
  media: {
    poster: "/components/folder-preview/preview.webp",
    video: "/components/folder-preview/preview.mp4",
  },
  /** Which file under `examples/` the docs and the live preview use. */
  example: "basic",
};
