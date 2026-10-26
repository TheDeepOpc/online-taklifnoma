"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthenticatedClient, createClient } from "@/lib/supabase/server";
import { messageIdFromMediaUrl } from "@/lib/discordCdn";
import { deleteMediaIfUnreferenced, invitationMediaUrls } from "@/lib/mediaStore";
import { INVITATIONS_TAG } from "@/lib/invitationData";
import { generateInvitationSlug } from "@/lib/slug";
import { isThemeUnlocked, getUnlockedThemes } from "@/lib/themes";
import type { PriceTier, ScheduleItem } from "@/lib/types";

const MAX_GALLERY_PHOTOS = 5;
const MEDIA_COLUMNS = "cover_photo_url, second_photo_url, gallery_photo_urls";

function readJsonStrings(value: FormDataEntryValue | null): string[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Rasmlar formada tanlanishi bilan Discord'ga yuklangan (media/actions.ts) —
 * bu yerga faqat havolalar keladi. Qabul qilinadi: `/api/media/<id>` yoki shu
 * taklifnomada avvaldan saqlangan havola (masalan, eski Supabase rasmlari).
 * Boshqa ixtiyoriy tashqi havolalar yozilmaydi.
 */
function readInvitationMedia(formData: FormData, previous: string[] = []) {
  const allowed = new Set(previous);
  const pick = (value: FormDataEntryValue | string | null): string | null => {
    const url = typeof value === "string" ? value.trim() : "";
    if (!url) return null;
    return messageIdFromMediaUrl(url) !== null || allowed.has(url) ? url : null;
  };

  const gallery = readJsonStrings(formData.get("gallery_photo_urls"))
    .map(pick)
    .filter((url): url is string => url !== null);

  return {
    cover_photo_url: pick(formData.get("cover_photo_url")),
    second_photo_url: pick(formData.get("second_photo_url")),
    gallery_photo_urls: [...new Set(gallery)].slice(0, MAX_GALLERY_PHOTOS),
  };
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
    wishes_title: String(formData.get("wishes_title") ?? "").trim() || null,
    wishes_text: String(formData.get("wishes_text") ?? "").trim() || null,
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

/**
 * `wishes_*` ustunlari 0010 migratsiyasi bilan qo'shilgan. Migratsiya hali
 * qo'llanmagan bazada saqlash butunlay yiqilmasligi uchun — ustun topilmasa,
 * shu maydonlarsiz qayta urinamiz.
 */
const OPTIONAL_COLUMNS = ["wishes_title", "wishes_text"] as const;

function isMissingOptionalColumn(message: string | undefined): boolean {
  return Boolean(message && OPTIONAL_COLUMNS.some((c) => message.includes(c)));
}

function withoutOptionalColumns<T extends Record<string, unknown>>(row: T): T {
  const copy = { ...row };
  for (const column of OPTIONAL_COLUMNS) delete copy[column];
  return copy;
}

export async function createInvitation(formData: FormData) {
  const supabase = await createAuthenticatedClient();
  const data = readInvitationForm(formData);
  const slug = generateInvitationSlug(data.groom_name, data.bride_name);

  // Saqlanmay qolsa, yuklangan rasmlar formada turadi (qayta urinish mumkin);
  // forma tashlab ketilsa — ular /api/media/discard yoki tozalash orqali o'chadi.
  const row = { ...data, ...readInvitationMedia(formData), slug };
  let { error } = await supabase.from("invitations").insert(row);
  if (error && isMissingOptionalColumn(error.message)) {
    ({ error } = await supabase.from("invitations").insert(withoutOptionalColumns(row)));
  }

  if (error) {
    throw new Error(`Taklifnoma yaratishda xatolik: ${error.message}`);
  }

  // Mehmonlar ochadigan /t/<slug> keshi darhol yangilansin.
  updateTag(INVITATIONS_TAG);
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createAuthenticatedClient();
  const data = readInvitationForm(formData);

  const { data: before, error: readError } = await supabase
    .from("invitations")
    .select(MEDIA_COLUMNS)
    .eq("id", id)
    .single();
  if (readError) {
    throw new Error(`Taklifnomani yangilashda xatolik: ${readError.message}`);
  }
  const previousMedia = invitationMediaUrls(before);
  const media = readInvitationMedia(formData, previousMedia);

  const row = { ...data, ...media };
  let { error } = await supabase.from("invitations").update(row).eq("id", id);
  if (error && isMissingOptionalColumn(error.message)) {
    ({ error } = await supabase.from("invitations").update(withoutOptionalColumns(row)).eq("id", id));
  }

  if (error) {
    throw new Error(`Taklifnomani yangilashda xatolik: ${error.message}`);
  }

  // Almashtirilgan muqova yoki olib tashlangan galereya rasmlari endi hech
  // qayerda ishlatilmasa — Discord'dan o'chiriladi. Xato saqlashni to'xtatmaydi:
  // o'chmay qolgani keyinroq "Keraksiz fayllarni tozalash" bilan ketadi.
  const kept = new Set(invitationMediaUrls(media));
  await deleteMediaIfUnreferenced(
    supabase,
    previousMedia.filter((url) => !kept.has(url)),
  ).catch(() => {});

  // Mehmonlar ochadigan /t/<slug> keshi darhol yangilansin.
  updateTag(INVITATIONS_TAG);
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function deleteInvitation(id: string) {
  const supabase = await createAuthenticatedClient();
  const { data: row } = await supabase
    .from("invitations")
    .select(MEDIA_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("invitations").delete().eq("id", id);

  if (error) {
    throw new Error(`Taklifnomani o'chirishda xatolik: ${error.message}`);
  }

  // Taklifnoma bilan birga uning rasmlari ham Discord'dan o'chadi.
  await deleteMediaIfUnreferenced(supabase, invitationMediaUrls(row)).catch(() => {});

  // Mehmonlar ochadigan /t/<slug> keshi darhol yangilansin.
  updateTag(INVITATIONS_TAG);
  revalidatePath("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
