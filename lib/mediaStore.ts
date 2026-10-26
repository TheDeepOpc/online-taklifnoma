import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  deleteFromDiscord,
  listOwnUploads,
  messageCreatedAt,
  messageIdFromMediaUrl,
  purgeOwnUploads,
} from "@/lib/discordCdn";

/**
 * Discord'dagi fayllarni bazaga qarab boshqarish: fayl faqat hech bir
 * taklifnoma yoki musiqa ishlatmayotgan bo'lsa o'chiriladi.
 *
 * MUHIM: `supabase` kirgan admin klienti bo'lishi shart (createAuthenticatedClient).
 * Anon klient RLS sabab faqat e'lon qilingan taklifnomalarni ko'radi — qoralama
 * taklifnomalarning rasmlari "ishlatilmayapti" deb o'chib ketardi.
 */

/** Yuklangan, lekin saqlanmagan fayl shuncha vaqtdan keyin "tashlab ketilgan" hisoblanadi. */
export const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 1000;

interface InvitationMediaRow {
  cover_photo_url: string | null;
  second_photo_url: string | null;
  gallery_photo_urls: string[] | null;
}

export function invitationMediaUrls(row: InvitationMediaRow | null | undefined): string[] {
  if (!row) return [];
  return [row.cover_photo_url, row.second_photo_url, ...(row.gallery_photo_urls ?? [])].filter(
    (url): url is string => Boolean(url),
  );
}

export async function getReferencedMediaIds(supabase: SupabaseClient): Promise<Set<string>> {
  const ids = new Set<string>();
  const add = (url: string | null) => {
    const id = url ? messageIdFromMediaUrl(url) : null;
    if (id) ids.add(id);
  };

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("invitations")
      .select("cover_photo_url, second_photo_url, gallery_photo_urls")
      .order("id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Taklifnomalarni o'qishda xatolik: ${error.message}`);
    for (const row of data as InvitationMediaRow[]) invitationMediaUrls(row).forEach(add);
    if (data.length < PAGE_SIZE) break;
  }

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("music_tracks")
      .select("file_url")
      .order("id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Musiqalarni o'qishda xatolik: ${error.message}`);
    for (const row of data as { file_url: string | null }[]) add(row.file_url);
    if (data.length < PAGE_SIZE) break;
  }

  return ids;
}

/** Berilgan havolalardan hech qayerda ishlatilmayotgan Discord fayllarini o'chiradi. */
export async function deleteMediaIfUnreferenced(
  supabase: SupabaseClient,
  urls: string[],
): Promise<number> {
  const candidates = [
    ...new Set(urls.map(messageIdFromMediaUrl).filter((id): id is string => id !== null)),
  ];
  if (candidates.length === 0) return 0;

  const referenced = await getReferencedMediaIds(supabase);
  let deleted = 0;
  for (const id of candidates) {
    if (referenced.has(id)) continue;
    await deleteFromDiscord(id);
    deleted++;
  }
  return deleted;
}

/**
 * Kanaldagi tashlab ketilgan fayllarni tozalash: taklifnoma yaratilmay qolgan
 * yoki sahifa yopilganda o'chmay qolgan yuklamalar. Faqat 24 soatdan eskilari —
 * hozir ochiq turgan formadagi rasmlar o'chib ketmasin.
 */
export async function cleanupOrphanMedia(
  supabase: SupabaseClient,
): Promise<{ scanned: number; deleted: number }> {
  const [uploads, referenced] = await Promise.all([
    listOwnUploads(),
    getReferencedMediaIds(supabase),
  ]);
  const cutoff = Date.now() - ORPHAN_GRACE_MS;
  const orphans = uploads
    .filter((m) => !referenced.has(m.id) && messageCreatedAt(m.id) < cutoff)
    .map((m) => m.id);

  const deleted = await purgeOwnUploads(orphans);
  return { scanned: uploads.length, deleted };
}
