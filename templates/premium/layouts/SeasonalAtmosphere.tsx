"use client";

import type { CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import type { Atmosphere } from "@/lib/templateDesigns";
import styles from "./SeasonalAtmosphere.module.css";

const sprites: Record<Atmosphere, string> = {
  snow: "/invitation-art/effects/snow-crystal.webp",
  leaves: "/invitation-art/effects/autumn-leaf.webp",
  clouds: "/invitation-art/effects/celestial-star.webp",
  stars: "/invitation-art/effects/celestial-star.webp",
  petals: "/imported-assets/ivory-envelope/petal-1.webp",
  pearls: "/imported-assets/swan-noir/pearl.png",
  pollen: "/imported-assets/ivory-envelope/petal-2.webp",
  gold: "/invitation-art/effects/celestial-star.webp",
  heritage: "/imported-assets/milliy-ornament/flower.webp",
};

function Cloud({ index }: { index: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 2500], [0, -90 - index * 65]);
  const x = useTransform(scrollY, [0, 2500], [0, (index % 2 ? -1 : 1) * (65 + index * 30)]);
  return <motion.div className={`${styles.cloudLayer} ${styles[`cloud${index}`]}`} style={{ y, x }} data-cloud-parallax={index}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/invitation-art/effects/cloud-bank.webp" alt="" />
  </motion.div>;
}

export function SeasonalAtmosphere({ effect, previewMode }: { effect: Atmosphere; previewMode: boolean }) {
  const reduced = useMotionPreference();
  if (previewMode || reduced) return null;
  const count = effect === "snow" ? 46 : effect === "stars" || effect === "clouds" ? 24 : effect === "leaves" ? 20 : 13;
  return <div className={`${styles.atmosphere} ${styles[effect]}`} aria-hidden="true" data-seasonal-effect={effect}>
    {effect === "clouds" && [0, 1, 2].map(index => <Cloud key={index} index={index} />)}
    {Array.from({ length: count }, (_, index) => <span className={styles.particle} key={index} style={{
      "--left": `${(index * 41 + 9) % 101}%`, "--top": `${(index * 29 + 7) % 90}%`, "--delay": `${-index * 2.13}s`,
      "--duration": `${effect === "snow" ? 12 + index % 8 * 2 : 18 + index % 7 * 3}s`,
      "--size": `${effect === "snow" ? 4 + index % 6 * 2 : effect === "leaves" ? 22 + index % 5 * 6 : effect === "clouds" || effect === "stars" ? 8 + index % 4 * 5 : 7 + index % 5 * 3}px`,
      "--sway": `${(index % 2 ? -1 : 1) * (25 + index % 6 * 12)}px`, "--rotation": `${index * 47}deg`,
    } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={sprites[effect]} alt="" />
    </span>)}
  </div>;
}
