"use server";

import { revalidatePath, updateTag } from "next/cache";
import { MUSIC_TRACKS_TAG } from "@/lib/musicTracks";
import { createAuthenticatedClient } from "@/lib/supabase/server";
import { DISCORD_STORAGE_PREFIX, deleteFromDiscord, uploadToDiscord } from "@/lib/discordCdn";

/** Discord'ga o'tishdan oldin yuklangan qo'shiqlar Supabase'dagi shu bucket'da qolgan. */
const LEGACY_MUSIC_BUCKET = "music";

export async function addMusicTrack(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  if (!title) {
    throw new Error("Qo'shiq nomini kiriting.");
  }
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Mp3 fayl tanlanmagan.");
  }

  const supabase = await createAuthenticatedClient();

  // Fayl Discord CDN'ga yuklanadi; bazaga doimiy `/api/media/<id>` manzili,
  // storage_path'ga esa o'chirish uchun `discord:<messageId>` yoziladi.
  let uploaded: { messageId: string; url: string };
  try {
    uploaded = await uploadToDiscord(file);
  } catch (error) {
    throw new Error(`Faylni yuklashda xatolik: ${(error as Error).message}`);
  }

  const { error: insertError } = await supabase.from("music_tracks").insert({
    title,
    file_url: uploaded.url,
    storage_path: `${DISCORD_STORAGE_PREFIX}${uploaded.messageId}`,
    min_price_tier: "150000",
  });

  if (insertError) {
    await deleteFromDiscord(uploaded.messageId).catch(() => {});
    throw new Error(`Bazaga saqlashda xatolik: ${insertError.message}`);
  }

  updateTag(MUSIC_TRACKS_TAG);
  revalidatePath("/admin/music");
}

export async function deleteMusicTrack(id: string) {
  const supabase = await createAuthenticatedClient();

  // MUHIM: avval qo'shiq ishlatilayotganini tekshiramiz.
  //
  // Ilgari bu funksiya avval storage'dagi mp3 faylni o'chirib, keyin bazadagi
  // qatorni o'chirishga urinardi. Agar qo'shiq biror taklifnomada ishlatilgan
  // bo'lsa, qator o'chmasdi (foreign key), lekin FAYL allaqachon o'chib
  // ketgan bo'lardi — natijada eski taklifnomalarning `file_url` manzili 404
  // qaytarib, musiqa ovozsiz qolardi. Endi ishlatilayotgan qo'shiq umuman
  // o'chirilmaydi.
  const { count, error: countError } = await supabase
    .from("invitations")
    .select("id", { count: "exact", head: true })
    .eq("music_track_id", id);

  if (countError) {
    throw new Error(`Tekshirishda xatolik: ${countError.message}`);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      `Bu qo'shiq ${count} ta taklifnomada ishlatilmoqda — o'chirib bo'lmaydi. ` +
        `Avval o'sha taklifnomalarga boshqa qo'shiq tanlang.`,
    );
  }

  // Fayl manzilini mijoz yuborgan argumentdan emas, bazadan olamiz — aks holda
  // istalgan `discord:<id>` yuborib, boshqa rasm/audioni o'chirish mumkin bo'lardi.
  const { data: track, error: readError } = await supabase
    .from("music_tracks")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    throw new Error(`O'chirishda xatolik: ${readError.message}`);
  }

  // Endi tartib teskari: avval baza qatori, keyin fayl. Shunda qator o'chmay
  // qolsa ham fayl joyida turadi (yetim fayl — zararsiz), teskarisi esa
  // taklifnomani buzardi.
  const { error } = await supabase.from("music_tracks").delete().eq("id", id);

  if (error) {
    throw new Error(`O'chirishda xatolik: ${error.message}`);
  }

  const storagePath: string | null = track?.storage_path ?? null;
  if (storagePath?.startsWith(DISCORD_STORAGE_PREFIX)) {
    await deleteFromDiscord(storagePath.slice(DISCORD_STORAGE_PREFIX.length)).catch(() => {});
  } else if (storagePath) {
    await supabase.storage.from(LEGACY_MUSIC_BUCKET).remove([storagePath]);
  }

  updateTag(MUSIC_TRACKS_TAG);
  revalidatePath("/admin/music");
}
