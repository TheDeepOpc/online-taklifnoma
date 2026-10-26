import { InvitationFormWithPreview } from "@/components/admin/InvitationFormWithPreview";
import { DEMO_INVITATION } from "@/lib/demoInvitation";

export default function PreviewFormCheck() {
  const wave = Buffer.alloc(44 + 8000 * 8);
  wave.write("RIFF", 0); wave.writeUInt32LE(wave.length - 8, 4); wave.write("WAVEfmt ", 8);
  wave.writeUInt32LE(16, 16); wave.writeUInt16LE(1, 20); wave.writeUInt16LE(1, 22);
  wave.writeUInt32LE(8000, 24); wave.writeUInt32LE(8000, 28); wave.writeUInt16LE(1, 32); wave.writeUInt16LE(8, 34);
  wave.write("data", 36); wave.writeUInt32LE(wave.length - 44, 40); wave.fill(128, 44);
  async function ignore() { "use server"; }
  return <main className="mx-auto w-full max-w-6xl p-4"><InvitationFormWithPreview invitation={{ ...DEMO_INVITATION, template_id: "premium-bardoviy-atirgul", music_track_id: "preview-audio" }} musicTracks={[{ id: "preview-audio", title: "Preview audio", file_url: `data:audio/wav;base64,${wave.toString("base64")}`, storage_path: null, min_price_tier: "150000" }]} action={ignore} /></main>;
}
