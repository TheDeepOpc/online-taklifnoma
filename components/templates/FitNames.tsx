"use client";

import { useEffect, useRef } from "react";

/**
 * Shablonlar dizayni "Azizbek & Malika" kabi qisqa ismlarga chizilgan —
 * "Muhammadabdulloh" yoki "Shahrizodabonu" kabi uzun ismlar katta script
 * shriftda ekrandan chiqib ketar, so'z o'rtasidan bo'linib ketar edi.
 *
 * Bu o'rovchi har bir shablon ichidagi ism yozilgan elementlarni topadi va
 * ismning eng uzun so'zi mavjud kenglikka sig'maguncha shriftni kichraytiradi.
 * CSS'dagi asl o'lcham "eng katta" bo'lib qoladi — qisqa ismlarga tegilmaydi.
 */
const MIN_SCALE = 0.45;
const FIT_ATTR = "data-fit-base";

function nameWords(names: string[]): string[] {
  return [...new Set(names.flatMap((n) => n.split(/\s+/)).filter((w) => w.length >= 5))];
}

function contentWidth(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

function availableWidth(el: HTMLElement): number {
  // Flex/grid ichidagi element o'z matniga qarab kengayadi (shrink-to-fit) —
  // shuning uchun cheklovni ota konteynerdan olamiz.
  let parent = el.parentElement;
  while (parent && getComputedStyle(parent).display.startsWith("inline")) {
    parent = parent.parentElement;
  }
  if (!parent) return 0;
  let avail = contentWidth(parent);

  const cs = getComputedStyle(el);
  if (!cs.display.startsWith("inline")) {
    const parentDisplay = getComputedStyle(parent).display;
    if (!/flex|grid/.test(parentDisplay)) avail = Math.min(avail, contentWidth(el));
    const maxWidth = parseFloat(cs.maxWidth);
    if (Number.isFinite(maxWidth)) {
      avail = Math.min(avail, maxWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
    }
  }
  return Math.min(avail, document.documentElement.clientWidth - 12);
}

function measureWord(el: HTMLElement, word: string, fontSize: number): number {
  const cs = getComputedStyle(el);
  const probe = document.createElement("span");
  probe.textContent = word;
  probe.style.cssText = [
    "position:absolute",
    "visibility:hidden",
    "white-space:nowrap",
    "left:-9999px",
    "top:0",
    `font-family:${cs.fontFamily}`,
    `font-weight:${cs.fontWeight}`,
    `font-style:${cs.fontStyle}`,
    `font-size:${fontSize}px`,
    `letter-spacing:${cs.letterSpacing}`,
    `text-transform:${cs.textTransform}`,
    `font-variant:${cs.fontVariant}`,
  ].join(";");
  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

function fitAll(root: HTMLElement, words: string[]) {
  if (words.length === 0) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets = new Set<HTMLElement>();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    const parent = node.parentElement;
    if (!parent || parent.closest("svg, button, [data-fit-skip]")) continue;
    const lower = text.toLowerCase();
    if (words.some((w) => lower.includes(w.toLowerCase()))) targets.add(parent);
  }

  for (const el of targets) {
    const cs = getComputedStyle(el);
    // Oddiy matn (paragraf ichida ism) — faqat katta sarlavhalar bilan ishlaymiz.
    const base = Number(el.getAttribute(FIT_ATTR)) || parseFloat(cs.fontSize);
    if (base < 22) continue;
    const avail = availableWidth(el);
    if (avail <= 0) continue;
    const text = (el.textContent ?? "").toLowerCase();
    const longest = words
      .filter((w) => text.includes(w.toLowerCase()))
      .reduce((max, w) => Math.max(max, measureWord(el, w, base)), 0);
    if (longest <= avail) {
      if (el.hasAttribute(FIT_ATTR)) {
        el.style.fontSize = "";
        el.removeAttribute(FIT_ATTR);
      }
      continue;
    }
    const scale = Math.max(MIN_SCALE, (avail / longest) * 0.97);
    el.setAttribute(FIT_ATTR, String(base));
    el.style.fontSize = `${Math.floor(base * scale)}px`;
  }
}

export function FitNames({ names, children }: { names: string[]; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const key = names.join("|");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = nameWords(key.split("|"));
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fitAll(root, words));
    };

    schedule();
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener("resize", schedule);
    // Gate ochilganda/kalligrafiya mount bo'lganda yangi elementlar paydo bo'ladi.
    const observer = new MutationObserver((mutations) => {
      // Countdown har soniyada matn tugunini almashtiradi — faqat yangi element
      // qo'shilganda qayta o'lchaymiz.
      if (mutations.some((m) => [...m.addedNodes].some((n) => n.nodeType === Node.ELEMENT_NODE))) {
        schedule();
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [key]);

  return <div ref={ref}>{children}</div>;
}
