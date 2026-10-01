export const DETAIL_SECTION_TYPES = [
  "preview",
  "installation",
  "dependencies",
  "props",
  "api",
  "variants",
  "motion",
  "formula",
  "playground",
  "documentation",
  "source",
] as const;

export type DetailSectionType = (typeof DETAIL_SECTION_TYPES)[number];

export interface DetailSection {
  type: DetailSectionType;
}
