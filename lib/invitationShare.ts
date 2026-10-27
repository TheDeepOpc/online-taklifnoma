import type { Invitation } from "@/lib/types";
import { uzFullDate, uzWeekdayName } from "@/lib/uzDate";

/** Ulashish rasmi o'lchami — Telegram/Instagram/Facebook "katta rasm" ko'rinishi uchun. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

/** "Shanba, 12 Iyun, 2026 · 18:00" — sana mahalliy kun bo'yicha (vaqt mintaqasi siljitmaydi). */
export function weddingDateLine(invitation: Pick<Invitation, "wedding_date" | "wedding_time">): string {
  const [y, m, d] = invitation.wedding_date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const time = invitation.wedding_time?.slice(0, 5);
  return `${uzWeekdayName(date)}, ${uzFullDate(date)}${time ? ` · ${time}` : ""}`;
}

/**
 * Havola Telegram, Instagram va boshqalarga tashlanganda chiqadigan sarlavha,
 * tavsif va rasm. Rasm manzilidagi `v` — taklifnoma yangilanganda (masalan,
 * muqova almashtirilsa) ilovalar eski rasmni keshdan ko'rsatmasligi uchun.
 */
export function invitationShareMeta(invitation: Invitation, guestName: string | null) {
  const title = `${invitation.groom_name} & ${invitation.bride_name} — to‘y taklifnomasi`;
  const details = [weddingDateLine(invitation), invitation.venue_name].filter(Boolean).join(" · ");
  const greeting = guestName ? `Hurmatli ${guestName}! ` : "";
  const description = `${greeting}Sizni to‘y marosimimizga taklif qilamiz. ${details}`;
  const version = new Date(invitation.updated_at).getTime().toString(36);

  return {
    title,
    description,
    image: {
      url: `/t/${invitation.slug}/og?v=${version}`,
      ...SHARE_IMAGE_SIZE,
      type: "image/jpeg",
      alt: title,
    },
  };
}
