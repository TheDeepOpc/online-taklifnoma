"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import { useScrollLock } from "../useScrollLock";
import { PhotoGallery } from "../PhotoGallery";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./EditorialPlateLetter.module.css";

export function EditorialPlateLetter({
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
  const [gone, setGone] = useState(previewMode);

  useScrollLock(!previewMode && !gone);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 900);
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;

  const messageLines = (
    invitation.custom_message ||
    `Bizning quvonchimizni ulashganingiz uchun rahmat. Sizni ${invitation.groom_name} va ${invitation.bride_name}ning nikoh to'yiga taklif etamiz.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div
          className={`${styles.entrance} ${open ? styles.entranceOpen : ""} ${
            gone ? styles.entranceGone : ""
          }`}
        >
          <span className={styles.entranceOrb} aria-hidden />
          <button
            type="button"
            className={styles.plateBtn}
            onClick={handleOpen}
            aria-label="Taklifnomani ochish"
          >
            <span className={styles.plateShadow} aria-hidden />
            <span className={styles.plateBody}>
              <span className={styles.plateBarTop} aria-hidden />
              <span className={styles.plateBarBottom} aria-hidden />
              <span className={styles.plateContent}>
                <span className={styles.entranceNumber}>
                  N&deg; 01 &nbsp;&middot;&nbsp; {year}
                </span>
                <span className={`${styles.entranceName} ${styles.serif}`}>
                  {invitation.groom_name}
                </span>
                <span className={styles.entranceAmp}>&amp;</span>
                <span className={`${styles.entranceName} ${styles.entranceNameItalic} ${styles.serif}`}>
                  {invitation.bride_name}
                </span>
                <span className={styles.hairLine} aria-hidden />
                <span className={styles.entranceEyebrow}>
                  {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
                </span>
              </span>
              <span className={`${styles.plateSplit} ${open ? styles.plateSplitOpen : ""}`} aria-hidden />
            </span>
            <span className={styles.plateCta}>Taklifnomani ochish uchun bosing</span>
          </button>
        </div>
      )}

      <section className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <p className={styles.eyebrow}>N&deg; 01 &nbsp;&middot;&nbsp; {year}</p>
        <h1 className={`${styles.heroNames} ${styles.serif}`}>
          {invitation.groom_name}
          <span className={styles.heroAmp}>&amp;</span>
          {invitation.bride_name}
        </h1>
      </section>

      {invitation.cover_photo_url && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.plateFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invitation.cover_photo_url} alt="" className={styles.plateImg} />
            <span className={styles.plateShade} aria-hidden />
            <span className={styles.plateLabel}>Plate I</span>
          </div>
          <p className={styles.plateCaption}>Photographed for the occasion</p>
        </RevealCard>
      )}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.chapterNumber}>01-bob</p>
        <h2 className={`${styles.chapterTitle} ${styles.serif}`}>Xush kelibsiz</h2>
        <p className={styles.vertical}>&laquo;Allah ularning qalblarini birlashtirdi&raquo;</p>
        <p className={styles.eyebrowSmall}>
          {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
        </p>
        {messageLines.map((line, i) => (
          <p key={i} className={styles.greetingText}>
            {line}
          </p>
        ))}
      </RevealCard>

      <RevealCard className={`${styles.section} ${styles.countdownSection}`} alwaysVisible={previewMode}>
        <p className={styles.eyebrowLight}>Vaqt sanog&apos;i</p>
        <h3 className={`${styles.countdownTitle} ${styles.serif}`}>To&apos;ygacha qolgan vaqt</h3>
        <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.chapterNumber}>02-bob</p>
        <h2 className={`${styles.chapterTitle} ${styles.serif}`}>Qachon &amp; Qayerda</h2>
        <div className={styles.detailGrid}>
          <div>
            <p className={styles.detailLabel}>Qachon</p>
            <p className={styles.detailValue}>{dateLabel}</p>
            <p className={styles.detailSub}>To&apos;y marosimi boshlanadi {invitation.wedding_time}</p>
          </div>
          <div>
            <p className={styles.detailLabel}>Qayerda</p>
            <p className={styles.detailValue}>{invitation.venue_name}</p>
            <p className={styles.detailSub}>{invitation.venue_address}</p>
          </div>
        </div>
        {invitation.venue_map_url && (
          <a
            href={invitation.venue_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapBtn}
          >
            <MapPinIcon className="h-4 w-4" /> Xaritada ko&apos;rish
          </a>
        )}
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <p className={styles.eyebrowSmall}>Bizning xotiralarimiz</p>
          <h3 className={`${styles.chapterTitle} ${styles.serif}`}>Xotira galereyasi</h3>
          <PhotoGallery
            photos={invitation.gallery_photo_urls}
            className={styles.galleryGrid}
            itemClassName={styles.galleryItem}
          />
        </RevealCard>
      )}

      {invitation.gift_card_number && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <p className={styles.chapterNumber}>To&apos;yona</p>
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
        </RevealCard>
      )}

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--ink)", color: "var(--cream)" }}
        />
      )}
    </div>
  );
}
