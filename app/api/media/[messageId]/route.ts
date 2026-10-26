import { isDiscordMessageId, mediaCacheSeconds, resolveDiscordMediaUrl } from "@/lib/discordCdn";

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
    // Brauzer va Vercel CDN yo'naltirishni havola eskirguncha (12 soatgacha)
    // eslab qoladi — keyingi ochilishlar funksiyaga ham, Discord'ga ham bormaydi.
    const seconds = mediaCacheSeconds(url);
    return new Response(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": `public, max-age=${seconds}, s-maxage=${seconds}` },
    });
  } catch (error) {
    // Sabab Vercel log'ida va javobda ko'rinsin (masalan, "DISCORD_WEBHOOK_URL sozlanmagan").
    // Xabarlar faqat bizniki — token yoki maxfiy qiymat yo'q.
    console.error("[api/media]", messageId, error);
    return new Response(`Fayl vaqtincha mavjud emas: ${(error as Error).message}`, { status: 502 });
  }
}
