"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const GITHUB_URL = "https://github.com/FadyEmad01/Fixel-UI-v2";

const NAVIGATION = [
  { label: "Components", href: "/components" },
  { label: "Illustrations", href: "/illustration" },
  { label: "Easing", href: "/easing" },
  { label: "Resources", href: "/resources" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/fady-emad-sabry",
  },
  { label: "GitHub", href: "https://github.com/FadyEmad01" },
] as const;

const CONTACT_EMAIL = "fadyemad933@gmail.com";

const FOOTER_GUTTER = "px-6 sm:px-10 lg:px-12";
const FOOTER_SURFACE = "rounded-lg bg-[#202020] text-white";

/* -------------------------------------------------------------------------- */
/* Shared components                                                          */
/* -------------------------------------------------------------------------- */

type FooterLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  arrow?: boolean;
  className?: string;
};

function FooterLink({
  href,
  children,
  external = false,
  arrow = true,
  className = "",
}: FooterLinkProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex w-fit items-center gap-1 text-sm text-white/65 transition-colors duration-200 hover:text-white ${className}`}
    >
      {children}

      {arrow && (
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </Link>
  );
}

function FooterNavigation() {
  return (
    <nav
      aria-label="Footer navigation"
      className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:justify-end sm:gap-x-7"
    >
      {NAVIGATION.map((item) => (
        <FooterLink key={item.href} href={item.href}>
          {item.label}
        </FooterLink>
      ))}

      <FooterLink href={GITHUB_URL} external>
        GitHub
      </FooterLink>
    </nav>
  );
}

function FooterSectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
      {children}
    </span>
  );
}

function FooterInfoGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-2">
      <FooterSectionLabel>{label}</FooterSectionLabel>

      <div className="flex min-h-5 flex-wrap items-center gap-x-5 gap-y-2">
        {children}
      </div>
    </div>
  );
}

function FooterContactBar() {
  return (
    <section
      aria-label="Contact information"
      className={`${FOOTER_SURFACE} grid grid-cols-1 gap-7 ${FOOTER_GUTTER} py-6 sm:grid-cols-2 sm:gap-8 sm:py-7`}
    >
      <FooterInfoGroup label="Get in touch">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
        >
          {CONTACT_EMAIL}
        </a>
      </FooterInfoGroup>

      <FooterInfoGroup label="Socials">
        {SOCIAL_LINKS.map((item) => (
          <FooterLink
            key={item.href}
            href={item.href}
            external
            arrow={false}
          >
            {item.label}
          </FooterLink>
        ))}
      </FooterInfoGroup>
    </section>
  );
}

function FooterBrandMark() {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -bottom-2 z-0 overflow-hidden ${FOOTER_GUTTER}`}
    >
      <div className="flex w-full items-end justify-between whitespace-nowrap font-archivo text-[clamp(5rem,35vw,14rem)] font-semibold leading-[0.76] tracking-[-0.085em] text-white/[0.045] sm:text-[clamp(7rem,26vw,24rem)]">
        <span className="-ml-[0.075em] inline-block">Fixel</span>

        <span className="hidden sm:inline-block">
          UI
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-3 pb-6 sm:px-4 md:px-6">
      <section
        aria-label="Fixel UI footer"
        className={`${FOOTER_SURFACE} relative isolate flex min-h-[400px] flex-col overflow-hidden sm:min-h-[430px] lg:min-h-[460px]`}
      >
        <div
          className={`relative z-10 flex flex-1 flex-col pb-[clamp(7rem,15vw,12rem)] pt-9 sm:pt-11 lg:pt-12 ${FOOTER_GUTTER}`}
        >
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
            <div className="flex flex-col items-start">
              <h2 className="font-archivo text-3xl font-normal tracking-[-0.045em] sm:text-4xl">
                Contacts
              </h2>

              <FooterLink
                href={GITHUB_URL}
                external
                className="mt-5 border-b border-white/20 pb-1 text-white/75 hover:border-white/60"
              >
                GitHub Repository
              </FooterLink>
            </div>

            <div className="flex flex-col items-start gap-8 sm:items-end justify-between">
              <p className="text-xs tabular-nums text-white/35">
                © {currentYear ?? ""} Fixel UI
              </p>

              <FooterNavigation />
            </div>
          </div>
        </div>

        <FooterBrandMark />
      </section>

      <FooterContactBar />
    </footer>
  );
}
