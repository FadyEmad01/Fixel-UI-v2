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

  // UI Components & Design Systems
  {
    url: "https://tailark.com/",
    categories: ["UI Components", "UI Blocks"],
  },
  {
    url: "https://www.ui-layouts.com/",
    categories: ["UI Components", "UI Blocks", "Animation", "Tools"],
  },
  {
    url: "https://neo-brutalism-ui-library.vercel.app/",
    categories: ["UI Components", "Design Systems"],
  },
  {
    url: "https://vaul.emilkowal.ski/",
    categories: ["UI Components"],
  },
  {
    url: "https://www.jolyui.dev/",
    categories: ["UI Components"],
  },
  {
    url: "https://www.vengenceui.com/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://ui.heygaia.io/",
    categories: ["UI Components", "AI & Agents"],
  },
  {
    url: "https://www.spaceui.one/",
    categories: [
      "UI Components",
      "UI Blocks",
      "Animation",
      "React Hooks & Utilities",
      "Shaders & Effects",
    ],
  },
  {
    url: "https://www.23rd.dev/",
    categories: [
      "UI Components",
      "Animation",
      "Graphics & Rendering",
      "Shaders & Effects",
    ],
  },
  {
    url: "https://www.evilbuttons.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://www.rareui.com/",
    categories: ["UI Components", "Animation"],
  },
  {
    url: "https://www.obsidianui.dev/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },
  {
    url: "https://www.mellowui.com/",
    categories: ["UI Components", "UI Blocks", "Animation"],
  },

  // Design Inspiration
  {
    url: "https://www.navbar.gallery/",
    categories: ["Design Inspiration", "Interaction Design"],
  },
  {
    url: "https://www.footer.design/",
    categories: ["Design Inspiration"],
  },
  {
    url: "https://purelanding.page/",
    categories: ["Design Inspiration"],
  },
  {
    url: "https://mobbin.com/discover/apps/web/latest",
    categories: ["Design Inspiration", "Interaction Design"],
  },
  {
    url: "https://rauno.me/craft",
    categories: ["Design Inspiration", "Interaction Design"],
  },

  // Learning & Documentation
  {
    url: "https://www.fumadocs.dev/",
    categories: ["Documentation", "Developer Tools"],
  },
  {
    url: "https://tympanus.net/codrops/hub/",
    categories: ["Learning", "Design Inspiration", "Animation"],
  },
  {
    url: "https://vercel.com/design/guidelines",
    categories: ["Design Systems", "Learning"],
  },

  // Graphics, Rendering & Shaders
  {
    url: "https://pixijs.com/",
    categories: ["Graphics & Rendering"],
  },
  {
    url: "https://www.shadercn.run/",
    categories: ["UI Components", "Graphics & Rendering", "Shaders & Effects"],
  },
  {
    url: "https://threeui.com/browse",
    categories: [
      "UI Components",
      "UI Blocks",
      "Animation",
      "Graphics & Rendering",
      "Shaders & Effects",
    ],
  },
  {
    url: "https://canvasui.dev/",
    categories: ["UI Components", "Graphics & Rendering", "Shaders & Effects"],
  },

  // Developer Tools & AI
  {
    url: "https://shieldcn.dev/",
    categories: ["Tools", "Developer Tools"],
  },
  {
    url: "https://www.skills.sh/",
    categories: ["Developer Tools", "AI & Agents"],
  },

  // Video & Animation
  {
    url: "https://snapcn.dev/",
    categories: ["Animation", "Video Components"],
  },
];

/**
 * Chip order on `/resources`. Categories missing from this list are appended
 * alphabetically, so adding a new one to a resource above is enough.
 */
export const CATEGORY_ORDER = [
  // Individual reusable components such as buttons, dialogs, inputs, and drawers.
  "UI Components",

  // Pre-built sections and complete layouts such as hero, pricing, and testimonial sections.
  "UI Blocks",

  // Animation libraries, animated components, motion effects, and transitions.
  "Animation",

  // Component libraries and guidelines that provide consistent design principles and visual patterns.
  "Design Systems",

  // Assets and resources used in the visual design process, such as icons, illustrations, and design kits.
  "Design Resources",

  // Websites showcasing existing websites, interfaces, and visual design examples for inspiration.
  "Design Inspiration",

  // Resources focused on user interactions, navigation patterns, micro-interactions, and UX behavior.
  "Interaction Design",

  // General-purpose online tools for creating, testing, or improving web projects.
  "Tools",

  // Tools for drawing, sketching, diagramming, and visual collaboration.
  "Whiteboarding",

  // Tutorials, articles, guides, and educational content for developers and designers.
  "Learning",

  // Tools and frameworks for creating and managing technical documentation.
  "Documentation",

  // Developer-focused tools for building, debugging, and improving development workflows.
  "Developer Tools",

  // Reusable React hooks and utility functions that simplify common development tasks.
  "React Hooks & Utilities",

  // Libraries for creating onboarding flows, guided tours, and interactive product walkthroughs.
  "Product Tours",

  // Authentication solutions for handling user identity, login, registration, and authorization.
  "Authentication",

  // Email services and tools for sending transactional emails and managing email workflows.
  "Email",

  // APIs, SDKs, and developer services that provide integrations and backend functionality.
  "APIs & SDKs",

  // Tools and components for working with audio, voice, speech, and AI-powered audio experiences.
  "Audio & AI",

  // AI platforms, tools, and resources for building or integrating AI agents and AI-powered applications.
  "AI & Agents",

  // Libraries and tools for rendering 2D/3D graphics, scenes, and interactive visual experiences.
  "Graphics & Rendering",

  // Shader effects, GPU-powered visuals, WebGL, and WebGPU-based visual experiments.
  "Shaders & Effects",

  // Components and tools for creating, editing, or displaying video content.
  "Video Components",
];
