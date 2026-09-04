"use client";

import Link from "next/link";
import { Eye, Clock, Wallet, Globe, Camera } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { THEME_PRESETS, getUnlockedThemes, getTheme } from "@/lib/themes";
import { DEMO_INVITATION } from "@/lib/demoInvitation";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
    <div className={`relative overflow-hidden rounded-[1.6rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-2xl ${className ?? ""}`}>
      <div className="absolute left-1/2 top-0 z-30 h-3.5 w-14 -translate-x-1/2 rounded-b-lg bg-[#2E2A27]" />
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
      <div className="relative h-[320px] w-[180px] overflow-hidden rounded-[1.3rem] border-[4px] border-[#2E2A27] bg-[#2E2A27] shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:h-[340px] sm:w-[190px] sm:rounded-[1.4rem] sm:border-[5px]">
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
        <p className="text-xs text-[#2E2A27]/45">{PRICE_TIER_LABELS[theme.minPriceTier]}</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFBFB] font-sans text-[#2E2A27] antialiased selection:bg-[#D69E82] selection:text-[#FDFBFB]">
      <SiteHeader />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-12 sm:px-6 sm:gap-16 sm:pb-24 sm:pt-16 lg:grid-cols-2 lg:gap-20 lg:pb-32 lg:pt-20 lg:px-8">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-medium tracking-wide text-[#5F8A82] sm:mb-6 sm:text-sm">
              Har bir juftlik tarixi uchun
            </p>
            <h1 className="font-display text-[2.25rem] leading-[1.1] text-[#2E2A27] sm:text-5xl lg:text-[3.2rem]">
              To&apos;yingiz endi <em className="not-italic text-[#BD7E5F]">raqamli.</em>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#2E2A27]/60 sm:mt-6 sm:text-lg">
              Mehmonlaringiz chindan ham ochib ko&apos;radigan onlayn to&apos;y taklifnomasini
              yarating — musiqa, sanoq taymer va to&apos;yingizning barcha tafsilotlari
              bitta nafis havolada.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full bg-[#5F8A82] px-6 py-3 text-sm font-medium text-[#FDFBFB] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a7169] hover:shadow-md sm:px-7 sm:py-3.5"
              >
                Shablonlarni ko&apos;rish
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/20 px-6 py-3 text-sm font-medium text-[#2E2A27] transition-all duration-300 hover:border-[#2E2A27]/50 hover:bg-[#2E2A27]/5 sm:px-7 sm:py-3.5"
              >
                Qanday ishlaydi
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-[#2E2A27]/50 sm:mt-12 sm:gap-8 sm:text-sm">
              <div>
                <span className="font-display text-xl text-[#2E2A27] sm:text-2xl">{THEME_PRESETS.length}+</span>
                <br />
                tayyor dizayn
              </div>
              <div className="h-8 w-px bg-[#2E2A27]/10" />
              <div>
                <span className="font-display text-xl text-[#2E2A27] sm:text-2xl">3</span>
                <br />
                narx darajasi
              </div>
            </div>
          </div>

          <div className="hidden items-end justify-center lg:ml-[160px] lg:flex lg:justify-start xl:ml-[200px]">
            <div className="hidden aspect-[4/5] w-[200px] -rotate-3 rounded-[1.8rem] border border-[#D69E82]/20 bg-[#F6EFE9] p-3 shadow-xl transition-transform duration-500 hover:rotate-0 sm:block sm:w-[220px] lg:w-[240px]">
              <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#D69E82]/25 via-[#F6EFE9] to-[#79A69E]/15">
                <svg className="absolute inset-0 m-auto h-14 w-14 text-[#D69E82]/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4 6.3 4c2 0 3.6 1.1 4.7 2.7C12.1 5.1 13.7 4 15.7 4c3.9 0 5.8 4 4.3 7.7C19.5 16.4 12 21 12 21z" />
                </svg>
                <p className="pb-5 font-display italic text-[#2E2A27]/50 text-sm">
                  {DEMO_INVITATION.groom_name} &amp; {DEMO_INVITATION.bride_name}
                </p>
              </div>
            </div>

            <MiniPreview
              themeId={HERO_THEME_ID}
              className="aspect-[9/18.5] w-[200px] max-w-[75vw] rotate-2 transition-transform duration-500 hover:rotate-0 sm:-ml-12 sm:w-[220px] sm:max-w-none lg:w-[240px]"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST / WHY US ================= */}
      <section className="border-y border-[#2E2A27]/6 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#B8923F]/10 sm:mx-0 sm:h-12 sm:w-12">
                  <Icon className="h-4 w-4 text-[#B8923F] sm:h-5 sm:w-5" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[#2E2A27]">{title}</h3>
                <p className="text-xs leading-relaxed text-[#2E2A27]/55 sm:text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DESIGNS ================= */}
      <section id="designs" className="bg-[#F6EFE9]/50 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">
              Kuningizga mos dizaynni tanlang
            </h2>
            <p className="mt-3 text-sm text-[#2E2A27]/55 sm:mt-4 sm:text-base">
              Har bir shablon jonli namunada ko&apos;rinadi — kartaga bosib to&apos;liq ko&apos;ring.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {FEATURED_THEME_IDS.map((id) => (
              <TemplateCard key={id} themeId={id} />
            ))}
          </div>

          <div className="mt-10 text-center sm:mt-14">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/20 px-6 py-2.5 text-sm font-medium text-[#2E2A27] transition-colors duration-300 hover:border-[#2E2A27]/40 hover:bg-[#2E2A27]/5 sm:px-7 sm:py-3"
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
      <section id="how" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">Qanday ishlaydi?</h2>
          <p className="mx-auto mb-10 mt-3 max-w-md text-sm text-[#2E2A27]/55 sm:mb-12 sm:mt-4 sm:text-base">
            Oddiy 3 qadamda taklifnomangiz tayyor bo&apos;ladi
          </p>

          <div className="grid grid-cols-1 gap-6 text-left sm:gap-8 md:grid-cols-3">
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
              <div key={step.n} className="rounded-2xl border border-[#B8923F]/10 bg-white/60 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#B8923F] font-display text-base text-white sm:mb-4 sm:h-10 sm:w-10 sm:text-lg">
                  {step.n}
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-[#2E2A27] sm:mb-2 sm:text-lg">{step.title}</h3>
                <p className="text-xs text-[#2E2A27]/55 sm:text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="bg-[#F6EFE9]/50 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">Narxlar</h2>
            <p className="mt-3 text-sm text-[#2E2A27]/55 sm:mt-4 sm:text-base">
              Har bir daraja o&apos;zidan pastdagi barcha dizaynlarga kirish imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            {PRICE_TIERS.map((tier, i) => {
              const count = getUnlockedThemes(tier).length;
              const isMiddle = i === 1;
              return (
                <div
                  key={tier}
                  className={`rounded-2xl border p-6 text-center sm:p-8 ${
                    isMiddle
                      ? "border-[#5F8A82] bg-white shadow-lg"
                      : "border-[#2E2A27]/10 bg-white/70"
                  }`}
                >
                  {isMiddle && (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5F8A82]">
                      Ommabop
                    </p>
                  )}
                  <p className="font-display text-2xl text-[#2E2A27] sm:text-3xl">{PRICE_TIER_LABELS[tier]}</p>
                  <p className="mt-2 text-xs text-[#2E2A27]/50 sm:text-sm">{count} ta dizaynga kirish</p>
                  <Link
                    href="/templates"
                    className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 sm:mt-6 ${
                      isMiddle
                        ? "bg-[#5F8A82] text-white hover:bg-[#4a7169]"
                        : "border border-[#2E2A27]/15 text-[#2E2A27] hover:bg-[#2E2A27]/5"
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
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E2A27] to-[#1c1916] p-8 text-center sm:p-14">
            <div className="relative z-10">
              <h2 className="font-display text-2xl text-white sm:text-3xl lg:text-4xl">Tayyormisiz?</h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-[#D9BB78] sm:mb-8 sm:text-base">
                Hozir boshlang va eng chiroyli taklifnomani yarating
              </p>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full bg-[#B8923F] px-7 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#a3824d] sm:px-8 sm:py-3.5"
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

      <SiteFooter />
    </div>
  );
}
