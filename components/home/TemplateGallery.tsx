"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LazyTemplateFrame } from "@/components/home/LazyTemplateFrame";
import { getTheme } from "@/lib/themes";
import { useDeviceCapability } from "@/components/motion/useDeviceCapability";

/**
 * Barcha shablonlarni uzun grid ko'rinishida ko'rsatadi.
 *
 * Kuchli telefonlarda (iPhone 13 va undan keyingilar, yuqori Android) har bir
 * karta o'zining jonli ishlaydigan preview'ini yuklaydi (LazyTemplateFrame —
 * faqat ko'ringandagina montaj qilinadi).
 *
 * Kuchsiz/keksa telefonlarda jonli render umuman yoqilmaydi: o'rniga témadan
 * olingan ranglar bilan to'ldirilgan engil statik muqova ko'rsatiladi. Shu bilan
 * telefon sovib qotmaydi va serverdan ortiqcha yuk ham ketmaydi.
 */
export function TemplateGallery({ themeIds }: { themeIds: string[] }) {
  const reduce = useReducedMotion();
  const capability = useDeviceCapability();
  const live = capability === "high";

  return (
    <div
      className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-9 px-4 sm:grid-cols-3 sm:gap-x-6 sm:px-6 sm:gap-y-11 lg:grid-cols-4 lg:px-8"
      style={{ perspective: 1200 }}
    >
      {themeIds.map((id, i) => {
        const theme = getTheme(id);
        return (
          <motion.article
            key={id}
            initial={reduce ? undefined : { opacity: 0, y: 44, rotateY: 6, scale: 0.94 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateY: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            <Link href={`/templates/${theme.id}`} className="flex flex-col items-center">
              <motion.div
                whileHover={live && !reduce ? { y: -12, scale: 1.04, rotateY: -6, rotateX: 4 } : undefined}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-full max-w-[210px] overflow-hidden rounded-[1.55rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-[0_22px_55px_-24px_rgba(46,42,39,0.55)] transition-shadow duration-500 group-hover:shadow-[0_36px_80px_-28px_rgba(46,42,39,0.7)]"
              >
                <span className="absolute left-1/2 top-0 z-30 h-2.5 w-10 -translate-x-1/2 rounded-b-md bg-[#2E2A27]" />
                {live ? (
                  <LazyTemplateFrame themeId={theme.id} />
                ) : (
                  <StaticCover
                    start={theme.colors["bg-start"] ?? "#f7f2e9"}
                    mid={theme.colors["bg-mid"] ?? "#efe6d4"}
                    end={theme.colors["bg-end"] ?? "#2a241b"}
                    gold={theme.colors["gold"] ?? "#d4af37"}
                    script={theme.fonts["theme-script-font"]}
                  />
                )}

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3/4 bg-gradient-to-t from-[#120d07]/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute inset-x-0 bottom-3 z-30 hidden items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#F7F2E9] transition-transform duration-500 group-hover:flex"
                >
                  Ochish
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.span>
              </motion.div>

              <p className="mt-3 text-center text-[11px] font-medium leading-snug text-[#2A241B]/55 transition-colors duration-300 group-hover:text-[#9a7b1f] sm:text-xs">
                {theme.name}
              </p>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}

/** Kuchsiz telefonlar uchun engil statik muqova — jonli render qilinmaydi. */
function StaticCover({
  start,
  mid,
  end,
  gold,
  script,
}: {
  start: string;
  mid: string;
  end: string;
  gold: string;
  script?: string;
}) {
  return (
    <div
      className="relative flex aspect-[9/19] w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${start} 0%, ${mid} 45%, ${end} 100%)`,
      }}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-2xl"
        style={{ background: `radial-gradient(circle, ${gold}, transparent 70%)` }}
      />
      <svg
        viewBox="0 0 120 80"
        className="relative h-8 w-12"
        fill="none"
        aria-hidden
      >
        <ellipse
          cx="42"
          cy="45"
          rx="28"
          ry="18"
          stroke={gold}
          strokeWidth="8"
          transform="rotate(-12 42 45)"
        />
        <ellipse
          cx="78"
          cy="45"
          rx="28"
          ry="18"
          stroke={gold}
          strokeWidth="8"
          transform="rotate(12 78 45)"
        />
      </svg>
      <span
        className="relative mt-3 text-center text-sm leading-tight"
        style={{ fontFamily: script ?? "serif", color: gold }}
      >
        To&apos;y
        <br />
        taklifnomasi
      </span>
    </div>
  );
}