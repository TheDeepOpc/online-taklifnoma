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
import styles from "./LuxGoldLetter.module.css";

const PARTICLES = [10, 25, 40, 55, 70, 85];

export function LuxGoldLetter({
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
    `Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan "Visol oqshomiga" taklif etamiz.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      <div
        className={styles.luxBg}
        aria-hidden
        style={previewMode ? { position: "absolute" } : undefined}
      />
      {PARTICLES.map((left, i) => (
        <span
          key={i}
          className={styles.particle}
          style={{
            left: `${left}%`,
            animationDuration: `${9 + (i % 3) * 3}s`,
            animationDelay: `${i * 1.4}s`,
            ...(previewMode ? { position: "absolute" as const } : null),
          }}
          aria-hidden
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
              <span className={styles.letterCard}>
                <span className={styles.envelopeEyebrow}>
                  {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
                </span>
                <span className={styles.envelopeNames}>
                  {invitation.groom_name} &amp; {invitation.bride_name}
                </span>
              </span>
              <span className={styles.envelopePocket} aria-hidden>
                <span className={styles.pocketFade} />
                <span className={styles.pocketLine} />
                <span className={styles.pocketSeam} />
              </span>
              <span className={`${styles.flap} ${open ? styles.flapOpen : ""}`} aria-hidden>
                <span className={styles.flapFace} />
                <span className={styles.flapSeal}>♥</span>
              </span>
            </span>
            <span className={styles.envelopeCta}>Taklifnomani ochish uchun bosing</span>
          </button>
        </div>
      )}

      <section className={styles.hero}>
        <p className={styles.verseText}>Alloh ularning qalblarini birlashtirdi</p>
        <h1 className={`${styles.heroNames} ${styles.goldText}`}>
          {invitation.groom_name}
          <span className={styles.amp}>va</span>
          {invitation.bride_name}
        </h1>
        <p className={styles.heroMeta}>
          {dateLabel} · {invitation.venue_name}
        </p>
        {!previewMode && <p className={styles.scrollHint}>Pastga suring ↓</p>}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.glassCard}>
          <p className={styles.sectionTitle}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz Mehmonimiz"}
          </p>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
          <p className={styles.signature}>
            Hurmat bilan,
            <br />
            {invitation.groom_name} va {invitation.bride_name}
          </p>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.glassCard} ${styles.countdownCard}`}>
          <p className={styles.sectionTitle}>To&apos;ygacha qolgan vaqt</p>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.glassCard}>
          <p className={styles.sectionTitle}>Qachon &amp; Qayerda</p>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Qachon</span>
            <span className={styles.detailValue}>
              {dateLabel} · {invitation.wedding_time}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Qayerda</span>
            <span className={styles.detailValue}>
              {invitation.venue_name}
              <br />
              {invitation.venue_address}
            </span>
          </div>
          {invitation.venue_map_url && (
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <MapPinIcon className="h-4 w-4" /> Xaritada ko&apos;rsatish
            </a>
          )}
        </div>
      </RevealCard>

      {invitation.gallery_photo_urls.length > 0 && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.glassCard}>
            <p className={styles.sectionTitle}>Bizning Xotiralarimiz</p>
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
          <div className={styles.glassCard}>
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
        <p className={`${styles.closingNames} ${styles.goldText}`}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </p>
        <p className={styles.closingMeta}>
          {dateLabel} · {invitation.venue_name}
        </p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--cta-ink)" }}
        />
      )}
    </div>
  );
}
