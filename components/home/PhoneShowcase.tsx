"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { PhoneShot } from "./TemplateShot";
import { getTheme } from "@/lib/themes";

/** Hero'dagi uchta qiyshaygan telefon — skrollda parallaks, doimiy yumshoq suzish. */
export function PhoneShowcase({ themeIds }: { themeIds: [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const ySide = useTransform(smooth, [0, 1], ["0px", "-80px"]);
  const yFront = useTransform(smooth, [0, 1], ["0px", "48px"]);
  const rotSide = useTransform(smooth, [0, 1], [0, 4]);

  const [left, center, right] = themeIds;

  return (
    <div
      ref={ref}
      className="relative flex h-[360px] items-center justify-center sm:h-[430px] lg:h-[520px]"
    >
      <div
        aria-hidden
        className="aurora-a pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(214,158,130,0.32) 0%, rgba(184,146,63,0.18) 45%, transparent 72%)",
        }}
      />

      <motion.div
        style={reduce ? undefined : { y: ySide, rotate: rotSide }}
        className="absolute left-1/2 z-10 -translate-x-[104%] -rotate-[9deg]"
        initial={{ opacity: 0, x: -60, rotate: -18 }}
        animate={{ opacity: 1, x: 0, rotate: -9 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <PhoneShot
          themeId={left}
          alt={getTheme(left).name}
          dim
          frameClassName="w-[124px] sm:w-[146px] lg:w-[168px]"
        />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: ySide, rotate: rotSide }}
        className="absolute left-1/2 z-10 translate-x-[4%] rotate-[9deg]"
        initial={{ opacity: 0, x: 60, rotate: 18 }}
        animate={{ opacity: 1, x: 0, rotate: 9 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <PhoneShot
          themeId={right}
          alt={getTheme(right).name}
          dim
          frameClassName="w-[124px] sm:w-[146px] lg:w-[168px]"
        />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: yFront }}
        className="relative z-20"
        initial={{ opacity: 0, y: 56, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneShot
            themeId={center}
            alt={getTheme(center).name}
            eager
            frameClassName="w-[186px] sm:w-[218px] lg:w-[248px]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
