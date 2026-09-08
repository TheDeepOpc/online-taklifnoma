"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TemplateShot } from "@/components/home/TemplateShot";
import { getTheme } from "@/lib/themes";

/**
 * Barcha shablonlarni grid ko'rinishida ko'rsatadi.
 *
 * Ilgari har bir karta haqiqiy shablon komponentini kichraytirib render qilardi.
 * Bu ikki muammo tug'dirardi: (1) telefonlarda og'ir — 18 ta to'liq taklifnoma
 * bir sahifada; (2) kichraytirilganda shrift va joylashuv buzilib, xunuk
 * ko'rinardi. Endi oldindan olingan aniq skrinshotlar ishlatiladi
 * (public/template-shots/*.webp, `npm run shots` bilan yangilanadi) —
 * sahifa yengil, ko'rinish esa 1:1 aniq.
 */
export function TemplateGallery({ themeIds }: { themeIds: string[] }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-9 px-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 sm:px-6 lg:grid-cols-4 lg:px-8"
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
                whileHover={reduce ? undefined : { y: -12, scale: 1.04, rotateY: -6, rotateX: 4 }}
                whileTap={reduce ? undefined : { scale: 0.99 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-full max-w-[210px] overflow-hidden rounded-[1.55rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-[0_22px_55px_-24px_rgba(46,42,39,0.55)] transition-shadow duration-500 group-hover:shadow-[0_36px_80px_-28px_rgba(46,42,39,0.7)]"
              >
                <span className="absolute left-1/2 top-0 z-30 h-2.5 w-10 -translate-x-1/2 rounded-b-md bg-[#2E2A27]" />

                <div className="relative aspect-[43/90] w-full overflow-hidden bg-[#F0E9DD]">
                  <TemplateShot themeId={theme.id} alt={theme.name} />
                </div>

                {/* yaltirash — kursor ustiga kelganda o'tib ketadi */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
                />

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3/4 bg-gradient-to-t from-[#120d07]/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="absolute inset-x-0 bottom-3 z-30 hidden translate-y-2 items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#F7F2E9] transition-transform duration-500 group-hover:flex group-hover:translate-y-0">
                  Ochish
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
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
