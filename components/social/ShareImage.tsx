import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const photo = await readFile(join(process.cwd(), "public/home-art/love-story-social.jpg"));

export function createShareImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f7f3ea", color: "#302a25" }}>
      <div style={{ width: 680, padding: "62px 62px 52px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 25, color: "#193e35" }}>Oila-Uchun</div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 14, letterSpacing: 4, color: "#9c7d4a" }}>ONLAYN TO‘Y TAKLIFNOMALARI</div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 65, lineHeight: 1.08, letterSpacing: -3 }}>Bir havola.</div>
        <div style={{ display: "flex", fontSize: 65, lineHeight: 1.08, letterSpacing: -3, color: "#60243b" }}>Bir umrga xotira.</div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 21, lineHeight: 1.5, maxWidth: 480, color: "#817363" }}>Muhabbatingizga mos nafis dizayn, sevimli musiqa va shaxsiy taklif.</div>
        <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", background: "#60243b", padding: "16px 28px", color: "#fff9ed", fontSize: 17 }}>Kolleksiyani ko‘ring ↗</div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} width={520} height={630} alt="" style={{ objectFit: "cover", objectPosition: "center 35%" }} />
    </div>,
    { width: 1200, height: 630 },
  );
}
