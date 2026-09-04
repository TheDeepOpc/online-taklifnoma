export type PriceTier = "150000" | "200000" | "250000";
export type InvitationStatus = "draft" | "published";

export type TemplateId = string;

export const PRICE_TIER_LABELS: Record<PriceTier, string> = {
  "150000": "150 000 so'm",
  "200000": "200 000 so'm",
  "250000": "250 000 so'm",
};

export interface MusicTrack {
  id: string;
  title: string;
  file_url: string;
  storage_path: string | null;
  min_price_tier: PriceTier;
}

export interface Invitation {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string | null;
  price_tier: PriceTier;
  template_id: TemplateId;
  music_track_id: string | null;
  custom_message: string | null;
  cover_photo_url: string | null;
  second_photo_url: string | null;
  gift_card_number: string | null;
  is_paid: boolean;
  status: InvitationStatus;
  created_at: string;
  updated_at: string;
}
