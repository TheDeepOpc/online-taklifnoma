import type { Invitation } from "./types";

function demoWeddingDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().slice(0, 10);
}

export const DEMO_INVITATION: Invitation = {
  id: "demo",
  slug: "demo",
  groom_name: "Azizbek",
  bride_name: "Malika",
  wedding_date: demoWeddingDate(),
  wedding_time: "18:00",
  venue_name: "Regal Palace",
  venue_address: "Toshkent shahri, Amir Temur ko'chasi 15",
  venue_map_url: "https://maps.google.com",
  price_tier: "250000",
  template_id: "",
  music_track_id: null,
  custom_message:
    "Hayotimizdagi eng baxtli kunlardan biri — nikoh to'yimizni siz bilan birga nishonlashni niyat qildik.\nSizni ushbu kechamizga samimiy taklif etamiz.",
  cover_photo_url: null,
  second_photo_url: null,
  gallery_photo_urls: [],
  schedule_items: [],
  gift_card_number: "8600 1234 5678 9012",
  guest_name: null,
  text_size: "normal",
  is_paid: true,
  status: "published",
  created_at: "",
  updated_at: "",
};
