import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { GUEST_PARAM, sanitizeGuestName } from "@/lib/guestLink";
import type { Invitation, MusicTrack } from "@/lib/types";

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bare?: string; [GUEST_PARAM]?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .eq("is_paid", true)
    .eq("status", "published")
    .single();

  if (!invitation) {
    notFound();
  }

  // Shaxsiy havola (`?mehmon=...`) admin saqlagan umumiy murojaatdan ustun turadi —
  // bitta taklifnomani har bir mehmonga o'z ismi bilan yuborish mumkin.
  const guestFromLink = sanitizeGuestName(query[GUEST_PARAM]);
  const typedInvitation = {
    ...(invitation as Invitation),
    ...(guestFromLink ? { guest_name: guestFromLink } : {}),
  };
  let musicTrack: MusicTrack | null = null;

  if (typedInvitation.music_track_id) {
    const { data } = await supabase
      .from("music_tracks")
      .select("*")
      .eq("id", typedInvitation.music_track_id)
      .single();
    musicTrack = data as MusicTrack | null;
  }

  const bareQuery = new URLSearchParams({ bare: "1" });
  if (guestFromLink) bareQuery.set(GUEST_PARAM, guestFromLink);

  return (
    <TemplateRenderer
      invitation={typedInvitation}
      musicTrack={musicTrack}
      frame={query.bare !== "1"}
      frameSrc={`/t/${slug}?${bareQuery.toString()}`}
      frameTitle={`${typedInvitation.groom_name} va ${typedInvitation.bride_name} — Taklifnoma`}
    />
  );
}
