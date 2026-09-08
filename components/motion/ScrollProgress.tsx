"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Sahifa yuqorisidagi ingichka oltin o'qish-progressi chizig'i. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gradient-to-r from-[#D4AF37] via-[#f0d787] to-[#9a7b1f]"
    />
  );
}
