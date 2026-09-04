"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { ThemePicker } from "./ThemePicker";
import { THEME_PRESETS, getUnlockedThemes, isThemeUnlocked } from "@/lib/themes";
import {
  PRICE_TIER_LABELS,
  type Invitation,
  type MusicTrack,
  type PriceTier,
} from "@/lib/types";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function InvitationFormWithPreview({
  invitation,
  musicTracks,
  action,
}: {
  invitation?: Invitation;
  musicTracks: MusicTrack[];
  action: (formData: FormData) => void;
}) {
  const [groomName, setGroomName] = useState(invitation?.groom_name ?? "");
  const [brideName, setBrideName] = useState(invitation?.bride_name ?? "");
  const [weddingDate, setWeddingDate] = useState(invitation?.wedding_date ?? "");
  const [weddingTime, setWeddingTime] = useState(invitation?.wedding_time ?? "18:00");
  const [venueName, setVenueName] = useState(invitation?.venue_name ?? "");
  const [venueAddress, setVenueAddress] = useState(invitation?.venue_address ?? "");
  const [venueMapUrl, setVenueMapUrl] = useState(invitation?.venue_map_url ?? "");
  const [priceTier, setPriceTier] = useState<PriceTier>(invitation?.price_tier ?? "150000");
  const [templateId, setTemplateId] = useState(
    invitation?.template_id ?? THEME_PRESETS[0].id,
  );
  const [musicTrackId, setMusicTrackId] = useState(invitation?.music_track_id ?? "");
  const [customMessage, setCustomMessage] = useState(invitation?.custom_message ?? "");
  const [isPaid, setIsPaid] = useState(invitation?.is_paid ?? false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    invitation?.cover_photo_url ?? null,
  );
  const [secondPhotoPreviewUrl, setSecondPhotoPreviewUrl] = useState<string | null>(
    invitation?.second_photo_url ?? null,
  );
  const [giftCardNumber, setGiftCardNumber] = useState(invitation?.gift_card_number ?? "");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setCoverPreviewUrl(URL.createObjectURL(file));
  }

  function handleSecondPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSecondPhotoPreviewUrl(URL.createObjectURL(file));
  }

  function handlePriceTierChange(nextPriceTier: PriceTier) {
    setPriceTier(nextPriceTier);
    if (!isThemeUnlocked(templateId, nextPriceTier)) {
      setTemplateId(getUnlockedThemes(nextPriceTier)[0].id);
    }
  }

  const selectedMusicTrack = musicTracks.find((t) => t.id === musicTrackId) ?? null;

  const previewInvitation: Invitation = useMemo(
    () => ({
      id: invitation?.id ?? "preview",
      slug: invitation?.slug ?? "preview",
      groom_name: groomName || "Kuyov ismi",
      bride_name: brideName || "Kelin ismi",
      wedding_date: weddingDate || todayISODate(),
      wedding_time: weddingTime || "18:00",
      venue_name: venueName || "To'yxona nomi",
      venue_address: venueAddress || "To'yxona manzili",
      venue_map_url: venueMapUrl || null,
      price_tier: priceTier,
      template_id: templateId,
      music_track_id: musicTrackId || null,
      custom_message: customMessage || null,
      cover_photo_url: coverPreviewUrl,
      second_photo_url: secondPhotoPreviewUrl,
      gift_card_number: giftCardNumber || null,
      is_paid: isPaid,
      status: isPaid ? "published" : "draft",
      created_at: invitation?.created_at ?? "",
      updated_at: invitation?.updated_at ?? "",
    }),
    [
      invitation,
      groomName,
      brideName,
      weddingDate,
      weddingTime,
      venueName,
      venueAddress,
      venueMapUrl,
      priceTier,
      templateId,
      musicTrackId,
      customMessage,
      coverPreviewUrl,
      secondPhotoPreviewUrl,
      giftCardNumber,
      isPaid,
    ],
  );

  return (
    <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-8">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Kuyov ismi">
            <input
              name="groom_name"
              required
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Kelin ismi">
            <input
              name="bride_name"
              required
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="To'y sanasi">
            <input
              type="date"
              name="wedding_date"
              required
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="To'y vaqti">
            <input
              type="time"
              name="wedding_time"
              required
              value={weddingTime}
              onChange={(e) => setWeddingTime(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="To'yxona nomi">
          <input
            name="venue_name"
            required
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="To'yxona manzili">
          <input
            name="venue_address"
            required
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Google Maps havolasi (ixtiyoriy)">
          <input
            name="venue_map_url"
            type="url"
            placeholder="https://maps.google.com/..."
            value={venueMapUrl}
            onChange={(e) => setVenueMapUrl(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Narx darajasi">
          <select
            name="price_tier"
            required
            value={priceTier}
            onChange={(e) => handlePriceTierChange(e.target.value as PriceTier)}
            className="input"
          >
            {Object.entries(PRICE_TIER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Dizayn mavzusi">
          <input type="hidden" name="template_id" value={templateId} />
          <ThemePicker priceTier={priceTier} value={templateId} onChange={setTemplateId} />
        </Field>

        <Field label="Fon musiqasi">
          <select
            name="music_track_id"
            value={musicTrackId}
            onChange={(e) => setMusicTrackId(e.target.value)}
            className="input"
          >
            <option value="">Musiqasiz</option>
            {musicTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Muqova rasm (ixtiyoriy)">
          <input
            name="cover_photo"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="input"
          />
        </Field>

        <Field label="Ikkinchi rasm — kuyov (ixtiyoriy, faqat ba'zi mavzular uchun)">
          <input
            name="second_photo"
            type="file"
            accept="image/*"
            onChange={handleSecondPhotoChange}
            className="input"
          />
        </Field>

        <Field label="Sovg'a karta raqami (ixtiyoriy)">
          <input
            name="gift_card_number"
            value={giftCardNumber}
            onChange={(e) => setGiftCardNumber(e.target.value)}
            className="input"
            placeholder="8600 0000 0000 0000"
          />
        </Field>

        <Field label="Tabrik matni (ixtiyoriy)">
          <textarea
            name="custom_message"
            rows={3}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="input"
            placeholder="Sizni to'y marosimimizga taklif qilamiz..."
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="is_paid"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          To&apos;lov qabul qilindi (taklifnoma jonli bo&apos;ladi)
        </label>

        <button type="submit" className="btn">
          Saqlash
        </button>
      </form>

      <div className="mt-6 lg:mt-0">
        <button
          type="button"
          onClick={() => setShowMobilePreview((v) => !v)}
          className="btn-secondary mb-3 w-full lg:hidden"
        >
          {showMobilePreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showMobilePreview ? "Ko'rishni yashirish" : "Jonli ko'rish"}
        </button>

        <div className={`${showMobilePreview ? "" : "hidden"} lg:block lg:sticky lg:top-6`}>
          <p className="mb-2 hidden text-sm font-medium text-slate-500 lg:block">Jonli ko&apos;rish</p>
          <div className="mx-auto h-[600px] max-w-sm overflow-y-auto rounded-2xl border border-slate-200 shadow-sm">
            <TemplateRenderer
              invitation={previewInvitation}
              musicTrack={selectedMusicTrack}
              previewMode
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
