"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import styles from "./ParallaxScene.module.css";

/** Transform-only scrolling: no fixed backgrounds, wheel handlers or layout reads. */
export function ParallaxScene({ src, className = "", imageClassName = "", enabled = true, priority = false, label = "" }: {
  src: string; className?: string; imageClassName?: string; enabled?: boolean; priority?: boolean; label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const y = useTransform(progress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(progress, [0, 1], [1.19, 1.08]);
  const active = enabled && !reduced;

  return <div ref={ref} className={`${styles.scene} ${className}`} data-parallax-scene={active ? "active" : "still"}>
    <motion.div className={styles.layer} style={active ? { y, scale } : undefined} data-parallax-layer={active ? "image" : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className={imageClassName} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
    </motion.div>
  </div>;
}
