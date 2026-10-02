import dynamic from "next/dynamic";

export const previewRegistry = {
  "apple-folder": dynamic(
    () =>
      import("../../../registry/ui/apple-folder/preview/apple-folder-preview"),
  ),
} as const;

export type PreviewName = keyof typeof previewRegistry;
