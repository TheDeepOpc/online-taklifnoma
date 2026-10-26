import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Invitation, MusicTrack } from "@/lib/types";

export const INVITATIONS_TAG = "invitations";

type InvitationRow = Invitation & { music_tracks: MusicTrack | null };

/**
 * Mehmon ochadigan taklifnoma: bitta so'rovda (musiqasi bilan birga) va
 * keshdan. Ilgari har ochilishda 2 ta ketma-ket baza so'rovi ketardi.
 * Cookie'siz anon klient — ommaviy taklifnoma RLS bo'yicha ochiq o'qiladi.
 * Admin saqlaganda/o'chirganda `updateTag(INVITATIONS_TAG)` keshni yangilaydi.
 */
export const getPublishedInvitation = unstable_cache(
  async (slug: string): Promise<{ invitation: Invitation; musicTrack: MusicTrack | null } | null> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase
      .from("invitations")
      .select("*, music_tracks(*)")
      .eq("slug", slug)
      .eq("is_paid", true)
      .eq("status", "published")
      .maybeSingle();

    if (!data) return null;
    const { music_tracks, ...invitation } = data as InvitationRow;
    return { invitation, musicTrack: music_tracks ?? null };
  },
  ["published-invitation"],
  { tags: [INVITATIONS_TAG], revalidate: 86400 },
);
