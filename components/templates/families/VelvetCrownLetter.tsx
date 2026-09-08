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
import styles from "./VelvetCrownLetter.module.css";

const DUST_POSITIONS = [8, 18, 28, 40, 52, 64, 76, 88];

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 34 L4 16 L18 26 L32 8 L46 26 L60 16 L60 34 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        className={styles.crownPath}
      />
    </svg>
  );
}

export function VelvetCrownLetter({
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
  const schedule = invitation.schedule_items;

  const messageLines = (
    invitation.custom_message ||
    "Bizning quvonchimizni ulashganingiz uchun rahmat. Sizni nikoh to'yimizga taklif etamiz."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      <div
        className={styles.stage}
        aria-hidden
        style={previewMode ? { position: "absolute" } : undefined}
      />
      {!previewMode &&
        DUST_POSITIONS.map((left, i) => (
          <span
            key={i}
            className={styles.dust}
            style={{
              left: `${left}%`,
              animationDuration: `${9 + (i % 4) * 2}s`,
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}

      {!previewMode && (
        <div
          className={`${styles.entrance} ${open ? styles.entranceOpen : ""} ${
            gone ? styles.entranceGone : ""
          }`}
        >
          <span className={styles.entranceGlow} aria-hidden />
          <button
            type="button"
            className={styles.envelopeBtn}
            onClick={handleOpen}
            aria-label="Taklifnomani ochish"
          >
            <span className={styles.envelopeShadow} aria-hidden />
            <span className={styles.envelopeBody}>
              <span className={styles.envelopeBg} aria-hidden />
              <span className={styles.envelopePattern} aria-hidden />
              <span className={styles.envelopeContent}>
                <CrownIcon className={styles.entranceCrown} />
                <span className={styles.envelopeEyebrow}>
                  {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
                </span>
                <span className={`${styles.envelopeNames} ${styles.goldText}`}>
                  {invitation.groom_name.toUpperCase()} &amp; {invitation.bride_name.toUpperCase()}
                </span>
                <span className={`${styles.goldDivider} ${styles.envelopeDivider}`}>
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerOrnament} />
                  <span className={styles.dividerLine} />
                </span>
              </span>
              <span className={`${styles.flap} ${open ? styles.flapOpen : ""}`} aria-hidden>
                <span className={styles.flapFace} />
                <span className={styles.flapSeal}>♛</span>
              </span>
            </span>
            <span className={styles.envelopeCta}>Taklifnomani ochish uchun bosing</span>
          </button>
        </div>
      )}

      <section className={styles.hero}>
        <CrownIcon className={styles.heroCrown} />
        <div className={styles.goldDivider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerOrnament} />
          <span className={styles.dividerLine} />
        </div>
        <h1 className={`${styles.heroNames} ${styles.goldText}`}>
          {invitation.groom_name.toUpperCase()} &amp; {invitation.bride_name.toUpperCase()}
        </h1>
        <p className={styles.heroSub}>
          {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
        </p>
        {!previewMode && <p className={styles.scrollHint}>↓</p>}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <span className={`${styles.corner} ${styles.cornerTl}`} />
          <span className={`${styles.corner} ${styles.cornerTr}`} />
          <span className={`${styles.corner} ${styles.cornerBl}`} />
          <span className={`${styles.corner} ${styles.cornerBr}`} />
          <p className={styles.verseText}>&laquo;Allah ularning qalblarini birlashtirdi&raquo;</p>
          <div className={styles.goldDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerOrnament} />
            <span className={styles.dividerLine} />
          </div>
          <p className={styles.greetingTitle}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz mehmonimiz"}
          </p>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
        </div>
      </RevealCard>

      {schedule.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <p className={styles.sectionTitle}>Qachon &amp; Qayerda</p>
            <ol className={styles.timeline}>
              {schedule.map((item, i) => (
                <li key={i} className={styles.timelineItem}>
                  <span className={styles.timelineTime}>{item.time}</span>
                  <span className={styles.timelineLabel}>{item.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </RevealCard>
      )}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.card} ${styles.glowCard}`}>
          <p className={styles.sectionTitle}>To&apos;ygacha qolgan vaqt</p>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.sectionTitle}>To&apos;y manzili</p>
          <p className={styles.venueName}>{invitation.venue_name}</p>
          <p className={styles.venueAddr}>{invitation.venue_address}</p>
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
        </div>
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.card}>
            <p className={styles.sectionTitle}>Xotira galereyasi</p>
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
          </div>
        </RevealCard>
      )}

      <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
        <div className={styles.goldDivider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerOrnament} />
          <span className={styles.dividerLine} />
        </div>
        <p className={styles.closingText}>Sevgi bilan,</p>
        <p className={`${styles.closingNames} ${styles.goldText}`}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--bg-deep)" }}
        />
      )}
    </div>
  );
}
