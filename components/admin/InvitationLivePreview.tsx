"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PREVIEW_READY, PREVIEW_RENDERED, PREVIEW_RESTART, PREVIEW_UPDATE, type InvitationPreviewPayload } from "@/lib/invitationPreview";

/** A separate viewport gives fixed effects, scroll and audio their real behavior. */
export function InvitationLivePreview({ invitation, musicTrack, src = "/admin/preview" }: InvitationPreviewPayload & { src?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const sendUpdate = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: PREVIEW_UPDATE, payload: { invitation, musicTrack } }, window.location.origin);
  }, [invitation, musicTrack]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === PREVIEW_RENDERED) { setReady(true); return; }
      if (event.data?.type !== PREVIEW_READY) return;
      setReady(true);
      sendUpdate();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [sendUpdate]);

  useEffect(() => { sendUpdate(); }, [sendUpdate]);

  function restart() {
    iframeRef.current?.contentWindow?.postMessage({ type: PREVIEW_RESTART }, window.location.origin);
  }

  return <section className="mx-auto w-full max-w-sm" aria-label="Taklifnomaning jonli telefon ko‘rinishi">
    <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-500">
      <span className="flex items-center gap-1.5"><i className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-emerald-500" : "bg-slate-300"}`} />Jonli ko‘rish</span>
      <button type="button" onClick={restart} disabled={!ready} className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-slate-100 disabled:opacity-40"><RotateCcw size={12} />Qayta ochish</button>
    </div>
    <div className="relative h-[640px] overflow-hidden rounded-[2rem] border-[8px] border-slate-800 bg-white shadow-xl">
      <iframe ref={iframeRef} src={src} title="Taklifnoma — jonli preview" allow="autoplay; fullscreen; clipboard-write" onLoad={sendUpdate} className="h-full w-full border-0" data-invitation-live-preview />
      {!ready && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-50 text-xs text-slate-400">Jonli ko‘rish yuklanmoqda…</div>}
    </div>
    <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-400">Taklifnomani ochib, telefon ichida suring. Musiqa va animatsiyalar shu yerda ishlaydi.</p>
  </section>;
}
