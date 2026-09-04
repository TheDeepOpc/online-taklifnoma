"use server";

import { revalidatePath } from "next/cache";
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

  revalidatePath("/admin/music");
}

export async function deleteMusicTrack(id: string, storagePath: string | null) {
  const supabase = await createClient();

  if (storagePath) {
    await supabase.storage.from(MUSIC_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("music_tracks").delete().eq("id", id);

  if (error) {
    throw new Error(`O'chirishda xatolik: ${error.message}`);
  }

  revalidatePath("/admin/music");
}
