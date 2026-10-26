import {
  completeDirectUpload,
  relayUpload,
  requestDirectUpload,
} from "@/app/admin/(app)/media/actions";

/** Discord limiti (boost qilinmagan server). */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Vercel funksiyasi 4.5 MB dan katta so'rovni qabul qilmaydi — zaxira yo'l uchun zaxira bilan. */
const MAX_RELAY_BYTES = 4 * 1024 * 1024;

/**
 * Faylni Discord CDN'ga yuklaydi va doimiy `/api/media/<id>` havolasini qaytaradi.
 *
 * Direct Upload: server Discord'dan bir martalik yuklash havolasini oladi,
 * brauzer faylni o'sha havolaga o'zi yuboradi — fayl Vercel orqali o'tmaydi
 * (FUNCTION_PAYLOAD_TOO_LARGE yo'q), tokenlar esa brauzerga chiqmaydi.
 * Bot hali serverga qo'shilmagan bo'lsa — kichik fayllar server orqali yuklanadi.
 */
export async function uploadToCdn(file: File, kind: "image" | "audio"): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`"${file.name}" juda katta (${mb} MB). Maksimum — 10 MB.`);
  }

  const ticket = await requestDirectUpload(kind, file.name, file.type, file.size);
  let relayReason: string;
  if (ticket.ok) {
    let put: Response | null = null;
    try {
      // Turi ko'rsatilmagan Blob: imzolangan havola Content-Type'siz yuklashni kutadi.
      put = await fetch(ticket.uploadUrl, { method: "PUT", body: new Blob([file]) });
    } catch {
      // Discord (Google Storage) javobiga CORS sarlavhasi qo'ymaydi: brauzer
      // javobni o'qiy olmaydi, lekin fayl to'liq yuklangan bo'ladi (5 MB bilan
      // tekshirilgan). Shuning uchun xabar yaratishga o'tamiz — fayl yetib
      // bormagan bo'lsa, Discord xato qaytaradi va pastdagi zaxira yo'l ishlaydi.
    }
    if (!put || put.ok) {
      const result = await completeDirectUpload(kind, ticket.filename, ticket.uploadFilename);
      if (result.ok) return result.url;
      relayReason = result.error;
    } else {
      relayReason = `Faylni Discord'ga to'g'ridan-to'g'ri yuklab bo'lmadi (${put.status}).`;
    }
  } else {
    if (!ticket.relay) throw new Error(ticket.error);
    relayReason = ticket.error;
  }

  if (file.size > MAX_RELAY_BYTES) {
    throw new Error(`${relayReason} 4 MB dan katta fayllar faqat Direct Upload bilan yuklanadi.`);
  }
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  const result = await relayUpload(body);
  if (!result.ok) throw new Error(result.error);
  return result.url;
}

/**
 * Saqlanmagan yuklamalarni o'chirishni so'rash (`/api/media/discard`).
 * `keepalive` — sahifa yopilayotgan paytda ham so'rov yetib boradi.
 * Natija kutilmaydi: o'chmay qolgan fayllarni keyinroq tozalash tugmasi oladi.
 */
export function discardMedia(urls: string[]): void {
  if (urls.length === 0) return;
  void fetch("/api/media/discard", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  }).catch(() => {});
}
