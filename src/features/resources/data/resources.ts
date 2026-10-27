import type { ResourceSeed } from "../lib/types";

/**
 * The curated resource list — the only file you edit by hand.
 *
 * Add a `url` and its categories, then run `pnpm resources:sync` to fetch the
 * site's name, description, and preview image into
 * `generated/resources.json`. The grid never contacts a third-party site at
 * request time, so an unsynced URL still shows up with its hostname as the
 * title until the next sync.
 *
 * Categories are yours to choose. The first one is the card's primary badge;
 * all of them are filterable via `?tag=`.
 */
export const resources: ResourceSeed[] = [
   // UI Components & Design Systems
  {
    url: "https://ui.shadcn.com/",
    categories: ["UI Components", "Design Systems"],
  },
  {
    url: "https://www.gauge-ui.dev/",
    categories: ["UI Components"],
  },
  {
    url: "https://ui.elevenlabs.io/",
    categories: ["UI Components", "Audio & AI"],
  },
  {
    url: "https://21st.dev/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://magicui.design/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://motion-primitives.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://ui.aceternity.com/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://heroui.com/",
    categories: ["UI Components", "Design Systems"],
  },
  {
    url: "https://www.fancycomponents.dev/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://www.reactbits.dev/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://smoothui.dev/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://blocks.mvp-subha.me/",
    categories: ["UI Blocks", "UI Components", "Animation"],
  },
  {
    url: "https://www.cult-ui.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://skiper-ui.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://www.kibo-ui.com/",
    categories: ["UI Components", "UI Blocks"],
  },
  {
    url: "https://lightswind.com/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://www.shadcnblocks.com/",
    categories: ["UI Blocks", "UI Components"],
  },
  {
    url: "https://reverseui.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://coss.com/origin",
    categories: ["UI Components"],
  },

  // Animation Libraries & Resources
  {
    url: "https://motion.dev/",
    categories: ["Animation"],
  },
  {
    url: "https://gsap.com/",
    categories: ["Animation"],
  },
  {
    url: "https://animejs.com/",
    categories: ["Animation"],
  },
  {
    url: "https://madewithgsap.com/",
    categories: ["Animation", "Learning"],
  },
  {
    url: "https://annnimate.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://www.osmo.supply/",
    categories: ["Design Resources", "Animation"],
  },

  // Learning
  {
    url: "https://blog.olivierlarose.com/",
    categories: ["Learning", "Animation"],
  },

  // Tools & Utilities
  {
    url: "https://excalidraw.com/",
    categories: ["Tools", "Whiteboarding"],
  },
  {
    url: "https://www.reacthaiku.dev/",
    categories: ["React Hooks & Utilities"],
  },
  {
    url: "https://driverjs.com/",
    categories: ["Product Tours", "Tools"],
  },

  // Developer Services & APIs
  {
    url: "https://coss.com/",
    categories: ["APIs & SDKs"],
  },
  {
    url: "https://resend.com/",
    categories: ["Email", "APIs & SDKs"],
  },
  {
    url: "https://better-auth.com/",
    categories: ["Authentication"],
  },
];

/**
 * Chip order on `/resources`. Categories missing from this list are appended
 * alphabetically, so adding a new one to a resource above is enough.
 */
export const CATEGORY_ORDER = [
  "UI Components",
  "UI Blocks",
  "Animation",
  "Design Systems",
  "Design Resources",
  "Tools",
  "Whiteboarding",
  "Learning",
  "React Hooks & Utilities",
  "Product Tours",
  "Authentication",
  "Email",
  "APIs & SDKs",
  "Audio & AI",
];
