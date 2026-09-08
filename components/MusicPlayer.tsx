"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MusicNoteIcon, MusicMuteIcon } from "@/components/templates/icons";

export interface MusicPlayerHandle {
  play: () => void;
}

const DEFAULT_BUTTON_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.8)",
  color: "inherit",
  backdropFilter: "blur(4px)",
};

export const MusicPlayer = forwardRef<
  MusicPlayerHandle,
  { src: string; buttonStyle?: React.CSSProperties }
>(function MusicPlayer({ src, buttonStyle }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  // Brauzer birinchi `play()` ni bloklasa (autoplay siyosati, audio hali
  // yuklanmagan va h.k.) — shu bayroq yoqiladi va foydalanuvchining keyingi
  // har qanday tegishida qayta uriniladi. Shu sabab "qo'shiq qo'yilgan lekin
  // chalinmayapti" holati yo'qoladi.
  const pendingRef = useRef(false);

  const attempt = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      pendingRef.current = true;
      return;
    }
    audio.muted = false;
    audio.volume = 1;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        pendingRef.current = false;
      }).catch(() => {
        pendingRef.current = true;
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({ play: attempt }), [attempt]);

  // Bloklangan bo'lsa — keyingi teginish/bosish/klaviatura hodisasida qayta urinish.
  useEffect(() => {
    const retry = () => {
      if (!pendingRef.current) return;
      attempt();
    };
    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("pointerdown", retry, opts);
    window.addEventListener("touchend", retry, opts);
    window.addEventListener("click", retry, opts);
    window.addEventListener("keydown", retry, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", retry, opts);
      window.removeEventListener("touchend", retry, opts);
      window.removeEventListener("click", retry, opts);
      window.removeEventListener("keydown", retry, { capture: true });
    };
  }, [attempt]);

  // Tugma belgisi haqiqiy holatga mos bo'lishi uchun audio hodisalarini kuzatamiz.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      attempt();
    } else {
      audio.pause();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        style={{ ...DEFAULT_BUTTON_STYLE, ...buttonStyle }}
        className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
        aria-label={playing ? "Musiqani to'xtatish" : "Musiqani yoqish"}
      >
        {playing ? (
          <MusicNoteIcon className="h-5 w-5" />
        ) : (
          <MusicMuteIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
});
