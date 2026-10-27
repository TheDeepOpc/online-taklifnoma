import { getPublishedInvitation } from "@/lib/invitationData";
import { renderInvitationShareImage } from "@/lib/invitationShareImage";

/**
 * Taklifnoma havolasining ulashish rasmi (og:image). Telegram, Instagram va
 * boshqa ilovalar havolani bir marta o'qiydi — Vercel CDN javobni 1 soat
 * saqlaydi, keyin fonda yangilaydi. Muqova almashtirilsa, sahifadagi `?v=`
 * o'zgaradi va yangi rasm darhol olinadi.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const published = await getPublishedInvitation(slug);
  if (!published) {
    return new Response("Topilmadi", { status: 404 });
  }

  try {
    const image = await renderInvitationShareImage(published.invitation);
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    // Rasm chizilmasa ham havola rasmsiz qolmasin — saytning umumiy rasmi.
    console.error("[t/og]", slug, error);
    return Response.redirect(new URL("/opengraph-image", request.url), 302);
  }
}
