"use client";

import { useRef, useState } from "react";
import { Heart, Music } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthYear } from "@/lib/uzDate";
import styles from "./BloomPulseLetter.module.css";

export function BloomPulseLetter({
  invitation,
  musicTrack,
  theme,
  previewMode = false,
}: {
  invitation: Invitation;
  musicTrack: MusicTrack | null;
  theme: ThemeDefinition;
  previewMode?: boolean;
}) {
  const musicRef = useRef<MusicPlayerHandle>(null);
  const [open, setOpen] = useState(previewMode);

  useScrollLock(!previewMode && !open);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const monthLabel = uzMonthYear(new Date(weddingDateTime));

  const messageLines = (
    invitation.custom_message ||
    `Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan "Visol oqshomiga" ga taklif etamiz.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div className={`${styles.entrance} ${open ? styles.entranceGone : ""}`}>
          <span className={`${styles.blob} ${styles.blobRose}`} aria-hidden />
          <span className={`${styles.blob} ${styles.blobAmber}`} aria-hidden />
          <span className={`${styles.blob} ${styles.blobPink}`} aria-hidden />

          <div className={styles.entranceInner}>
            <div className={styles.heartWrap}>
              <div className={styles.heartBadge}>
                <Heart className={styles.heartIcon} fill="currentColor" />
              </div>
              <span className={styles.heartDotA} aria-hidden />
              <span className={styles.heartDotB} aria-hidden />
            </div>
            <h1 className={styles.entranceTitle}>
              {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
            </h1>
            <p className={styles.entranceLead}>
              Ularning maxsus kunini nishonlashda bizga qo&apos;shiling
            </p>
            <div className={styles.entranceMusic}>
              <Music className={styles.entranceMusicIcon} />
              <span>fon musiqasi bilan</span>
              <Music className={styles.entranceMusicIcon} />
            </div>
            <button type="button" className={styles.entranceBtn} onClick={handleOpen}>
              <Heart className={styles.entranceBtnIcon} fill="currentColor" />
              To&apos;y saytiga kirish
            </button>
            <p className={styles.entranceHint}>Boshlash uchun bosing</p>
            <div className={styles.entranceDots}>
              <span className={styles.entranceDot} />
              <span className={styles.entranceDot} />
              <span className={styles.entranceDot} />
            </div>
          </div>
        </div>
      )}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.greetingLabel}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz Mehmonimiz"}
          </p>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
          <p className={`${styles.signature} ${styles.script}`}>
            Hurmat bilan,
            <br />
            {invitation.bride_name} va {invitation.groom_name}
          </p>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={`${styles.calendarHead} ${styles.script}`}>{monthLabel}</h2>
          <CalendarHighlight
            date={invitation.wedding_date}
            cellClassName={styles.calendarCell}
            emptyClassName={styles.calendarEmpty}
            highlightClassName={styles.calendarHighlight}
            headClassName={styles.calendarCell}
          />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={styles.countdownTitle}>To&apos;ygacha qoldi</h2>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <h2 className={`${styles.sectionTitle} ${styles.script}`}>Joylashuv</h2>
          <p className={styles.venueAddr}>{invitation.venue_address}</p>
          <p className={`${styles.venueName} ${styles.script}`}>&quot;{invitation.venue_name}&quot;</p>
          {invitation.venue_map_url && (
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <MapPinIcon className="h-4 w-4" /> Xaritaga o&apos;tish
            </a>
          )}
        </div>
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <h2 className={`${styles.sectionTitle} ${styles.script}`}>Bizning Xotiralarimiz</h2>
            <PhotoGallery
              photos={invitation.gallery_photo_urls}
              className={styles.galleryGrid}
              itemClassName={styles.galleryItem}
            />
          </div>
        </RevealCard>
      )}

      {invitation.gift_card_number && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>To&apos;yona</h2>
            <div className={styles.giftRow}>
              <span className={styles.giftLabel}>{invitation.gift_card_number}</span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => navigator.clipboard.writeText(invitation.gift_card_number!)}
              >
                Nusxalash
              </button>
            </div>
          </div>
        </RevealCard>
      )}

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--accent)", color: "#fff" }}
        />
      )}
    </div>
  );
}
