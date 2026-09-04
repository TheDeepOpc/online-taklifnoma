"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { FloatingDecoration } from "../decorations";
import { RevealCard } from "../RevealCard";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthYear } from "@/lib/uzDate";
import styles from "./DoorArabicLetter.module.css";

const ASSETS = "/imported-assets/taklifnomaa";

export function DoorArabicLetter({
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

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const monthLabel = uzMonthYear(new Date(weddingDateTime));

  const messageLines = (
    invitation.custom_message ||
    "Hayotimizdagi eng baxtli kunlardan biri — nikoh to'yimizni siz bilan birga nishonlashni niyat qildik.\nSizni ushbu kechamizga samimiy taklif etamiz."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => setGone(true), 1100);
  }

  return (
    <div className={styles.root} style={rootStyle}>
      {theme.decorationEmoji && (
        <FloatingDecoration emoji={theme.decorationEmoji} previewMode={previewMode} />
      )}

      {!previewMode && (
        <div
          className={`${styles.entrance} ${open ? styles.entranceOpen : ""} ${
            gone ? styles.entranceGone : ""
          }`}
        >
          <div
            className={`${styles.door} ${styles.doorLeft}`}
            style={{ backgroundImage: `url(${ASSETS}/door-background.webp)` }}
          />
          <div
            className={`${styles.door} ${styles.doorRight}`}
            style={{ backgroundImage: `url(${ASSETS}/door-background.webp)` }}
          />
          <div className={styles.doorFloorShadow} />

          <button
            type="button"
            className={styles.seal}
            onClick={handleOpen}
            aria-label="Taklifnomani ochish"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/seal-button.webp`} alt="" className={styles.sealImage} />
          </button>
        </div>
      )}

      <section className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <div className={`${styles.heroNames} ${styles.script}`}>
          {invitation.groom_name}
          <span className={styles.heroAmp}>&amp;</span>
          {invitation.bride_name}
        </div>
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <div className={styles.ornamentLine}>❖ ❖ ❖</div>
          {messageLines.map((line, i) => (
            <p key={i} className={styles.greetingText}>
              {line}
            </p>
          ))}
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <div className={styles.calendarHead}>{monthLabel}</div>
          <CalendarHighlight
            date={invitation.wedding_date}
            cellClassName={styles.calendarCell}
            emptyClassName={styles.calendarEmpty}
            highlightClassName={styles.calendarHighlight}
            headClassName={styles.label}
          />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.sectionTitle}>Manzil</div>
        <div className={styles.divider} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ASSETS}/venue-illustration.webp`}
          alt=""
          className={styles.venueIllustration}
        />
        <div className={styles.venueName}>{invitation.venue_name}</div>
        <div className={styles.venueAddr}>{invitation.venue_address}</div>
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

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>To&apos;yimizgacha</div>
          <CountdownTimer targetDate={weddingDateTime} variant="ornate" />
          <p className={styles.closingNote}>Sizni intiqlik bilan kutamiz</p>
        </div>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--ink)", color: "var(--sand)" }}
        />
      )}
    </div>
  );
}
