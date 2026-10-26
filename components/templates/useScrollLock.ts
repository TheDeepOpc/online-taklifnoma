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
      bodyPosition: body.style.position,
      bodyInset: body.style.inset,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
    };
    const restoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.inset = "0";
    body.style.width = "100%";
    body.style.height = "100%";

    const block = (e: TouchEvent | WheelEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    const blockKeys = (e: KeyboardEvent) => {
      // Space/Enter on the opening button remain available to keyboard users.
      const activation = (e.key === " " || e.key === "Enter") && (e.target as HTMLElement)?.closest("button");
      if (!activation && [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("keydown", blockKeys);

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.overscroll;
      body.style.position = prev.bodyPosition;
      body.style.inset = prev.bodyInset;
      body.style.width = prev.bodyWidth;
      body.style.height = prev.bodyHeight;
      history.scrollRestoration = restoration;
      window.removeEventListener("touchmove", block);
      window.removeEventListener("wheel", block);
      window.removeEventListener("keydown", blockKeys);
      window.scrollTo(0, 0);
    };
  }, [locked]);
}
