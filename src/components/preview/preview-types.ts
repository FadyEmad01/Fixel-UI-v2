export const PREVIEW_VIEWPORTS = ["mobile", "tablet", "desktop"] as const;

export type PreviewViewport = (typeof PREVIEW_VIEWPORTS)[number];
