"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { TemplatePreviewFrame } from "@/components/templates/PreviewFrame";

/** Hero'dagi uchta qiyshaygan telefon — skrollda parallaks, doimiy yumshoq suzish. */
export function PhoneShowcase({ themeIds }: { themeIds: [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yBack = useTransform(scrollYProgress, [0, 1], ["0px", "-70px"]);
  const yFront = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);

  const [left, center, right] = themeIds;

  return (
    <div ref={ref} className="relative flex h-[380px] items-center justify-center sm:h-[440px] lg:h-[520px]">
      {/* yumshoq nur */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(214,158,130,0.30) 0%, rgba(184,146,63,0.16) 45%, transparent 72%)",
        }}
      />

      <motion.div
        style={reduce ? undefined : { y: yBack }}
        className="absolute left-1/2 z-10 -translate-x-[102%] rotate-[-9deg]"
        initial={{ opacity: 0, x: -40, rotate: -16 }}
        animate={{ opacity: 1, x: 0, rotate: -9 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Phone themeId={left} className="w-[132px] sm:w-[152px] lg:w-[172px]" scale="scale-[0.33] sm:scale-[0.38] lg:scale-[0.43]" dim />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: yBack }}
        className="absolute left-1/2 z-10 translate-x-[2%] rotate-[9deg]"
        initial={{ opacity: 0, x: 40, rotate: 16 }}
        animate={{ opacity: 1, x: 0, rotate: 9 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Phone themeId={right} className="w-[132px] sm:w-[152px] lg:w-[172px]" scale="scale-[0.33] sm:scale-[0.38] lg:scale-[0.43]" dim />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: yFront }}
        className="relative z-20"
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Phone
            themeId={center}
            className="w-[196px] sm:w-[224px] lg:w-[252px]"
            scale="scale-[0.49] sm:scale-[0.56] lg:scale-[0.63]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Phone({
  themeId,
  className,
  scale,
  dim = false,
}: {
  themeId: string;
  className: string;
  scale: string;
  dim?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[9/19] overflow-hidden rounded-[1.75rem] border-[5px] border-[#2E2A27] bg-[#2E2A27] shadow-[0_28px_60px_-18px_rgba(46,42,39,0.45)] ${className}`}
    >
      <span className="absolute left-1/2 top-0 z-30 h-3 w-12 -translate-x-1/2 rounded-b-lg bg-[#2E2A27]" />
      <TemplatePreviewFrame themeId={themeId} scaleClassName={scale} />
      {dim && <span aria-hidden className="absolute inset-0 z-40 bg-[#2E2A27]/10" />}
    </div>
  );
}
