/**
 * Illustration families, keyed by slug.
 *
 * A family is a browsing label, not a code boundary: it decides which chip an
 * illustration appears under, nothing else. Install targets, file names, and
 * the shared kit stay identical across families.
 *
 * A slug belongs to exactly one family. `scripts/registry/lib/category.test.mts`
 * fails the suite when a visible illustration is missing here, or when a slug
 * here no longer exists, so the chips can never hide an item.
 *
 * Order matters: the chip row renders in first-seen order, so the blocks below
 * read in the order the families should appear.
 */
export const ILLUSTRATION_CATEGORIES: Record<string, string> = {
  // Fields & Forms
  checkbox: "Fields & Forms",
  "checkbox-group": "Fields & Forms",
  field: "Fields & Forms",
  fieldset: "Fields & Forms",
  form: "Fields & Forms",
  input: "Fields & Forms",
  "input-group": "Fields & Forms",
  "input-otp": "Fields & Forms",
  label: "Fields & Forms",
  "number-field": "Fields & Forms",
  "radio-group": "Fields & Forms",
  switch: "Fields & Forms",
  textarea: "Fields & Forms",

  // Selection & Menus
  autocomplete: "Selection & Menus",
  calendar: "Selection & Menus",
  combobox: "Selection & Menus",
  command: "Selection & Menus",
  "date-picker": "Selection & Menus",
  menu: "Selection & Menus",
  select: "Selection & Menus",
  slider: "Selection & Menus",
  toggle: "Selection & Menus",
  "toggle-group": "Selection & Menus",

  // Overlays
  alert: "Overlays",
  "alert-dialog": "Overlays",
  dialog: "Overlays",
  drawer: "Overlays",
  popover: "Overlays",
  "preview-card": "Overlays",
  sheet: "Overlays",
  toast: "Overlays",
  tooltip: "Overlays",

  // Navigation & Structure
  accordion: "Navigation & Structure",
  breadcrumb: "Navigation & Structure",
  collapsible: "Navigation & Structure",
  footer: "Navigation & Structure",
  frame: "Navigation & Structure",
  group: "Navigation & Structure",
  pagination: "Navigation & Structure",
  "scroll-area": "Navigation & Structure",
  separator: "Navigation & Structure",
  tabs: "Navigation & Structure",
  toolbar: "Navigation & Structure",

  // Display & Feedback
  animation: "Display & Feedback",
  avatar: "Display & Feedback",
  badge: "Display & Feedback",
  button: "Display & Feedback",
  card: "Display & Feedback",
  empty: "Display & Feedback",
  kbd: "Display & Feedback",
  meter: "Display & Feedback",
  "on-hover": "Display & Feedback",
  progress: "Display & Feedback",
  skeleton: "Display & Feedback",
  spinner: "Display & Feedback",
  table: "Display & Feedback",

  isometric: "Isometric",
};

/** Distinct categories, in first-seen order. */
export function illustrationCategories(): string[] {
  return [...new Set(Object.values(ILLUSTRATION_CATEGORIES))];
}
