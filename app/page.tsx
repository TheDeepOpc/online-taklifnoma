"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Eye,
  Phone,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Music,
  Timer,
  Images,
  MapPin,
  Globe,
  Heart,
  Gift,
  Users,
  MessageCircle,
} from "lucide-react";
import { TemplateGallery } from "@/components/home/TemplateGallery";
import { Reveal, RevealGroup, RevealItem, AnimatedWords } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { THEME_PRESETS, getUnlockedThemes } from "@/lib/themes";
import { PRICE_TIER_LABELS, type PriceTier } from "@/lib/types";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CopyrightNotice } from "@/components/CopyrightNotice";

const PHONE = "+998 99 917 99 27";
const PHONE_LINK = "tel:+998999179927";
const TELEGRAM = "https://t.me/998999179927";
const WHATSAPP = "https://wa.me/998999179927";
const ALL_THEME_IDS = THEME_PRESETS.map((t) => t.id);

const PRICE_TIERS: PriceTier[] = ["150000", "200000", "250000"];

const FEATURES = [
  { icon: Music, title: "Jonli musiqa", body: "Har bir taklifnoma mehmonning birinchi bosishidayoq o'z ohangida ochiladi." },
  { icon: Timer, title: "Sanoq taymer", body: "To'yga qolgan kun, soat va daqiqa — jonli, har bir mehmon oldida." },
  { icon: Images, title: "Xotira galereyasi", body: "Sizning eng aziz suratlaringiz nafis va jozibali tarzda joylashtiriladi." },
  { icon: MapPin, title: "Google Maps", body: "Mehmon bitta bosishda to'yxonangizga qulay yo'l topadi." },
  { icon: Heart, title: "Shaxsiy uslub", body: "Har bir juftlik uchun alohida, faqat sizga mos dizayn yaratamiz." },
  { icon: Globe, title: "Doimiy havola", body: "Taklifnoma oila-uchun.uz domenida saqlanadi — hech qachon o'chmaydi." },
];

const STEPS = [
  {
    n: "01",
    title: "Uslubni tanlang",
    body: "18 ta jonli dizayn orasidan yurak qarorini qiling — har biri bir ko'rinishda ko'nglingizni zabt etadi.",
  },
  {
    n: "02",
    title: "Tafsilotlarni ayting",
    body: "Ismlar, sana, manzil, rasm va musiqani bizga ishoning — qolganini biz hal qilamiz.",
  },
  {
    n: "03",
    title: "Havolani ulashing",
    body: "Nafis havolani mehmonlaringizga yuboring — ular sizning sevgingizni his qiladi.",
  },
];

const GIFT_OFFERS = [
  {
    id: "10",
    guests: 10,
    free: 5,
    icon: Heart,
    title: "Shinam to'y",
    note: "Ya'ni 10 ta taklifnoma buyurtma qilsangiz — 5 tasini bepul tayyorlab beramiz.",
  },
  {
    id: "20",
    guests: 20,
    free: 10,
    icon: Gift,
    title: "Katta bayram",
    featured: true,
    note: "Ya'ni 20 ta taklifnoma buyurtma qilsangiz — 10 tasini bepul tayyorlab beramiz.",
  },
  {
    id: "all",
    guests: null,
    free: null,
    icon: Users,
    title: "Har bir mehmon uchun",
    note: "Har bir mehmoningiz uchun shaxsiy taklifnoma — barchasi bitta nafis uslubda.",
  },
];

function GiftOfferCard({ guests, free, icon: Icon, title, featured, note }: (typeof GIFT_OFFERS)[number]) {
  return (
    <RevealItem className="h-full">
      <div
        className={`relative h-full overflow-hidden rounded-[1.6rem] p-7 transition-all duration-500 hover:-translate-y-2 sm:p-8 ${
          featured
            ? "bg-gradient-to-br from-[#16110b] via-[#241b10] to-[#16110b] text-[#F7F2E9] shadow-[0_30px_70px_-30px_rgba(212,175,55,0.55)] ring-2 ring-[#D4AF37]/60"
            : "border border-[#D4AF37]/25 bg-white/80 text-[#2A241B] backdrop-blur-sm"
        }`}
      >
        {featured && (
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#16110b]">
            <Sparkles className="h-3 w-3" />
            Eng qulay
          </span>
        )}

        <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${featured ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "bg-[#D4AF37]/10 text-[#9a7b1f]"}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="mb-4">
          <p className={`text-sm font-semibold ${featured ? "text-[#F7F2E9]" : "text-[#2A241B]"}`}>{title}</p>
        </div>

        {guests ? (
          <p className="font-display text-3xl sm:text-4xl">
            <span className={featured ? "text-gold" : "text-[#2A241B]"}>{guests}</span>{" "}
            <span className="text-base sm:text-lg">ta taklifnoma</span>
          </p>
        ) : (
          <p className="font-display text-3xl sm:text-4xl">Cheksiz</p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <span className="font-script text-3xl leading-none text-[#D4AF37] sm:text-4xl">
            {free ? `${free} tasi BEPUL` : "sevgi bilan"}
          </span>
        </div>

        <p className={`mt-4 text-sm leading-relaxed ${featured ? "text-[#F7F2E9]/70" : "text-[#2A241B]/60"}`}>{note}</p>

        {free ? (
          <div className="mt-6 flex items-end justify-between border-t pt-5">
            <div className={featured ? "text-[#F7F2E9]/45" : "text-[#2A241B]/45"}>
              <span className="block text-[11px] uppercase tracking-wide">To&apos;laysiz</span>
              <span className="font-display text-xl">{guests} ta</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={featured ? "text-[#F7F2E9]/45" : "text-[#2A241B]/45"}>
                <span className="block text-[11px] uppercase tracking-wide">Olasiz</span>
                <span className="font-display text-xl">{guests + free} ta</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t pt-5">
            <p className={featured ? "text-[#F7F2E9]/45" : "text-[#2A241B]/45"}>Maxsus aloqa</p>
          </div>
        )}
      </div>
    </RevealItem>
  );
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F2E9] font-sans text-[#2A241B] antialiased selection:bg-[#D4AF37]/30 selection:text-[#2A241B]">
      <SiteHeader dark overlay />

      {/* ================= HERO: VIDEO FON ================= */}
      <section className="relative overflow-hidden">
        {/* video fon */}
        <div aria-hidden className="absolute inset-0 h-full w-full">
          <video
            className={`h-full w-full object-cover ${reduce ? "" : "kenburns"}`}
            src="/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* qoraytiruvchi qatlamlar */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/85 via-[#120d07]/65 to-[#F7F2E9]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(13,9,5,0.55)_85%)]" />
          <div className="absolute inset-0 bg-[#120d07]/20" />
          {/* yuqoridagi oltin glowni yumshatish */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0905]/75 to-transparent" />
        </div>

        {/* suzuvchi mayda yurakchalar */}
        {!reduce &&
          [
            { left: "8%", delay: 0, dur: 22 },
            { left: "20%", delay: 6, dur: 26 },
            { left: "34%", delay: 11, dur: 24 },
            { left: "55%", delay: 3, dur: 28 },
            { left: "68%", delay: 13, dur: 23 },
            { left: "82%", delay: 8, dur: 27 },
            { left: "91%", delay: 16, dur: 25 },
          ].map((f, i) => (
            <span
              key={i}
              aria-hidden
              className="animate-float-up pointer-events-none absolute bottom-0 text-[#D4AF37]/40"
              style={{ left: f.left, animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s` }}
            >
              <Heart className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
            </span>
          ))}

        <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col items-center justify-center px-5 pb-24 pt-28 text-center sm:pb-28 sm:pt-32">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#120d07]/40 px-4 py-1.5 text-xs font-medium tracking-wide text-[#F3E0A0] backdrop-blur-md sm:text-[13px]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Sevgi hikoyangizning raqamli davomi
          </motion.p>

          <h1
            className="font-display text-4xl leading-[1.1] text-[#F7F2E9] sm:text-6xl lg:text-7xl"
            style={{ filter: "drop-shadow(0 2px 18px rgba(0,0,0,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
          >
            <span className="block">
              <AnimatedWords text="Sizning eng go‘zal" className="block" />
            </span>
            <span className="text-gold block">
              <AnimatedWords text="kuningiz" delay={0.15} />{" "}
              <AnimatedWords text="havolada:" className="italic" delay={0.3} />
            </span>
          </h1>

          <p
            className="font-script mt-7 text-xl text-[#F3E0A0] sm:text-2xl lg:text-3xl"
            style={{ filter: "drop-shadow(0 1px 10px rgba(0,0,0,0.6))" }}
          >
            — bir nafis havola, millionlarga arzigulik his-tuyg&apos;u —
          </p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-sm leading-relaxed text-[#F7F2E9] sm:text-lg"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
          >
            Mehmonlaringiz chindan ham ochib ko&apos;radigan onlayn to&apos;y taklifnomasini yarating.
            O&apos;z musiqasi, sanoq taymeri va xotira galereyasi bilan — hammasi bitta havolada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
          >
            <Link
              href="/templates"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-[#16110b] shadow-[0_16px_40px_-12px_rgba(212,175,55,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e6c252] sm:px-8"
            >
              <span className="relative z-10">Dizaynlarni ko‘rish</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span aria-hidden className="animate-sheen absolute inset-y-0 -left-1/3 z-0 w-1/3 skew-x-[-20deg] bg-white/40" />
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#F7F2E9]/40 bg-[#120d07]/40 px-7 py-3.5 text-sm font-medium text-[#F7F2E9] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#120d07]/70 sm:px-8"
            >
              <Phone className="h-4 w-4" />
              Boshlash
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-9 gap-y-5 text-[#F7F2E9]/75 sm:mt-16 sm:gap-x-12"
          >
            <div className="text-center">
              <CountUp to={THEME_PRESETS.length} suffix="+" className="font-display text-3xl text-[#D4AF37] sm:text-4xl" />
              <p className="mt-1 text-xs uppercase tracking-widest sm:text-sm">jonli dizayn</p>
            </div>
            <div className="h-10 w-px bg-[#F7F2E9]/15" />
            <div className="text-center">
              <CountUp to={3} className="font-display text-3xl text-[#D4AF37] sm:text-4xl" />
              <p className="mt-1 text-xs uppercase tracking-widest sm:text-sm">narx darajasi</p>
            </div>
            <div className="h-10 w-px bg-[#F7F2E9]/15" />
            <div className="text-center">
              <CountUp to={15} className="font-display text-3xl text-[#D4AF37] sm:text-4xl" />
              <p className="mt-1 text-xs uppercase tracking-widest sm:text-sm">daqiqada tayyor</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="relative hidden justify-center pb-7 lg:flex"
        >
          <span className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.35em] text-[#F7F2E9]/50">
            Pastga suring
            <ChevronDown className="animate-scroll-cue h-4 w-4" />
          </span>
        </motion.div>
      </section>

      {/* ================= JONLI DIZAYNLAR (KARUSEL) ================= */}
      <section id="designs" className="scroll-mt-24 border-y border-[#D4AF37]/15 bg-white py-14 sm:py-18">
        <Reveal className="mx-auto mb-10 max-w-2xl px-5 text-center sm:mb-13 sm:px-6">
          <h2 className="font-display text-3xl text-[#2A241B] sm:text-4xl">
            Har biri — <span className="text-gold">jonli dizayn</span>
          </h2>
          <p className="mt-3 text-sm text-[#2A241B]/55 sm:text-base">
            Quyidagilar rasm emas — haqiqiy ishlaydigan taklifnomalar. Ustiga bosing va his qiling.
          </p>
        </Reveal>
        <TemplateGallery themeIds={ALL_THEME_IDS} />
      </section>

      {/* ================= XIZMAT / HOW IT WORKS ================= */}
      <section id="how" className="bg-[#F7F2E9] py-18 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center sm:mb-18">
            <p className="mb-3 font-script text-3xl text-[#9a7b1f] sm:text-4xl">qanday ishlaydi?</p>
            <h2 className="font-display text-3xl text-[#2A241B] sm:text-4xl lg:text-5xl">
              Uch qadamda <span className="text-gold">tayyor</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-[#2A241B]/55 sm:text-base">
              Sizdan uslub tanlovi — qolgan sehrni biz qilamiz.
            </p>
          </Reveal>

          <div className="relative">
            <motion.span
              aria-hidden
              className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <RevealGroup className="grid grid-cols-1 gap-9 text-left sm:gap-11 md:grid-cols-3">
              {STEPS.map((step) => (
                <RevealItem key={step.n} className="relative">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8860b] font-display text-xl text-white shadow-[0_12px_32px_-10px_rgba(212,175,55,0.9)] md:mx-0">
                    {step.n}
                  </div>
                  <h3 className="mb-2 text-center text-base font-semibold text-[#2A241B] md:text-left sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-center text-sm leading-relaxed text-[#2A241B]/60 md:text-left">{step.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ================= IMKONIYATLAR / FEATURES ================= */}
      <section className="border-y border-[#D4AF37]/15 bg-[#221a10] py-18 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 font-script text-3xl text-[#D4AF37] sm:text-4xl">har bir taklifnomada</p>
            <h2 className="font-display text-3xl text-[#F7F2E9] sm:text-4xl lg:text-5xl">
              Sehrning <span className="text-gold">tarkibi</span>
            </h2>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <RevealItem
                key={title}
                className="group rounded-[1.4rem] border border-[#D4AF37]/15 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37]/40 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] sm:p-7"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold text-[#F7F2E9]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#F7F2E9]/60">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================= NARXLAR / PRICING + GIFT ================= */}
      <section id="pricing" className="bg-[#F7F2E9] py-18 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-3 font-script text-3xl text-[#9a7b1f] sm:text-4xl">sovg&apos;amiz bor</p>
            <h2 className="font-display text-3xl text-[#2A241B] sm:text-4xl lg:text-5xl">
              Maxsus <span className="text-gold">tuhfa</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-[#2A241B]/55 sm:text-base">
              Mehmonlaringiz ko&apos;p bo&apos;lsa — do&apos;stona yon beramiz: har ikkitadan bittasi bizdan.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
            {GIFT_OFFERS.map((offer) => (
              <GiftOfferCard key={offer.id} {...offer} />
            ))}
          </RevealGroup>

          <Reveal className="mx-auto mb-12 mt-20 max-w-2xl text-center sm:mt-24 sm:mb-16">
            <p className="mb-3 font-script text-3xl text-[#9a7b1f] sm:text-4xl">sinchlash narxlari</p>
            <h2 className="font-display text-3xl text-[#2A241B] sm:text-4xl lg:text-5xl">Tariflar</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-[#2A241B]/55 sm:text-base">
              Har bir daraja o&apos;zidan pastdagi barcha dizaynlarga kirish beradi.
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
                    className={`relative h-full rounded-[1.5rem] border p-7 text-center sm:p-9 ${
                      isMiddle
                        ? "border-[#D4AF37] bg-gradient-to-b from-white to-[#FBF6E9] shadow-[0_30px_70px_-32px_rgba(212,175,55,0.85)] md:-mt-4 md:pb-13"
                        : "border-[#2A241B]/10 bg-white/80"
                    }`}
                  >
                    {isMiddle && (
                      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#16110b]">
                        <Sparkles className="h-3 w-3" />
                        Ommabop
                      </p>
                    )}
                    <p className="font-display text-3xl text-[#2A241B] sm:text-4xl">{PRICE_TIER_LABELS[tier]}</p>
                    <p className="mt-3 text-sm text-[#2A241B]/50">{count} ta dizaynga kirish</p>
                    <Link
                      href="/#designs"
                      className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${
                        isMiddle
                          ? "bg-[#D4AF37] text-[#16110b] hover:bg-[#e6c252]"
                          : "border border-[#2A241B]/20 text-[#2A241B] hover:bg-[#2A241B]/5"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      Dizaynlarni ko‘rish
                    </Link>
                  </motion.div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ================= BOG'LANISH / CONTACT ================= */}
      <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-[#221a10] to-[#16110b] py-18 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42vw] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[110px]"
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6">
          <Reveal>
            <p className="mb-3 font-script text-3xl text-[#D4AF37] sm:text-4xl">gaplashamizmi?</p>
            <h2 className="font-display text-3xl text-[#F7F2E9] sm:text-4xl lg:text-5xl">
              Sevgingizni <span className="text-gold">raqamlashtiramiz</span>
            </h2>
            <p className="mx-auto mb-9 mt-4 max-w-md text-sm text-[#F7F2E9]/60 sm:text-base">
              Savolingiz bormi yoki darhol boshlamoqchimisiz — biz bir qo&apos;ng&apos;iroq narida turibmiz.
            </p>
          </Reveal>

          <Reveal className="mx-auto max-w-md" delay={0.1}>
            <a
              href={PHONE_LINK}
              className="group flex items-center justify-center gap-4 rounded-[1.4rem] border border-[#D4AF37]/25 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:bg-white/10 sm:p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10 transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                <Phone className="h-6 w-6 text-[#D4AF37] sm:h-7 sm:w-7" />
              </div>
              <div className="text-left">
                <p className="flex items-center gap-1.5 text-xs text-[#F7F2E9]/50">
                  <MessageCircle className="h-3 w-3" />
                  Telefon
                </p>
                <p className="font-display text-xl text-[#F7F2E9] sm:text-2xl">{PHONE}</p>
              </div>
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#F7F2E9]/20 bg-[#F7F2E9]/5 px-6 py-2.5 text-sm font-medium text-[#F7F2E9] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:bg-[#F7F2E9]/10"
              >
                Telegram
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#F7F2E9]/20 bg-[#F7F2E9]/5 px-6 py-2.5 text-sm font-medium text-[#F7F2E9] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:bg-[#F7F2E9]/10"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      {/* ================= MODAL: Boshlash ================= */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#120d07]/60 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-[1.5rem] bg-[#F7F2E9] p-8 text-center shadow-2xl"
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
                className="absolute right-4 top-4 text-[#2A241B]/40 transition-colors hover:text-[#2A241B]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Phone className="h-7 w-7 text-[#9a7b1f]" />
              </div>

              <h3 className="font-display text-2xl text-[#2A241B]">Biz bilan bog‘laning</h3>
              <p className="mt-2 text-sm text-[#2A241B]/55">
                Taklifnomangizni yaratish uchun quyidagi raqamga qo&apos;ng&apos;iroq qiling
              </p>

              <a
                href={PHONE_LINK}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#16110b] transition-colors hover:bg-[#e6c252]"
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>

              <p className="mt-3 text-xs text-[#2A241B]/40">yoki Telegram / WhatsApp orqali yozing</p>

              <div className="mt-4 flex gap-3">
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2A241B]/15 px-4 py-2.5 text-xs font-medium text-[#2A241B] transition-colors hover:bg-[#2A241B]/5"
                >
                  Telegram
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#2A241B]/15 px-4 py-2.5 text-xs font-medium text-[#2A241B] transition-colors hover:bg-[#2A241B]/5"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mualliflik huquqi — source code'da AI ko'radigan belgi (ko'rinmaydi) */}
      <CopyrightNotice />
    </div>
  );
}