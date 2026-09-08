"use server";

import { revalidatePath, updateTag } from "next/cache";
import { MUSIC_TRACKS_TAG } from "@/lib/musicTracks";
import { createClient } from "@/lib/supabase/server";

const MUSIC_BUCKET = "music";

export async function addMusicTrack(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!title) {
    throw new Error("Qo'shiq nomini kiriting.");
  }
  if (!file || file.size === 0) {
    throw new Error("Mp3 fayl tanlanmagan.");
  }

  const supabase = await createClient();
  const path = `${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(MUSIC_BUCKET)
    .upload(path, file, { contentType: file.type || "audio/mpeg" });

  if (uploadError) {
    throw new Error(`Faylni yuklashda xatolik: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MUSIC_BUCKET).getPublicUrl(path);

  const { error: insertError } = await supabase.from("music_tracks").insert({
    title,
    file_url: publicUrl,
    storage_path: path,
    min_price_tier: "150000",
  });

  if (insertError) {
    await supabase.storage.from(MUSIC_BUCKET).remove([path]);
    throw new Error(`Bazaga saqlashda xatolik: ${insertError.message}`);
  }

  updateTag(MUSIC_TRACKS_TAG);
  revalidatePath("/admin/music");
}

export async function deleteMusicTrack(id: string, storagePath: string | null) {
  const supabase = await createClient();

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

  // Endi tartib teskari: avval baza qatori, keyin fayl. Shunda qator o'chmay
  // qolsa ham fayl joyida turadi (yetim fayl — zararsiz), teskarisi esa
  // taklifnomani buzardi.
  const { error } = await supabase.from("music_tracks").delete().eq("id", id);

  if (error) {
    throw new Error(`O'chirishda xatolik: ${error.message}`);
  }

  if (storagePath) {
    await supabase.storage.from(MUSIC_BUCKET).remove([storagePath]);
  }

  updateTag(MUSIC_TRACKS_TAG);
  revalidatePath("/admin/music");
}
