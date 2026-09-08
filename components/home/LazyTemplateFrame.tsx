"use client";

import { useEffect, useRef, useState } from "react";
import { TemplatePreviewFrame } from "@/components/templates/PreviewFrame";

/**
 * Preview kartani tomoshabin ko'rinishga yaqinlashgandagina (IntersectionObserver
 * bilan) montaj qiladi. Jonli shablonlar og'ir — sahifa ochilganda hammasini
 * birdan render qilish telefonlarda sahifani qotirib qo'yadi. Karta ko'ndalangiga
 * kelguncha bo'sh chizma (skeleton) ko'rsatiladi.
 */
export function LazyTemplateFrame({ themeId }: { themeId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-[#F0E9DD]">
      {show ? (
        <TemplatePreviewFrame themeId={themeId} scaleClassName="scale-[0.45] sm:scale-[0.5]" />
      ) : (
        <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#EDE4D3] to-[#F7F2E9]" />
      )}
    </div>
  );
}