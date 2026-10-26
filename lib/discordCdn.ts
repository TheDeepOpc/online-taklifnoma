import "server-only";
import { unstable_cache } from "next/cache";

/**
 * Rasm va audio fayllar Discord webhook orqali Discord CDN'da saqlanadi.
 *
 * MUHIM: Discord CDN havolasi (`cdn.discordapp.com/...?ex=..&is=..&hm=..`)
 * imzolangan va ~24 soatda eskiradi. Shuning uchun bazaga CDN havolasi emas,
 * saytning doimiy manzili — `/api/media/<messageId>` yoziladi. Bu route har
 * so'rovda Discord'dan xabarni o'qib, yangi imzolangan havolaga yo'naltiradi.
 */
export const MEDIA_ROUTE_PREFIX = "/api/media/";
/** `music_tracks.storage_path` ichida Discord xabarini belgilash uchun. */
export const DISCORD_STORAGE_PREFIX = "discord:";

/** Boost qilinmagan server uchun Discord webhook fayl limiti. */
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_RETRIES = 4;
/** Havola kamida shuncha vaqt yaroqli bo'lsa, keshdagisi ishlatiladi. */
const MIN_REMAINING_MS = 60 * 60 * 1000;

const SNOWFLAKE = /^\d{15,21}$/;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};

interface DiscordMessage {
  id: string;
  attachments?: { url: string }[];
}

function webhookUrl(): string {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    throw new Error("DISCORD_WEBHOOK_URL sozlanmagan (.env.local ga qo'shing).");
  }
  return url;
}

export function isDiscordMessageId(value: string): boolean {
  return SNOWFLAKE.test(value);
}

export function discordMediaUrl(messageId: string): string {
  return `${MEDIA_ROUTE_PREFIX}${messageId}`;
}

// Fayl nomi Discord'ga faqat xavfsiz ASCII ko'rinishda boradi (kirillcha,
// bo'sh joy, `#` kabi belgilar havolani buzmasin) — kengaytma saqlanadi,
// chunki Discord content-type'ni shunga qarab beradi.
function safeFileName(file: File): string {
  const fromName = /\.([a-z0-9]{1,5})$/i.exec(file.name)?.[1]?.toLowerCase();
  const ext = fromName ?? MIME_EXTENSIONS[file.type] ?? "bin";
  return `${crypto.randomUUID()}.${ext}`;
}

/** 429 (rate limit) bo'lsa, Discord aytgan vaqtcha kutib qayta urinadi. */
async function discordFetch(path: string, init: RequestInit = {}): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${webhookUrl()}${path}`, { ...init, cache: "no-store" });
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    const body = (await res.json().catch(() => null)) as { retry_after?: number } | null;
    const waitSeconds = Number(body?.retry_after ?? res.headers.get("retry-after") ?? 1);
    await new Promise((resolve) => setTimeout(resolve, Math.ceil(waitSeconds * 1000) + 100));
  }
}

export async function uploadToDiscord(file: File): Promise<{ messageId: string; url: string }> {
  if (file.size > MAX_FILE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(`"${file.name}" juda katta (${mb} MB). Discord limiti — 10 MB.`);
  }

  const form = new FormData();
  form.append("files[0]", file, safeFileName(file));

  // `?wait=true` bo'lmasa Discord 204 qaytaradi va xabar id'si kelmaydi.
  const res = await discordFetch("?wait=true", { method: "POST", body: form });
  if (!res.ok) {
    throw new Error(`Discord'ga yuklashda xatolik (${res.status}): ${await res.text()}`);
  }

  const message = (await res.json()) as DiscordMessage;
  if (!message.attachments?.length) {
    throw new Error("Discord javobida fayl topilmadi.");
  }

  return { messageId: message.id, url: discordMediaUrl(message.id) };
}

export async function deleteFromDiscord(messageId: string): Promise<void> {
  if (!isDiscordMessageId(messageId)) return;
  const res = await discordFetch(`/messages/${messageId}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Discord'dan o'chirishda xatolik (${res.status}).`);
  }
}

/** `null` — xabar yoki fayl Discord'da yo'q (o'chirilgan). */
async function fetchAttachmentUrl(messageId: string): Promise<string | null> {
  const res = await discordFetch(`/messages/${messageId}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    // Vaqtinchalik xato keshlanmasin — throw qilamiz.
    throw new Error(`Discord xabarini o'qishda xatolik (${res.status}).`);
  }
  const message = (await res.json()) as DiscordMessage;
  return message.attachments?.[0]?.url ?? null;
}

// Har bir rasm/audio ochilishida Discord'ga so'rov ketmasligi uchun yangi
// havola 6 soat keshlanadi (havola ~24 soat yaroqli).
const getCachedAttachmentUrl = unstable_cache(fetchAttachmentUrl, ["discord-attachment-url"], {
  revalidate: 6 * 60 * 60,
});

function expiresAt(url: string): number {
  const ex = new URL(url).searchParams.get("ex");
  return ex ? parseInt(ex, 16) * 1000 : 0;
}

export async function resolveDiscordMediaUrl(messageId: string): Promise<string | null> {
  const cached = await getCachedAttachmentUrl(messageId);
  // Kesh muddati o'tgach Next eskirgan qiymatni bir marta qaytaradi (fonda
  // yangilaydi). Uzoq ochilmagan taklifnomada bu eskirgan havola bo'lishi
  // mumkin — shunday holatda keshni chetlab, darhol yangisini olamiz.
  if (cached === null || expiresAt(cached) - Date.now() > MIN_REMAINING_MS) {
    return cached;
  }
  return fetchAttachmentUrl(messageId);
}
