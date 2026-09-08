import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  SITE_CONTENT_KEY,
  type SiteContent,
} from "@/lib/siteContent";

export async function getSiteContentFromDb(): Promise<SiteContent> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", SITE_CONTENT_KEY)
    .maybeSingle();

  return mergeSiteContent(data?.value ?? undefined, DEFAULT_SITE_CONTENT);
}

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