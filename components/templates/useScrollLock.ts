"use client";

import { useEffect } from "react";

/**
 * Kirish konverti/parda ochilmaguncha orqadagi sahifa aylanmasin —
 * originallardagi `body { overflow: hidden }` xatti-harakati.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [locked]);
}
