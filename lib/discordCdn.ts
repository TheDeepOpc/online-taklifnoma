import "server-only";
import { unstable_cache } from "next/cache";

/**
 * Rasm va audio fayllar Discord webhook orqali Discord CDN'da saqlanadi.
 *
 * MUHIM: Discord CDN havolasi (`cdn.discordapp.com/...?ex=..&is=..&hm=..`)
 * imzolangan va ~24 soatda eskiradi. Shuning uchun bazaga CDN havolasi emas,
 * saytning doimiy manzili — `/api/media/<messageId>` yoziladi. Bu route har
 * so'rovda Discord'dan xabarni o'qib, yangi imzolangan havolaga yo'naltiradi.
 *
 * Yuklash — webhook orqali. O'qish va o'chirish — bot (DISCORD_BOT_TOKEN)
 * sozlangan va kanalga kira olsa bot orqali, aks holda webhook orqali. Bot
 * webhook almashtirilsa ham eski fayllarni o'qiy/o'chira oladi va kanaldagi
 * keraksiz fayllarni tozalash uchun kerak.
 */
export const MEDIA_ROUTE_PREFIX = "/api/media/";
/** `music_tracks.storage_path` ichida Discord xabarini belgilash uchun. */
export const DISCORD_STORAGE_PREFIX = "discord:";

const API = "https://discord.com/api/v10";
/** Boost qilinmagan server uchun Discord webhook fayl limiti. */
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_RETRIES = 4;
/** Havola kamida shuncha vaqt yaroqli bo'lsa, keshdagisi ishlatiladi. */
const MIN_REMAINING_MS = 60 * 60 * 1000;
/** Discord bulk-delete faqat 14 kundan yosh xabarlarni qabul qiladi (zaxira bilan 13). */
const BULK_DELETE_MAX_AGE_MS = 13 * 24 * 60 * 60 * 1000;
const DISCORD_EPOCH = 1420070400000;

const SNOWFLAKE = /^\d{15,21}$/;
const MEDIA_URL = /^\/api\/media\/(\d{15,21})$/;

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

export interface DiscordMessage {
  id: string;
  /** Webhook yuborgan xabarlarda bor; odamlar yozgan xabarlarda yo'q. */
  webhook_id?: string;
  author?: { id: string };
  attachments?: { url: string }[];
}

export type MediaKind = "image" | "audio";

const KIND_EXTENSIONS: Record<MediaKind, readonly string[]> = {
  image: ["jpg", "jpeg", "png", "webp", "gif", "heic"],
  audio: ["mp3", "m4a", "ogg", "wav"],
};

function webhookUrl(): string {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    throw new Error(
      "DISCORD_WEBHOOK_URL sozlanmagan: lokalda .env.local ga, productionda Vercel → Settings → Environment Variables ga qo'shing.",
    );
  }
  return url;
}

function webhookId(): string | null {
  return /\/webhooks\/(\d+)\//.exec(webhookUrl())?.[1] ?? null;
}

function botConfig(): { token: string; channelId: string; userId: string | null } | null {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;
  // Bot foydalanuvchisining id'si application id bilan bir xil.
  const userId = process.env.DISCORD_APPLICATION_ID ?? null;
  return token && channelId ? { token, channelId, userId } : null;
}

/**
 * Bizning yuklamamizmi: shu webhook (yoki `anyWebhook` bo'lsa, istalgan,
 * masalan almashtirilgan eski webhook) yoki bot yuborgan fayl xabari.
 * Kanaldagi odamlar yozishmasi hech qachon o'chirilmaydi.
 */
function isOwnUpload(message: DiscordMessage, anyWebhook: boolean): boolean {
  if (!message.attachments?.length) return false;
  const bot = botConfig();
  if (bot?.userId && message.author?.id === bot.userId) return true;
  if (!message.webhook_id) return false;
  return anyWebhook || message.webhook_id === webhookId();
}

export function isDiscordMessageId(value: string): boolean {
  return SNOWFLAKE.test(value);
}

export function discordMediaUrl(messageId: string): string {
  return `${MEDIA_ROUTE_PREFIX}${messageId}`;
}

/** `/api/media/<id>` → `<id>`; boshqa (masalan, eski Supabase) havolalar uchun `null`. */
export function messageIdFromMediaUrl(url: string): string | null {
  return MEDIA_URL.exec(url)?.[1] ?? null;
}

/** Discord id'si ichida yaratilgan vaqt saqlanadi. */
export function messageCreatedAt(messageId: string): number {
  return Number(BigInt(messageId) >> BigInt(22)) + DISCORD_EPOCH;
}

// Fayl nomi Discord'ga faqat xavfsiz ASCII ko'rinishda boradi (kirillcha,
// bo'sh joy, `#` kabi belgilar havolani buzmasin) — kengaytma saqlanadi,
// chunki Discord content-type'ni shunga qarab beradi.
function safeFileName(name: string, type: string): string {
  const fromName = /\.([a-z0-9]{1,5})$/i.exec(name)?.[1]?.toLowerCase();
  const ext = fromName ?? MIME_EXTENSIONS[type] ?? "bin";
  return `${crypto.randomUUID()}.${ext}`;
}

const SAFE_FILE_NAME = /^[0-9a-f-]{36}\.([a-z0-9]{1,5})$/;

function assertSize(size: number, name: string): void {
  if (size > MAX_FILE_BYTES) {
    const mb = (size / 1024 / 1024).toFixed(1);
    throw new Error(`"${name}" juda katta (${mb} MB). Discord limiti — 10 MB.`);
  }
}

/** 429 (rate limit) bo'lsa, Discord aytgan vaqtcha kutib qayta urinadi. */
async function discordRequest(url: string, init: RequestInit = {}): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { ...init, cache: "no-store" });
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    const body = (await res.json().catch(() => null)) as { retry_after?: number } | null;
    const waitSeconds = Number(body?.retry_after ?? res.headers.get("retry-after") ?? 1);
    await new Promise((resolve) => setTimeout(resolve, Math.ceil(waitSeconds * 1000) + 100));
  }
}

function webhookFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return discordRequest(`${webhookUrl()}${path}`, init);
}

function botFetch(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bot ${token}`);
  return discordRequest(`${API}${path}`, { ...init, headers });
}

/**
 * Server orqali yuklash (webhook). Fayl Vercel funksiyasidan o'tadi — shuning
 * uchun faqat kichik fayllar uchun (4.5 MB limiti); katta fayllar Direct
 * Upload bilan yuklanadi (createDirectUpload).
 */
export async function uploadToDiscord(file: File): Promise<{ messageId: string; url: string }> {
  assertSize(file.size, file.name);

  const form = new FormData();
  form.append("files[0]", file, safeFileName(file.name, file.type));

  // `?wait=true` bo'lmasa Discord 204 qaytaradi va xabar id'si kelmaydi.
  const res = await webhookFetch("?wait=true", { method: "POST", body: form });
  if (!res.ok) {
    throw new Error(`Discord'ga yuklashda xatolik (${res.status}): ${await res.text()}`);
  }

  const message = (await res.json()) as DiscordMessage;
  if (!message.attachments?.length) {
    throw new Error("Discord javobida fayl topilmadi.");
  }

  return { messageId: message.id, url: discordMediaUrl(message.id) };
}

export interface DirectUploadTicket {
  uploadUrl: string;
  uploadFilename: string;
  filename: string;
}

/**
 * Direct Upload, 1-qadam (bot kerak): Discord'dan bir martalik imzolangan
 * yuklash havolasi olinadi. Brauzer faylni shu havolaga o'zi PUT qiladi —
 * fayl Vercel orqali o'tmaydi (4.5 MB / FUNCTION_PAYLOAD_TOO_LARGE yo'q),
 * webhook/bot tokeni esa brauzerga chiqmaydi.
 * `null` — bot sozlanmagan yoki kanalga kira olmaydi.
 */
export async function createDirectUpload(
  kind: MediaKind,
  originalName: string,
  type: string,
  size: number,
): Promise<DirectUploadTicket | null> {
  assertSize(size, originalName);
  const filename = safeFileName(originalName, type);
  const ext = SAFE_FILE_NAME.exec(filename)?.[1] ?? "";
  if (!KIND_EXTENSIONS[kind].includes(ext)) {
    throw new Error(kind === "image" ? "Faqat rasm yuklash mumkin." : "Faqat audio fayl yuklash mumkin.");
  }

  const bot = botConfig();
  if (!bot) return null;
  const res = await botFetch(bot.token, `/channels/${bot.channelId}/attachments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files: [{ id: "0", filename, file_size: size }] }),
  });
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) {
    throw new Error(`Discord yuklash havolasini bermadi (${res.status}): ${await res.text()}`);
  }

  const body = (await res.json()) as {
    attachments?: { upload_url: string; upload_filename: string }[];
  };
  const attachment = body.attachments?.[0];
  if (!attachment) throw new Error("Discord yuklash havolasini qaytarmadi.");
  return { uploadUrl: attachment.upload_url, uploadFilename: attachment.upload_filename, filename };
}

/** Direct Upload, 3-qadam: brauzer yuklagan fayl kanalga xabar sifatida e'lon qilinadi. */
export async function finishDirectUpload(
  kind: MediaKind,
  filename: string,
  uploadFilename: string,
): Promise<{ messageId: string; url: string }> {
  const ext = SAFE_FILE_NAME.exec(filename)?.[1];
  if (!ext || !KIND_EXTENSIONS[kind].includes(ext) || !uploadFilename || uploadFilename.length > 512) {
    throw new Error("Noto'g'ri yuklash ma'lumoti.");
  }

  const bot = botConfig();
  if (!bot) throw new Error("DISCORD_BOT_TOKEN sozlanmagan.");
  const res = await botFetch(bot.token, `/channels/${bot.channelId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attachments: [{ id: "0", filename, uploaded_filename: uploadFilename }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Faylni Discord'ga joylashda xatolik (${res.status}): ${await res.text()}`);
  }

  const message = (await res.json()) as DiscordMessage;
  if (!message.attachments?.length) {
    throw new Error("Discord javobida fayl topilmadi.");
  }
  return { messageId: message.id, url: discordMediaUrl(message.id) };
}

/**
 * Bot kanalga kira olmasa (serverga qo'shilmagan — 401/403), har rasmda
 * avval botni, keyin webhook'ni so'ramaslik uchun botni bir muddat chetlab o'tamiz.
 */
const BOT_RETRY_AFTER_MS = 10 * 60 * 1000;
let botUnavailableUntil = 0;

/** `null` — xabar Discord'da yo'q (o'chirilgan). */
async function readMessage(messageId: string): Promise<DiscordMessage | null> {
  const bot = botConfig();
  if (bot && Date.now() > botUnavailableUntil) {
    const res = await botFetch(bot.token, `/channels/${bot.channelId}/messages/${messageId}`);
    if (res.ok) return (await res.json()) as DiscordMessage;
    if (res.status === 404) return null;
    if (res.status === 401 || res.status === 403) botUnavailableUntil = Date.now() + BOT_RETRY_AFTER_MS;
    // Bot o'qiy olmadi — webhook orqali o'qiymiz.
  }

  const res = await webhookFetch(`/messages/${messageId}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    // Vaqtinchalik xato keshlanmasin — throw qilamiz.
    throw new Error(`Discord xabarini o'qishda xatolik (${res.status}).`);
  }
  return (await res.json()) as DiscordMessage;
}

export async function deleteFromDiscord(messageId: string): Promise<void> {
  if (!isDiscordMessageId(messageId)) return;

  // Bot bo'lsa: avval xabarni o'qib, bizning yuklamamiz ekanini tekshiradi —
  // kanaldagi odamlar yozishmasi hech qachon o'chmaydi.
  const bot = botConfig();
  if (bot) {
    const path = `/channels/${bot.channelId}/messages/${messageId}`;
    const read = await botFetch(bot.token, path);
    if (read.status === 404) return;
    if (read.ok) {
      if (!isOwnUpload((await read.json()) as DiscordMessage, true)) return;
      const del = await botFetch(bot.token, path, { method: "DELETE" });
      if (del.ok || del.status === 404) return;
      throw new Error(`Bot xabarni o'chira olmadi (${del.status}) — "Manage Messages" huquqini tekshiring.`);
    }
    // 401/403 — bot hali serverga qo'shilmagan: webhook bilan urinamiz.
  }

  // Webhook faqat o'zi yuborgan xabarni o'chira oladi.
  const res = await webhookFetch(`/messages/${messageId}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Discord'dan o'chirishda xatolik (${res.status}).`);
  }
}

/**
 * Kanaldagi bizning barcha fayl xabarlarimiz — shu webhook yoki bot
 * yuborganlari (yangidan eskiga). Faqat bot bilan ishlaydi.
 */
export async function listOwnUploads(): Promise<DiscordMessage[]> {
  const bot = botConfig();
  if (!bot) {
    throw new Error("Tozalash uchun DISCORD_BOT_TOKEN va DISCORD_CHANNEL_ID kerak.");
  }
  const uploads: DiscordMessage[] = [];

  for (let before: string | undefined; ; ) {
    const query = `limit=100${before ? `&before=${before}` : ""}`;
    const res = await botFetch(bot.token, `/channels/${bot.channelId}/messages?${query}`);
    if (!res.ok) {
      throw new Error(
        `Bot kanal xabarlarini o'qiy olmadi (${res.status}) — bot serverga qo'shilganini tekshiring.`,
      );
    }
    const page = (await res.json()) as DiscordMessage[];
    uploads.push(...page.filter((m) => isOwnUpload(m, false)));
    if (page.length < 100) break;
    before = page[page.length - 1].id;
  }

  return uploads;
}

/**
 * Bot bilan xabarlarni o'chiradi: 14 kundan yoshlari 100 talab (bulk-delete),
 * eskilari bittalab. Faqat `listOwnUploads` dan olingan id'lar uchun.
 */
export async function purgeOwnUploads(messageIds: string[]): Promise<number> {
  const bot = botConfig();
  if (!bot || messageIds.length === 0) return 0;

  const recentLimit = Date.now() - BULK_DELETE_MAX_AGE_MS;
  const recent = messageIds.filter((id) => messageCreatedAt(id) > recentLimit);
  const single = messageIds.filter((id) => messageCreatedAt(id) <= recentLimit);
  let deleted = 0;

  for (let i = 0; i < recent.length; i += 100) {
    const chunk = recent.slice(i, i + 100);
    if (chunk.length === 1) {
      single.push(chunk[0]);
      continue;
    }
    const res = await botFetch(bot.token, `/channels/${bot.channelId}/messages/bulk-delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chunk }),
    });
    if (!res.ok) {
      throw new Error(`Bot fayllarni o'chira olmadi (${res.status}) — "Manage Messages" huquqini tekshiring.`);
    }
    deleted += chunk.length;
  }

  for (const id of single) {
    const res = await botFetch(bot.token, `/channels/${bot.channelId}/messages/${id}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 404) {
      throw new Error(`Bot faylni o'chira olmadi (${res.status}) — "Manage Messages" huquqini tekshiring.`);
    }
    deleted++;
  }

  return deleted;
}

async function fetchAttachmentUrl(messageId: string): Promise<string | null> {
  const message = await readMessage(messageId);
  return message?.attachments?.[0]?.url ?? null;
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

/**
 * Yo'naltirishni brauzer va Vercel CDN qancha keshlashi mumkin: havola
 * eskirishidan 30 daqiqa oldingacha, lekin 12 soatdan ko'p emas. Shunda bir
 * rasm uchun funksiya va Discord'ga deyarli so'rov ketmaydi.
 */
export function mediaCacheSeconds(url: string): number {
  const seconds = Math.floor((expiresAt(url) - Date.now() - 30 * 60 * 1000) / 1000);
  return Math.max(60, Math.min(seconds, 12 * 60 * 60));
}

async function resolveFresh(messageId: string): Promise<string | null> {
  const cached = await getCachedAttachmentUrl(messageId);
  // Kesh muddati o'tgach Next eskirgan qiymatni bir marta qaytaradi (fonda
  // yangilaydi). Uzoq ochilmagan taklifnomada bu eskirgan havola bo'lishi
  // mumkin — shunday holatda keshni chetlab, darhol yangisini olamiz.
  if (cached === null || expiresAt(cached) - Date.now() > MIN_REMAINING_MS) {
    return cached;
  }
  return fetchAttachmentUrl(messageId);
}

// Taklifnoma ochilganda bir xil rasm bir vaqtda bir necha marta so'ralsa,
// Discord'ga bitta so'rov ketadi.
const inflight = new Map<string, Promise<string | null>>();

export function resolveDiscordMediaUrl(messageId: string): Promise<string | null> {
  let pending = inflight.get(messageId);
  if (!pending) {
    pending = resolveFresh(messageId).finally(() => inflight.delete(messageId));
    inflight.set(messageId, pending);
  }
  return pending;
}
