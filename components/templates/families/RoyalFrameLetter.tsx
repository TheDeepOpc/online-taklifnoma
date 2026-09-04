"use client";

import { useEffect, useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { RevealCard } from "../RevealCard";
import { PalaceIcon, MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import styles from "./RoyalFrameLetter.module.css";

const ASSETS = "/imported-assets/royal-frame";

export function RoyalFrameLetter({
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
  const [loading, setLoading] = useState(!previewMode);
  const [ready, setReady] = useState(previewMode);
  const musicRef = useRef<MusicPlayerHandle>(null);

  useEffect(() => {
    if (previewMode) return;
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, [previewMode]);

  function handleOpen() {
    setLoading(false);
    musicRef.current?.play();
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;
  const timeLabel = invitation.wedding_time || "";

  const monogram = `${invitation.groom_name.charAt(0)}${invitation.bride_name.charAt(0)}`.toUpperCase();

  const messageLines = (
    invitation.custom_message ||
    "QADRLI AZIZ MEHMONIMIZ! SIZNI NIKOH TO'YIMIZGA TAKLIF ETAMIZ.\nSHU QUVONCHLI OQSHOMDA SIZ BILAN DIYDORLASHISH BIZ UCHUN KATTA BAXT BO'LADI."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div className={`${styles.preloader} ${loading ? "" : styles.preloaderGone}`}>
          <div className={styles.preloaderClouds}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={`${ASSETS}/cloud.png`}
                alt=""
                className={`${styles.preloaderCloudPiece} ${styles[`cloudPiece${i}`]}`}
              />
            ))}
          </div>
          <div className={`${styles.preloaderMonogram} ${styles.script}`}>{monogram}</div>
          {ready && (
            <button type="button" className={styles.preloaderBtn} onClick={handleOpen}>
              Ochish
            </button>
          )}
        </div>
      )}

      <div className={styles.frame} aria-hidden>
        <span className={`${styles.corner} ${styles.cornerTl}`} />
        <span className={`${styles.corner} ${styles.cornerTr}`} />
        <span className={`${styles.corner} ${styles.cornerBl}`} />
        <span className={`${styles.corner} ${styles.cornerBr}`} />
      </div>

      <section className={styles.hero}>
        <div className={styles.monogram}>{monogram}</div>
        <div className={`${styles.heroNames} ${styles.script}`}>
          {invitation.groom_name} &amp; {invitation.bride_name}
        </div>
        <div className={styles.illustrationCard}>
          <PalaceIcon className={styles.palaceIcon} />
        </div>
        {!previewMode && <p className={styles.scrollHint}>Pastga suring ↓</p>}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.verseText}>
          Alloh ularning qalblarini sevgi ila birlashtirdi.
        </p>
        <p className={styles.verseLabel}>«Anfol» surasi, 63-oyat</p>
        <div className={styles.divider} />
        {messageLines.map((line, i) => (
          <p key={i} className={styles.greetingText}>
            {line}
          </p>
        ))}
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.bigDate} ${styles.display}`}>{dateLabel}</div>
        {timeLabel && <div className={`${styles.bigTime} ${styles.display}`}>{timeLabel}</div>}
        <div className={styles.venueName}>{invitation.venue_name}</div>
        <div className={`${styles.venueAddr} ${styles.script}`}>{invitation.venue_address}</div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.illustrationCard}>
          <PalaceIcon className={styles.palaceIcon} />
        </div>
        <div className={`${styles.countdownTitle} ${styles.script}`}>To&apos;ygacha qoldi</div>
        <CountdownTimer targetDate={weddingDateTime} variant="divided" />
        <div className={styles.asterisks}>* * * * *</div>
      </RevealCard>

      <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
        <div className={styles.sectionTitle}>To&apos;y manzili</div>
        <div className={styles.venueName}>{invitation.venue_name}</div>
        <div className={`${styles.venueAddr} ${styles.script}`}>{invitation.venue_address}</div>
        {invitation.venue_map_url && (
          <a
            href={invitation.venue_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapBtn}
          >
            <MapPinIcon className="h-4 w-4" /> Lokatsiyani ochish
          </a>
        )}
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--gold)", color: "var(--paper)" }}
        />
      )}
    </div>
  );
}
