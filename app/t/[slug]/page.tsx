import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { GUEST_PARAM, sanitizeGuestName } from "@/lib/guestLink";
import { getPublishedInvitation } from "@/lib/invitationData";
import { invitationShareMeta } from "@/lib/invitationShare";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bare?: string; [GUEST_PARAM]?: string | string[] }>;
};

/**
 * Havola ulashilganda: kelin-kuyov ismlari, sana va ularning surati bilan katta rasm.
 * Google'ga esa kirmaydi (`noindex`): sahifada manzil, sana va karta raqami bor.
 */
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const robots = { index: false, follow: false };
  const { slug } = await params;
  const published = await getPublishedInvitation(slug);
  if (!published) return { robots };

  const guest = sanitizeGuestName((await searchParams)[GUEST_PARAM]);
  const { title, description, image } = invitationShareMeta(published.invitation, guest);
  return {
    title,
    description,
    robots,
    openGraph: { type: "website", siteName: "Oila-Uchun", locale: "uz_UZ", title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
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
