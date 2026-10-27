"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { MusicNoteIcon, MusicMuteIcon } from "@/components/templates/icons";

export interface MusicPlayerHandle { play: () => void }
type PlaybackState = "paused" | "loading" | "playing" | "error";
const DEFAULT_BUTTON_STYLE: React.CSSProperties = { background: "rgba(255,255,255,0.9)", color: "inherit", backdropFilter: "blur(4px)" };

export const MusicPlayer = forwardRef<MusicPlayerHandle, { src: string; buttonStyle?: React.CSSProperties; hidden?: boolean }>(function MusicPlayer({ src, buttonStyle, hidden = false }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wantedRef = useRef(false);
  const blockedRef = useRef(false);
  const requestRef = useRef(0);
  const resumeAtRef = useRef(0);
  const [state, setState] = useState<PlaybackState>("paused");
  const stateRef = useRef<PlaybackState>("paused");
  const update = useCallback((next: PlaybackState) => { stateRef.current = next; setState(next); }, []);

  const attempt = useCallback(() => {
    wantedRef.current = true;
    const audio = audioRef.current;
    if (!audio) { blockedRef.current = true; return; }
    const request = ++requestRef.current;
    blockedRef.current = false;
    if (audio.error) {
      resumeAtRef.current = audio.currentTime || 0;
      audio.load();
    }
    audio.muted = false;
    audio.volume = 1;
    update("loading");
    void audio.play().then(() => {
      if (request === requestRef.current && wantedRef.current) update("playing");
    }).catch((error: DOMException) => {
      if (request !== requestRef.current || !wantedRef.current) return;
      if (error.name === "NotAllowedError") { blockedRef.current = true; update("paused"); }
      else if (error.name !== "AbortError") update("error");
    });
  }, [update]);
  useImperativeHandle(ref, () => ({ play: attempt }), [attempt]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const playing = () => { if (!wantedRef.current || audio.paused) return; blockedRef.current = false; update("playing"); };
    const waiting = () => { if (wantedRef.current) update("loading"); };
    const stalled = () => { if (wantedRef.current && audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) update("loading"); };
    const pause = () => { if (!audio.error) update("paused"); };
    const error = () => { if (wantedRef.current) update("error"); };
    const canplay = () => { if (wantedRef.current && audio.paused && !blockedRef.current) attempt(); };
    const metadata = () => { if (resumeAtRef.current) { audio.currentTime = resumeAtRef.current; resumeAtRef.current = 0; } };
    audio.addEventListener("playing", playing); audio.addEventListener("waiting", waiting);
    audio.addEventListener("stalled", stalled); audio.addEventListener("pause", pause);
    audio.addEventListener("error", error); audio.addEventListener("canplay", canplay); audio.addEventListener("loadedmetadata", metadata);
    if (wantedRef.current) attempt();
    return () => {
      requestRef.current += 1;
      audio.removeEventListener("playing", playing); audio.removeEventListener("waiting", waiting);
      audio.removeEventListener("stalled", stalled); audio.removeEventListener("pause", pause);
      audio.removeEventListener("error", error); audio.removeEventListener("canplay", canplay); audio.removeEventListener("loadedmetadata", metadata);
    };
  }, [src, attempt, update]);

  useEffect(() => {
    const retry = (event: Event) => {
      // The music button owns its click. A capture retry here used to play and
      // immediately pause the same audio again in the button's onClick.
      if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
      if (blockedRef.current && wantedRef.current) attempt();
    };
    window.addEventListener("pointerdown", retry, { passive: true, capture: true });
    window.addEventListener("keydown", retry, { capture: true });
    window.addEventListener("click", retry, { capture: true });
    return () => { window.removeEventListener("pointerdown", retry, { capture: true }); window.removeEventListener("keydown", retry, { capture: true }); window.removeEventListener("click", retry, { capture: true }); };
  }, [attempt]);

  function toggle() {
    if (stateRef.current === "loading" || stateRef.current === "playing") {
      wantedRef.current = false; blockedRef.current = false; requestRef.current += 1;
      audioRef.current?.pause(); update("paused");
    } else attempt();
  }
  const label = state === "playing" ? "Musiqani to‘xtatish" : state === "loading" ? "Musiqa yuklanmoqda — to‘xtatish" : state === "error" ? "Musiqani qayta yuklash" : "Musiqani yoqish";
  return <div className="fixed bottom-4 right-4 z-[60]" style={hidden ? { visibility: "hidden", pointerEvents: "none" } : undefined} aria-hidden={hidden || undefined} data-music-state={state}>
    {/* Faqat sarlavha (metadata) oldindan olinadi: fayl "faststart" AAC, mehmon
        bosganda ~0.25 s da boshlanadi — ochmaydigan mehmon 3–4 MB yuklamaydi. */}
    <audio ref={audioRef} src={src} loop preload="metadata" />
    <button ref={buttonRef} type="button" onClick={toggle} style={{ ...DEFAULT_BUTTON_STYLE, ...buttonStyle }} className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition hover:scale-105" aria-label={label} title={label} aria-pressed={state === "playing" || state === "loading"} tabIndex={hidden ? -1 : 0} data-music-toggle>
      {state === "loading" ? <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" /> : state === "error" ? <RotateCcw className="h-5 w-5" /> : state === "playing" ? <MusicNoteIcon className="h-5 w-5" /> : <MusicMuteIcon className="h-5 w-5" />}
    </button>
    {!hidden && (state === "loading" || state === "error") && <span role="status" className="absolute bottom-14 right-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] shadow-sm" style={{ ...DEFAULT_BUTTON_STYLE, ...buttonStyle }}>{state === "loading" ? "Musiqa yuklanmoqda…" : "Qayta yoqish uchun bosing"}</span>}
  </div>;
});
