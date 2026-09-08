"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

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
  ctaLabel = "Templatelar",
  ctaHref = "#designs",
  showCta = true,
  dark = false,
  overlay = false,
}: {
  nav?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
  dark?: boolean;
  /** Hero video ustida to'liq shaffof overlay rejimi: video navbarning
   * orqasidan ham davom etadi, navbar o'z foni yo'qolib videoni ochib beradi. */
  overlay?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fg = dark ? "#F7F2E9" : "#2E2A27";

  const containerOn = scrolled || !overlay;

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4 ${
        overlay ? "fixed inset-x-0 top-0" : "sticky top-0"
      } ${overlay && !scrolled ? "pointer-events-auto" : ""}`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          containerOn
            ? dark
              ? "border-[#D4AF37]/25 bg-[#14100b]/85 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)] backdrop-blur-xl"
              : "border-[#2E2A27]/10 bg-white/90 shadow-[0_18px_50px_-24px_rgba(46,42,39,0.55)] backdrop-blur-xl"
            : "border-transparent bg-transparent shadow-none backdrop-blur-none"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-105 sm:h-10 sm:w-10 ${
              dark
                ? "bg-gradient-to-br from-[#e6c15a] to-[#b8860b] text-[#16110b] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.9)]"
                : "bg-gradient-to-br from-[#c9a227] to-[#8a6c1f] text-[#FDFBFB] shadow-[0_8px_24px_-8px_rgba(184,146,63,0.8)]"
            }`}
          >
            <svg viewBox="0 0 120 80" className="h-5 w-6 fill-none sm:h-6 sm:w-7" aria-hidden>
              <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="9" transform="rotate(-12 42 45)" />
              <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="9" transform="rotate(12 78 45)" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-tight sm:text-xl" style={{ color: fg }}>
              Oila<span style={{ color: "#D4AF37" }}>-</span>Uchun
            </span>
            <span
              className={`mt-0.5 hidden text-[9px] uppercase tracking-[0.32em] sm:block ${
                dark ? "text-[#F7F2E9]/45" : "text-[#2E2A27]/40"
              }`}
            >
              to&apos;y taklifnomalari
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 rounded-full p-1 md:flex">
          {nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative rounded-full px-4 py-2 text-sm transition-colors duration-300 lg:px-5 ${
                dark ? "text-[#F7F2E9]/75 hover:text-[#F7F2E9]" : "text-[#2E2A27]/65 hover:text-[#2E2A27]"
              }`}
            >
              {link.label}
              <span className="absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {showCta && (
            <Link
              href={ctaHref}
              className={`group relative hidden items-center gap-1.5 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:inline-flex ${
                dark
                  ? "bg-gradient-to-r from-[#e6c15a] to-[#d4af37] text-[#16110b] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.8)] hover:shadow-[0_14px_40px_-10px_rgba(212,175,55,1)]"
                  : "bg-[#2E2A27] text-[#FDFBFB] shadow-[0_10px_30px_-12px_rgba(46,42,39,0.7)] hover:shadow-[0_14px_40px_-12px_rgba(46,42,39,0.9)]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {ctaLabel}
            </Link>
          )}
          <button
            type="button"
            aria-label="Menyuni ochish"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors md:hidden ${
              dark ? "border-white/15 text-[#F7F2E9]" : "border-[#2E2A27]/12 text-[#2E2A27]"
            }`}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0, y: -8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border px-3 pb-3 md:hidden"
            style={{
              borderColor: dark ? "rgba(212,175,55,0.25)" : "rgba(46,42,39,0.1)",
              background: dark ? "rgba(20,16,11,0.96)" : "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="space-y-1 pt-1">
              {nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    dark
                      ? "text-[#F7F2E9]/85 hover:bg-white/5 hover:text-[#D4AF37]"
                      : "text-[#2E2A27]/85 hover:bg-[#2E2A27]/5 hover:text-[#9a7b1f]"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {showCta && (
                <Link
                  href={ctaHref}
                  onClick={() => setMenuOpen(false)}
                  className={`mt-2 block w-full rounded-xl px-5 py-3.5 text-center text-sm font-semibold ${
                    dark
                      ? "bg-gradient-to-r from-[#e6c15a] to-[#d4af37] text-[#16110b]"
                      : "bg-[#2E2A27] text-[#FDFBFB]"
                  }`}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}