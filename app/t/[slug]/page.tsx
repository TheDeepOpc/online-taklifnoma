import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { GUEST_PARAM, sanitizeGuestName } from "@/lib/guestLink";
import { getPublishedInvitation } from "@/lib/invitationData";

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bare?: string; [GUEST_PARAM]?: string | string[] }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const published = await getPublishedInvitation(slug);

  if (!published) {
    notFound();
  }

  // Shaxsiy havola (`?mehmon=...`) admin saqlagan umumiy murojaatdan ustun turadi —
  // bitta taklifnomani har bir mehmonga o'z ismi bilan yuborish mumkin.
  const guestFromLink = sanitizeGuestName(query[GUEST_PARAM]);
  const typedInvitation = {
    ...published.invitation,
    ...(guestFromLink ? { guest_name: guestFromLink } : {}),
  };
  const musicTrack = published.musicTrack;

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
