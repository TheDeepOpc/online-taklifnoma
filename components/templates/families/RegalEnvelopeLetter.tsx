"use client";

import { useRef, useState } from "react";
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
import styles from "./RegalEnvelopeLetter.module.css";

const ASSETS = "/imported-assets/royal-envelope";

export function RegalEnvelopeLetter({
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
    setTimeout(() => setGone(true), 950);
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const monthLabel = uzMonthYear(new Date(weddingDateTime));
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;

  const messageLines = (
    invitation.custom_message ||
    "Sizni nikoh to'yimiz munosabati bilan bo'lib o'tadigan “Visol oqshomi”ga taklif etamiz."
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
          <div className={styles.stage}>
            <div className={`${styles.flap} ${styles.flapTop}`}>
              <p className={styles.flapNote}>
                <span className={styles.flapNoteTop}>Siz</span>
                <span className={styles.flapNoteMiddle}>To&apos;yimizga</span>
                <span className={`${styles.flapNoteScript} ${styles.script}`}>taklif etilgansiz</span>
              </p>
            </div>
            <div className={`${styles.flap} ${styles.flapLeft}`} />
            <div className={`${styles.flap} ${styles.flapRight}`} />
            <div className={`${styles.flap} ${styles.flapBottom}`}>
              <p className={styles.flapSignature}>
                muhabbat ila,
                <strong>
                  {invitation.groom_name} va {invitation.bride_name}
                </strong>
              </p>
            </div>
            <button
              type="button"
              className={styles.sealButton}
              onClick={handleOpen}
              aria-label="Taklifnomani ochish"
            >
              <span>ochish</span>
            </button>
          </div>
        </div>
      )}

      <section className={`${styles.hero} ${previewMode ? styles.heroPreview : ""}`}>
        <div className={styles.ornamentFrame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/ornament.png`} alt="" className={styles.ornamentImg} />
          <div className={styles.ornamentContent}>
            <p className={styles.ornamentEyebrow}>Taklif etilgansiz</p>
            <div className={styles.ornamentNames}>
              {invitation.groom_name}
              <br />
              &amp;
              <br />
              {invitation.bride_name}
            </div>
          </div>
        </div>
        <p className={styles.heroDate}>{monthLabel}</p>
        {!previewMode && <p className={styles.scrollHint}>Pastga suring &darr;</p>}
      </section>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <span className={styles.heroTitle}>
            {invitation.groom_name} &amp; {invitation.bride_name}
          </span>
          <p className={styles.verseText}>
            &laquo;Alloh ularni qalbini sevgi ila birlashtirdi&raquo;
          </p>
          <p className={styles.verseLabel}>Anfol surasi, 63-oyat</p>
          <div className={styles.divider} />
          <p className={styles.greetingTitle}>
            {invitation.guest_name ? `Hurmatli ${invitation.guest_name}!` : "Aziz va qadrdon insonimiz!"}
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
          <p className={styles.sectionTitle}>Sana va vaqt</p>
          <div className={styles.datetimePanel}>
            <div className={styles.datetimeItem}>
              <span className={styles.datetimeLabel}>Sana</span>
              <span className={styles.datetimeValue}>{dateLabel}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/rings.png`} alt="" className={styles.ringsIcon} />
            <div className={styles.datetimeItem}>
              <span className={styles.datetimeLabel}>Vaqt</span>
              <span className={styles.datetimeValue}>{invitation.wedding_time}</span>
            </div>
          </div>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={`${styles.card} ${styles.calendarCard}`}>
          <p className={styles.calendarHead}>{monthLabel}</p>
          <CalendarHighlight
            date={invitation.wedding_date}
            cellClassName={styles.calendarCell}
            emptyClassName={styles.calendarEmpty}
            highlightClassName={styles.calendarHighlight}
            headClassName={styles.datetimeLabel}
          />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.sectionTitle}>Har lahzani sanayapmiz</p>
          <CountdownTimer targetDate={weddingDateTime} variant="divided" live={!previewMode} />
          <p className={styles.greetingText} style={{ marginTop: 14 }}>
            Sizni intiqlik bilan kutamiz.
          </p>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.card}>
          <p className={styles.sectionTitle}>To&apos;y manzili</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/building.png`} alt="" className={styles.venueImg} />
          <p className={styles.venueName}>{invitation.venue_name}</p>
          <p className={styles.venueAddr}>{invitation.venue_address}</p>
          {invitation.venue_map_url && (
            <a
              href={invitation.venue_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapBtn}
            >
              <MapPinIcon className="h-4 w-4" /> Google Maps
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
        <p className={styles.closingText}>Muhabbat ila sizni kutamiz</p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--ink-navy)", color: "#fff" }}
        />
      )}
    </div>
  );
}
