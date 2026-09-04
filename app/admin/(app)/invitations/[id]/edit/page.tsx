import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvitationFormWithPreview } from "@/components/admin/InvitationFormWithPreview";
import { updateInvitation } from "../../actions";
import type { Invitation, MusicTrack } from "@/lib/types";

export default async function EditInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: invitation }, { data: musicTracks }] = await Promise.all([
    supabase.from("invitations").select("*").eq("id", id).single(),
    supabase.from("music_tracks").select("*").order("title"),
  ]);

  if (!invitation) {
    notFound();
  }

  const boundUpdateInvitation = updateInvitation.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Taklifnomani tahrirlash</h1>
      <InvitationFormWithPreview
        invitation={invitation as Invitation}
        musicTracks={(musicTracks as MusicTrack[]) ?? []}
        action={boundUpdateInvitation}
      />
    </div>
  );
}
