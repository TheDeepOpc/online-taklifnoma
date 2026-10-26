"use client";

import { useEffect, useRef, useState } from "react";
import { useDeviceCapability } from "@/components/motion/useDeviceCapability";
import styles from "./RevealCard.module.css";

export function RevealCard({
  className,
  alwaysVisible = false,
  children,
}: {
  className?: string;
  alwaysVisible?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(alwaysVisible);
  const lite = useDeviceCapability() === "low";

  useEffect(() => {
    if (alwaysVisible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Bo'lim ekranga biroz kirgach ochiladi — chetida "yarim ko'rinib" qolmaydi.
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [alwaysVisible]);

  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${styles.reveal} ${visible ? "" : styles.hidden} ${lite ? styles.lite : ""}`}
    >
      {children}
    </div>
  );
}
