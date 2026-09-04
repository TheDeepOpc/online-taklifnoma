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

export function CountdownTimer({
  targetDate,
  variant = "ornate",
}: {
  targetDate: string;
  variant?: "ornate" | "divided";
}) {
  const target = new Date(targetDate).getTime();
  // Serverda va mijozda "hozir" turlicha bo'lgani uchun, hidratsiyadan keyin
  // mount bo'lgach darhol hisoblab, keyin har soniyada yangilaymiz.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining(target));
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!remaining) return null;

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
