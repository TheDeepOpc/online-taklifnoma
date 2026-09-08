"use client";

import { useDeferredValue, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { ThemePicker } from "./ThemePicker";
import {
  THEME_PRESETS,
  getTheme,
  getUnlockedThemes,
  isThemeUnlocked,
  familySupportsCoverPhoto,
  familySupportsSecondPhoto,
} from "@/lib/themes";
import {
  PRICE_TIER_LABELS,
  type Invitation,
  type MusicTrack,
  type PriceTier,
  type ScheduleItem,
  type TextSize,
} from "@/lib/types";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function subscribeIsDesktop(callback: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getIsDesktopSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}
function getIsDesktopServerSnapshot() {
  return false;
}

const MAX_UPLOAD_WIDTH = 1600;
const MAX_GALLERY_PHOTOS = 5;

/**
 * Admin ko'pincha rasmni telefondan to'g'ridan-to'g'ri yuklaydi (3-10 MB, 3000px+
 * kenglikda) — sekin internetda bu formani saqlashni sezilarli sekinlashtiradi.
 * Yuborishdan oldin brauzerda kichraytirib, hajmini bir necha barobar qisqartiramiz.
 */
async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_UPLOAD_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    // Kichraytirib bo'lmasa, asl faylni yuboramiz — funksionallik buzilmasin.
    return file;
  }
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
  // Galereya: mavjud (serverda saqlangan) rasmlar va bu sessiyada qo'shilgan
  // yangi (hali yuklanmagan) rasmlar alohida kuzatiladi — shunda admin
  // qo'shishda avvalgilarini yo'qotmaydi, va ikkalasidan ham o'chira oladi.
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(
    invitation?.gallery_photo_urls ?? [],
  );
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);
  const [pendingGalleryPreviews, setPendingGalleryPreviews] = useState<string[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(
    invitation?.schedule_items ?? [],
  );
  const [useGuestName, setUseGuestName] = useState(Boolean(invitation?.guest_name));
  const [guestName, setGuestName] = useState(invitation?.guest_name ?? "");
  const [textSize, setTextSize] = useState<TextSize>(invitation?.text_size ?? "normal");
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribeIsDesktop,
    getIsDesktopSnapshot,
    getIsDesktopServerSnapshot,
  );

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setCoverPreviewUrl(URL.createObjectURL(file));

    const compressed = await compressImageFile(file);
    const dt = new DataTransfer();
    dt.items.add(compressed);
    input.files = dt.files;
  }

  async function handleSecondPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setSecondPhotoPreviewUrl(URL.createObjectURL(file));

    const compressed = await compressImageFile(file);
    const dt = new DataTransfer();
    dt.items.add(compressed);
    input.files = dt.files;
  }

  function syncGalleryInput(files: File[]) {
    const input = galleryInputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    input.files = dt.files;
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const remainingSlots = MAX_GALLERY_PHOTOS - existingGalleryUrls.length - pendingGalleryFiles.length;
    const selected = Array.from(input.files ?? []).slice(0, Math.max(0, remainingSlots));
    if (selected.length === 0) {
      input.value = "";
      return;
    }

    const compressed = await Promise.all(selected.map(compressImageFile));
    const nextFiles = [...pendingGalleryFiles, ...compressed];
    setPendingGalleryFiles(nextFiles);
    setPendingGalleryPreviews((urls) => [...urls, ...compressed.map((f) => URL.createObjectURL(f))]);
    syncGalleryInput(nextFiles);
  }

  function removeExistingGalleryPhoto(index: number) {
    setExistingGalleryUrls((urls) => urls.filter((_, i) => i !== index));
  }

  function removePendingGalleryPhoto(index: number) {
    const nextFiles = pendingGalleryFiles.filter((_, i) => i !== index);
    setPendingGalleryFiles(nextFiles);
    setPendingGalleryPreviews((urls) => urls.filter((_, i) => i !== index));
    syncGalleryInput(nextFiles);
  }

  function addScheduleItem() {
    setScheduleItems((items) => [...items, { time: "", label: "" }]);
  }

  function updateScheduleItem(index: number, field: keyof ScheduleItem, value: string) {
    setScheduleItems((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function removeScheduleItem(index: number) {
    setScheduleItems((items) => items.filter((_, i) => i !== index));
  }

  function handlePriceTierChange(nextPriceTier: PriceTier) {
    setPriceTier(nextPriceTier);
    if (!isThemeUnlocked(templateId, nextPriceTier)) {
      setTemplateId(getUnlockedThemes(nextPriceTier)[0].id);
    }
  }

  const selectedMusicTrack = musicTracks.find((t) => t.id === musicTrackId) ?? null;
  const selectedTheme = getTheme(templateId);
  const showCoverPhoto = familySupportsCoverPhoto(selectedTheme.family);
  const showSecondPhoto = familySupportsSecondPhoto(selectedTheme.family);
  const galleryPhotos = [
    ...existingGalleryUrls.map((url) => ({ url, kind: "existing" as const })),
    ...pendingGalleryPreviews.map((url) => ({ url, kind: "pending" as const })),
  ];
  const galleryFull = galleryPhotos.length >= MAX_GALLERY_PHOTOS;

  // Live preview loyihasi (framer-motion, scroll kuzatuvchilar, IntersectionObserver)
  // ancha og'ir — uni har bosilgan tugma bilan emas, faqat foydalanuvchi yozishni
  // to'xtatgach qayta chizamiz, shunda inputlar sekin/tormozlanib qolmaydi.
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
      gallery_photo_urls: [...existingGalleryUrls, ...pendingGalleryPreviews],
      schedule_items: scheduleItems.filter((item) => item.time || item.label),
      gift_card_number: giftCardNumber || null,
      guest_name: useGuestName ? guestName || null : null,
      text_size: textSize,
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
      existingGalleryUrls,
      pendingGalleryPreviews,
      scheduleItems,
      giftCardNumber,
      useGuestName,
      guestName,
      textSize,
      isPaid,
    ],
  );

  const deferredPreviewInvitation = useDeferredValue(previewInvitation);
  const shouldMountPreview = isDesktop || showMobilePreview;

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

        {showCoverPhoto ? (
          <Field label="Muqova rasm (ixtiyoriy)">
            <input
              name="cover_photo"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="input"
            />
          </Field>
        ) : (
          <Field label="Muqova rasm">
            <p className="text-xs text-slate-400">
              Bu shablon rejasida muqova rasm yo&apos;q.
            </p>
          </Field>
        )}

        {showSecondPhoto ? (
          <Field label="Ikkinchi rasm — kuyov (ixtiyoriy)">
            <input
              name="second_photo"
              type="file"
              accept="image/*"
              onChange={handleSecondPhotoChange}
              className="input"
            />
          </Field>
        ) : (
          <Field label="Ikkinchi rasm — kuyov">
            <p className="text-xs text-slate-400">
              Bu shablon rejasida ikkinchi rasm yo&apos;q.
            </p>
          </Field>
        )}

        <Field label={`Xotira galereyasi — 1 dan ${MAX_GALLERY_PHOTOS} tagacha rasm (ixtiyoriy)`}>
          <input
            type="hidden"
            name="existing_gallery_urls"
            value={JSON.stringify(existingGalleryUrls)}
          />
          {galleryPhotos.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {galleryPhotos.map((photo, i) => {
                const indexInKind =
                  photo.kind === "existing"
                    ? i
                    : i - existingGalleryUrls.length;
                return (
                  <div key={photo.url + i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        photo.kind === "existing"
                          ? removeExistingGalleryPhoto(indexInKind)
                          : removePendingGalleryPhoto(indexInKind)
                      }
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
                      aria-label="Rasmni olib tashlash"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                );
              })}
              {!galleryFull && (
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl leading-none text-slate-400 hover:border-slate-400 hover:text-slate-500">
                  +
                  <input
                    ref={galleryInputRef}
                    name="gallery_photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
          {galleryPhotos.length === 0 && (
            <label className="input flex cursor-pointer items-center justify-center text-slate-400">
              + Rasm qo&apos;shish
              <input
                ref={galleryInputRef}
                name="gallery_photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>
          )}
          <p className="mt-1 text-xs text-slate-400">
            Yuklanmasa, taklifnomada galereya bo&apos;limi umuman ko&apos;rinmaydi. &quot;+&quot;
            bosib istalgan vaqt yana rasm qo&apos;shishingiz mumkin.
          </p>
        </Field>

        <Field label="Kun dasturi (ixtiyoriy)">
          <input type="hidden" name="schedule_items" value={JSON.stringify(scheduleItems)} />
          <div className="space-y-2">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) => updateScheduleItem(i, "time", e.target.value)}
                  className="input w-28 shrink-0"
                />
                <input
                  value={item.label}
                  onChange={(e) => updateScheduleItem(i, "label", e.target.value)}
                  placeholder="Mehmonlarni kutib olish"
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeScheduleItem(i)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Bandni olib tashlash"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addScheduleItem} className="btn-secondary mt-2 text-sm">
            + Band qo&apos;shish
          </button>
          <p className="mt-1 text-xs text-slate-400">
            Masalan: 18:00 — Mehmonlarni kutib olish. Bo&apos;sh qoldirilsa, shablonning
            standart kun dasturi ko&apos;rsatiladi.
          </p>
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

        <Field label="Murojaat">
          <input type="hidden" name="use_guest_name" value={useGuestName ? "on" : ""} />
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                checked={!useGuestName}
                onChange={() => setUseGuestName(false)}
                className="h-4 w-4 border-slate-300"
              />
              Hammaga umumiy (&quot;Aziz mehmon&quot;)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                checked={useGuestName}
                onChange={() => setUseGuestName(true)}
                className="h-4 w-4 border-slate-300"
              />
              Shaxsiy — ism-familiya bilan
            </label>
            {useGuestName && (
              <input
                name="guest_name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="input"
                placeholder="Mehmon ism-familiyasi"
              />
            )}
          </div>
        </Field>

        <Field label="Matn o'lchami">
          <select
            name="text_size"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value as TextSize)}
            className="input"
          >
            <option value="normal">Standart</option>
            <option value="compact">Kichikroq</option>
          </select>
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

        <SaveButton />
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
            {shouldMountPreview && (
              <TemplateRenderer
                invitation={deferredPreviewInvitation}
                musicTrack={selectedMusicTrack}
                previewMode
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveButton() {
  // useFormStatus faqat <form>ning o'z ichidagi komponentda ishlaydi — shuning
  // uchun alohida komponent. Rasmlar (muqova/ikkinchi/galereya) yuklanayotganda
  // bu bir necha soniya davom etishi mumkin; tugma shu payt "muzlab qolgandek"
  // ko'rinmasligi uchun aniq holat ko'rsatamiz va qayta bosishni bloklaymiz.
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Saqlanmoqda..." : "Saqlash"}
    </button>
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
