"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
  const [muted, setMuted] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play().catch(() => {
        // Brauzer autoplay'ni bloklashi mumkin; foydalanuvchi tugma orqali yoqadi.
      });
    },
  }));

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src={src} loop muted={muted} />
      <button
        type="button"
        onClick={() => {
          setMuted((m) => !m);
          audioRef.current?.play().catch(() => {});
        }}
        style={{ ...DEFAULT_BUTTON_STYLE, ...buttonStyle }}
        className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
        aria-label={muted ? "Musiqani yoqish" : "Musiqani o'chirish"}
      >
        {muted ? (
          <MusicMuteIcon className="h-5 w-5" />
        ) : (
          <MusicNoteIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
});
