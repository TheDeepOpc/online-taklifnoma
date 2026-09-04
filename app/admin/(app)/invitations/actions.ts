"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generateInvitationSlug } from "@/lib/slug";
import { isThemeUnlocked, getUnlockedThemes } from "@/lib/themes";
import type { PriceTier } from "@/lib/types";

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
    is_paid: formData.get("is_paid") === "on",
    status: formData.get("is_paid") === "on" ? ("published" as const) : ("draft" as const),
  };
}

export async function createInvitation(formData: FormData) {
  const supabase = await createClient();
  const data = readInvitationForm(formData);
  const slug = generateInvitationSlug(data.groom_name, data.bride_name);
  const cover_photo_url = await uploadCoverPhoto(supabase, formData, "cover_photo");
  const second_photo_url = await uploadCoverPhoto(supabase, formData, "second_photo");

  const { error } = await supabase
    .from("invitations")
    .insert({ ...data, slug, cover_photo_url, second_photo_url });

  if (error) {
    throw new Error(`Taklifnoma yaratishda xatolik: ${error.message}`);
  }

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createClient();
  const data = readInvitationForm(formData);
  const cover_photo_url = await uploadCoverPhoto(supabase, formData, "cover_photo");
  const second_photo_url = await uploadCoverPhoto(supabase, formData, "second_photo");

  const { error } = await supabase
    .from("invitations")
    .update({
      ...data,
      ...(cover_photo_url ? { cover_photo_url } : {}),
      ...(second_photo_url ? { second_photo_url } : {}),
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
