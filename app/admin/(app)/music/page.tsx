import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { addMusicTrack, deleteMusicTrack } from "./actions";
import type { MusicTrack } from "@/lib/types";

export default async function MusicLibraryPage() {
  const supabase = await createClient();
  const { data: musicTracks } = await supabase
    .from("music_tracks")
    .select("*")
    .order("title");

  const tracks = (musicTracks as MusicTrack[]) ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Musiqalar kutubxonasi</h1>

      <form
        action={addMusicTrack}
        className="mb-8 space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Qo&apos;shiq nomi</span>
          <input name="title" required className="input" placeholder="Masalan: Romantik pianino" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Mp3 fayl</span>
          <input name="file" type="file" accept="audio/mpeg,audio/mp3,.mp3" required className="input" />
        </label>

        <button type="submit" className="btn inline-flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Qo&apos;shish
        </button>
      </form>

      {tracks.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
          Hozircha musiqa qo&apos;shilmagan.
        </p>
      )}

      <div className="space-y-3">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-2 font-medium text-slate-900">{track.title}</p>
              <audio controls src={track.file_url} className="h-9 w-full max-w-xs" />
            </div>
            <form action={deleteMusicTrack.bind(null, track.id, track.storage_path)}>
              <button type="submit" className="btn-secondary text-red-600" title="O'chirish">
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
