"use client";

import { useState } from "react";

/**
 * To'yona karta raqamini nusxalash. `navigator.clipboard` faqat xavfsiz
 * kontekstda va iframe'ga `clipboard-write` ruxsati berilganda ishlaydi —
 * aks holda jim xato berib, mehmon hech narsa nusxalanmaganini bilmay qolardi.
 * Shuning uchun eski `execCommand` zaxira yo'li va aniq holat matni bor.
 */
export function CopyGiftButton({
  text,
  className,
  label = "Nusxalash",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  async function handleCopy() {
    const digits = text.replace(/\s+/g, "");
    let ok = false;
    try {
      await navigator.clipboard.writeText(digits);
      ok = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = digits;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      area.remove();
    }
    setState(ok ? "done" : "fail");
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button type="button" className={className} onClick={handleCopy} aria-live="polite">
      {state === "done" ? "Nusxalandi ✓" : state === "fail" ? "Qo'lda nusxalang" : label}
    </button>
  );
}

/** 8600123456789012 -> "8600 1234 5678 9012" */
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 12) return raw;
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}
