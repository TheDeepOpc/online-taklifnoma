"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBFB] px-6 text-center font-sans">
      <svg viewBox="0 0 120 80" className="mb-6 h-10 w-16 text-[#B8923F]" fill="none" aria-hidden>
        <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(-12 42 45)" />
        <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 78 45)" />
      </svg>
      <h1 className="font-display text-2xl text-[#2E2A27] sm:text-3xl">Nimadir xato ketdi</h1>
      <p className="mt-3 max-w-md text-sm text-[#2E2A27]/55 sm:text-base">
        Sahifani yuklashda kutilmagan xatolik yuz berdi. Qaytadan urinib ko&apos;ring.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-[#2E2A27] px-6 py-3 text-sm font-medium text-[#FDFBFB] transition-colors duration-300 hover:bg-[#5F8A82]"
        >
          Qaytadan urinish
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/20 px-6 py-3 text-sm font-medium text-[#2E2A27] transition-colors duration-300 hover:border-[#2E2A27]/40 hover:bg-[#2E2A27]/5"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
