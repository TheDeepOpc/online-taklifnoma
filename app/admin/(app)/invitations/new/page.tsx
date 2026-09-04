import { createClient } from "@/lib/supabase/server";
import { InvitationFormWithPreview } from "@/components/admin/InvitationFormWithPreview";
import { createInvitation } from "../actions";
import type { MusicTrack } from "@/lib/types";

export default async function NewInvitationPage() {
  const supabase = await createClient();
  const { data: musicTracks } = await supabase
    .from("music_tracks")
    .select("*")
    .order("title");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Yangi taklifnoma</h1>
      <InvitationFormWithPreview
        musicTracks={(musicTracks as MusicTrack[]) ?? []}
        action={createInvitation}
      />
    </div>
  );
}
