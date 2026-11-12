"use client";

import { Search, SearchX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { MenuIconHandle } from "@/components/icons/menu";
// import { useLenis } from "lenis/react";
import { MenuIconSmall } from "@/components/icons/menuSmall";
import type { SearchItem } from "@/components/site/search/types";
import { ThemeSwitcher } from "@/components/theme/theme-toggle";
import { replaceUrl } from "@/shared/lib/history-url";

/**
 * The search body is a separate chunk: it renders the generated illustration
 * barrel (59 live previews) and has no business in every page's bundle. It is
 * prefetched on hover/focus of the toggle, and mounted on first open.
 */
const SearchPanel = dynamic(() => import("@/components/site/search/search-panel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-archivo text-sm text-black/40 dark:text-white/40">
      Preparing search…
    </div>
  ),
});

function prefetchSearchPanel() {
  void import("@/components/site/search/search-panel");
}

/* ==========================================================================
   Contents
   1. Types & config      — edit links / contact / mock data here
   2. Motion variants     — edit animation timing here
   3. Hooks               — animation lock, scroll state, panel lifecycle
   4. Building blocks     — buttons, logo, cards, footer (dumb UI)
   5. Panel units         — menu unit + search unit (content + footer)
   6. NavbarClient        — composition root (state + handlers + layout)
   ========================================================================== */

/* ──────────────────────────────────────────────────────────────────────────
   1. Types & config
   ────────────────────────────────────────────────────────────────────────── */

type PanelKind = "menu" | "search" | null;

type NavbarClientProps = {
  githubStars: ReactNode;
  /** Server-built, serializable catalog index for the search panel. */
  searchItems: SearchItem[];
};

type NavLink = { title: string; href: string };

/**
 * Query keys that open a catalog's detail sheet (`/resources?url=`,
 * `/illustration?slug=`, `/easing?slug=`).
 *
 * A sheet is a modal dialog: its focus trap would keep ⌘K from ever reaching
 * the search input, so opening search dismisses whatever sheet is behind it.
 * Only these keys are dropped, so a `?tag=` filter survives.
 */
const SHEET_PARAMS = ["url", "slug"] as const;

type NavigateHandler = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) => void;

const NAV_LINKS: NavLink[] = [
  { title: "Home", href: "/" },
  { title: "Resources", href: "/resources" },
  { title: "Illustration", href: "/illustration" },
  { title: "Easing", href: "/easing" },
];

const CONTACT = {
  email: "fadyemad933@gmail.com",
  linkedin: "https://www.linkedin.com/in/fady-emad-sabry",
  github: "https://github.com/FadyEmad01",
};

/* ──────────────────────────────────────────────────────────────────────────
   2. Motion variants
   ────────────────────────────────────────────────────────────────────────── */

const ease = [0.76, 0, 0.24, 1] as const;

const navbarVariants = {
  closed: {
    width: "var(--navbar-closed-width)",
    transition: { duration: 0.7, delay: 0.65, ease },
  },
  open: {
    width: "min(980px, calc(100vw - 40px))",
    transition: { duration: 0.7, ease },
  },
};
const panelVariants = {
  closed: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.55, ease },
  },
  open: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.65, delay: 0.7, ease },
  },
};
const linksContainerVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: { delayChildren: 0.95, staggerChildren: 0.06 },
  },
};
const linkVariants = {
  closed: { opacity: 0, y: 20, transition: { duration: 0.2, ease } },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.4, 0.1, 1] as const },
  },
};
const logoAnimation = {
  initial: { opacity: 0, y: 4, scale: 0.96, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -4, scale: 0.96, filter: "blur(4px)" },
  transition: { duration: 0.3, ease: [0.25, 0.4, 0.1, 1] as const },
};

/* ──────────────────────────────────────────────────────────────────────────
   3. Hooks
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Locks interaction while navbar/panel animations run.
 * Driven by Motion's own onAnimationStart/Complete (wired on the motion.divs).
 * A counter keeps the lock until the LAST animation ends, so overlapping
 * close+open during a switch stays locked. No timers, no durations.
 */
function useAnimationLock() {
  const [isAnimating, setIsAnimating] = useState(false);
  const animCount = useRef(0);

  const handleAnimStart = () => {
    animCount.current += 1;
    setIsAnimating(true);
  };

  const handleAnimComplete = () => {
    animCount.current -= 1;
    if (animCount.current <= 0) {
      animCount.current = 0;
      setIsAnimating(false);
    }
  };

  // Sync lock to cover the gap before Motion fires onAnimationStart.
  const lock = useCallback(() => setIsAnimating(true), []);

  return { isAnimating, lock, handleAnimStart, handleAnimComplete };
}

/** Tracks page scroll for the text-logo → image-logo swap. */
function useScrolledNavbar(threshold = 120) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsScrolled(window.scrollY > threshold);
    setHasMounted(true);
  }, [threshold]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      setIsScrolled((current) => (current === scrolled ? current : scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return { isScrolled, hasMounted };
}

/**
 * Side effects for panel open/close: menu-icon animation, body scroll lock,
 * and a delayed onClose callback. onClose may be passed inline — it's kept
 * in a ref so it never retriggers the effect.
 */
function usePanelLifecycle(
  activePanel: PanelKind,
  menuRef: RefObject<MenuIconHandle | null>,
  onClose?: () => void,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (activePanel !== null) {
      menuRef.current?.startAnimation();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    menuRef.current?.stopAnimation();
    document.body.style.overflow = "";
    const t = setTimeout(() => onCloseRef.current?.(), 500);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [activePanel, menuRef]);
}

/* ──────────────────────────────────────────────────────────────────────────
   4. Building blocks
   ────────────────────────────────────────────────────────────────────────── */

type MenuToggleButtonProps = {
  isOpen: boolean;
  disabled: boolean;
  onClick: () => void;
  menuRef: RefObject<MenuIconHandle | null>;
};

function MenuToggleButton({
  isOpen,
  disabled,
  onClick,
  menuRef,
}: MenuToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-auto items-center justify-start gap-x-1 pr-1.5 outline-none transition-opacity hover:opacity-70 disabled:cursor-wait disabled:hover:opacity-100"
      aria-label={isOpen ? "Close panel" : "Open menu"}
      aria-expanded={isOpen}
    >
      <MenuIconSmall ref={menuRef} />
      <span className="whitespace-nowrap font-archivo text-lg">
        {isOpen ? "Close" : "Menu"}
      </span>
    </button>
  );
}

type NavbarLogoProps = { isScrolled: boolean; hasMounted: boolean };

function NavbarLogo({ isScrolled, hasMounted }: NavbarLogoProps) {
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {!isScrolled ? (

          <motion.span
            key="text-logo"
            initial={hasMounted ? logoAnimation.initial : false}
            animate={logoAnimation.animate}
            exit={logoAnimation.exit}
            transition={logoAnimation.transition}
            className="block whitespace-nowrap font-archivo text-[18px] font-medium tracking-[-0.03em]"
          >
            <Link href="/" aria-label="Fixel UI home page" className="pointer-events-auto">
              Fixel UI
            </Link>
          </motion.span>
        ) : (

          <motion.div
            key="image-logo"
            initial={hasMounted ? logoAnimation.initial : false}
            animate={logoAnimation.animate}
            exit={logoAnimation.exit}
            transition={logoAnimation.transition}
            className="relative size-6"
          >
            <Link href="/" aria-label="Fixel UI home page" className="pointer-events-auto">
              <Image
                src="/logo.svg"
                alt="Fixel UI"
                fill
                priority
                sizes="24px"
                className="object-contain invert dark:invert-0"
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type SearchToggleButtonProps = {
  isSearchOpen: boolean;
  disabled: boolean;
  onClick: () => void;
  /** Warm the panel chunk before the first open. */
  onPrefetch: () => void;
};

function SearchToggleButton({
  isSearchOpen,
  disabled,
  onClick,
  onPrefetch,
}: SearchToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      title="Search — ⌘K / Ctrl K"
      aria-keyshortcuts="Meta+K Control+K"
      className="hidden lg:flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-my-primary/70 text-black backdrop-blur-[20px] transition-opacity hover:opacity-70 disabled:cursor-wait disabled:hover:opacity-100 dark:bg-muted/80 dark:text-white"
      aria-label="Toggle Search"
    >
      {isSearchOpen ? (
        <SearchX className="size-4 text-black dark:text-white" />
      ) : (
        <Search className="size-4 text-black dark:text-white" />
      )}
    </button>
  );
}

/** Theme switch mockup (visual only — wire up a real toggle later). */
function ThemeToggleFooter() {
  return (
    <div className="flex items-center ">
      <ThemeSwitcher />
    </div>
  );
}

type PanelCardProps = {
  scrollable?: boolean;
  children: ReactNode;
};

/**
 * Content card filling the top slot of a panel unit.
 *
 * NOTE: this card intentionally has NO `backdrop-filter`. The glass lives on
 * PanelShell — the same element that owns the animated clip-path reveal.
 * An ancestor with `clip-path` forms a "backdrop root" (Filter Effects L2),
 * which caps any descendant's backdrop-filter at content painted inside that
 * root (i.e. nothing), silently killing the blur. An element's OWN clip-path
 * only clips its own rendered output, so keeping clip-path + backdrop-filter
 * on the same element preserves both the unified reveal and a working blur.
 * This card only contributes its tint over the shell's blurred glass.
 */
function PanelCard({ scrollable = false, children }: PanelCardProps) {
  return (
    <div className="min-h-0 flex-1">
      <div
        className={`flex h-full min-h-0 flex-col rounded-lg bg-my-primary/70 px-4 pt-10 pb-4 text-black sm:px-6 sm:pt-14 dark:bg-muted/80 dark:text-white ${scrollable
          ? "overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          : ""
          }`}
      >
        {children}
      </div>
    </div>
  );
}

type MenuLinksProps = {
  isOpen: boolean;
  onNavigate: NavigateHandler;
};

function MenuLinks({ isOpen, onNavigate }: MenuLinksProps) {
  return (
    <motion.nav
      variants={linksContainerVariants}
      animate={isOpen ? "open" : "closed"}
      initial="closed"
      className="flex flex-col gap-3 sm:gap-4"
    >
      {NAV_LINKS.map((link) => (
        <motion.div key={link.title} variants={linkVariants}>
          <Link
            href={link.href}
            onClick={(e) => onNavigate(e, link.href)}
            className="block font-archivo text-[clamp(2.5rem,8vh,5.5rem)] font-normal leading-[0.9] tracking-tighter text-black transition-colors duration-300 hover:text-black/50 dark:text-white dark:hover:text-white/15"
          >
            {link.title}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}

/**
 * Shared footer card — rendered inside BOTH units. Contact info comes from CONTACT.
 *
 * NOTE: like PanelCard, this is a tint layer only — the backdrop blur is owned
 * by PanelShell (see the note on PanelCard for why the glass must not live on
 * a descendant of the clip-path element).
 */
function PanelFooter() {
  return (
    <div className="shrink-0 rounded-lg bg-my-primary/70 text-black dark:bg-muted/80 dark:text-white">
      <div className="flex h-full flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-end gap-6 sm:gap-12">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
              Get in touch
            </span>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-[13px] transition-colors hover:text-black/50 dark:hover:text-white/50 sm:text-sm"
            >
              {CONTACT.email}
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <span className="hidden sm:block text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
              Socials
            </span>
            <div className="flex gap-4 text-[13px] sm:text-sm">
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black/50 dark:hover:text-white/50"
              >
                LinkedIn
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black/50 dark:hover:text-white/50"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <ThemeToggleFooter />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   5. Panel units
   ────────────────────────────────────────────────────────────────────────── */

type UnitShellProps = {
  isOpen: boolean;
  disabled: boolean;
  onAnimStart: () => void;
  onAnimComplete: () => void;
};

/**
 * Absolutely-positioned unit wrapper. Owns BOTH the clipPath open/close
 * animation AND the glass surface (backdrop-filter) for the entire panel.
 *
 * Why the glass lives here and not on PanelCard/PanelFooter:
 * an element with `clip-path` forms a "backdrop root" (Filter Effects L2).
 * A descendant's backdrop-filter can only sample content painted below it
 * INSIDE the nearest ancestor backdrop root — and this shell paints no
 * background, so that sample is empty and the blur silently dies.
 * An element's OWN clip-path, however, does not restrict what its own
 * backdrop-filter samples; it only clips the element's final rendered
 * output (backdrop-filter included). Keeping clip-path + backdrop-filter on
 * the same element therefore preserves both the single unified reveal
 * animation and a blur that samples the actual page behind the panel.
 *
 * `disabled` (while animating) strips pointer events so nothing inside can
 * interrupt the animation mid-flight.
 */
function PanelShell({
  isOpen,
  disabled,
  onAnimStart,
  onAnimComplete,
  children,
}: UnitShellProps & { children: ReactNode }) {
  return (
    <motion.div
      variants={panelVariants}
      animate={isOpen ? "open" : "closed"}
      initial="closed"
      onAnimationStart={onAnimStart}
      onAnimationComplete={onAnimComplete}
      className={`absolute top-[48px] left-0 z-10 flex h-[calc(100svh-80px)] w-full flex-col gap-2 backdrop-blur-[20px] rounded-lg ${isOpen && !disabled ? "" : "pointer-events-none"
        }`}
      aria-hidden={!isOpen}
    >
      {children}
    </motion.div>
  );
}

type MenuUnitProps = UnitShellProps & { onNavigate: NavigateHandler };

function MenuUnit({
  isOpen,
  disabled,
  onAnimStart,
  onAnimComplete,
  onNavigate,
}: MenuUnitProps) {
  return (
    <PanelShell
      isOpen={isOpen}
      disabled={disabled}
      onAnimStart={onAnimStart}
      onAnimComplete={onAnimComplete}
    >
      <PanelCard scrollable>
        <MenuLinks isOpen={isOpen} onNavigate={onNavigate} />
      </PanelCard>
      <PanelFooter />
    </PanelShell>
  );
}

type SearchUnitProps = UnitShellProps & {
  items: SearchItem[];
  onClose: () => void;
};

function SearchUnit({
  isOpen,
  disabled,
  onAnimStart,
  onAnimComplete,
  items,
  onClose,
}: SearchUnitProps) {
  // The panel chunk is only fetched once someone actually searches. After the
  // first open it stays mounted so reopening is instant (and keeps the scope).
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  return (
    <PanelShell
      isOpen={isOpen}
      disabled={disabled}
      onAnimStart={onAnimStart}
      onAnimComplete={onAnimComplete}
    >
      <PanelCard>
        {hasOpened ? (
          <SearchPanel items={items} isOpen={isOpen} onClose={onClose} />
        ) : null}
      </PanelCard>
      <PanelFooter />
    </PanelShell>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   6. NavbarClient (composition root)
   ────────────────────────────────────────────────────────────────────────── */

export default function NavbarClient({
  githubStars,
  searchItems,
}: NavbarClientProps) {
  const [activePanel, setActivePanel] = useState<PanelKind>(null);
  const menuRef = useRef<MenuIconHandle>(null);
  const pathname = usePathname();
  // const lenis = useLenis();

  const { isAnimating, lock, handleAnimStart, handleAnimComplete } =
    useAnimationLock();
  const { isScrolled, hasMounted } = useScrolledNavbar();
  usePanelLifecycle(activePanel, menuRef);

  const isMenuOpen = activePanel === "menu";
  const isSearchOpen = activePanel === "search";
  const isAnyPanelOpen = activePanel !== null;

  const closePanel = useCallback(() => {
    lock();
    setActivePanel(null);
  }, [lock]);

  /**
   * Close any open catalog sheet before the search panel takes over.
   *
   * Reads `window.location` at call time instead of `useSearchParams` so the
   * navbar (which lives in the root layout) does not need a Suspense boundary
   * just to watch a query string it only cares about on a click.
   *
   * Rewrites the entry with the History API rather than `router.replace`: the
   * sheet is client state, and a server navigation here would re-render the
   * catalog behind a panel that is about to cover it. `replaceUrl` notifies the
   * sheet owner, which is how it learns to close.
   */
  const releaseOpenSheet = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    let changed = false;

    for (const key of SHEET_PARAMS) {
      if (params.has(key)) {
        params.delete(key);
        changed = true;
      }
    }

    if (!changed) return;

    const query = params.toString();
    replaceUrl(query ? `${pathname}?${query}` : pathname);
  }, [pathname]);

  // ⌘K / Ctrl K from anywhere, and Esc for whichever panel is open. Both live
  // here (not in the panel) so they work while focus sits outside the input,
  // including before the search chunk has loaded.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        if (isAnimating) return;
        if (activePanel === "search") {
          lock();
          setActivePanel(null);
          return;
        }
        releaseOpenSheet();
        lock();
        setActivePanel("search");
        return;
      }

      if (event.key === "Escape" && activePanel !== null && !isAnimating) {
        closePanel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activePanel,
    closePanel,
    isAnimating,
    lock,
    releaseOpenSheet,
  ]);

  const handleMenuClick = () => {
    if (isAnimating) return;
    lock(); // sync lock, Motion callbacks will release it
    setActivePanel((prev) => (prev !== null ? null : "menu"));
  };

  const handleSearchClick = () => {
    if (isAnimating) return;
    if (!isSearchOpen) releaseOpenSheet();
    lock();
    setActivePanel((prev) => (prev === "search" ? null : "search"));
  };

  const handleHashClick: NavigateHandler = (e, href) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) {
      lock();
      setActivePanel(null);
      return;
    }
    const hash = href.substring(hashIndex);
    if (pathname === "/") {
      e.preventDefault();
      const element = document.querySelector(hash) as HTMLElement | null;
      if (element) {
        lock();
        setActivePanel(null);
        requestAnimationFrame(() => {
          history.replaceState(null, "", hash);
        });
      }
    } else {
      lock();
      setActivePanel(null);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 w-auto -translate-x-1/2 flex flex-row items-center gap-2">
      {/* NAVBAR */}
      <motion.div
        variants={navbarVariants}
        animate={isAnyPanelOpen ? "open" : "closed"}
        initial="closed"
        onAnimationStart={handleAnimStart}
        onAnimationComplete={handleAnimComplete}
        className="relative z-20 flex h-[40px] max-w-[calc(100vw-40px)] items-center rounded-lg bg-my-primary/70 py-1.5 pl-3 pr-3 text-sm font-medium text-black backdrop-blur-[20px] will-change-[width] dark:bg-muted/80 dark:text-white [--navbar-closed-width:300px] sm:[--navbar-closed-width:360px]"
      >
        <MenuToggleButton
          isOpen={isAnyPanelOpen}
          disabled={isAnimating}
          onClick={handleMenuClick}
          menuRef={menuRef}
        />
        <NavbarLogo isScrolled={isScrolled} hasMounted={hasMounted} />
        <div className="ml-auto flex items-center">{githubStars}</div>
      </motion.div>

      {/* SEARCH TOGGLE */}
      <SearchToggleButton
        isSearchOpen={isSearchOpen}
        disabled={isAnimating}
        onClick={handleSearchClick}
        onPrefetch={prefetchSearchPanel}
      />

      {/* MENU UNIT */}
      <MenuUnit
        isOpen={isMenuOpen}
        disabled={isAnimating}
        onAnimStart={handleAnimStart}
        onAnimComplete={handleAnimComplete}
        onNavigate={handleHashClick}
      />

      {/* SEARCH UNIT */}
      <SearchUnit
        isOpen={isSearchOpen}
        disabled={isAnimating}
        onAnimStart={handleAnimStart}
        onAnimComplete={handleAnimComplete}
        items={searchItems}
        onClose={closePanel}
      />
    </div>
  );
}
