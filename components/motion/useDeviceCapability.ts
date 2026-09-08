"use client";

import { useSyncExternalStore } from "react";

export type DeviceCapability = "high" | "low";

/**
 * Telefon kuchini brauzer ko'rsatkichlaridan aniqlaydi.
 * - iOSda DPR >= 3 bo'lsa zamonaviy iPhone (iPhone X va undan keyingi, iPhone 13
 *   ham shular qatorida) — "high". Eski iPhone (SE, 6/7/8, DPR 2) — "low".
 * - Androidda yadro soni 6+ va RAM 4GB+ bo'lmasa "low".
 *
 * Server tarafida "high" deb hisoblaymiz, brauzerda bir marta aniqlanadi.
 */
export function useDeviceCapability(): DeviceCapability {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let cached: DeviceCapability | null = null;

function getCapability(): DeviceCapability {
  if (typeof window === "undefined") return "high";
  if (cached !== null) return cached;
  cached = detectCapability();
  return cached;
}

function subscribe(callback: () => void): () => void {
  // Birinchi chaqiruvda o'lchov natijasini muslak holga keltiramiz
  // (subscribe effect rolini bajaradi, lekin setState chaqirmaydi).
  if (cached === null) {
    cached = detectCapability();
    callback();
  }
  return () => {};
}

function getSnapshot(): DeviceCapability {
  return getCapability();
}

function getServerSnapshot(): DeviceCapability {
  return "high";
}

function detectCapability(): DeviceCapability {
  if (typeof window === "undefined") return "high";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const isIOS = /iPhone|iPad|iPod/.test(nav.userAgent);

  const cores = nav.hardwareConcurrency ?? 0;
  const mem = nav.deviceMemory ?? 0;
  const dpr = window.devicePixelRatio || 1;

  if (isIOS) {
    // Zamonaviy iPhone'lar DPR 3 ga ega (iPhone X dan boshlab), iPhone 13 ham.
    if (dpr < 3) return "low";
    if (cores > 0 && cores < 4) return "low";
    return "high";
  }

  let score = 0;
  if (cores >= 6) score += 2;
  else if (cores >= 4) score += 1;
  if (mem >= 4) score += 1;
  if (dpr >= 3) score += 1;

  return score >= 3 ? "high" : "low";
}