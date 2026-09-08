"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generateInvitationSlug } from "@/lib/slug";
import { isThemeUnlocked, getUnlockedThemes } from "@/lib/themes";
import type { PriceTier, ScheduleItem } from "@/lib/types";

const COVERS_BUCKET = "covers";

async function uploadCoverPhoto(
  supabase: SupabaseClient,
  formData: FormData,
  fieldName: string = "cover_photo",
): Promise<string | null> {
  const file = formData.get(fieldName) as File | null;
  if (!file || file.size === 0) return null;

  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(COVERS_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg" });

  if (error) {
    throw new Error(`Muqova rasmni yuklashda xatolik: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(path);

  return publicUrl;
}

const MAX_GALLERY_PHOTOS = 5;

function readExistingGalleryUrls(formData: FormData): string[] {
  const raw = String(formData.get("existing_gallery_urls") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string") : [];
  } catch {
    return [];
  }
}

// Admin oldin saqlagan rasmlarni (existing_gallery_urls) va bu safar qo'shgan
// yangi fayllarni birlashtiradi — shunda "+" bosib qo'shish avvalgilarini
// o'chirib yubormaydi, jami 5 tadan oshmaydi.
async function uploadGalleryPhotos(
  supabase: SupabaseClient,
  formData: FormData,
): Promise<string[]> {
  const existing = readExistingGalleryUrls(formData);
  const remainingSlots = Math.max(0, MAX_GALLERY_PHOTOS - existing.length);
  const files = formData
    .getAll("gallery_photos")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, remainingSlots);

  // Fayllarni ketma-ket emas, parallel yuklaymiz — 5 ta rasm ketma-ket
  // yuklansa administrator "Saqlash" tugmasini bosgandan keyin o'nlab
  // soniya kutib, sahifa muzlab qolganday tuyulishi mumkin edi.
  const uploaded = await Promise.all(
    files.map(async (file) => {
      const path = `gallery/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from(COVERS_BUCKET)
        .upload(path, file, { contentType: file.type || "image/jpeg" });

      if (error) {
        throw new Error(`Galereya rasmini yuklashda xatolik: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(path);
      return publicUrl;
    }),
  );

  return [...existing, ...uploaded];
}

function readScheduleItems(formData: FormData): ScheduleItem[] {
  const raw = String(formData.get("schedule_items") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        time: String(item?.time ?? "").trim(),
        label: String(item?.label ?? "").trim(),
      }))
      .filter((item) => item.time || item.label);
  } catch {
    return [];
  }
}

function readInvitationForm(formData: FormData) {
  const priceTier = formData.get("price_tier") as PriceTier;
  const requestedThemeId = String(formData.get("template_id") ?? "");
  const template_id = isThemeUnlocked(requestedThemeId, priceTier)
    ? requestedThemeId
    : getUnlockedThemes(priceTier)[0].id;

  return {
    groom_name: String(formData.get("groom_name") ?? "").trim(),
    bride_name: String(formData.get("bride_name") ?? "").trim(),
    wedding_date: String(formData.get("wedding_date") ?? ""),
    wedding_time: String(formData.get("wedding_time") ?? ""),
    venue_name: String(formData.get("venue_name") ?? "").trim(),
    venue_address: String(formData.get("venue_address") ?? "").trim(),
    venue_map_url: String(formData.get("venue_map_url") ?? "").trim() || null,
    price_tier: priceTier,
    template_id,
    music_track_id: String(formData.get("music_track_id") ?? "") || null,
    custom_message: String(formData.get("custom_message") ?? "").trim() || null,
    gift_card_number: String(formData.get("gift_card_number") ?? "").trim() || null,
    schedule_items: readScheduleItems(formData),
    guest_name:
      formData.get("use_guest_name") === "on"
        ? String(formData.get("guest_name") ?? "").trim() || null
        : null,
    text_size: formData.get("text_size") === "compact" ? "compact" : "normal",
    is_paid: formData.get("is_paid") === "on",
    status: formData.get("is_paid") === "on" ? ("published" as const) : ("draft" as const),
  };
}

export async function createInvitation(formData: FormData) {
  const supabase = await createClient();
  const data = readInvitationForm(formData);
  const slug = generateInvitationSlug(data.groom_name, data.bride_name);
  const [cover_photo_url, second_photo_url, gallery_photo_urls] = await Promise.all([
    uploadCoverPhoto(supabase, formData, "cover_photo"),
    uploadCoverPhoto(supabase, formData, "second_photo"),
    uploadGalleryPhotos(supabase, formData),
  ]);

  const { error } = await supabase
    .from("invitations")
    .insert({ ...data, slug, cover_photo_url, second_photo_url, gallery_photo_urls });

  if (error) {
    throw new Error(`Taklifnoma yaratishda xatolik: ${error.message}`);
  }

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createClient();
  const data = readInvitationForm(formData);
  const [cover_photo_url, second_photo_url, gallery_photo_urls] = await Promise.all([
    uploadCoverPhoto(supabase, formData, "cover_photo"),
    uploadCoverPhoto(supabase, formData, "second_photo"),
    uploadGalleryPhotos(supabase, formData),
  ]);

  const { error } = await supabase
    .from("invitations")
    .update({
      ...data,
      ...(cover_photo_url ? { cover_photo_url } : {}),
      ...(second_photo_url ? { second_photo_url } : {}),
      gallery_photo_urls,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Taklifnomani yangilashda xatolik: ${error.message}`);
  }

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("invitations").delete().eq("id", id);

  if (error) {
    throw new Error(`Taklifnomani o'chirishda xatolik: ${error.message}`);
  }

  revalidatePath("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
