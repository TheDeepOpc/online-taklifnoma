"use client";

import { useSyncExternalStore } from "react";

// Shablonlar mobil uchun mo'ljallangan: o'lchamlar `vw`/`svh` birliklarida.
// Kompyuterda ularni oddiy `div` ichiga solsak, `vw` baribir katta ekranga
// nisbatan hisoblanadi va dizayn buziladi. Shuning uchun desktopda taklifnoma
// haqiqiy 430px kenglikdagi viewport — ya'ni `iframe` ichida ko'rsatiladi.
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getServerSnapshot() {
  return false;
}

export function PhoneFrame({
  src,
  title,
  children,
}: {
  /** Xuddi shu sahifaning ramkasiz (`?bare=1`) manzili. */
  src: string;
  title: string;
  children: React.ReactNode;
}) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-[#e9e4d8] p-10">
      <iframe
        src={src}
        title={title}
        allow="autoplay; fullscreen"
        className="h-[880px] max-h-[92vh] w-[430px] rounded-[2.5rem] border-[10px] border-[#1c1a17] bg-white shadow-2xl"
      />
    </div>
  );
}
