import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2E2A27]/8 px-4 py-8 text-center sm:py-10">
      <div className="mb-2 flex items-center justify-center gap-2">
        <svg viewBox="0 0 120 80" className="h-5 w-8 text-[#B8923F]" fill="none" aria-hidden>
          <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(-12 42 45)" />
          <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 78 45)" />
        </svg>
        <Link href="/" className="font-display text-sm text-[#2E2A27]">Oila-Uchun</Link>
      </div>
      <p className="text-xs text-[#2E2A27]/45">&copy; 2026 Barcha huquqlar himoyalangan</p>
    </footer>
  );
}
