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
import styles from "./ImperialGoldLetter.module.css";

const ASSETS = "/imported-assets/imperial-gold";

export function ImperialGoldLetter({
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
  const dotDate = `${day} • ${month} • ${year}`;
  const heroPhoto = invitation.cover_photo_url || `${ASSETS}/banquet-hall.jpg`;
  const schedule = invitation.schedule_items;

  const messageLines = (
    invitation.custom_message ||
    "Sizga taklifnoma keldi. Sevgi va nafosat uchrashadigan joyda — nikoh to'yimizda sizni ko'rishni orzu qilamiz."
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
          <div className={styles.entrancePhoto} style={{ backgroundImage: `url(${heroPhoto})` }} />
          <div className={styles.entranceVeil} aria-hidden />
          <div className={`${styles.entranceInner} ${styles.legible}`}>
            <div className={styles.rule} aria-hidden>
              <span />
              <span />
            </div>
            <p className={styles.label}>Sizga taklifnoma keldi</p>
            <h1 className={styles.entranceNames}>
              {invitation.groom_name}
              <span className={styles.amp}>&amp;</span>
              {invitation.bride_name}
            </h1>
            <p className={`${styles.label} ${styles.entranceDate}`}>{dotDate}</p>
            <p className={`${styles.arabic} ${styles.goldText}`} dir="rtl">
              وَأَلَّفَ بَيْنَ قُلُوبِهِمْ
            </p>
            <p className={styles.verseQuote}>
              &ldquo;Va U ularning qalblarini sevgi ila birlashtirdi&rdquo;
            </p>
            <p className={styles.verseAttr}>Anfol surasi, 63</p>
            <button type="button" className={styles.entranceBtn} onClick={handleOpen}>
              <span className={styles.entranceBtnKnob} aria-hidden />
              <span className={styles.entranceBtnLabel}>Ochish →</span>
            </button>
          </div>
        </div>
      )}

      <section className={styles.hero} style={{ backgroundImage: `url(${heroPhoto})` }}>
        <div className={styles.entranceVeil} aria-hidden />
        <div className={`${styles.heroInner} ${styles.legible}`}>
          <p className={styles.label}>
            {invitation.guest_name
              ? `Hurmatli ${invitation.guest_name}!`
              : "Aziz va qadrli insonimiz!"}
          </p>
          <p className={`${styles.heroScript} ${styles.script} ${styles.goldText}`}>Biz</p>
          <p className={`${styles.label} ${styles.heroLead}`}>
            sizni to&apos;yimizga taklif qilishdan mamnunmiz
          </p>
        </div>
        {!previewMode && <p className={styles.scrollHint}>↓</p>}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.verseText}>&laquo;Allah ularning qalblarini birlashtirdi&raquo;</p>
        <p className={styles.verseLabel}>&mdash; Anfol surasi, 63</p>
        <div className={styles.divider} />
        <p className={styles.greetingTitle}>
          {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz mehmonimiz"}
        </p>
        {messageLines.map((line, i) => (
          <p key={i} className={styles.greetingText}>
            {line}
          </p>
        ))}
      </RevealCard>

      {schedule.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <p className={styles.sectionTitle}>Kun tartibi</p>
          <ol className={styles.timeline}>
            {schedule.map((item, i) => (
              <li key={i} className={styles.timelineItem}>
                <span className={styles.timelineTime}>{item.time}</span>
                <span className={styles.timelineLabel}>{item.label}</span>
              </li>
            ))}
          </ol>
        </RevealCard>
      )}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.sectionTitle}>To&apos;ygacha qolgan vaqt</p>
        <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.sectionTitle}>Joylashuv</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/banquet-hall.jpg`} alt="" className={styles.venueImg} />
        <p className={styles.venueName}>{invitation.venue_name}</p>
        <p className={styles.venueAddr}>{invitation.venue_address}</p>
        {invitation.venue_map_url && (
          <a
            href={invitation.venue_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapBtn}
          >
            <MapPinIcon className="h-4 w-4" /> Xaritada ochish
          </a>
        )}
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <p className={styles.sectionTitle}>Xotira galereyasi</p>
          <PhotoGallery
            photos={invitation.gallery_photo_urls}
            className={styles.galleryGrid}
            itemClassName={styles.galleryItem}
          />
        </RevealCard>
      )}

      {invitation.gift_card_number && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <p className={styles.sectionTitle}>To&apos;yona</p>
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

      <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/table-numbers.jpg`} alt="" className={styles.closingImg} />
        <p className={styles.closingText}>Sevgi bilan sizni kutamiz</p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--ink)" }}
        />
      )}
    </div>
  );
}
