import optimized from "@/public/audio/manifest.json";
import type { MusicTrack } from "./types";

/** Content-addressed, fast-start AAC copies of the existing library. */
export function musicPlaybackUrl(track: Pick<MusicTrack, "id" | "file_url">): string {
  const entry = (optimized as Record<string, { source: string; path: string }>)[track.id];
  return entry?.source === track.file_url ? entry.path : track.file_url;
}
