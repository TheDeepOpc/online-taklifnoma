"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { X, Eye, EyeOff, Dices, Loader2 } from "lucide-react";
import { randomWish } from "@/lib/wishTemplates";
import { discardMedia, uploadToCdn } from "@/lib/mediaClient";
import { InvitationLivePreview } from "./InvitationLivePreview";
import { DEMO_INVITATION } from "@/lib/demoInvitation";
import { ThemePicker } from "./ThemePicker";
import {
  getTheme,
  getUnlockedThemes,
  isThemeUnlocked,
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

interface Photo {
  key: string;
  /** Saqlanadigan havola (`/api/media/<id>` yoki eski Supabase havolasi); yuklanayotganda `null`. */
  url: string | null;
  /** Ko'rsatish uchun: yangi tanlanganda lokal blob, saqlanganida — `url`. */
  preview: string;
  error?: string;
}

function savedPhoto(url: string): Photo {
  return { key: `saved:${url}`, url, preview: url };
}

function visiblePreview(photo: Photo | null): string | null {
  return photo && !photo.error ? photo.preview : null;
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
    getTheme(invitation?.template_id ?? getUnlockedThemes(invitation?.price_tier ?? "150000")[0].id).id,
  );
  const [musicTrackId, setMusicTrackId] = useState(invitation?.music_track_id ?? "");
  const [customMessage, setCustomMessage] = useState(invitation?.custom_message ?? "");
  const [isPaid, setIsPaid] = useState(invitation?.is_paid ?? false);
  const [cover, setCover] = useState<Photo | null>(
    invitation?.cover_photo_url ? savedPhoto(invitation.cover_photo_url) : null,
  );
  const [secondPhoto, setSecondPhoto] = useState<Photo | null>(
    invitation?.second_photo_url ? savedPhoto(invitation.second_photo_url) : null,
  );
  const [giftCardNumber, setGiftCardNumber] = useState(invitation?.gift_card_number ?? "");
  const [wishesTitle, setWishesTitle] = useState(invitation?.wishes_title ?? "");
  const [wishesText, setWishesText] = useState(invitation?.wishes_text ?? "");
  const [gallery, setGallery] = useState<Photo[]>(
    (invitation?.gallery_photo_urls ?? []).map(savedPhoto),
  );
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(
    invitation?.schedule_items ?? [],
  );
  const [useGuestName, setUseGuestName] = useState(Boolean(invitation?.guest_name));
  const [guestName, setGuestName] = useState(invitation?.guest_name ?? "");
  const [textSize, setTextSize] = useState<TextSize>(invitation?.text_size ?? "normal");
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const isDesktop = useSyncExternalStore(
    subscribeIsDesktop,
    getIsDesktopSnapshot,
    getIsDesktopServerSnapshot,
  );

  // Rasmlar tanlanishi bilan Discord'ga yuklanadi (Direct Upload) — forma
  // faqat tayyor havolalarni yuboradi. Shu sessiyada yuklangan, hali
  // saqlanmagan rasm olib tashlansa, almashtirilsa yoki forma tashlab
  // ketilsa — u Discord'dan o'chiriladi. Saqlangan rasmni esa server
  // "Saqlash"da o'chiradi (admin tahrirni bekor qilsa, u joyida qoladi).
  const freshUrlsRef = useRef(new Set<string>());
  const activeKeysRef = useRef(new Set<string>());
  const keyCounterRef = useRef(0);

  useEffect(() => {
    const fresh = freshUrlsRef.current;
    const flush = () => {
      // Saqlab bo'lingan rasmlarni server o'chirmaydi (bazada ishlatilyapti) —
      // shuning uchun muvaffaqiyatli saqlashdan keyingi chaqiruv zararsiz.
      discardMedia([...fresh]);
      fresh.clear();
    };
    const onPageHide = (event: PageTransitionEvent) => {
      if (!event.persisted) flush();
    };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      flush();
    };
  }, []);

  function nextPhotoKey() {
    keyCounterRef.current += 1;
    return `new:${keyCounterRef.current}`;
  }

  /** Rasm formadan chiqarildi: yuklanayotgan bo'lsa — tugagach, yangi bo'lsa — darhol o'chadi. */
  function releasePhoto(photo: Photo | null | undefined) {
    if (!photo) return;
    activeKeysRef.current.delete(photo.key);
    if (photo.url && freshUrlsRef.current.delete(photo.url)) discardMedia([photo.url]);
  }

  async function uploadPhoto(
    file: File,
    key: string,
    update: (key: string, patch: Partial<Photo>) => void,
  ) {
    activeKeysRef.current.add(key);
    try {
      const url = await uploadToCdn(await compressImageFile(file), "image");
      if (!activeKeysRef.current.has(key)) {
        // Yuklanayotgan paytda olib tashlangan yoki almashtirilgan.
        discardMedia([url]);
        return;
      }
      freshUrlsRef.current.add(url);
      update(key, { url });
    } catch (error) {
      update(key, { error: (error as Error).message });
    }
  }

  function handleSinglePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>,
    current: Photo | null,
    setPhoto: React.Dispatch<React.SetStateAction<Photo | null>>,
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    releasePhoto(current);
    const key = nextPhotoKey();
    setPhoto({ key, url: null, preview: URL.createObjectURL(file) });
    void uploadPhoto(file, key, (k, patch) =>
      setPhoto((photo) => (photo?.key === k ? { ...photo, ...patch } : photo)),
    );
  }

  function removeSinglePhoto(
    current: Photo | null,
    setPhoto: React.Dispatch<React.SetStateAction<Photo | null>>,
  ) {
    releasePhoto(current);
    setPhoto(null);
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(
      0,
      Math.max(0, MAX_GALLERY_PHOTOS - gallery.length),
    );
    e.target.value = "";
    if (files.length === 0) return;

    const added = files.map((file) => ({
      file,
      photo: { key: nextPhotoKey(), url: null, preview: URL.createObjectURL(file) } as Photo,
    }));
    setGallery((list) => [...list, ...added.map((item) => item.photo)]);

    const update = (key: string, patch: Partial<Photo>) =>
      setGallery((list) => list.map((photo) => (photo.key === key ? { ...photo, ...patch } : photo)));
    for (const { file, photo } of added) void uploadPhoto(file, photo.key, update);
  }

  function removeGalleryPhoto(photo: Photo) {
    releasePhoto(photo);
    setGallery((list) => list.filter((p) => p.key !== photo.key));
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
  const showSecondPhoto = familySupportsSecondPhoto(selectedTheme.family);
  const photosUploading = [cover, secondPhoto, ...gallery].some(
    (photo) => photo !== null && photo.url === null && !photo.error,
  );

  // Live preview loyihasi (framer-motion, scroll kuzatuvchilar, IntersectionObserver)
  // ancha og'ir — uni har bosilgan tugma bilan emas, faqat foydalanuvchi yozishni
  // to'xtatgach qayta chizamiz, shunda inputlar sekin/tormozlanib qolmaydi.
  const previewInvitation: Invitation = useMemo(
    () => ({
      id: invitation?.id ?? "preview",
      slug: invitation?.slug ?? "preview",
      groom_name: groomName || DEMO_INVITATION.groom_name,
      bride_name: brideName || DEMO_INVITATION.bride_name,
      wedding_date: weddingDate || todayISODate(),
      wedding_time: weddingTime || "18:00",
      venue_name: venueName || "To'yxona nomi",
      venue_address: venueAddress || "To'yxona manzili",
      venue_map_url: venueMapUrl || null,
      price_tier: priceTier,
      template_id: templateId,
      music_track_id: musicTrackId || null,
      custom_message: customMessage || null,
      cover_photo_url: visiblePreview(cover),
      second_photo_url: visiblePreview(secondPhoto),
      gallery_photo_urls: gallery.filter((photo) => !photo.error).map((photo) => photo.preview),
      schedule_items: scheduleItems.filter((item) => item.time || item.label),
      gift_card_number: giftCardNumber || null,
      wishes_title: wishesTitle || null,
      wishes_text: wishesText || null,
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
      cover,
      secondPhoto,
      gallery,
      scheduleItems,
      giftCardNumber,
      wishesTitle,
      wishesText,
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

        {/* Rasmlar allaqachon Discord'da — forma faqat havolalarni yuboradi. */}
        <input type="hidden" name="cover_photo_url" value={cover?.url ?? ""} />
        <input type="hidden" name="second_photo_url" value={secondPhoto?.url ?? ""} />
        <input
          type="hidden"
          name="gallery_photo_urls"
          value={JSON.stringify(gallery.flatMap((photo) => (photo.url ? [photo.url] : [])))}
        />

        <PhotoField
          label="Muqova rasm (ixtiyoriy)"
          photo={cover}
          onSelect={(e) => handleSinglePhotoChange(e, cover, setCover)}
          onRemove={() => removeSinglePhoto(cover, setCover)}
        />

        {showSecondPhoto ? (
          <PhotoField
            label="Ikkinchi rasm — kuyov (ixtiyoriy)"
            photo={secondPhoto}
            onSelect={(e) => handleSinglePhotoChange(e, secondPhoto, setSecondPhoto)}
            onRemove={() => removeSinglePhoto(secondPhoto, setSecondPhoto)}
          />
        ) : (
          <Field label="Ikkinchi rasm — kuyov">
            <p className="text-xs text-slate-400">
              Bu shablon rejasida ikkinchi rasm yo&apos;q.
            </p>
          </Field>
        )}

        <FieldGroup label={`Xotira galereyasi — 1 dan ${MAX_GALLERY_PHOTOS} tagacha rasm (ixtiyoriy)`}>
          <div className="flex flex-wrap gap-2">
            {gallery.map((photo) => (
              <PhotoThumb key={photo.key} photo={photo} onRemove={() => removeGalleryPhoto(photo)} />
            ))}
            {gallery.length < MAX_GALLERY_PHOTOS && (
              <label
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl leading-none text-slate-400 hover:border-slate-400 hover:text-slate-500"
                aria-label="Rasm qo'shish"
              >
                +
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {gallery.some((photo) => photo.error) && (
            <p className="mt-1 text-xs text-red-600">
              {gallery.find((photo) => photo.error)?.error} Qizil ramkali rasmni olib tashlab, qayta
              tanlang.
            </p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            Yuklanmasa, taklifnomada galereya bo&apos;limi umuman ko&apos;rinmaydi. &quot;+&quot;
            bosib istalgan vaqt yana rasm qo&apos;shishingiz mumkin, ✕ bilan o&apos;chirasiz.
          </p>
        </FieldGroup>

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
          <TemplateTextButton onPick={() => setCustomMessage(randomWish(customMessage).text)} />
        </Field>

        <Field label="Qo'shimcha tilaklar (ixtiyoriy)">
          <input
            name="wishes_title"
            value={wishesTitle}
            onChange={(e) => setWishesTitle(e.target.value)}
            className="input mb-2"
            placeholder="Sarlavha, masalan: Ikki qalb, bir manzil"
          />
          <textarea
            name="wishes_text"
            rows={4}
            value={wishesText}
            onChange={(e) => setWishesText(e.target.value)}
            className="input"
            placeholder="Bo'sh qoldirilsa — baxt va oila haqidagi tayyor matnlardan biri avtomatik chiqadi."
          />
          <TemplateTextButton
            onPick={() => {
              const wish = randomWish(wishesText);
              setWishesTitle(wish.title);
              setWishesText(wish.text);
            }}
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
            <p className="text-xs text-slate-400">
              Ko&apos;p mehmonga har birining ismi bilan yuborish uchun saqlagandan keyin
              &quot;Shaxsiy havolalar&quot; bo&apos;limidan foydalaning.
            </p>
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

        <SaveButton uploading={photosUploading} />
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
          {shouldMountPreview && <InvitationLivePreview invitation={deferredPreviewInvitation} musicTrack={selectedMusicTrack} />}
        </div>
      </div>
    </div>
  );
}

function SaveButton({ uploading }: { uploading: boolean }) {
  // useFormStatus faqat <form>ning o'z ichidagi komponentda ishlaydi — shuning
  // uchun alohida komponent. Rasm hali Discord'ga yuklanayotgan bo'lsa,
  // saqlashni kutdiramiz — aks holda u taklifnomaga tushmay qolardi.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || uploading}
      className="btn disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saqlanmoqda..." : uploading ? "Rasmlar yuklanmoqda..." : "Saqlash"}
    </button>
  );
}

/**
 * `<label>` emas, `<div>`: ichida bir nechta tugma bor — label bosilganda
 * brauzer birinchi tugmani (masalan, birinchi rasmning ✕) bosib yuborardi.
 */
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </div>
  );
}

function PhotoThumb({ photo, onRemove }: { photo: Photo; onRemove: () => void }) {
  const uploading = photo.url === null && !photo.error;
  return (
    <div
      className={`relative h-16 w-16 overflow-hidden rounded-lg border ${photo.error ? "border-red-400" : "border-slate-200"}`}
      title={photo.error}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.preview}
        alt=""
        className={`h-full w-full object-cover ${uploading || photo.error ? "opacity-50" : ""}`}
      />
      {uploading && (
        <span className="absolute inset-0 grid place-items-center" aria-label="Yuklanmoqda">
          <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
        aria-label="Rasmni o'chirish"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}

function PhotoField({
  label,
  photo,
  onSelect,
  onRemove,
}: {
  label: string;
  photo: Photo | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <FieldGroup label={label}>
      <div className="flex items-center gap-3">
        {photo && <PhotoThumb photo={photo} onRemove={onRemove} />}
        <label className="btn-secondary cursor-pointer text-sm">
          {photo ? "Almashtirish" : "Rasm tanlash"}
          <input type="file" accept="image/*" onChange={onSelect} className="hidden" />
        </label>
      </div>
      {photo?.error && <p className="mt-1 text-xs text-red-600">{photo.error}</p>}
    </FieldGroup>
  );
}

function TemplateTextButton({ onPick }: { onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
    >
      <Dices className="h-3.5 w-3.5" />
      Tayyor matn bilan to&apos;ldirish
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
