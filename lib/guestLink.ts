/**
 * Bitta taklifnomadan har bir mehmon uchun alohida shaxsiy havola:
 * `/t/<slug>?mehmon=Ism%20Familiya`. Ism URL'dan keladi, shuning uchun
 * uzunligi cheklanadi va bo'sh joylar tozalanadi (React matnni o'zi escape qiladi).
 */
export const GUEST_PARAM = "mehmon";
const MAX_GUEST_NAME = 80;

export function sanitizeGuestName(raw: string | string[] | undefined | null): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, MAX_GUEST_NAME);
}

export function guestInvitationPath(slug: string, guestName?: string | null): string {
  const name = sanitizeGuestName(guestName);
  return name ? `/t/${slug}?${GUEST_PARAM}=${encodeURIComponent(name)}` : `/t/${slug}`;
}
