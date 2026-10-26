"use client";

import { useEffect } from "react";

/**
 * Kirish konverti/parda ochilmaguncha orqadagi sahifa aylanmasin —
 * originallardagi `body { overflow: hidden }` xatti-harakati.
 *
 * Faqat `body` ni qulflash yetarli emas: iOS Safari va ba'zi Android
 * brauzerlarida `html` ham aylanadi, touch-swipe esa fixed qatlam ostidan
 * orqa sahifani surib yuboradi (gate ochiq turganda sahifa pastga tushib,
 * "Ochish" bosilganda foydalanuvchi o'rtadan boshlab qolardi). Shuning uchun
 * ikkalasini qulflaymiz, touchmove'ni to'xtatamiz va sahifani tepaga qaytaramiz.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const { body } = document;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      overscroll: html.style.overscrollBehavior,
    };
    const restoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    const block = (e: TouchEvent | WheelEvent) => {
      // Gate'ning o'zi kichik ekranga sig'masa, uning ichida aylantirish mumkin bo'lsin.
      for (let el = e.target as HTMLElement | null; el && el !== body; el = el.parentElement) {
        const { overflowY } = getComputedStyle(el);
        if (/(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight) return;
      }
      if (e.cancelable) e.preventDefault();
    };
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("wheel", block, { passive: false });

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.overscroll;
      history.scrollRestoration = restoration;
      window.removeEventListener("touchmove", block);
      window.removeEventListener("wheel", block);
    };
  }, [locked]);
}
