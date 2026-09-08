"use client";

import { useRef, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MusicPlayer, type MusicPlayerHandle } from "@/components/MusicPlayer";
import { CalendarHighlight } from "../CalendarHighlight";
import { RevealCard } from "../RevealCard";
import { PhotoGallery } from "../PhotoGallery";
import { MapPinIcon } from "../icons";
import type { Invitation, MusicTrack } from "@/lib/types";
import type { ThemeDefinition } from "@/lib/themes";
import { uzMonthName, uzWeekdayName } from "@/lib/uzDate";
import styles from "./NavyGazeboLetter.module.css";

const ASSETS = "/imported-assets/navy-gazebo";

const WEEKDAYS = ["D", "S", "Ch", "P", "J", "Sh", "Ya"];

export function NavyGazeboLetter({
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
  const [opened, setOpened] = useState(previewMode);

  function handleOpen() {
    setOpened(true);
    musicRef.current?.play();
  }

  const rootStyle = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--${k}`, v])),
    ...Object.fromEntries(Object.entries(theme.fonts).map(([k, v]) => [`--${k}`, v])),
  } as React.CSSProperties;

  const weddingDateTime = `${invitation.wedding_date}T${invitation.wedding_time || "00:00"}`;
  const weddingDay = new Date(`${invitation.wedding_date}T00:00:00`);
  const monthLower = uzMonthName(weddingDay).toLowerCase();
  const monthLabel = `${monthLower}, ${weddingDay.getFullYear()}`;
  const heroDate = `${uzWeekdayName(weddingDay)}, ${weddingDay.getDate()}-${monthLower} ${weddingDay.getFullYear()}`;
  const [year, month, day] = invitation.wedding_date.split("-");
  const dateLabel = `${day}.${month}.${year}`;

  const messageLines = (
    invitation.custom_message ||
    `Sizlarni ${invitation.groom_name} va ${invitation.bride_name}ning nikoh to'yi munosabati bilan ${dateLabel} kuni soat ${invitation.wedding_time} da bo'lib o'tadigan to'y marosimiga taklif qilamiz.\nTashrifingiz davramizga fayz, qalbimizga esa unutilmas xursandchilik bag'ishlaydi.`
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className={styles.root} style={rootStyle}>
      <section className={styles.hero}>
        <div className={styles.blessing} dir="rtl">
          <p>بسم الله الرحمن الرحيم</p>
          <p>السلام عليكم ورحمة الله وبركاته</p>
        </div>
        <p className={styles.eyebrow}>Nikoh to&apos;yiga taklifnoma</p>
        <div className={styles.illustration}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/gazebo.png`} alt="" />
        </div>
        <h1 className={`${styles.heroNames} ${styles.script}`}>
          {invitation.groom_name}
          <span className={styles.ampersand}>&amp;</span>
          {invitation.bride_name}
        </h1>
        <p className={styles.heroDate}>{heroDate}</p>
        {!opened && (
          <button type="button" className={styles.openBtn} onClick={handleOpen}>
            Taklifnomani ochish
          </button>
        )}
        {opened && !previewMode && <p className={styles.scrollHint}>Pastga suring ↓</p>}
      </section>

      {invitation.cover_photo_url && (
        <RevealCard className={styles.section} alwaysVisible={previewMode}>
          <div className={styles.photoFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invitation.cover_photo_url} alt="" className={styles.photoFrameImg} />
            <span className={styles.photoFrameLine} data-pos="top" aria-hidden="true" />
            <span className={styles.photoFrameLine} data-pos="right" aria-hidden="true" />
            <span className={styles.photoFrameLine} data-pos="bottom" aria-hidden="true" />
            <span className={styles.photoFrameLine} data-pos="left" aria-hidden="true" />
          </div>
          <p className={styles.sectionTitle}>Nikoh to&apos;yi</p>
        </RevealCard>
      )}

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.countdownPanel}>
          <p className={styles.countdownTitle}>To&apos;ygacha qoldi</p>
          <CountdownTimer
            targetDate={weddingDateTime}
            live={!previewMode}
            pad
            classes={{
              root: styles.countdownTimer,
              cell: styles.countdownItem,
              value: styles.countdownValue,
              label: styles.countdownLabel,
            }}
          />
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <div className={styles.calendarCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ASSETS}/border-frame.png`} alt="" className={styles.calendarFrame} />
          <div className={styles.calendarContent}>
            <div className={styles.calendarTitle}>{monthLabel}</div>
            <CalendarHighlight
              date={invitation.wedding_date}
              gridClassName={styles.calendarGrid}
              cellClassName={styles.calendarCell}
              emptyClassName={styles.calendarCell}
              highlightClassName={styles.calendarHighlight}
              headClassName={styles.calendarHead}
              weekdays={WEEKDAYS}
            />
            <p className={styles.calendarFooter}>
              {dateLabel} — Nikoh to&apos;yi — {invitation.wedding_time}
            </p>
          </div>
        </div>
      </RevealCard>

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={styles.sectionTitle}>To&apos;yxona manzili</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/house.png`} alt="" className={styles.houseImg} />
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

      <RevealCard className={styles.section} alwaysVisible={previewMode}>
        <p className={`${styles.greetingTitle} ${styles.script}`}>
          {invitation.guest_name ? `Hurmatli ${invitation.guest_name}` : "Aziz mehmonlar"}
        </p>
        <p className={`${styles.featuredDate} ${styles.numberFont}`}>{dateLabel}</p>
        {messageLines.map((line, i) => (
          <p key={i} className={styles.greetingText}>
            {line}
          </p>
        ))}
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
        <img src={`${ASSETS}/attire.png`} alt="" className={styles.attireImg} />
        <p className={styles.sectionTitle}>Sizlarni to&apos;yimizga taklif qilamiz</p>
        <p className={styles.closingText}>Quvonchli kunimizda sizlarni kutib qolamiz</p>
      </RevealCard>

      <footer className={styles.footer}>
        {invitation.groom_name} va {invitation.bride_name} oilalari
      </footer>

      {musicTrack && !previewMode && (
        <MusicPlayer
          ref={musicRef}
          src={musicTrack.file_url}
          buttonStyle={{ background: "var(--primary)", color: "var(--white)" }}
        />
      )}
    </div>
  );
}
