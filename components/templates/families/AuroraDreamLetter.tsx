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
import styles from "./AuroraDreamLetter.module.css";

const SPARKLES = [
  { s: 2, x: 5, y: 8, d: 2, delay: 0 },
  { s: 3, x: 18, y: 25, d: 2.3, delay: 0.2 },
  { s: 2, x: 31, y: 42, d: 2.6, delay: 0.4 },
  { s: 3, x: 44, y: 59, d: 2.9, delay: 0.6 },
  { s: 2, x: 57, y: 76, d: 3.2, delay: 0.8 },
  { s: 3, x: 70, y: 13, d: 3.5, delay: 1 },
  { s: 2, x: 83, y: 30, d: 3.8, delay: 1.2 },
  { s: 3, x: 6, y: 47, d: 4.1, delay: 1.4 },
];

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

export function AuroraDreamLetter({
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
      <div
        className={styles.stage}
        aria-hidden
        style={previewMode ? { position: "absolute" } : undefined}
      >
        <span className={`${styles.blob} ${styles.blob1}`} />
        <span className={`${styles.blob} ${styles.blob2}`} />
        <span className={`${styles.blob} ${styles.blob3}`} />
        <span className={`${styles.blob} ${styles.blob4}`} />
      </div>

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
            <span className={styles.dreamFrame}>
              <span className={styles.envelopeBody}>
                <span className={styles.halo} aria-hidden />
                {SPARKLES.map((sp, i) => (
                  <span
                    key={i}
                    className={styles.sparkle}
                    style={{
                      width: sp.s,
                      height: sp.s,
                      left: `${sp.x}%`,
                      top: `${sp.y}%`,
                      animationDuration: `${sp.d}s`,
                      animationDelay: `${sp.delay}s`,
                    }}
                  />
                ))}
                <span className={styles.envelopeContent}>
                  <SparkleIcon className={styles.envelopeIcon} />
                  <span className={styles.envelopeEyebrow}>
                    {invitation.groom_name} va {invitation.bride_name} to&apos;yiga xush kelibsiz
                  </span>
                  <span className={`${styles.envelopeNames} ${styles.auroraText}`}>
                    {invitation.groom_name} &amp; {invitation.bride_name}
                  </span>
                  <span className={styles.envelopeRule} aria-hidden />
                </span>
                <span className={`${styles.flap} ${open ? styles.flapOpen : ""}`} aria-hidden>
                  <span className={styles.flapFace} />
                  <span className={styles.flapSeal}>
                    <SparkleIcon className={styles.flapSealIcon} />
                  </span>
                </span>
              </span>
            </span>
            <span className={styles.envelopeCta}>Taklifnomani ochish uchun bosing</span>
          </button>
        </div>
      )}

      <section className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <span className={styles.halo} aria-hidden />
        {invitation.cover_photo_url && (
          <span className={styles.heroPhoto} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invitation.cover_photo_url} alt="" />
          </span>
        )}
        <span className={styles.heroVeil} aria-hidden />
        <svg
          viewBox="0 0 600 80"
          preserveAspectRatio="none"
          className={styles.ribbon}
          aria-hidden
        >
          <defs>
            <linearGradient id="auroraGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffb6d2" />
              <stop offset="35%" stopColor="#c9b6e3" />
              <stop offset="65%" stopColor="#a8d0e6" />
              <stop offset="100%" stopColor="#bde4c8" />
            </linearGradient>
          </defs>
          <path d="M0 40 Q150 0 300 40 T600 40" />
          <path d="M0 50 Q150 80 300 50 T600 50" opacity="0.6" />
        </svg>
        <div className={styles.heroInner}>
          <div className={styles.heroMark} aria-hidden>
            <span />
            <SparkleIcon className={styles.heroMarkIcon} />
            <span />
          </div>
          <p className={styles.eyebrow}>Allah ularning qalblarini birlashtirdi</p>
          <h1 className={`${styles.heroNames} ${styles.auroraText}`}>{invitation.groom_name}</h1>
          <p className={styles.heroAmp}>and</p>
          <h1 className={`${styles.heroNames} ${styles.auroraText}`}>{invitation.bride_name}</h1>
          <span className={styles.heroRule} aria-hidden />
          <p className={styles.heroDate}>{dateLabel}</p>
          <p className={styles.heroVenue}>{invitation.venue_name}</p>
        </div>
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.quoteText}>&laquo;Allah ularning qalblarini birlashtirdi&raquo;</p>
          <p className={styles.quoteAttr}>&mdash; Miratnama</p>
          <div className={styles.divider} />
          <p className={styles.sectionEyebrow}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz mehmonimiz"}
          </p>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.sectionEyebrow}>To&apos;ygacha qolgan vaqt</p>
          <div className={styles.countdownGrid}>
            <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
          </div>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.sectionEyebrow}>Qachon &amp; Qayerda</p>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Sana</span>
            <span>{dateLabel}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Vaqt</span>
            <span>{invitation.wedding_time}</span>
          </div>
          <p className={styles.venueName}>{invitation.venue_name}</p>
          <p className={styles.greetingText}>{invitation.venue_address}</p>
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
            <p className={styles.sectionEyebrow}>Bizning xotiralarimiz</p>
            <p className={`${styles.sectionTitle} ${styles.auroraText}`}>Xotira galereyasi</p>
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
            <p className={styles.sectionEyebrow}>To&apos;yona</p>
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
          buttonStyle={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
        />
      )}
    </div>
  );
}
