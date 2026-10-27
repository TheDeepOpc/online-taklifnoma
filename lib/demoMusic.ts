import "server-only";
import { getMusicTracks } from "./musicTracks";

/** The public catalogue demonstrates music already added by the admin. */
export async function getDemoMusicTrack() {
  const tracks = await getMusicTracks();
  return tracks.find(track => track.file_url?.trim()) ?? null;
}
