import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { DEMO_INVITATION } from "@/lib/demoInvitation";

// Temporary local verification fixture. Removed after browser checks.
export default async function Verify({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const { theme = "premium-qish" } = await searchParams;
  const wave = Buffer.alloc(44 + 8000 * 8);
  wave.write("RIFF", 0); wave.writeUInt32LE(wave.length - 8, 4); wave.write("WAVEfmt ", 8);
  wave.writeUInt32LE(16, 16); wave.writeUInt16LE(1, 20); wave.writeUInt16LE(1, 22);
  wave.writeUInt32LE(8000, 24); wave.writeUInt32LE(8000, 28); wave.writeUInt16LE(1, 32); wave.writeUInt16LE(8, 34);
  wave.write("data", 36); wave.writeUInt32LE(wave.length - 44, 40); wave.fill(128, 44);
  return <TemplateRenderer invitation={{ ...DEMO_INVITATION, template_id: theme,
    groom_name: "Muhammadabdulloh", bride_name: "Shahrizodabonu", guest_name: "Abdurahmonova Gulnoza Shavkatovna",
    cover_photo_url: "/premium-assets/yoz.webp",
    gallery_photo_urls: ["qish", "kuz", "yoz", "tilla-hayot", "moviy-osmon"].map(name => `/premium-assets/${name}.webp`),
    schedule_items: [{ time: "17:30", label: "Mehmonlarni kutib olish" }, { time: "18:00", label: "Nikoh tantanasi" }, { time: "20:00", label: "Bayram dasturxoni" }],
    wishes_title: "Bir umr yonma-yon", wishes_text: "Barcha ezgu kunlarimizda siz bilan birga bo‘lishni istaymiz.",
  }} musicTrack={{ id: "verify", title: "Verification", file_url: `data:audio/wav;base64,${wave.toString("base64")}`, storage_path: null, min_price_tier: "150000" }} frame={false} />;
}
