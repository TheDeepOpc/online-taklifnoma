"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_NAV: NavLink[] = [
  { label: "Dizaynlar", href: "#designs" },
  { label: "Qanday ishlaydi", href: "#how" },
  { label: "Narxlar", href: "#pricing" },
  { label: "Bog'lanish", href: "#contact" },
];

export function SiteHeader({
  nav = DEFAULT_NAV,
  ctaLabel = "Shablonlarni ko'rish",
  ctaHref = "/templates",
  showCta = true,
}: {
  nav?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-[#2E2A27]/10 bg-[#FDFBFB]/85 shadow-[0_8px_30px_-20px_rgba(46,42,39,0.5)] backdrop-blur-xl"
          : "border-transparent bg-[#FDFBFB]/60 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-500 sm:px-6 lg:px-8 ${
          scrolled ? "h-13 sm:h-14" : "h-14 sm:h-[4.5rem]"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2">
          <svg
            viewBox="0 0 120 80"
            className="h-6 w-9 text-[#B8923F] transition-transform duration-500 group-hover:rotate-[8deg] sm:h-7 sm:w-10"
            fill="none"
            aria-hidden
          >
            <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(-12 42 45)" />
            <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 78 45)" />
          </svg>
          <span className="font-display text-lg tracking-tight text-[#2E2A27] sm:text-xl">
            Oila<span className="text-[#BD7E5F]">-</span>Uchun
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#2E2A27]/60 md:flex lg:gap-8">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 transition-colors hover:text-[#2E2A27]"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#BD7E5F] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {showCta && (
            <Link
              href={ctaHref}
              className="hidden items-center rounded-full bg-[#2E2A27] px-4 py-2 text-xs font-medium text-[#FDFBFB] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5F8A82] sm:inline-flex sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {ctaLabel}
            </Link>
          )}
          <button
            type="button"
            aria-label="Menyuni ochish"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 text-[#2E2A27] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#D69E82]/10 bg-[#FDFBFB] md:hidden"
          >
            <div className="space-y-1 px-5 py-3 text-[#2E2A27]/80 sm:px-6">
              {nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[#2E2A27]/5"
                >
                  {link.label}
                </a>
              ))}
              {showCta && (
                <Link
                  href={ctaHref}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 block w-full rounded-full bg-[#2E2A27] px-5 py-3 text-center text-sm font-medium text-[#FDFBFB]"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
