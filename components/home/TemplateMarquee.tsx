"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { TemplatePreviewFrame } from "@/components/templates/PreviewFrame";
import { getTheme } from "@/lib/themes";

/**
 * Cheksiz gorizontal lenta: shablonlarning jonli namunalari.
 * Ro'yxat ikki marta chiziladi va CSS animatsiyasi bilan -50% ga suriladi,
 * shuning uchun uzilishsiz aylanadi. Kursor ustiga kelganda to'xtaydi.
 */
export function TemplateMarquee({
  themeIds,
  reverse = false,
  duration = 60,
}: {
  themeIds: string[];
  reverse?: boolean;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const items = [...themeIds, ...themeIds];

  return (
    <div className="marquee-mask relative overflow-hidden py-2">
      <div
        className="flex w-max gap-5 sm:gap-6"
        style={
          reduce
            ? undefined
            : {
                animation: `marquee-scroll ${duration}s linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
              }
        }
      >
        {items.map((id, i) => {
          const theme = getTheme(id);
          return (
            <Link
              key={`${id}-${i}`}
              href={`/templates/${theme.id}`}
              aria-hidden={i >= themeIds.length}
              tabIndex={i >= themeIds.length ? -1 : undefined}
              className="group relative block shrink-0"
            >
              <div className="relative aspect-[9/19] w-[124px] overflow-hidden rounded-[1.35rem] border-[4px] border-[#2E2A27] bg-[#2E2A27] shadow-lg transition-transform duration-500 group-hover:-translate-y-2 sm:w-[140px] lg:w-[156px]">
                <span className="absolute left-1/2 top-0 z-30 h-2.5 w-10 -translate-x-1/2 rounded-b-md bg-[#2E2A27]" />
                <TemplatePreviewFrame
                  themeId={theme.id}
                  scaleClassName="scale-[0.31] sm:scale-[0.35] lg:scale-[0.39]"
                />
              </div>
              <p className="mt-2.5 text-center text-[11px] font-medium text-[#2E2A27]/55 sm:text-xs">
                {theme.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
