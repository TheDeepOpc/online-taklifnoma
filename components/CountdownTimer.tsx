"use client";

import { useEffect, useState } from "react";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export interface CountdownClasses {
  root?: string;
  cell?: string;
  value?: string;
  label?: string;
}

export function CountdownTimer({
  targetDate,
  variant = "ornate",
  live = true,
  classes,
  pad = false,
  labels,
}: {
  targetDate: string;
  variant?: "ornate" | "divided";
  /** Small preview cards (template gallery, admin live preview) render many of
   * these at once — ticking every second in the background is pure wasted
   * CPU there, so callers pass `live={false}` to freeze it after one read. */
  live?: boolean;
  /** Berilsa, umumiy Tailwind uslublari o'rniga shablonning o'z CSS moduli
   * klasslari ishlatiladi — originaldagi katta raqamlar/ajratgichlar uchun. */
  classes?: CountdownClasses;
  /** Raqamlarni ikki xonali qilib ko'rsatish (01, 08, ...). */
  pad?: boolean;
  /** Kun/soat/daqiqa/soniya yorliqlari. */
  labels?: [string, string, string, string];
}) {
  const target = new Date(targetDate).getTime();
  // Serverda va mijozda "hozir" turlicha bo'lgani uchun, hidratsiyadan keyin
  // mount bo'lgach darhol hisoblab, keyin har soniyada yangilaymiz.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining(target));
    if (!live) return;
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target, live]);

  if (!remaining) return null;

  if (classes) {
    const [lDay, lHour, lMin, lSec] = labels ?? ["Kun", "Soat", "Daqiqa", "Soniya"];
    const cells = [
      { label: lDay, value: remaining.days },
      { label: lHour, value: remaining.hours },
      { label: lMin, value: remaining.minutes },
      { label: lSec, value: remaining.seconds },
    ];
    return (
      <div className={classes.root} role="timer" aria-live="polite">
        {cells.map((c) => (
          <div key={c.label} className={classes.cell}>
            <span className={classes.value}>
              {pad ? String(c.value).padStart(2, "0") : c.value}
            </span>
            <small className={classes.label}>{c.label}</small>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "divided") {
    const units = [
      { label: "kun", value: remaining.days },
      { label: "soat", value: remaining.hours },
      { label: "daqiqa", value: remaining.minutes },
      { label: "soniya", value: remaining.seconds },
    ];

    return (
      <div className="flex items-baseline justify-center">
        {units.map((u, i) => (
          <div key={u.label} className="relative px-5 text-center">
            {i > 0 && (
              <span
                aria-hidden
                className="absolute top-[8%] bottom-[8%] left-0 w-px opacity-40"
                style={{ background: "var(--gold)" }}
              />
            )}
            <div
              className="text-2xl tabular-nums sm:text-3xl"
              style={{ fontFamily: "var(--theme-script-font)" }}
            >
              {u.value}
            </div>
            <div
              className="mt-2 text-[10px] uppercase tracking-[0.14em] opacity-75"
              style={{ fontFamily: "var(--theme-label-font)" }}
            >
              {u.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "kun", value: remaining.days },
    { label: "soat", value: remaining.hours },
    { label: "daq", value: remaining.minutes },
    { label: "son", value: remaining.seconds },
  ];

  return (
    <div className="flex items-start justify-center gap-1.5">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start">
          <div className="flex min-w-[52px] flex-col items-center">
            <span
              className="text-xl sm:text-2xl"
              style={{ fontFamily: "var(--theme-body-font)" }}
            >
              {u.value}
            </span>
            <span
              className="mt-0.5 text-[10px] uppercase tracking-[0.12em] opacity-70"
              style={{ fontFamily: "var(--theme-label-font)" }}
            >
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="mt-1 px-1 text-lg opacity-60" aria-hidden>
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
