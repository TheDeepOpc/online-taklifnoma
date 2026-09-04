import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import type { Invitation, MusicTrack } from "@/lib/types";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  const typedInvitation = invitation as Invitation;
  let musicTrack: MusicTrack | null = null;

  if (typedInvitation.music_track_id) {
    const { data } = await supabase
      .from("music_tracks")
      .select("*")
      .eq("id", typedInvitation.music_track_id)
      .single();
    musicTrack = data as MusicTrack | null;
  }

  return <TemplateRenderer invitation={typedInvitation} musicTrack={musicTrack} />;
}
