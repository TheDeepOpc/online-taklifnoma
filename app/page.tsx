"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Eye,
  Clock,
  Wallet,
  Globe,
  Camera,
  Phone,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Music,
  Timer,
  Images,
  MapPin,
} from "lucide-react";
import { TemplatePreviewFrame } from "@/components/templates/PreviewFrame";
import { PhoneShowcase } from "@/components/home/PhoneShowcase";
import { TemplateMarquee } from "@/components/home/TemplateMarquee";
import { Reveal, RevealGroup, RevealItem, AnimatedWords } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { THEME_PRESETS, getUnlockedThemes, getTheme } from "@/lib/themes";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const PHONE = "+998 99 917 99 27";
const PHONE_LINK = "tel:+998999179927";
const TELEGRAM = "https://t.me/998999179927";
const WHATSAPP = "https://wa.me/998999179927";

const HERO_THEMES: [string, string, string] = [
  "sacred-peony-gold",
  "milliy-anor",
  "velvet-crown-noir",
];

const FEATURED_THEME_IDS = [
  "milliy-anor",
  "sacred-peony-gold",
  "aurora-dream-night",
  "ivory-swan-arch",
  "lux-gold-night",
  "garden-bloom",
];

const MARQUEE_TOP = THEME_PRESETS.slice(0, 9).map((t) => t.id);
const MARQUEE_BOTTOM = THEME_PRESETS.slice(9).map((t) => t.id);

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
    title: "Doimiy havola",
    body: "Taklifnomangiz oila-uchun.uz domenida saqlanadi — hech qachon o'chib qolmaydi.",
  },
  {
    icon: Camera,
    title: "O'z rasmlaringiz bilan",
    body: "Xohishga qarab, taklifnomaga kelin-kuyovning shaxsiy rasmlarini ham qo'shib beramiz.",
  },
];

const FEATURES = [
  { icon: Music, title: "Musiqa", body: "Har bir taklifnoma o'z qo'shig'i bilan ochiladi." },
  { icon: Timer, title: "Sanoq taymer", body: "To'yga qolgan kun, soat va daqiqa jonli sanaladi." },
  { icon: Images, title: "Xotira galereyasi", body: "5 tagacha suratni chiroyli joylashtiramiz." },
  { icon: MapPin, title: "Google Maps", body: "Mehmon bir bosishda to'yxonaga yo'l oladi." },
];

const STEPS = [
  {
    n: "1",
    title: "Shablon tanlang",
    body: "Turli uslub va narxdagi 18 ta dizayn orasidan o'zingizga yoqqanini tanlang.",
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
];

function TemplateCard({ themeId, index }: { themeId: string; index: number }) {
  const theme = getTheme(themeId);
  return (
    <RevealItem className="flex flex-col items-center gap-3">
      <Link href={`/templates/${theme.id}`} className="group flex flex-col items-center gap-3 focus:outline-none">
        <motion.div
          whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative h-[320px] w-[180px] overflow-hidden rounded-[1.4rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-lg sm:h-[344px] sm:w-[192px]"
        >
          <span className="absolute left-1/2 top-0 z-30 h-3 w-12 -translate-x-1/2 rounded-b-lg bg-[#2E2A27]" />
          <TemplatePreviewFrame themeId={theme.id} scaleClassName="scale-[0.45] sm:scale-[0.48]" />
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#2E2A27]/0 opacity-0 transition-all duration-300 group-hover:bg-[#2E2A27]/35 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2E2A27] shadow-lg">
              <Eye className="h-3.5 w-3.5" />
              To&apos;liq ko&apos;rish
            </span>
          </div>
        </motion.div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-[#2E2A27] transition-colors group-hover:text-[#BD7E5F]">
            {theme.name}
          </h3>
          <p className="text-xs text-[#2E2A27]/45">{PRICE_TIER_LABELS[theme.minPriceTier]}</p>
        </div>
      </Link>
    </RevealItem>
  );
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FDFBFB] font-sans text-[#2E2A27] antialiased selection:bg-[#D69E82] selection:text-[#FDFBFB]">
      <SiteHeader />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* jonli fon */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="aurora-a absolute -left-[18%] -top-[22%] h-[52vw] w-[52vw] rounded-full bg-[#D69E82]/25 blur-[90px]" />
          <div className="aurora-b absolute -right-[14%] top-[4%] h-[46vw] w-[46vw] rounded-full bg-[#79A69E]/22 blur-[90px]" />
          <div className="aurora-c absolute bottom-[-24%] left-[26%] h-[42vw] w-[42vw] rounded-full bg-[#B8923F]/16 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(46,42,39,0.10) 1px, transparent 0)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:gap-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B8923F]/25 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-[#8a6c2f] backdrop-blur-sm sm:mb-6 sm:text-[13px]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Har bir juftlik tarixi uchun
            </motion.p>

            <h1 className="font-display text-[2.4rem] leading-[1.06] text-[#2E2A27] sm:text-[3.2rem] lg:text-[3.6rem]">
              <AnimatedWords text="To'yingiz endi" className="block" />
              <AnimatedWords
                text="raqamli."
                className="block text-[#BD7E5F]"
                delay={0.25}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-md text-base leading-relaxed text-[#2E2A27]/60 sm:mt-6 sm:text-lg"
            >
              Mehmonlaringiz chindan ham ochib ko&apos;radigan onlayn to&apos;y taklifnomasini
              yarating — musiqa, sanoq taymer va to&apos;yingizning barcha tafsilotlari bitta
              nafis havolada.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
            >
              <Link
                href="/templates"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#5F8A82] px-6 py-3.5 text-sm font-medium text-[#FDFBFB] shadow-[0_10px_30px_-10px_rgba(95,138,130,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a7169] sm:px-7"
              >
                <span className="relative z-10">Shablonlarni ko&apos;rish</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span
                  aria-hidden
                  className="animate-sheen absolute inset-y-0 -left-1/3 z-0 w-1/3 skew-x-[-20deg] bg-white/25"
                />
              </Link>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/20 bg-white/60 px-6 py-3.5 text-sm font-medium text-[#2E2A27] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2E2A27]/45 hover:bg-white sm:px-7"
              >
                <Phone className="h-4 w-4" />
                Boshlash
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="mt-10 flex items-center gap-6 text-xs text-[#2E2A27]/50 sm:mt-12 sm:gap-9 sm:text-sm"
            >
              <div>
                <CountUp
                  to={THEME_PRESETS.length}
                  suffix="+"
                  className="font-display text-2xl text-[#2E2A27] sm:text-3xl"
                />
                <br />
                tayyor dizayn
              </div>
              <div className="h-9 w-px bg-[#2E2A27]/12" />
              <div>
                <CountUp to={3} className="font-display text-2xl text-[#2E2A27] sm:text-3xl" />
                <br />
                narx darajasi
              </div>
              <div className="h-9 w-px bg-[#2E2A27]/12" />
              <div>
                <CountUp to={15} className="font-display text-2xl text-[#2E2A27] sm:text-3xl" />
                <br />
                daqiqada tayyor
              </div>
            </motion.div>
          </div>

          <PhoneShowcase themeIds={HERO_THEMES} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="hidden justify-center pb-8 lg:flex"
        >
          <span className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.35em] text-[#2E2A27]/40">
            Pastga suring
            <ChevronDown className="animate-scroll-cue h-4 w-4" />
          </span>
        </motion.div>
      </section>

      {/* ================= MARQUEE ================= */}
      <section className="border-y border-[#2E2A27]/[0.06] bg-white py-12 sm:py-16">
        <Reveal className="mx-auto mb-8 max-w-2xl px-5 text-center sm:mb-10 sm:px-6">
          <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl">
            {THEME_PRESETS.length} ta jonli dizayn
          </h2>
          <p className="mt-2.5 text-sm text-[#2E2A27]/55 sm:text-base">
            Quyidagi namunalar — rasm emas, haqiqiy ishlaydigan taklifnomalar. Ustiga bosing.
          </p>
        </Reveal>
        <TemplateMarquee themeIds={MARQUEE_TOP} duration={70} />
        <div className="h-4 sm:h-5" />
        <TemplateMarquee themeIds={MARQUEE_BOTTOM} duration={80} reverse />
      </section>

      {/* ================= TRUST / WHY US ================= */}
      <section className="bg-[#FDFBFB] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <RevealGroup className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
              <RevealItem key={title} className="group text-center sm:text-left">
                <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8923F]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#B8923F]/20 sm:mx-0">
                  <Icon className="h-5 w-5 text-[#B8923F]" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-[#2E2A27]">{title}</h3>
                <p className="text-xs leading-relaxed text-[#2E2A27]/55 sm:text-sm">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================= DESIGNS ================= */}
      <section id="designs" className="relative overflow-hidden bg-[#F6EFE9]/60 py-16 sm:py-24 lg:py-28">
        <div
          aria-hidden
          className="aurora-b pointer-events-none absolute -right-[10%] top-[10%] -z-10 h-[36vw] w-[36vw] rounded-full bg-[#D69E82]/20 blur-[90px]"
        />
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">
              Kuningizga mos dizaynni tanlang
            </h2>
            <p className="mt-3 text-sm text-[#2E2A27]/55 sm:mt-4 sm:text-base">
              Har bir shablon jonli namunada ko&apos;rinadi — kartaga bosib to&apos;liq ko&apos;ring.
            </p>
          </Reveal>

          <RevealGroup className="flex flex-wrap justify-center gap-6 sm:gap-8" amount={0.1}>
            {FEATURED_THEME_IDS.map((id, i) => (
              <TemplateCard key={id} themeId={id} index={i} />
            ))}
          </RevealGroup>

          <Reveal className="mt-12 text-center sm:mt-16" delay={0.1}>
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/20 bg-white/70 px-6 py-3 text-sm font-medium text-[#2E2A27] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2E2A27]/40 hover:bg-white sm:px-7"
            >
              Barcha {THEME_PRESETS.length} dizaynni ko&apos;rish
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">
              Har bir taklifnomada bor
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <RevealItem
                key={title}
                className="group rounded-2xl border border-[#2E2A27]/8 bg-white/70 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B8923F]/30 hover:shadow-[0_18px_40px_-24px_rgba(46,42,39,0.4)] sm:p-6"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#5F8A82]/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-[#5F8A82]" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-[#2E2A27]">{title}</h3>
                <p className="text-xs leading-relaxed text-[#2E2A27]/55">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">
              Qanday ishlaydi?
            </h2>
            <p className="mx-auto mb-12 mt-3 max-w-md text-sm text-[#2E2A27]/55 sm:mb-16 sm:mt-4 sm:text-base">
              Oddiy 3 qadamda taklifnomangiz tayyor bo&apos;ladi
            </p>
          </Reveal>

          <div className="relative">
            {/* qadamlarni bog'lovchi chiziq */}
            <motion.span
              aria-hidden
              className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-gradient-to-r from-transparent via-[#B8923F]/40 to-transparent md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <RevealGroup className="grid grid-cols-1 gap-8 text-left sm:gap-10 md:grid-cols-3">
              {STEPS.map((step) => (
                <RevealItem key={step.n} className="relative">
                  <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#B8923F] font-display text-lg text-white shadow-[0_8px_24px_-8px_rgba(184,146,63,0.9)] md:mx-0">
                    {step.n}
                  </div>
                  <h3 className="mb-2 text-center text-base font-semibold text-[#2E2A27] md:text-left sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-center text-sm text-[#2E2A27]/55 md:text-left">{step.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="bg-[#F6EFE9]/60 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">Narxlar</h2>
            <p className="mt-3 text-sm text-[#2E2A27]/55 sm:mt-4 sm:text-base">
              Har bir daraja o&apos;zidan pastdagi barcha dizaynlarga kirish imkonini beradi.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            {PRICE_TIERS.map((tier, i) => {
              const count = getUnlockedThemes(tier).length;
              const isMiddle = i === 1;
              return (
                <RevealItem key={tier}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className={`relative h-full rounded-2xl border p-6 text-center sm:p-8 ${
                      isMiddle
                        ? "border-[#5F8A82] bg-white shadow-[0_24px_60px_-30px_rgba(95,138,130,0.9)] md:-mt-4 md:pb-12"
                        : "border-[#2E2A27]/10 bg-white/70"
                    }`}
                  >
                    {isMiddle && (
                      <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#5F8A82]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#5F8A82]">
                        <Sparkles className="h-3 w-3" />
                        Ommabop
                      </p>
                    )}
                    <p className="font-display text-2xl text-[#2E2A27] sm:text-3xl">
                      {PRICE_TIER_LABELS[tier]}
                    </p>
                    <p className="mt-2 text-xs text-[#2E2A27]/50 sm:text-sm">
                      {count} ta dizaynga kirish
                    </p>
                    <Link
                      href="/templates"
                      className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300 ${
                        isMiddle
                          ? "bg-[#5F8A82] text-white hover:bg-[#4a7169]"
                          : "border border-[#2E2A27]/15 text-[#2E2A27] hover:bg-[#2E2A27]/5"
                      }`}
                    >
                      Dizaynlarni ko&apos;rish
                    </Link>
                  </motion.div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative overflow-hidden py-16 sm:py-24">
        <div
          aria-hidden
          className="aurora-c pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8923F]/12 blur-[90px]"
        />
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-2xl text-[#2E2A27] sm:text-3xl lg:text-4xl">
              Biz bilan bog&apos;laning
            </h2>
            <p className="mx-auto mb-8 mt-3 max-w-md text-sm text-[#2E2A27]/55 sm:mb-10 sm:mt-4 sm:text-base">
              Savollaringiz bo&apos;lsa yoki darhol boshlamoqchi bo&apos;lsangiz — qo&apos;ng&apos;iroq
              qiling
            </p>
          </Reveal>

          <Reveal className="mx-auto max-w-md" delay={0.1}>
            <a
              href={PHONE_LINK}
              className="group flex items-center justify-center gap-4 rounded-2xl border border-[#B8923F]/20 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8923F]/45 hover:bg-white hover:shadow-[0_24px_60px_-30px_rgba(184,146,63,0.9)] sm:p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B8923F]/10 transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                <Phone className="h-6 w-6 text-[#B8923F] sm:h-7 sm:w-7" />
              </div>
              <div className="text-left">
                <p className="text-xs text-[#2E2A27]/50">Telefon</p>
                <p className="font-display text-xl text-[#2E2A27] sm:text-2xl">{PHONE}</p>
              </div>
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "Telegram", href: TELEGRAM },
                { label: "WhatsApp", href: WHATSAPP },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2E2A27]/15 bg-white/60 px-5 py-2.5 text-sm font-medium text-[#2E2A27] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2E2A27]/35 hover:bg-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      {/* ================= MODAL: Boshlash ================= */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E2A27]/50 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Yopish"
                className="absolute right-4 top-4 text-[#2E2A27]/40 transition-colors hover:text-[#2E2A27]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#B8923F]/10">
                <Phone className="h-7 w-7 text-[#B8923F]" />
              </div>

              <h3 className="font-display text-xl text-[#2E2A27]">Biz bilan bog&apos;laning</h3>
              <p className="mt-2 text-sm text-[#2E2A27]/55">
                Taklifnomangizni yaratish uchun quyidagi raqamga qo&apos;ng&apos;iroq qiling
              </p>

              <a
                href={PHONE_LINK}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5F8A82] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4a7169]"
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>

              <p className="mt-3 text-xs text-[#2E2A27]/40">
                yoki Telegram / WhatsApp orqali yozing
              </p>

              <div className="mt-4 flex gap-3">
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2E2A27]/15 px-4 py-2.5 text-xs font-medium text-[#2E2A27] transition-colors hover:bg-[#2E2A27]/5"
                >
                  Telegram
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2E2A27]/15 px-4 py-2.5 text-xs font-medium text-[#2E2A27] transition-colors hover:bg-[#2E2A27]/5"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
