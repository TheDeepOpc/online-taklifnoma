import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { messageIdFromMediaUrl, resolveDiscordMediaUrl } from "@/lib/discordCdn";
import { SHARE_IMAGE_SIZE, weddingDateLine } from "@/lib/invitationShare";
import type { Invitation } from "@/lib/types";

const { width: WIDTH, height: HEIGHT } = SHARE_IMAGE_SIZE;
const PHOTO_WIDTH = 520;

function fitPhoto(input: Buffer): Promise<Buffer> {
  // `rotate()` — telefon suratlaridagi EXIF burilishi; `attention` — yuzlar/asosiy qism kesilmasin.
  return sharp(input)
    .rotate()
    .resize(PHOTO_WIDTH, HEIGHT, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 86 })
    .toBuffer();
}

// Yo'llar literal: Vercel funksiyasiga faqat shu fayllar qo'shilsin (butun public/ emas).
const [nameFont, textFont, fallbackPhoto] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-SemiBoldItalic.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "public/home-art/love-story-social.jpg")).then(fitPhoto),
]);

/** Muqova surati: Discord'dagi doimiy `/api/media/<id>` yoki eski to'liq havola. Bo'lmasa — umumiy surat. */
async function coverPhoto(url: string | null): Promise<Buffer> {
  if (!url) return fallbackPhoto;
  try {
    const messageId = messageIdFromMediaUrl(url);
    const source = messageId ? await resolveDiscordMediaUrl(messageId) : url.startsWith("https://") ? url : null;
    if (!source) return fallbackPhoto;
    const res = await fetch(source, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await fitPhoto(Buffer.from(await res.arrayBuffer()));
  } catch (error) {
    console.error("[share-image] muqova yuklanmadi:", url, error);
    return fallbackPhoto;
  }
}

/** Uzun ismlar ham bir qatorga sig'sin (matn maydoni ~560px). */
function nameFontSize(invitation: Invitation): number {
  const longest = Math.max(invitation.groom_name.length, invitation.bride_name.length, 1);
  return Math.max(48, Math.min(88, Math.floor(560 / (longest * 0.46))));
}

/**
 * Taklifnoma havolasi ulashilganda chiqadigan 1200×630 rasm: chapda kelin-kuyov
 * surati, o'ngda ismlar, sana va manzil. PNG o'rniga JPEG — surat bilan PNG ~1 MB
 * bo'ladi, JPEG ~100 KB: ilovalar (WhatsApp ham) tez va ishonchli oladi.
 */
export async function renderInvitationShareImage(invitation: Invitation): Promise<Buffer> {
  const photo = await coverPhoto(invitation.cover_photo_url);
  const size = nameFontSize(invitation);

  const png = await new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f7f3ea", color: "#302a25", fontFamily: "Geist" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} width={PHOTO_WIDTH} height={HEIGHT} alt="" />
      <div style={{ flex: 1, display: "flex", padding: 26 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(156, 125, 74, 0.45)",
            padding: "0 36px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 15, letterSpacing: 5, color: "#9c7d4a" }}>TO‘Y TAKLIFNOMASI</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 26,
              fontFamily: "Cormorant",
              fontSize: size,
              lineHeight: 1.04,
              color: "#60243b",
            }}
          >
            <div style={{ display: "flex" }}>{invitation.groom_name}</div>
            <div style={{ display: "flex", fontSize: Math.round(size * 0.62), color: "#9c7d4a", margin: "2px 0" }}>&</div>
            <div style={{ display: "flex" }}>{invitation.bride_name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "30px 0 24px" }}>
            <div style={{ display: "flex", width: 72, height: 1, background: "#c9b48a" }} />
            <div style={{ display: "flex", width: 9, height: 9, background: "#9c7d4a", transform: "rotate(45deg)" }} />
            <div style={{ display: "flex", width: 72, height: 1, background: "#c9b48a" }} />
          </div>
          <div style={{ display: "flex", fontSize: 25 }}>{weddingDateLine(invitation)}</div>
          {invitation.venue_name ? (
            <div style={{ display: "flex", marginTop: 10, fontSize: 21, color: "#817363" }}>{invitation.venue_name}</div>
          ) : null}
          <div style={{ display: "flex", marginTop: 34, fontSize: 15, letterSpacing: 2, color: "#193e35" }}>oila-uchun.uz</div>
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Geist", data: textFont, weight: 400, style: "normal" },
        { name: "Cormorant", data: nameFont, weight: 600, style: "italic" },
      ],
    },
  ).arrayBuffer();

  return sharp(Buffer.from(png)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
}
