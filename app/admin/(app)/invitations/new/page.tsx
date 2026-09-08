import { InvitationFormWithPreview } from "@/components/admin/InvitationFormWithPreview";
import { createInvitation } from "../actions";
import { getMusicTracks } from "@/lib/musicTracks";

export default async function NewInvitationPage() {
  const musicTracks = await getMusicTracks();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Yangi taklifnoma</h1>
      <InvitationFormWithPreview musicTracks={musicTracks} action={createInvitation} />
    </div>
  );
}
