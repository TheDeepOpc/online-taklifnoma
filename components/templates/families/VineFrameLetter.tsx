"use client";

import { useEffect, useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthYear } from "@/lib/uzDate";
import styles from "./VineFrameLetter.module.css";

const ASSETS = "/imported-assets/vine-frame";

export function VineFrameLetter({
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
  const [open, setOpen] = useState(previewMode);
  const musicRef = useRef<MusicPlayerHandle>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewMode) return;
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [previewMode]);

  function handleOpen() {
    setOpen(true);
    musicRef.current?.play();
    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const weddingDate = new Date(weddingDateTime);
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;
  const monthLabel = uzMonthYear(weddingDate);

  const messageLines = (
    invitation.custom_message ||
    "Sizlarni nikoh to'yi munosabati bilan bo'lib o'tadigan to'y marosimiga taklif qilamiz.\nTashrifingiz davramizga fayz, qalbimizga esa unutilmas xursandchilik bag'ishlaydi."
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const photoSrc = invitation.cover_photo_url || `${ASSETS}/couple-photo.jpg`;

  const monogram = `${invitation.groom_name.charAt(0)}${invitation.bride_name.charAt(0)}`.toUpperCase();

  return (
    <div className={styles.root} style={rootStyle}>
      {!previewMode && (
        <div className={`${styles.preloader} ${loading ? "" : styles.preloaderGone}`}>
          <div className={styles.preloaderVines}>
            {[0, 1, 2, 3].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={`${ASSETS}/vine-border.png`}
                alt=""
                className={`${styles.preloaderVinePiece} ${styles[`vineCorner${i}`]}`}
              />
            ))}
          </div>
          <div className={styles.preloaderContent}>
            <div className={`${styles.preloaderMonogram} ${styles.script}`}>{monogram}</div>
            <div className={styles.preloaderLine} />
            <p className={styles.preloaderLabel}>Nikoh to&apos;yiga taklifnoma</p>
          </div>
        </div>
      )}

      <section className={styles.hero}>
        <p className={styles.arabic}>بسم الله الرحمن الرحيم</p>
        <p className={styles.arabic}>السلام عليكم ورحمة الله وبركاته</p>
        <div className={styles.label}>Nikoh to&apos;yiga taklifnoma</div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/gazebo.png`} alt="" className={styles.gazebo} />

        <div className={`${styles.heroNames} ${styles.script}`}>
          {invitation.groom_name}
        </div>
        <div className={styles.amp}>&amp;</div>
        <div className={`${styles.heroNames} ${styles.script}`}>{invitation.bride_name}</div>

        <p className={styles.heroDate}>{dateLabel}</p>

        {!open && (
          <button type="button" className={styles.openBtn} onClick={handleOpen}>
            Taklifnomani ochish
          </button>
        )}
      </section>

      {open && (
        <div ref={revealRef} className={styles.revealWrap}>
          <RevealCard className={styles.section} alwaysVisible={previewMode}>
            <div className={styles.framedPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc} alt="" className={styles.framedPhotoImg} />
            </div>
            <div className={styles.label}>Nikoh to&apos;yi</div>
          </RevealCard>

          <RevealCard className={styles.section} alwaysVisible={previewMode}>
            <div className={styles.sectionTitle}>To&apos;ygacha qoldi</div>
            <CountdownTimer targetDate={weddingDateTime} variant="divided" />

            <div className={styles.calendarCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSETS}/vine-border.png`} alt="" className={styles.vineBorder} />
              <div className={styles.calendarInner}>
                <div className={styles.calendarHead}>{monthLabel}</div>
                <CalendarHighlight
                  date={invitation.wedding_date}
                  cellClassName={styles.calendarCell}
                  emptyClassName={styles.calendarEmpty}
                  highlightClassName={styles.calendarHighlight}
                  headClassName={styles.calendarLabel}
                />
                <p className={styles.calendarCaption}>
                  {dateLabel} — Nikoh to&apos;yi
                  {invitation.wedding_time ? ` — ${invitation.wedding_time}` : ""}
                </p>
              </div>
            </div>
          </RevealCard>

          <RevealCard className={styles.section} alwaysVisible={previewMode}>
            <div className={styles.sectionTitle}>To&apos;yxona manzili</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/venue-house.png`} alt="" className={styles.venueHouse} />
            <p className={styles.venueName}>{invitation.venue_name}</p>
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

          <RevealCard className={styles.section} alwaysVisible={previewMode}>
            <div className={`${styles.script} ${styles.greetingTitle}`}>Aziz mehmonlar</div>
            <p className={styles.bigDate}>{dateLabel}</p>
            {messageLines.map((line, i) => (
              <p key={i} className={styles.greetingText}>
                {line}
              </p>
            ))}
            <p className={`${styles.script} ${styles.signature}`}>
              Hurmat bilan, {invitation.groom_name} va {invitation.bride_name} oilalari
            </p>
          </RevealCard>

          <RevealCard className={`${styles.section} ${styles.closing}`} alwaysVisible={previewMode}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/attire.png`} alt="" className={styles.attire} />
            <div className={`${styles.script} ${styles.closingTitle}`}>
              Sizlarni to&apos;yimizga taklif qilamiz
            </div>
            <p className={styles.closingNote}>
              Quvonchli kunimizda sizlarni kutib qolamiz
            </p>
          </RevealCard>

          <footer className={styles.footer}>
            {invitation.groom_name} va {invitation.bride_name} oilalari
          </footer>
        </div>
      )}

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
