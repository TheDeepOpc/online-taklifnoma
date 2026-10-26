"use server";

import { createAuthenticatedClient } from "@/lib/supabase/server";
import {
  createDirectUpload,
  finishDirectUpload,
  uploadToDiscord,
  type DirectUploadTicket,
  type MediaKind,
} from "@/lib/discordCdn";
import { cleanupOrphanMedia } from "@/lib/mediaStore";

// Xato `throw` emas, qiymat sifatida qaytariladi — production'da Next server
// action xato matnini yashiradi, admin esa sababini ko'rishi kerak.
export type UploadMediaResult = { ok: true; url: string } | { ok: false; error: string };

export type DirectUploadResult =
  | ({ ok: true } & DirectUploadTicket)
  /** `relay: true` — bot hali sozlanmagan/serverga qo'shilmagan: kichik fayl server orqali yuklanadi. */
  | { ok: false; error: string; relay?: boolean };

/** Direct Upload, 1-qadam: Discord'dan bir martalik yuklash havolasi. */
export async function requestDirectUpload(
  kind: MediaKind,
  name: string,
  type: string,
  size: number,
): Promise<DirectUploadResult> {
  try {
    await createAuthenticatedClient();
    const ticket = await createDirectUpload(kind, name, type, size);
    if (!ticket) {
      return { ok: false, relay: true, error: "Discord bot hali serverga qo'shilmagan." };
    }
    return { ok: true, ...ticket };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

/** Direct Upload, 3-qadam: brauzer yuklagan faylni kanalga joylash → `/api/media/<id>`. */
export async function completeDirectUpload(
  kind: MediaKind,
  filename: string,
  uploadFilename: string,
): Promise<UploadMediaResult> {
  try {
    await createAuthenticatedClient();
    const { url } = await finishDirectUpload(kind, filename, uploadFilename);
    return { ok: true, url };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

/**
 * Zaxira yo'l (bot ishlamasa): fayl server orqali webhook bilan yuklanadi.
 * Vercel 4.5 MB dan katta so'rovni qabul qilmaydi — mijoz buni faqat kichik
 * fayllar uchun chaqiradi.
 */
export async function relayUpload(formData: FormData): Promise<UploadMediaResult> {
  try {
    await createAuthenticatedClient();
    const file = formData.get("file");
    const kind = formData.get("kind");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Fayl tanlanmagan." };
    }
    const expected = kind === "audio" ? "audio/" : "image/";
    if (!file.type.startsWith(expected)) {
      return { ok: false, error: kind === "audio" ? "Faqat audio fayl yuklash mumkin." : "Faqat rasm yuklash mumkin." };
    }
    const { url } = await uploadToDiscord(file);
    return { ok: true, url };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

export type CleanupMediaResult =
  | { ok: true; scanned: number; deleted: number }
  | { ok: false; error: string };

export async function cleanupDiscordMedia(): Promise<CleanupMediaResult> {
  try {
    const supabase = await createAuthenticatedClient();
    const { scanned, deleted } = await cleanupOrphanMedia(supabase);
    return { ok: true, scanned, deleted };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}
