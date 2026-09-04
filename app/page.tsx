"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Menu, X, Clock, Wallet, Globe, Camera } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { THEME_PRESETS, getUnlockedThemes, getTheme } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";

const HERO_THEME_ID = "vine-navy";

const FEATURED_THEME_IDS = [
  "gold-classic",
  "burgundy-envelope",
  "desert-ornament",
  "swan-noir-classic",
  "royal-champagne",
  "vine-navy",
];

const PRICE_TIERS: PriceTier[] = ["150000", "200000", "250000"];

const TRUST_POINTS = [
  {
    icon: Clock,
    title: "15 daqiqada tayyor",
    body: "Ma'lumotlaringizni yuboring — taklifnomangiz atigi 15 daqiqada tayyor bo'ladi.",
  },
  {
    icon: Wallet,
    title: "150 000 — 250 000 so'm",
    body: "Byudjetingizga mos darajani tanlang, bir martalik to'lov, yashirin qo'shimcha haq yo'q.",
  },
  {
    icon: Globe,
    title: "oila-uchun.uz domenida doimiy",
    body: "Taklifnomangiz doimiy ishlaydigan havolada saqlanadi — hech qachon o'chib qolmaydi.",
  },
  {
    icon: Camera,
    title: "O'z rasmlaringiz bilan",
    body: "Xohishga qarab, taklifnomaga kelin-kuyovning shaxsiy rasmlarini ham qo'shib beramiz.",
  },
];

function MiniPreview({ themeId, className }: { themeId: string; className?: string }) {
  const theme = getTheme(themeId);
  const invitation = { ...DEMO_INVITATION, template_id: theme.id };
  return (
    <div className={`relative overflow-hidden rounded-[1.6rem] border-[6px] border-[#2E2A27] bg-[#2E2A27] shadow-2xl ${className ?? ""}`}>
      <div className="absolute left-1/2 top-0 z-30 h-4 w-16 -translate-x-1/2 rounded-b-lg bg-[#2E2A27]" />
      <div className="pointer-events-none h-full w-full overflow-y-auto bg-white">
        <TemplateRenderer invitation={invitation} musicTrack={null} previewMode />
      </div>
    </div>
  );
}

function TemplateCard({ themeId }: { themeId: string }) {
  const theme = getTheme(themeId);
  return (
    <Link href={`/templates/${theme.id}`} className="group flex flex-col items-center gap-3 focus:outline-none">
      <div className="relative h-[340px] w-[190px] overflow-hidden rounded-[1.4rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
        <div className="pointer-events-none h-full w-full overflow-y-auto bg-white">
          <TemplateRenderer
            invitation={{ ...DEMO_INVITATION, template_id: theme.id }}
            musicTrack={null}
            previewMode
          />
        </div>
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2E2A27] shadow-lg">
            <Eye className="h-3.5 w-3.5" />
            To&apos;liq ko&apos;rish
          </span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-[#2E2A27]">{theme.name}</h3>
        <p className="text-xs text-[#2E2A27]/50">{PRICE_TIER_LABELS[theme.minPriceTier]}</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBFB] font-sans text-[#2E2A27] antialiased selection:bg-[#D69E82] selection:text-[#FDFBFB]">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-[#D69E82]/15 bg-[#FDFBFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 120 80" className="h-8 w-12 text-[#B8923F]" fill="none" aria-hidden>
              <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(-12 42 45)" />
              <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 78 45)" />
            </svg>
            <span className="font-display text-2xl tracking-tight text-[#2E2A27]">
              Oila<span className="text-[#BD7E5F]">-</span>Uchun
            </span>
          </Link>

          <nav className="hidden items-center gap-10 text-[15px] text-[#2E2A27]/70 md:flex">
            <a href="#designs" className="rounded transition-colors hover:text-[#2E2A27]">Dizaynlar</a>
            <a href="#how" className="rounded transition-colors hover:text-[#2E2A27]">Qanday ishlaydi</a>
            <a href="#pricing" className="rounded transition-colors hover:text-[#2E2A27]">Narxlar</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="hidden sm:inline-flex items-center rounded-full bg-[#2E2A27] px-5 py-2.5 text-sm font-medium text-[#FDFBFB] transition-colors duration-300 hover:bg-[#5F8A82]"
            >
              Shablonlarni ko&apos;rish
            </Link>
            <button
              type="button"
              aria-label="Menyuni ochish"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 text-[#2E2A27] md:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="space-y-4 border-t border-[#D69E82]/15 bg-[#FDFBFB] px-6 py-5 text-[#2E2A27]/80 md:hidden">
            <a href="#designs" onClick={() => setMenuOpen(false)} className="block">Dizaynlar</a>
            <a href="#how" onClick={() => setMenuOpen(false)} className="block">Qanday ishlaydi</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block">Narxlar</a>
            <Link
              href="/templates"
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-full bg-[#2E2A27] px-5 py-3 text-center font-medium text-[#FDFBFB]"
            >
              Shablonlarni ko&apos;rish
            </Link>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="max-w-xl">
            <p className="mb-6 text-sm font-medium tracking-wide text-[#5F8A82]">
              Har bir juftlik tarixi uchun
            </p>
            <h1 className="font-display text-[2.75rem] leading-[1.1] text-[#2E2A27] sm:text-5xl lg:text-[3.4rem]">
              To&apos;yingiz endi <em className="not-italic text-[#BD7E5F]">raqamli.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#2E2A27]/65">
              Mehmonlaringiz chindan ham ochib ko&apos;radigan onlayn to&apos;y taklifnomasini
              yarating — musiqa, sanoq taymer va to&apos;yingizning barcha tafsilotlari
              bitta nafis havolada.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full bg-[#5F8A82] px-7 py-3.5 font-medium text-[#FDFBFB] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a7169] hover:shadow-md"
              >
                Shablonlarni ko&apos;rish
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/25 px-7 py-3.5 font-medium text-[#2E2A27] transition-all duration-300 hover:border-[#2E2A27] hover:bg-[#2E2A27]/5"
              >
                Qanday ishlaydi
              </a>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-[#2E2A27]/55">
              <div>
                <span className="font-display text-2xl text-[#2E2A27]">{THEME_PRESETS.length}+</span>
                <br />
                tayyor dizayn
              </div>
              <div className="h-10 w-px bg-[#2E2A27]/10" />
              <div>
                <span className="font-display text-2xl text-[#2E2A27]">3</span>
                <br />
                narx darajasi
              </div>
            </div>
          </div>

          <div className="flex w-full items-end justify-center lg:ml-[200px] lg:justify-start">
            <div className="hidden aspect-[4/5] w-[210px] -rotate-3 rounded-[2rem] border border-[#D69E82]/20 bg-[#F6EFE9] p-3 shadow-xl transition-transform duration-500 hover:rotate-0 sm:block sm:w-[230px] lg:w-[250px]">
              <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#D69E82]/25 via-[#F6EFE9] to-[#79A69E]/15">
                <svg className="absolute inset-0 m-auto h-16 w-16 text-[#D69E82]/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4 6.3 4c2 0 3.6 1.1 4.7 2.7C12.1 5.1 13.7 4 15.7 4c3.9 0 5.8 4 4.3 7.7C19.5 16.4 12 21 12 21z" />
                </svg>
                <p className="pb-6 font-display italic text-[#2E2A27]/50">
                  {DEMO_INVITATION.groom_name} &amp; {DEMO_INVITATION.bride_name}
                </p>
              </div>
            </div>

            <MiniPreview
              themeId={HERO_THEME_ID}
              className="aspect-[9/18.5] w-[220px] max-w-[80vw] rotate-2 transition-transform duration-500 hover:rotate-0 sm:-ml-16 sm:w-[240px] sm:max-w-none lg:w-[260px]"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST / WHY US ================= */}
      <section className="border-y border-[#2E2A27]/8 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#B8923F]/10 sm:mx-0">
                  <Icon className="h-5 w-5 text-[#B8923F]" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-[#2E2A27]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#2E2A27]/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DESIGNS ================= */}
      <section id="designs" className="bg-[#F6EFE9]/60 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl text-[#2E2A27] sm:text-4xl">
              Kuningizga mos dizaynni tanlang
            </h2>
            <p className="mt-4 text-[#2E2A27]/60">
              Har bir shablon jonli namunada ko&apos;rinadi — kartaga bosib to&apos;liq ko&apos;ring.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {FEATURED_THEME_IDS.map((id) => (
              <TemplateCard key={id} themeId={id} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/25 px-7 py-3 text-sm font-medium text-[#2E2A27] transition-colors duration-300 hover:border-[#2E2A27] hover:bg-[#2E2A27]/5"
            >
              Barcha {THEME_PRESETS.length} dizaynni ko&apos;rish
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl text-[#2E2A27] sm:text-4xl">Qanday ishlaydi?</h2>
          <p className="mx-auto mb-12 mt-4 max-w-md text-[#2E2A27]/60">
            Oddiy 3 qadamda taklifnomangiz tayyor bo&apos;ladi
          </p>

          <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Shablon tanlang",
                body: "Turli uslub va narxdagi dizaynlar orasidan o'zingizga yoqqanini tanlang.",
              },
              {
                n: "2",
                title: "Ma'lumot yuboring",
                body: "Ismlar, sana, manzil, rasm va musiqani biz bilan bo'lishing.",
              },
              {
                n: "3",
                title: "Havolani ulashing",
                body: "Tayyor taklifnoma havolasini mehmonlaringizga yuboring.",
              },
            ].map((step) => (
              <div key={step.n} className="rounded-2xl border border-[#B8923F]/10 bg-white/60 p-8 backdrop-blur-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#B8923F] font-display text-lg text-white">
                  {step.n}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#2E2A27]">{step.title}</h3>
                <p className="text-sm text-[#2E2A27]/60">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="bg-[#F6EFE9]/60 py-24 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl text-[#2E2A27] sm:text-4xl">Narxlar</h2>
            <p className="mt-4 text-[#2E2A27]/60">
              Har bir daraja o&apos;zidan pastdagi barcha dizaynlarga kirish imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PRICE_TIERS.map((tier, i) => {
              const count = getUnlockedThemes(tier).length;
              const isMiddle = i === 1;
              return (
                <div
                  key={tier}
                  className={`rounded-2xl border p-8 text-center ${
                    isMiddle
                      ? "border-[#5F8A82] bg-white shadow-lg"
                      : "border-[#2E2A27]/10 bg-white/70"
                  }`}
                >
                  {isMiddle && (
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5F8A82]">
                      Ommabop
                    </p>
                  )}
                  <p className="font-display text-3xl text-[#2E2A27]">{PRICE_TIER_LABELS[tier]}</p>
                  <p className="mt-2 text-sm text-[#2E2A27]/55">{count} ta dizaynga kirish</p>
                  <Link
                    href="/templates"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300 ${
                      isMiddle
                        ? "bg-[#5F8A82] text-white hover:bg-[#4a7169]"
                        : "border border-[#2E2A27]/20 text-[#2E2A27] hover:bg-[#2E2A27]/5"
                    }`}
                  >
                    Dizaynlarni ko&apos;rish
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA STRIP ================= */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E2A27] to-[#1c1916] p-10 text-center sm:p-14">
            <div className="relative z-10">
              <h2 className="font-display text-3xl text-white sm:text-4xl">Tayyormisiz?</h2>
              <p className="mx-auto mb-8 max-w-md text-[#D9BB78]">
                Hozir boshlang va eng chiroyli taklifnomani yarating
              </p>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full bg-[#B8923F] px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#a3824d]"
              >
                Boshlash
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#2E2A27]/8 px-4 py-10 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <svg viewBox="0 0 120 80" className="h-5 w-8 text-[#B8923F]" fill="none" aria-hidden>
            <ellipse cx="42" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(-12 42 45)" />
            <ellipse cx="78" cy="45" rx="28" ry="18" stroke="currentColor" strokeWidth="1.5" transform="rotate(12 78 45)" />
          </svg>
          <span className="font-display text-sm text-[#2E2A27]">Oila-Uchun</span>
        </div>
        <p className="text-xs text-[#2E2A27]/50">&copy; 2026 Barcha huquqlar himoyalangan</p>
      </footer>
    </div>
  );
}
