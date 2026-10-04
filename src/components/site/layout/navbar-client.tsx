"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { MenuIconSmall } from "@/components/icons/menuSmall";
import { MenuIconHandle } from "@/components/icons/menu";
import { Search } from "lucide-react";

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
const navLinks = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/#project" },
  { title: "Showcase", href: "/showcase" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];
type NavbarClientProps = { githubStars: ReactNode };
export default function NavbarClient({ githubStars }: NavbarClientProps) {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const menuRef = useRef<MenuIconHandle>(null);
  const pathname = usePathname();
  const lenis = useLenis();
  const handleHashClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) {
      setIsActive(false);
      return;
    }
    const hash = href.substring(hashIndex);
    if (pathname === "/") {
      e.preventDefault();
      const element = document.querySelector(hash) as HTMLElement | null;
      if (element && lenis) {
        setIsActive(false);
        requestAnimationFrame(() => {
          lenis.scrollTo(element, { offset: 0 });
          history.replaceState(null, "", hash);
        });
      }
    } else {
      setIsActive(false);
    }
  };
  useEffect(() => {
    const scrolled = window.scrollY > 120;
    setIsScrolled(scrolled);
    setHasMounted(true);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 120;
      setIsScrolled((current) => (current === scrolled ? current : scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (isActive) {
      menuRef.current?.startAnimation();
      document.body.style.overflow = "hidden";
    } else {
      menuRef.current?.stopAnimation();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);
  return (
    <div className="fixed top-6 left-1/2 z-50 w-auto -translate-x-1/2 flex flex-row items-center gap-2">
      {/* NAVBAR */}
      <motion.div
        variants={navbarVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
        className="relative z-20 flex h-[40px] max-w-[calc(100vw-40px)] items-center rounded-lg bg-neutral-200/70 py-1.5 pl-3 pr-2 text-sm font-medium text-black backdrop-blur-[20px] will-change-[width] dark:bg-white/15 dark:text-white [--navbar-closed-width:300px] sm:[--navbar-closed-width:360px]"
      >
        {/* LEFT — MENU */}
        <button
          type="button"
          onClick={() => {
            setIsActive((prev) => !prev);
          }}
          className="flex w-auto items-center justify-start gap-x-1 pr-1.5 outline-none transition-opacity hover:opacity-70"
          aria-label={isActive ? "Close menu" : "Open menu"}
          aria-expanded={isActive}
        >
          <MenuIconSmall ref={menuRef} />
          <span className="whitespace-nowrap font-archivo text-lg">
            {isActive ? "Close" : "Menu"}
          </span>
        </button>
        {/* CENTER — LOGO */}
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
                Fixel UI
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
                <Image
                  src="/logo.svg"
                  alt="Fixel UI"
                  fill
                  priority
                  sizes="24px"
                  className="object-contain invert dark:invert-0"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* RIGHT — GITHUB */}
        <div className="ml-auto flex items-center"> {githubStars} </div>
      </motion.div>
      {/* SEARCH */}
      {/* <div className="hidden lg:flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-neutral-200/70 text-black backdrop-blur-[20px] dark:bg-white/15 dark:text-white">
        <Search className="size-4 text-black dark:text-white" />
      </div> */}
      {/* MENU PANEL */}
      <motion.div
        variants={panelVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
        className="absolute top-[48px] left-0 z-10 h-[calc(100svh-88px)] w-full overflow-hidden rounded-lg bg-neutral-200/70 text-black backdrop-blur-[20px] dark:bg-white/15 dark:text-white"
        style={{ willChange: "clip-path", contain: "paint" }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pt-10 pb-4 sm:px-6 sm:pt-14 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* NAVIGATION */}
          <motion.nav
            variants={linksContainerVariants}
            animate={isActive ? "open" : "closed"}
            initial="closed"
            className="flex flex-col gap-3 sm:gap-4"
          >
            {navLinks.map((link) => (
              <motion.div key={link.title} variants={linkVariants}>
                <Link
                  href={link.href}
                  onClick={(e) => handleHashClick(e, link.href)}
                  className="block font-archivo text-[clamp(2.5rem,8vh,5.5rem)] font-normal leading-[0.9] tracking-tighter text-black transition-colors duration-300 hover:text-black/50 dark:text-white dark:hover:text-white/15"
                >
                  {link.title}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
          {/* FOOTER */}
          <motion.div
            variants={linkVariants}
            animate={isActive ? "open" : "closed"}
            initial="closed"
            className="mt-auto flex shrink-0 flex-wrap items-end justify-between gap-4 border-t border-black/10 pt-4 dark:border-white/15"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50">
                Get in touch
              </span>
              <a
                href="mailto:fadyemad933@gmail.com"
                className="text-[13px] transition-colors hover:text-black/50 dark:hover:text-white/50 sm:text-sm"
              >
                fadyemad933@gmail.com
              </a>
            </div>
            <div className="flex gap-4 text-[13px] sm:text-sm">
              <a
                href="https://www.linkedin.com/in/fady-emad-sabry"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black/50 dark:hover:text-white/50"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/FadyEmad01"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black/50 dark:hover:text-white/50"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
