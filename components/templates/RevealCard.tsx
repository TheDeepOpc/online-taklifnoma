"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (alwaysVisible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [alwaysVisible]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1s ease, transform 1s ease",
      }}
    >
      {children}
    </div>
  );
}
