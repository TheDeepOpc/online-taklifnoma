"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { addMusicTrack } from "@/app/admin/(app)/music/actions";
import { discardMedia, uploadToCdn } from "@/lib/mediaClient";

/**
 * Mp3 Vercel orqali o'tmaydi (4.5 MB limiti — FUNCTION_PAYLOAD_TOO_LARGE):
 * brauzer uni Direct Upload bilan to'g'ridan-to'g'ri Discord'ga yuklaydi.
 */
export function MusicUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get("title") ?? "");
    const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (!file) {
      setError("Mp3 fayl tanlanmagan.");
      return;
    }

    setError(null);
    try {
      setStatus("uploading");
      const url = await uploadToCdn(file, "audio");
      setStatus("saving");
      const result = await addMusicTrack(title, url);
      if (!result.ok) {
        // Qo'shiq saqlanmadi — yuklangan fayl Discord'da qolib ketmasin.
        discardMedia([url]);
        setError(result.error);
        return;
      }
      formRef.current?.reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setStatus("idle");
    }
  }

  const busy = status !== "idle";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mb-8 space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Qo&apos;shiq nomi</span>
        <input name="title" required className="input" placeholder="Masalan: Romantik pianino" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Mp3 fayl (maks. 10 MB)</span>
        <input name="file" type="file" accept="audio/mpeg,audio/mp3,.mp3" required className="input" />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={busy} className="btn inline-flex items-center gap-2 disabled:opacity-60">
        <Upload className="h-4 w-4" />
        {status === "uploading" ? "Yuklanmoqda…" : status === "saving" ? "Saqlanmoqda…" : "Qo'shish"}
      </button>
    </form>
  );
}
