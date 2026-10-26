import "server-only";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  SITE_CONTENT_KEY,
  type SiteContent,
} from "@/lib/siteContent";

export const SITE_CONTENT_TAG = "site-content";

/**
 * Bosh sahifa matnlari keshdan o'qiladi: cookie'siz anon klient (site_content
 * ommaviy o'qiladi) — shuning uchun bosh sahifa statik bo'lib, CDN'dan darhol
 * ochiladi (ilgari har tashrifda server render + baza so'rovi ~3.9 s edi).
 * Admin saqlaganda `updateTag(SITE_CONTENT_TAG)` keshni darhol yangilaydi.
 */
export const getSiteContentFromDb = unstable_cache(
  async (): Promise<SiteContent> => {
    const supabase = createAnonClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", SITE_CONTENT_KEY)
      .maybeSingle();

    return mergeSiteContent(data?.value ?? undefined, DEFAULT_SITE_CONTENT);
  },
  ["site-content-home"],
  { tags: [SITE_CONTENT_TAG], revalidate: 3600 },
);

export async function saveSiteContent(value: SiteContent): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("site_content").upsert(
    { key: SITE_CONTENT_KEY, value, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error(`Sayt tuzilmasini saqlashda xatolik: ${error.message}`);
  }
}

export { DEFAULT_SITE_CONTENT, mergeSiteContent };
