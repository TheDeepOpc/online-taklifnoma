import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { MusicTrack } from "@/lib/types";

export const MUSIC_TRACKS_TAG = "music-tracks";

/**
 * Musiqa kutubxonasini Next'ning ma'lumot keshidan o'qiydi.
 *
 * Nima uchun: har bir Supabase so'rovi ~290 ms turadi (loyiha Singapur
 * regionida). Qo'shiqlar ro'yxati esa juda kam o'zgaradi — lekin "Yangi
 * taklifnoma" va "Tahrirlash" sahifalari uni har ochilganda qayta so'rardi.
 * Endi ro'yxat keshlanadi va faqat qo'shiq qo'shilganda/o'chirilganda
 * yangilanadi (`revalidateTag(MUSIC_TRACKS_TAG)`).
 *
 * Cookie'li server klienti kesh ichida ishlatilmaydi (kesh dinamik
 * ma'lumotga bog'liq bo'lib qolardi), shuning uchun bu yerda oddiy anon
 * klient ishlatiladi — `music_tracks` jadvalida ommaviy o'qish siyosati bor.
 */
export const getMusicTracks = unstable_cache(
  async (): Promise<MusicTrack[]> => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase.from("music_tracks").select("*").order("title");
    return (data as MusicTrack[]) ?? [];
  },
  ["music-tracks-list"],
  { tags: [MUSIC_TRACKS_TAG] },
);
