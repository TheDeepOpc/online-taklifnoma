"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Music2, Upload } from "lucide-react";
import { addMusicTrack } from "@/app/admin/(app)/music/actions";
import { discardMedia, uploadToCdn } from "@/lib/mediaClient";
import { musicPlaybackUrl } from "@/lib/musicPlayback";
import type { MusicTrack } from "@/lib/types";

export function InvitationMusicField({ tracks, value, onChange, onUploaded, onBusyChange }: { tracks: MusicTrack[]; value: string; onChange: (id: string) => void; onUploaded: (track: MusicTrack) => void; onBusyChange: (busy: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const selected = tracks.find(track => track.id === value);
  const busy = status !== "idle";

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file || busy) return;
    const name = title.trim() || file.name.replace(/\.[^.]+$/, "");
    let mediaUrl: string | null = null;
    setError(null); setStatus("uploading"); onBusyChange(true);
    try {
      mediaUrl = await uploadToCdn(file, "audio");
      if (!alive.current) { discardMedia([mediaUrl]); return; }
      setStatus("saving");
      const result = await addMusicTrack(name, mediaUrl);
      if (!result.ok) throw Error(result.error);
      // It now belongs to the reusable music library, even if this invitation
      // is left unsaved. Image cleanup must never delete this saved audio.
      mediaUrl = null;
      if (alive.current) { onUploaded(result.track); setTitle(""); }
    } catch (error) {
      if (mediaUrl) discardMedia([mediaUrl]);
      if (alive.current) setError((error as Error).message);
    } finally {
      if (alive.current) { setStatus("idle"); onBusyChange(false); }
    }
  }
  return <fieldset className="min-w-0 space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
    <legend className="flex items-center gap-2 px-1 text-sm font-medium text-slate-700"><Music2 size={16} />Fon musiqasi</legend>
    <label className="block"><span className="mb-1 block text-xs text-slate-500">Mavjud qo‘shiqlardan tanlash</span><select name="music_track_id" value={value} onChange={event => onChange(event.target.value)} disabled={busy} className="input"><option value="">Musiqasiz</option>{tracks.map(track => <option key={track.id} value={track.id}>{track.title}</option>)}</select></label>
    {selected && <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="mb-2 truncate text-xs font-medium text-slate-700">{selected.title}</p><audio key={selected.id} controls preload="metadata" src={musicPlaybackUrl(selected)} className="h-10 w-full min-w-0 max-w-full" aria-label={`${selected.title} — tinglab ko‘rish`} /></div>}
    <div className="border-t border-slate-200 pt-3"><label className="block"><span className="mb-1 block text-xs text-slate-500">Yangi audio nomi (ixtiyoriy)</span><input value={title} onChange={event => setTitle(event.target.value)} disabled={busy} className="input" placeholder="Bo‘sh qoldirilsa, fayl nomi olinadi" /></label>
      <label className={`mt-3 flex min-h-14 items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 ${busy ? "opacity-60" : "cursor-pointer hover:border-slate-500"}`}>
        {busy ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
        <span>{status === "uploading" ? "Audio Discord’ga yuklanmoqda…" : status === "saving" ? "Kutubxonaga saqlanmoqda…" : "Audio fayl yuklash"}</span>
        <input type="file" accept="audio/mpeg,audio/mp3,audio/mp4,audio/ogg,audio/wav,.mp3,.m4a,.ogg,.wav" onChange={upload} disabled={busy} className="sr-only" aria-label="Taklifnoma uchun audio yuklash" />
      </label>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">MP3, M4A, OGG yoki WAV · 10 MB gacha. Yuklangan qo‘shiq avtomatik tanlanadi va kutubxonada ham saqlanadi.</p>
    </div>
    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    <span role="status" className="sr-only">{busy ? "Audio yuklanmoqda. Yuklash tugaguncha saqlashni kuting." : "Musiqa tanlash tayyor."}</span>
  </fieldset>;
}
