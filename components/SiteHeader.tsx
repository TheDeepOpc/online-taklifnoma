"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_NAV: NavLink[] = [
  { label: "Dizaynlar", href: "#designs" },
  { label: "Qanday ishlaydi", href: "#how" },
  { label: "Narxlar", href: "#pricing" },
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

  return (
    <header className="sticky top-0 z-50 border-b border-[#D69E82]/10 bg-[#FDFBFB]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 120 80" className="h-6 w-9 text-[#B8923F] sm:h-7 sm:w-10" fill="none" aria-hidden>
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
              className="rounded py-1 transition-colors hover:text-[#2E2A27]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {showCta && (
            <Link
              href={ctaHref}
              className="hidden items-center rounded-full bg-[#2E2A27] px-4 py-2 text-xs font-medium text-[#FDFBFB] transition-colors duration-300 hover:bg-[#5F8A82] sm:inline-flex sm:px-5 sm:py-2.5 sm:text-sm"
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

      {menuOpen && (
        <div className="space-y-1 border-t border-[#D69E82]/10 bg-[#FDFBFB] px-5 py-3 text-[#2E2A27]/80 md:hidden sm:px-6">
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
      )}
    </header>
  );
}
