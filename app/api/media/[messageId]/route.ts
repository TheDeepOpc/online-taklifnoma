import { isDiscordMessageId, resolveDiscordMediaUrl } from "@/lib/discordCdn";

/**
 * Taklifnoma rasmlari va musiqalarning doimiy manzili. Discord CDN havolasi
 * ~24 soatda eskiradi, shuning uchun bazada shu manzil saqlanadi va har
 * so'rovda yangi imzolangan CDN havolasiga yo'naltiriladi.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params;
  if (!isDiscordMessageId(messageId)) {
    return new Response("Topilmadi", { status: 404 });
  }

  try {
    const url = await resolveDiscordMediaUrl(messageId);
    if (!url) {
      return new Response("Topilmadi", { status: 404 });
    }
    // Brauzer/CDN yo'naltirishni 1 soat eslab qoladi — havola kamida 1 soat
    // yaroqli bo'lgandagina qaytariladi (resolveDiscordMediaUrl).
    return new Response(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new Response("Fayl vaqtincha mavjud emas", { status: 502 });
  }
}
