"use client";

import { useEffect, useState } from "react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { PREVIEW_READY, PREVIEW_RENDERED, PREVIEW_RESTART, PREVIEW_UPDATE, type InvitationPreviewPayload } from "@/lib/invitationPreview";

export function InvitationPreviewCanvas() {
  const [payload, setPayload] = useState<InvitationPreviewPayload | null>(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === PREVIEW_RESTART) {
        setGeneration(value => value + 1);
        return;
      }
      if (event.data?.type !== PREVIEW_UPDATE) return;
      const next = event.data.payload as InvitationPreviewPayload | undefined;
      if (!next?.invitation || typeof next.invitation.template_id !== "string" || !Array.isArray(next.invitation.gallery_photo_urls) || !Array.isArray(next.invitation.schedule_items)) return;
      setPayload(next);
      window.parent.postMessage({ type: PREVIEW_RENDERED }, window.location.origin);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!payload) return <main className="grid min-h-screen place-items-center bg-[#f7f3ec] p-6 text-center text-xs text-slate-400">Jonli ko‘rish tayyorlanmoqda…</main>;
  return <TemplateRenderer key={`${payload.invitation.template_id}:${generation}`} invitation={payload.invitation} musicTrack={payload.musicTrack} frame={false} />;
}
